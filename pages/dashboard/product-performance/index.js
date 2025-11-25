import isAdmin from "@/middleware/is-admin";
import convert from "../../../plugins/convert";
import dayjs from "dayjs";
import "dayjs/locale/th";

dayjs.locale("th");

export default {
  middleware: ["auth", isAdmin],
  layout: "seller-layout",
  head() {
    return {
      title: "รายงานผลการขายสินค้า",
    };
  },
  data() {
    return {
      loading: true,
      search: "",
      branchList: [],
      branchSelect: null,
      periodSelect: "month",
      dateStart: dayjs().startOf("month").format("YYYY-MM-DD"),
      dateEnd: dayjs().endOf("month").format("YYYY-MM-DD"),
      allProducts: [],
      salesOrders: [],
      allProductsData: [],
      summary: {
        totalProducts: 0,
        soldProducts: 0,
        unsoldProducts: 0,
        successRate: 0,
        totalQuantity: 0,
        totalRevenue: 0,
      },
      tableHead: [
        {
          title: "ชื่อสินค้า",
          width: "25%",
          text: "text-left",
        },
        {
          title: "ประเภท",
          width: "12%",
          text: "text-left",
        },
        {
          title: "จำนวนขาย",
          width: "10%",
          text: "text-center",
        },
        {
          title: "ยอดขาย",
          width: "13%",
          text: "text-right",
        },
        {
          title: "ราคาเฉลี่ย",
          width: "13%",
          text: "text-right",
        },
        {
          title: "ผลการขาย",
          width: "12%",
          text: "text-center",
        },
        {
          title: "% ของยอดรวม",
          width: "15%",
          text: "text-center",
        },
      ],
      topProductsChartData: null,
      categoryPieData: null,
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: {
            display: false,
          },
          title: {
            display: false,
          },
        },
        scales: {
          x: {
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

    topProducts() {
      return this.allProductsData
        .filter((p) => p.quantity > 0)
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 10);
    },

    unsoldProducts() {
      return this.allProductsData.filter((p) => p.quantity === 0);
    },

    filteredProductsData() {
      if (!this.search) return this.allProductsData;

      return this.allProductsData.filter((product) => {
        return (
          product.name.toLowerCase().includes(this.search.toLowerCase()) ||
          (product.type &&
            product.type.name.toLowerCase().includes(this.search.toLowerCase()))
        );
      });
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.getBranches();
      this.loading = false;
    });
  },

  methods: {
    async getBranches() {
      try {
        const res = await this.$axios.get("/branch");
        this.branchList = [{ id: null, title: "ทุกสาขา" }, ...res.data.data];

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

    changePeriod() {
      const today = dayjs();

      switch (this.periodSelect) {
        case "week":
          this.dateStart = today.startOf("week").format("YYYY-MM-DD");
          this.dateEnd = today.endOf("week").format("YYYY-MM-DD");
          break;
        case "month":
          this.dateStart = today.startOf("month").format("YYYY-MM-DD");
          this.dateEnd = today.endOf("month").format("YYYY-MM-DD");
          break;
        case "year":
          this.dateStart = today.startOf("year").format("YYYY-MM-DD");
          this.dateEnd = today.endOf("year").format("YYYY-MM-DD");
          break;
      }

      this.getData();
    },

    async getData() {
      if (!this.branchSelect) return;

      this.$nuxt.$loading.start();
      try {
        // Get all products
        const productsParams = {};
        if (this.branchSelect && this.branchSelect.id) {
          productsParams.branch = this.branchSelect.id;
        }

        const productsRes = await this.$axios.get("/posProduct", {
          params: productsParams,
        });
        this.allProducts = productsRes.data.data || [];

        // Get sales data
        const salesParams = {
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
        };
        if (this.branchSelect && this.branchSelect.id) {
          salesParams.branch = this.branchSelect.id;
        }

        const salesRes = await this.$axios.get("/getBillList", {
          params: salesParams,
        });

        // Process sales data
        this.processSalesData(salesRes.data);

        this.$nuxt.$loading.finish();
      } catch (e) {
        console.error(e);
        this.$nuxt.$loading.finish();
      }
    },

    processSalesData(apiData) {
      // Extract all orders
      let allOrders = [];
      if (apiData.data && Array.isArray(apiData.data)) {
        apiData.data.forEach((branch) => {
          if (branch.items && Array.isArray(branch.items)) {
            allOrders = [...allOrders, ...branch.items];
          }
        });
      }

      this.salesOrders = allOrders;

      // Calculate sales by product
      const productSalesMap = {};

      allOrders.forEach((order) => {
        if (order.product && Array.isArray(order.product)) {
          order.product.forEach((item) => {
            const productId = item.id;
            if (!productSalesMap[productId]) {
              productSalesMap[productId] = {
                id: productId,
                name: item.name,
                quantity: 0,
                totalSales: 0,
                prices: [],
              };
            }

            productSalesMap[productId].quantity += item.total || 1;
            productSalesMap[productId].totalSales +=
              parseFloat(item.price) || 0;
            productSalesMap[productId].prices.push(parseFloat(item.price) || 0);
          });
        }
      });

      // Merge with all products
      this.allProductsData = this.allProducts.map((product) => {
        const salesData = productSalesMap[product.id] || {
          quantity: 0,
          totalSales: 0,
          prices: [],
        };

        const avgPrice =
          salesData.prices.length > 0
            ? salesData.prices.reduce((a, b) => a + b, 0) /
              salesData.prices.length
            : product.price || 0;

        return {
          ...product,
          quantity: salesData.quantity,
          totalSales: salesData.totalSales,
          avgPrice: avgPrice,
          performance: this.getPerformance(salesData.quantity),
          percentOfTotal: 0, // Will calculate after
        };
      });

      // Calculate total and percentages
      const totalRevenue = this.allProductsData.reduce(
        (sum, p) => sum + p.totalSales,
        0
      );

      this.allProductsData = this.allProductsData.map((p) => ({
        ...p,
        percentOfTotal:
          totalRevenue > 0 ? (p.totalSales / totalRevenue) * 100 : 0,
      }));

      // Sort by total sales descending
      this.allProductsData.sort((a, b) => b.totalSales - a.totalSales);

      // Calculate summary
      this.calculateSummary();

      // Prepare charts
      this.prepareChartData();
    },

    calculateSummary() {
      this.summary.totalProducts = this.allProductsData.length;
      this.summary.soldProducts = this.allProductsData.filter(
        (p) => p.quantity > 0
      ).length;
      this.summary.unsoldProducts = this.allProductsData.filter(
        (p) => p.quantity === 0
      ).length;
      this.summary.successRate =
        this.summary.totalProducts > 0
          ? (
              (this.summary.soldProducts / this.summary.totalProducts) *
              100
            ).toFixed(1)
          : 0;
      this.summary.totalQuantity = this.allProductsData.reduce(
        (sum, p) => sum + p.quantity,
        0
      );
      this.summary.totalRevenue = this.allProductsData.reduce(
        (sum, p) => sum + p.totalSales,
        0
      );
    },

    prepareChartData() {
      // Top Products Bar Chart
      const top10 = this.topProducts.slice(0, 10);

      this.topProductsChartData = {
        labels: top10.map((p) => p.name),
        datasets: [
          {
            label: "ยอดขาย (บาท)",
            data: top10.map((p) => p.totalSales),
            backgroundColor: [
              "#B27D41",
              "#846537",
              "#A57156",
              "#C99865",
              "#8B6F47",
              "#A68B5B",
              "#7D5B3F",
              "#9C7E5A",
              "#B89968",
              "#D4A574",
            ],
            borderColor: "#846537",
            borderWidth: 1,
          },
        ],
      };

      // Category Pie Chart
      const categoryMap = {};
      this.allProductsData.forEach((product) => {
        if (product.type && product.quantity > 0) {
          const typeName = product.type.name;
          if (!categoryMap[typeName]) {
            categoryMap[typeName] = 0;
          }
          categoryMap[typeName] += product.totalSales;
        }
      });

      const categoryLabels = Object.keys(categoryMap);
      const categoryValues = Object.values(categoryMap);

      this.categoryPieData = {
        labels: categoryLabels,
        datasets: [
          {
            label: "ยอดขาย",
            data: categoryValues,
            backgroundColor: [
              "#846537",
              "#B27D41",
              "#A57156",
              "#6E4C2E",
              "#C99865",
              "#8B6F47",
              "#A68B5B",
              "#7D5B3F",
            ],
            borderColor: "#fff",
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      };
    },

    getPerformance(quantity) {
      if (quantity === 0) return "ไม่มียอด";
      if (quantity < 5) return "ต่ำ";
      if (quantity < 20) return "ปานกลาง";
      if (quantity < 50) return "ดี";
      return "ยอดเยี่ยม";
    },

    getPerformanceColor(performance) {
      switch (performance) {
        case "ยอดเยี่ยม":
          return "green";
        case "ดี":
          return "#43e97b";
        case "ปานกลาง":
          return "orange";
        case "ต่ำ":
          return "#ffa726";
        case "ไม่มียอด":
          return "grey";
        default:
          return "grey";
      }
    },

    getRankColor(index) {
      if (index === 0) return "#FFD700"; // Gold
      if (index === 1) return "#C0C0C0"; // Silver
      if (index === 2) return "#CD7F32"; // Bronze
      return "#B27D41";
    },
  },
};
