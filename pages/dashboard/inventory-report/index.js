import isAdmin from "@/middleware/is-admin";
import convert from "../../../plugins/convert";

export default {
  middleware: ["auth", isAdmin],
  layout: "seller-layout",
  head() {
    return {
      title: "รายงานสินค้าคงคลัง",
    };
  },
  data() {
    return {
      loading: true,
      search: "",
      branchList: [],
      branchSelect: null,
      productTypes: [],
      typeSelect: null,
      products: [],
      summary: {
        totalProducts: 0,
        lowStockProducts: 0,
        totalValue: 0,
        totalTypes: 0,
      },
      tableHead: [
        {
          title: "ชื่อสินค้า",
          width: "25%",
          text: "text-left",
        },
        {
          title: "ประเภท",
          width: "15%",
          text: "text-left",
        },
        {
          title: "สาขา",
          width: "15%",
          text: "text-left",
        },
        {
          title: "จำนวนคงเหลือ",
          width: "12%",
          text: "text-center",
        },
        {
          title: "ราคา/หน่วย",
          width: "13%",
          text: "text-right",
        },
        {
          title: "มูลค่ารวม",
          width: "13%",
          text: "text-right",
        },
        {
          title: "สถานะ",
          width: "7%",
          text: "text-left",
        },
      ],
      inventoryChartData: null,
      productTypePieData: null,
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
          },
          title: {
            display: false,
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function (value) {
                return value.toLocaleString() + " บาท";
              },
            },
          },
        },
      },
      pieChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "bottom",
          },
          title: {
            display: false,
          },
        },
      },
    };
  },

  computed: {
    convert() {
      return convert;
    },

    filteredProducts() {
      if (!this.search) return this.products;

      return this.products.filter((product) => {
        return (
          product.name.toLowerCase().includes(this.search.toLowerCase()) ||
          (product.type &&
            product.type.name.toLowerCase().includes(this.search.toLowerCase()))
        );
      });
    },

    lowStockItems() {
      return this.products.filter((product) => {
        const minStock = product.min_stock || 10;
        return (product.stock || 0) <= minStock;
      });
    },

    totalInventoryValue() {
      return this.products.reduce((sum, product) => {
        return sum + (product.stock || 0) * product.price;
      }, 0);
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.getBranches();
      this.getProductTypes();
      this.loading = false;
    });
  },

  methods: {
    async getBranches() {
      try {
        const res = await this.$axios.get("/branch");
        this.branchList = [{ id: null, title: "ทุกสาขา" }, ...res.data.data];

        // Set default branch
        if (this.$auth.user.branch) {
          this.branchSelect = this.$auth.user.branch;
        } else {
          this.branchSelect = this.branchList[0];
        }

        this.getData();
      } catch (e) {
        console.error(e);
      }
    },

    async getProductTypes() {
      try {
        const res = await this.$axios.get("/posProductType", {
          params: {
            all: true,
          },
        });
        this.productTypes = [{ id: null, name: "ทุกประเภท" }, ...res.data.data];
      } catch (e) {
        console.error(e);
      }
    },

    async getData() {
      if (!this.branchSelect) return;

      this.$nuxt.$loading.start();
      try {
        const params = {};

        if (this.branchSelect && this.branchSelect.id) {
          params.branch = this.branchSelect.id;
        }

        if (this.typeSelect && this.typeSelect.id) {
          params.type = this.typeSelect.id;
        }

        // Get products with stock information
        const res = await this.$axios.get("/posProduct", { params });

        // Check if API returns stock field, otherwise use default
        this.products = res.data.data.map((product) => ({
          ...product,
          stock: product.stock !== undefined ? product.stock : 0,
          min_stock: product.min_stock !== undefined ? product.min_stock : 10,
        }));

        console.log("Sample product data:", this.products[0]); // Debug: Check if stock field exists

        this.calculateSummary();
        this.prepareChartData();

        this.$nuxt.$loading.finish();
      } catch (e) {
        console.error(e);
        this.$nuxt.$loading.finish();
      }
    },

    calculateSummary() {
      this.summary.totalProducts = this.products.length;

      // Count low stock products based on min_stock threshold
      this.summary.lowStockProducts = this.products.filter((p) => {
        const minStock = p.min_stock || 10;
        return (p.stock || 0) <= minStock;
      }).length;

      this.summary.totalValue = this.products.reduce(
        (sum, p) => sum + (p.stock || 0) * p.price,
        0
      );

      const uniqueTypes = new Set(
        this.products.map((p) => p.type?.id).filter(Boolean)
      );
      this.summary.totalTypes = uniqueTypes.size;
    },

    prepareChartData() {
      // Group products by type and calculate value
      const typeData = {};
      const typeColors = [
        "#846537",
        "#B27D41",
        "#A57156",
        "#6E4C2E",
        "#C99865",
        "#8B6F47",
        "#A68B5B",
        "#7D5B3F",
      ];

      this.products.forEach((product) => {
        if (product.type) {
          const typeName = product.type.name;
          if (!typeData[typeName]) {
            typeData[typeName] = {
              value: 0,
              count: 0,
            };
          }
          typeData[typeName].value += (product.stock || 0) * product.price;
          typeData[typeName].count += 1;
        }
      });

      const labels = Object.keys(typeData);
      const values = Object.values(typeData).map((d) => d.value);
      const counts = Object.values(typeData).map((d) => d.count);

      // Bar Chart Data
      this.inventoryChartData = {
        labels: labels,
        datasets: [
          {
            label: "มูลค่าคงคลัง (บาท)",
            data: values,
            backgroundColor: typeColors.slice(0, labels.length),
            borderColor: typeColors.slice(0, labels.length),
            borderWidth: 1,
          },
        ],
      };

      // Pie Chart Data
      this.productTypePieData = {
        labels: labels,
        datasets: [
          {
            label: "จำนวนสินค้า",
            data: counts,
            backgroundColor: typeColors.slice(0, labels.length),
            borderColor: "#fff",
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      };
    },

    getStockColor(stock) {
      const qty = stock || 0;
      if (qty === 0) return "red";
      if (qty <= 5) return "orange";
      if (qty <= 10) return "warning";
      return "green";
    },

    getStatusColor(stock) {
      const qty = stock || 0;
      if (qty === 0) return "red";
      if (qty <= 10) return "warning";
      return "green";
    },

    getStockStatus(stock) {
      const qty = stock || 0;
      if (qty === 0) return "หมดสต๊อก";
      if (qty <= 5) return "ใกล้หมด";
      if (qty <= 10) return "ต่ำ";
      return "ปกติ";
    },
  },
};
