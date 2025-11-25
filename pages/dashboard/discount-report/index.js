export default {
  name: "DiscountReport",
  layout: "seller-layout",
  middleware: ["is-admin"],
  data() {
    return {
      loading: true,
      branchList: [],
      branchSelect: null,
      periodSelect: "month",
      search: "",

      // Raw data
      discountsData: [],
      billsData: [],

      // Summary
      summary: {
        totalDiscounts: 0,
        totalUsed: 0,
        totalDiscountAmount: 0,
        totalSales: 0,
        redemptionRate: 0,
        avgROI: 0,
        avgDiscountPerOrder: 0,
        avgOrderValue: 0,
      },

      // Top discounts
      topDiscounts: [],

      // Table
      tableHead: [
        { title: "ชื่อส่วนลด", text: "text-left", width: "20%" },
        { title: "มูลค่าส่วนลด", text: "text-right", width: "10%" },
        { title: "ใช้งาน (ครั้ง)", text: "text-center", width: "10%" },
        { title: "ส่วนลดรวม (฿)", text: "text-right", width: "12%" },
        { title: "ยอดขายที่เกิด (฿)", text: "text-right", width: "13%" },
        { title: "ROI", text: "text-center", width: "8%" },
        { title: "ประสิทธิภาพ", text: "text-center", width: "12%" },
        { title: "% การใช้งาน", text: "text-center", width: "15%" },
      ],

      // Chart data
      topDiscountsChartData: null,
      discountUsagePieData: null,
      roiChartData: null,
      trendChartData: null,

      // Chart options
      barChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return context.parsed.x + " ครั้ง";
              },
            },
          },
        },
      },

      roiChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        indexAxis: "y",
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return "ROI: " + context.parsed.x.toFixed(2) + "x";
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              callback: (value) => {
                return value.toFixed(1) + "x";
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
            position: "right",
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${value} ครั้ง (${percentage}%)`;
              },
            },
          },
        },
      },

      lineChartOptions: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                return context.parsed.y + " ครั้ง";
              },
            },
          },
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              stepSize: 1,
            },
          },
        },
      },
    };
  },

  computed: {
    filteredDiscounts() {
      if (!this.search) return this.discountsData;
      return this.discountsData.filter((disc) =>
        disc.name.toLowerCase().includes(this.search.toLowerCase())
      );
    },
  },

  async mounted() {
    await this.getBranch();
    if (this.branchList.length > 0) {
      this.branchSelect = this.branchList[0];
      await this.getData();
    }
    this.loading = false;
  },

  methods: {
    async getBranch() {
      try {
        let res = await this.$axios.$get("/branch");
        this.branchList = res.data || [];
      } catch (error) {
        console.error("Error fetching branches:", error);
      }
    },

    async getData() {
      if (!this.branchSelect) return;

      this.loading = true;
      try {
        // Get discounts and bills data
        const [discountsRes, billsRes] = await Promise.all([
          this.$axios.$get("/posDiscount"),
          this.$axios.$get("/getBillList", {
            params: {
              branch: this.branchSelect.id,
            },
          }),
        ]);

        this.discountsData = discountsRes.data?.data || discountsRes.data || [];
        this.billsData = billsRes.data || [];

        // Process discount performance data
        this.processDiscountData();
        this.calculateSummary();
        this.prepareChartData();
      } catch (error) {
        console.error("Error fetching data:", error);
      }
      this.loading = false;
    },

    changePeriod() {
      this.getData();
    },

    processDiscountData() {
      const dayjs = this.$dayjs;
      const now = dayjs();

      // Filter bills by selected period
      const filteredBills = this.billsData.filter((bill) => {
        const billDate = dayjs(bill.timestamp);

        switch (this.periodSelect) {
          case "week":
            return billDate.isAfter(now.subtract(7, "day"));
          case "month":
            return billDate.isAfter(now.subtract(1, "month"));
          case "year":
            return billDate.isAfter(now.subtract(1, "year"));
          default:
            return true;
        }
      });

      // Create discount usage map
      const discountUsageMap = new Map();

      // Count discount usage from bills
      filteredBills.forEach((bill) => {
        if (bill.discount && bill.discount > 0) {
          // Find which discount was used (this assumes discount amount matches)
          // In real scenario, you might have discountId in bill
          this.discountsData.forEach((discount) => {
            const discountValue = this.calculateDiscountValue(
              discount,
              bill.totalPrice
            );

            // If discount matches (with some tolerance for percentage calculations)
            if (Math.abs(bill.discount - discountValue) < 1) {
              if (!discountUsageMap.has(discount.id)) {
                discountUsageMap.set(discount.id, {
                  ...discount,
                  usageCount: 0,
                  totalDiscountAmount: 0,
                  totalSales: 0,
                  orders: [],
                });
              }

              const usage = discountUsageMap.get(discount.id);
              usage.usageCount += 1;
              usage.totalDiscountAmount += bill.discount;
              usage.totalSales += parseFloat(bill.totalPrice || 0);
              usage.orders.push(bill);
            }
          });
        }
      });

      // Process all discounts with usage data
      this.discountsData = this.discountsData.map((discount) => {
        const usage = discountUsageMap.get(discount.id);

        if (usage) {
          const roi =
            usage.totalDiscountAmount > 0
              ? usage.totalSales / usage.totalDiscountAmount
              : 0;

          const performance = this.getPerformanceRating(usage.usageCount);

          return {
            ...discount,
            usageCount: usage.usageCount,
            totalDiscountAmount: usage.totalDiscountAmount,
            totalSales: usage.totalSales,
            roi,
            performance,
            usagePercent: 0, // Will be calculated after total
          };
        } else {
          return {
            ...discount,
            usageCount: 0,
            totalDiscountAmount: 0,
            totalSales: 0,
            roi: 0,
            performance: "ไม่มีการใช้งาน",
            usagePercent: 0,
          };
        }
      });

      // Calculate usage percentage
      const totalUsage = this.discountsData.reduce(
        (sum, d) => sum + (d.usageCount || 0),
        0
      );
      this.discountsData = this.discountsData.map((d) => ({
        ...d,
        usagePercent:
          totalUsage > 0 ? ((d.usageCount || 0) / totalUsage) * 100 : 0,
      }));

      // Sort by usage count
      this.discountsData.sort(
        (a, b) => (b.usageCount || 0) - (a.usageCount || 0)
      );

      // Get top 10 discounts
      this.topDiscounts = this.discountsData
        .filter((d) => d.usageCount > 0)
        .slice(0, 10);
    },

    calculateDiscountValue(discount, totalPrice) {
      if (discount.type_discount === 1) {
        // Fixed amount
        return parseFloat(discount.total || 0);
      } else {
        // Percentage
        return (parseFloat(totalPrice) * parseFloat(discount.total || 0)) / 100;
      }
    },

    getPerformanceRating(usageCount) {
      if (usageCount >= 50) return "ดีเยี่ยม";
      if (usageCount >= 30) return "ดีมาก";
      if (usageCount >= 15) return "ดี";
      if (usageCount >= 5) return "ปานกลาง";
      if (usageCount > 0) return "ต้องปรับปรุง";
      return "ไม่มีการใช้งาน";
    },

    calculateSummary() {
      this.summary.totalDiscounts = this.discountsData.length;
      this.summary.totalUsed = this.discountsData.reduce(
        (sum, d) => sum + (d.usageCount || 0),
        0
      );
      this.summary.totalDiscountAmount = this.discountsData.reduce(
        (sum, d) => sum + (d.totalDiscountAmount || 0),
        0
      );
      this.summary.totalSales = this.discountsData.reduce(
        (sum, d) => sum + (d.totalSales || 0),
        0
      );

      // Calculate redemption rate (orders with discount / total orders)
      const totalOrders = this.billsData.length;
      const ordersWithDiscount = this.billsData.filter(
        (b) => b.discount && b.discount > 0
      ).length;
      this.summary.redemptionRate =
        totalOrders > 0 ? (ordersWithDiscount / totalOrders) * 100 : 0;

      // Calculate average ROI
      const discountsWithROI = this.discountsData.filter(
        (d) => d.roi && d.roi > 0
      );
      this.summary.avgROI =
        discountsWithROI.length > 0
          ? discountsWithROI.reduce((sum, d) => sum + d.roi, 0) /
            discountsWithROI.length
          : 0;

      // Average discount per order
      this.summary.avgDiscountPerOrder =
        this.summary.totalUsed > 0
          ? this.summary.totalDiscountAmount / this.summary.totalUsed
          : 0;

      // Average order value
      this.summary.avgOrderValue =
        this.summary.totalUsed > 0
          ? this.summary.totalSales / this.summary.totalUsed
          : 0;
    },

    prepareChartData() {
      // Top 10 discounts bar chart
      if (this.topDiscounts.length > 0) {
        this.topDiscountsChartData = {
          labels: this.topDiscounts.map((d) => d.name),
          datasets: [
            {
              label: "จำนวนครั้งที่ใช้",
              data: this.topDiscounts.map((d) => d.usageCount),
              backgroundColor: "#846537",
            },
          ],
        };
      }

      // Discount usage pie chart (top 8 + others)
      const usedDiscounts = this.discountsData.filter((d) => d.usageCount > 0);
      if (usedDiscounts.length > 0) {
        const top8 = usedDiscounts.slice(0, 8);
        const others = usedDiscounts.slice(8);
        const othersCount = others.reduce((sum, d) => sum + d.usageCount, 0);

        const labels = [...top8.map((d) => d.name)];
        const data = [...top8.map((d) => d.usageCount)];

        if (othersCount > 0) {
          labels.push("อื่นๆ");
          data.push(othersCount);
        }

        this.discountUsagePieData = {
          labels,
          datasets: [
            {
              data,
              backgroundColor: [
                "#846537",
                "#B27D41",
                "#A57156",
                "#6E4C2E",
                "#D4A574",
                "#8B6F47",
                "#C19A6B",
                "#9B7653",
                "#CCCCCC",
              ],
            },
          ],
        };
      }

      // ROI chart (top 10 by ROI)
      const discountsWithROI = this.discountsData
        .filter((d) => d.roi > 0)
        .sort((a, b) => b.roi - a.roi)
        .slice(0, 10);

      if (discountsWithROI.length > 0) {
        this.roiChartData = {
          labels: discountsWithROI.map((d) => d.name),
          datasets: [
            {
              label: "ROI",
              data: discountsWithROI.map((d) => d.roi),
              backgroundColor: discountsWithROI.map((d) => {
                if (d.roi >= 5) return "#43e97b";
                if (d.roi >= 3) return "#4facfe";
                if (d.roi >= 2) return "#B27D41";
                return "#ffa726";
              }),
            },
          ],
        };
      }

      // Trend chart (last 7 days)
      this.prepareTrendChart();
    },

    prepareTrendChart() {
      const dayjs = this.$dayjs;
      const last7Days = [];

      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, "day");
        last7Days.push({
          date: date.format("DD/MM"),
          dayName: date.format("ddd"),
          count: 0,
        });
      }

      // Count discount usage per day
      this.billsData.forEach((bill) => {
        if (bill.discount && bill.discount > 0) {
          const billDate = dayjs(bill.timestamp);
          const dayIndex = last7Days.findIndex(
            (day) => day.date === billDate.format("DD/MM")
          );
          if (dayIndex !== -1) {
            last7Days[dayIndex].count += 1;
          }
        }
      });

      this.trendChartData = {
        labels: last7Days.map((day) => day.dayName),
        datasets: [
          {
            label: "จำนวนการใช้ส่วนลด",
            data: last7Days.map((day) => day.count),
            borderColor: "#846537",
            backgroundColor: "rgba(132, 101, 55, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      };
    },

    getDiscountTypeName(type) {
      return type === 1 ? "บาท" : "เปอร์เซ็นต์";
    },

    getDiscountTypeColor(type) {
      return type === 1 ? "#4facfe" : "#43e97b";
    },

    getPerformanceColor(performance) {
      const colors = {
        ดีเยี่ยม: "#43e97b",
        ดีมาก: "#4facfe",
        ดี: "#B27D41",
        ปานกลาง: "#ffa726",
        ต้องปรับปรุง: "#ef5350",
        ไม่มีการใช้งาน: "#9e9e9e",
      };
      return colors[performance] || "#9e9e9e";
    },

    getPerformanceIcon(performance) {
      const icons = {
        ดีเยี่ยม: "mdi-star",
        ดีมาก: "mdi-thumb-up",
        ดี: "mdi-check-circle",
        ปานกลาง: "mdi-minus-circle",
        ต้องปรับปรุง: "mdi-alert-circle",
        ไม่มีการใช้งาน: "mdi-circle-outline",
      };
      return icons[performance] || "mdi-circle";
    },
  },
};
