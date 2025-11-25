import isAdmin from "@/middleware/is-admin";
import convert from "../../../plugins/convert";
import dayjs from "dayjs";
import "dayjs/locale/th";
import isBetween from "dayjs/plugin/isBetween";

dayjs.extend(isBetween);
dayjs.locale("th");

export default {
  middleware: ["auth", isAdmin],
  layout: "seller-layout",
  head() {
    return {
      title: "รายงานสรุปยอดขาย",
    };
  },
  data() {
    const today = new Date();
    return {
      loading: true,
      branchList: [],
      branchSelect: null,
      periodSelect: "day",
      dialogStart: false,
      dialogEnd: false,
      dateStart: dayjs().format("YYYY-MM-DD"),
      dateEnd: dayjs().format("YYYY-MM-DD"),
      salesData: [],
      summary: {
        totalSales: 0,
        totalOrders: 0,
        avgOrderValue: 0,
        totalDiscount: 0,
        netSales: 0,
      },
      topProducts: [],
      tableHead: [
        {
          title: "วันที่",
          width: "20%",
          text: "text-left",
        },
        {
          title: "จำนวนออเดอร์",
          width: "15%",
          text: "text-center",
        },
        {
          title: "ยอดขาย",
          width: "15%",
          text: "text-right",
        },
        {
          title: "ส่วนลด",
          width: "15%",
          text: "text-right",
        },
        {
          title: "ยอดสุทธิ",
          width: "15%",
          text: "text-right",
        },
        {
          title: "% เพิ่ม/ลด",
          width: "15%",
          text: "text-center",
        },
      ],
      salesTrendData: null,
      paymentMethodData: null,
      paymentPieData: null,
      hourlyData: null,
      lineChartOptions: {
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
      hourlyChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
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
        case "day":
          this.dateStart = today.format("YYYY-MM-DD");
          this.dateEnd = today.format("YYYY-MM-DD");
          break;
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
        case "custom":
          // User will select dates manually
          return;
      }

      this.getData();
    },

    async getData() {
      if (!this.branchSelect) return;

      this.$nuxt.$loading.start();
      try {
        const params = {
          dateStart: this.dateStart,
          dateEnd: this.dateEnd,
        };

        if (this.branchSelect && this.branchSelect.id) {
          params.branch = this.branchSelect.id;
        }

        // Get sales data from API
        const res = await this.$axios.get("/getBillList", { params });

        // Process the data
        this.processSalesData(res.data);

        this.$nuxt.$loading.finish();
      } catch (e) {
        console.error(e);
        this.$nuxt.$loading.finish();
      }
    },

    processSalesData(apiData) {
      // Group data by date
      const groupedByDate = {};
      let allOrders = [];

      // Extract all orders from branches
      if (apiData.data && Array.isArray(apiData.data)) {
        apiData.data.forEach((branch) => {
          if (branch.items && Array.isArray(branch.items)) {
            allOrders = [...allOrders, ...branch.items];
          }
        });
      }

      // Group by date
      allOrders.forEach((order) => {
        const date = dayjs(order.createdAt).format("YYYY-MM-DD");

        if (!groupedByDate[date]) {
          groupedByDate[date] = {
            date: date,
            orders: [],
            totalSales: 0,
            totalDiscount: 0,
            totalOrders: 0,
          };
        }

        groupedByDate[date].orders.push(order);
        groupedByDate[date].totalSales += parseFloat(order.price) || 0;
        groupedByDate[date].totalDiscount +=
          parseFloat(order.discountTotal) || 0;
        groupedByDate[date].totalOrders += 1;
      });

      // Convert to array and calculate growth
      const dates = Object.keys(groupedByDate).sort();
      this.salesData = dates.map((date, index) => {
        const data = groupedByDate[date];
        const netSales = data.totalSales - data.totalDiscount;

        // Calculate growth compared to previous day
        let growth = 0;
        if (index > 0) {
          const prevDate = dates[index - 1];
          const prevNetSales =
            groupedByDate[prevDate].totalSales -
            groupedByDate[prevDate].totalDiscount;
          if (prevNetSales > 0) {
            growth = (((netSales - prevNetSales) / prevNetSales) * 100).toFixed(
              1
            );
          }
        }

        return {
          date: date,
          totalOrders: data.totalOrders,
          totalSales: data.totalSales,
          totalDiscount: data.totalDiscount,
          netSales: netSales,
          growth: parseFloat(growth),
        };
      });

      // Calculate summary
      this.calculateSummary(allOrders);

      // Prepare chart data
      this.prepareChartData(allOrders);

      // Get top products
      this.calculateTopProducts(allOrders);
    },

    calculateSummary(orders) {
      this.summary.totalOrders = orders.length;
      this.summary.totalSales = orders.reduce(
        (sum, order) => sum + (parseFloat(order.price) || 0),
        0
      );
      this.summary.totalDiscount = orders.reduce(
        (sum, order) => sum + (parseFloat(order.discountTotal) || 0),
        0
      );
      this.summary.netSales =
        this.summary.totalSales - this.summary.totalDiscount;
      this.summary.avgOrderValue =
        this.summary.totalOrders > 0
          ? this.summary.totalSales / this.summary.totalOrders
          : 0;
    },

    prepareChartData(orders) {
      // Prepare trend data (grouped by date)
      const dateGroups = {};
      orders.forEach((order) => {
        const date = dayjs(order.createdAt).format("YYYY-MM-DD");
        if (!dateGroups[date]) {
          dateGroups[date] = 0;
        }
        dateGroups[date] += parseFloat(order.price) || 0;
      });

      const sortedDates = Object.keys(dateGroups).sort();

      this.salesTrendData = {
        labels: sortedDates.map((date) => dayjs(date).format("DD/MM/YYYY")),
        datasets: [
          {
            label: "ยอดขาย (บาท)",
            data: sortedDates.map((date) => dateGroups[date]),
            backgroundColor: "rgba(178, 125, 65, 0.2)",
            borderColor: "#B27D41",
            borderWidth: 2,
            fill: true,
            tension: 0.4,
          },
        ],
      };

      // Payment method data
      const paymentGroups = {
        เงินสด: 0,
        พร้อมเพย์: 0,
        อื่นๆ: 0,
      };

      orders.forEach((order) => {
        const payType = order.pay_type || "อื่นๆ";
        const price = parseFloat(order.price) || 0;

        if (payType.includes("เงินสด") || payType === "1") {
          paymentGroups["เงินสด"] += price;
        } else if (payType.includes("พร้อมเพย์") || payType === "2") {
          paymentGroups["พร้อมเพย์"] += price;
        } else {
          paymentGroups["อื่นๆ"] += price;
        }
      });

      const paymentLabels = Object.keys(paymentGroups);
      const paymentValues = Object.values(paymentGroups);

      this.paymentMethodData = {
        labels: paymentLabels,
        datasets: [
          {
            label: "ยอดขาย (บาท)",
            data: paymentValues,
            backgroundColor: ["#846537", "#B27D41", "#A57156"],
            borderColor: ["#846537", "#B27D41", "#A57156"],
            borderWidth: 1,
          },
        ],
      };

      this.paymentPieData = {
        labels: paymentLabels,
        datasets: [
          {
            label: "ยอดขาย",
            data: paymentValues,
            backgroundColor: ["#846537", "#B27D41", "#A57156"],
            borderColor: "#fff",
            borderWidth: 2,
            hoverOffset: 4,
          },
        ],
      };

      // Hourly data
      const hourGroups = {};
      for (let i = 0; i < 24; i++) {
        hourGroups[i] = 0;
      }

      orders.forEach((order) => {
        const hour = dayjs(order.createdAt).hour();
        hourGroups[hour] += parseFloat(order.price) || 0;
      });

      this.hourlyData = {
        labels: Object.keys(hourGroups).map((h) => `${h}:00`),
        datasets: [
          {
            label: "ยอดขาย (บาท)",
            data: Object.values(hourGroups),
            backgroundColor: "#B27D41",
            borderColor: "#846537",
            borderWidth: 1,
          },
        ],
      };
    },

    calculateTopProducts(orders) {
      const productMap = {};

      orders.forEach((order) => {
        if (order.product && Array.isArray(order.product)) {
          order.product.forEach((item) => {
            const productName = item.name || "ไม่ระบุ";
            if (!productMap[productName]) {
              productMap[productName] = {
                name: productName,
                quantity: 0,
                totalSales: 0,
              };
            }
            productMap[productName].quantity += item.total || 1;
            productMap[productName].totalSales += parseFloat(item.price) || 0;
          });
        }
      });

      this.topProducts = Object.values(productMap)
        .sort((a, b) => b.totalSales - a.totalSales)
        .slice(0, 10);
    },

    formatDate(dateStr) {
      return dayjs(dateStr).format("DD/MM/YYYY");
    },

    getGrowthColor(growth) {
      if (growth > 0) return "green";
      if (growth < 0) return "red";
      return "grey";
    },

    exportReport() {
      // TODO: Implement export functionality
      this.$nuxt.$loading.start();

      setTimeout(() => {
        alert(
          "ฟีเจอร์ Export กำลังพัฒนา\nข้อมูลที่จะ Export:\n" +
            `- ช่วงเวลา: ${this.formatDate(this.dateStart)} - ${this.formatDate(
              this.dateEnd
            )}\n` +
            `- ยอดขายรวม: ${convert.money(
              this.summary.totalSales
            )} บาท\n` +
            `- จำนวนออเดอร์: ${this.summary.totalOrders} ออเดอร์`
        );
        this.$nuxt.$loading.finish();
      }, 500);
    },
  },
};
