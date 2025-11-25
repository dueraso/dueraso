import isAdmin from "@/middleware/is-admin";
import convert from "@/plugins/convert";

export default {
  name: "EmployeePerformance",
  layout: "seller-layout",
  middleware: [isAdmin],
  data() {
    return {
      loading: true,
      branchList: [],
      branchSelect: null,
      periodSelect: "month",
      search: "",

      // Raw data
      employeesData: [],
      billsData: [],

      // Summary
      summary: {
        totalEmployees: 0,
        totalSales: 0,
        totalOrders: 0,
        avgPerEmployee: 0,
        avgOrderValue: 0,
        activeEmployees: 0,
      },

      // Top employees
      topEmployees: [],

      // Table
      tableHead: [
        { title: "ชื่อพนักงาน", text: "text-left", width: "25%" },
        { title: "จำนวนออเดอร์", text: "text-center", width: "12%" },
        { title: "ยอดขายรวม (บาท)", text: "text-right", width: "15%" },
        { title: "เฉลี่ยต่อออเดอร์", text: "text-right", width: "13%" },
        { title: "ลูกค้า", text: "text-center", width: "10%" },
        { title: "ประสิทธิภาพ", text: "text-center", width: "12%" },
        { title: "% จากยอดรวม", text: "text-center", width: "13%" },
      ],

      // Chart data
      topEmployeesChartData: null,
      employeesPieData: null,
      dailyOrdersData: null,

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
                return convert.money(context.parsed.x) + " บาท";
              },
            },
          },
        },
        scales: {
          x: {
            ticks: {
              callback: (value) => {
                return convert.money(value);
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
            labels: {
              generateLabels: (chart) => {
                const data = chart.data;
                if (data.labels.length && data.datasets.length) {
                  return data.labels.map((label, i) => {
                    const value = data.datasets[0].data[i];
                    return {
                      text: `${label}: ${convert.money(value)} ฿`,
                      fillStyle: data.datasets[0].backgroundColor[i],
                      hidden: false,
                      index: i,
                    };
                  });
                }
                return [];
              },
            },
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                const label = context.label || "";
                const value = context.parsed || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((value / total) * 100).toFixed(1);
                return `${label}: ${convert.money(value)} บาท (${percentage}%)`;
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
                return context.parsed.y + " ออเดอร์";
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
    convert() {
      return convert;
    },

    filteredEmployees() {
      if (!this.search) return this.employeesData;
      return this.employeesData.filter((emp) =>
        emp.name.toLowerCase().includes(this.search.toLowerCase())
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
        console.log(
          "Fetching employee performance data for branch:",
          this.branchSelect.id
        );

        // Try new API first, fallback to old method
        try {
          const res = await this.$axios.$get("/employee-performance", {
            params: {
              branch_id: this.branchSelect.id,
              period: this.periodSelect,
            },
          });

          if (res.success && res.data) {
            console.log("Using new API endpoint");
            // ใช้ข้อมูลที่จัดกลุ่มแล้วจาก API
            this.employeesData = (res.data.employees || []).map((emp) => ({
              name: emp.name,
              totalOrders: emp.total_orders || 0,
              totalSales: parseFloat(emp.total_sales || 0),
              totalCustomers: emp.total_customers || 0,
              avgOrderValue: parseFloat(emp.avg_order_value || 0),
              orders: emp.orders || [],
            }));

            if (res.data.summary) {
              this.summary = {
                totalEmployees: res.data.summary.total_employees || 0,
                activeEmployees: res.data.summary.active_employees || 0,
                totalOrders: res.data.summary.total_orders || 0,
                totalSales: parseFloat(res.data.summary.total_sales || 0),
                avgPerEmployee: parseFloat(
                  res.data.summary.avg_per_employee || 0
                ),
                avgOrderValue: parseFloat(
                  res.data.summary.avg_order_value || 0
                ),
              };
            }

            // Add performance rating and percentage
            const avgSales = this.summary.avgPerEmployee;
            this.employeesData = this.employeesData.map((emp) => ({
              ...emp,
              performance: this.getPerformanceRating(emp.totalSales, avgSales),
              percentOfTotal:
                this.summary.totalSales > 0
                  ? (emp.totalSales / this.summary.totalSales) * 100
                  : 0,
            }));

            this.topEmployees = this.employeesData.slice(0, 10);
            this.prepareChartData();
            this.loading = false;
            return;
          }
        } catch (apiError) {
          console.log("New API not available, using fallback method");
        }

        // Fallback: Use getBillList and process on frontend
        const res = await this.$axios.$get("/getBillList", {
          params: {
            branch: this.branchSelect.id,
          },
        });

        console.log("Bills data received:", res.data?.length || 0, "bills");
        this.billsData = res.data || [];

        if (this.billsData.length === 0) {
          console.warn("No bills data found for branch:", this.branchSelect.id);
        } else {
          console.log("Sample bill:", this.billsData[0]);
        }

        // Process employee performance data
        this.processEmployeeData();
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

    processEmployeeData() {
      const employeeMap = new Map();
      const dayjs = this.$dayjs;
      const now = dayjs();

      console.log(
        "Processing employee data, total bills:",
        this.billsData.length
      );

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

      console.log(
        "Filtered bills for period:",
        this.periodSelect,
        filteredBills.length
      );

      // Group by employee
      filteredBills.forEach((bill) => {
        // Try different possible field names for employee
        const employeeName =
          bill.createdBy?.fullName ||
          bill.createdBy?.firstName ||
          bill.createdBy?.name ||
          bill.createBy?.fullName ||
          bill.createBy?.firstName ||
          bill.createBy?.name ||
          bill.employee?.fullName ||
          bill.employee?.firstName ||
          bill.employee?.name ||
          bill.user?.fullName ||
          bill.user?.firstName ||
          bill.user?.name ||
          "ไม่ระบุพนักงาน";

        if (!employeeMap.has(employeeName)) {
          employeeMap.set(employeeName, {
            name: employeeName,
            totalOrders: 0,
            totalSales: 0,
            totalCustomers: 0,
            orders: [],
          });
        }

        const employee = employeeMap.get(employeeName);
        employee.totalOrders += 1;
        employee.totalSales += parseFloat(bill.totalPrice || 0);
        employee.orders.push(bill);

        // Count unique customers (if customer data exists)
        if (bill.customer || bill.customer_id) {
          employee.totalCustomers += 1;
        }
      });

      console.log("Employees found:", employeeMap.size);
      console.log("Employee names:", Array.from(employeeMap.keys()));

      // Convert to array and calculate additional metrics
      this.employeesData = Array.from(employeeMap.values()).map((emp) => {
        const avgOrderValue =
          emp.totalOrders > 0 ? emp.totalSales / emp.totalOrders : 0;
        const performance = this.getPerformanceRating(
          emp.totalSales,
          this.getAverageSales(employeeMap)
        );

        return {
          ...emp,
          avgOrderValue,
          performance,
          percentOfTotal: 0, // Will be calculated after we have total
        };
      });

      // Calculate percent of total
      const totalSales = this.employeesData.reduce(
        (sum, emp) => sum + emp.totalSales,
        0
      );
      this.employeesData = this.employeesData.map((emp) => ({
        ...emp,
        percentOfTotal:
          totalSales > 0 ? (emp.totalSales / totalSales) * 100 : 0,
      }));

      // Sort by total sales
      this.employeesData.sort((a, b) => b.totalSales - a.totalSales);

      // Get top 10 employees
      this.topEmployees = this.employeesData.slice(0, 10);

      console.log(
        "Final employees data:",
        this.employeesData.length,
        "employees"
      );
      if (this.employeesData.length > 0) {
        console.log("Top employee:", this.employeesData[0]);
      }
    },

    getAverageSales(employeeMap) {
      const employees = Array.from(employeeMap.values());
      if (employees.length === 0) return 0;
      const totalSales = employees.reduce(
        (sum, emp) => sum + emp.totalSales,
        0
      );
      return totalSales / employees.length;
    },

    getPerformanceRating(sales, avgSales) {
      if (sales >= avgSales * 1.5) return "ดีเยี่ยม";
      if (sales >= avgSales * 1.2) return "ดีมาก";
      if (sales >= avgSales) return "ดี";
      if (sales >= avgSales * 0.7) return "ปานกลาง";
      return "ต้องปรับปรุง";
    },

    calculateSummary() {
      this.summary.totalEmployees = this.employeesData.length;
      this.summary.activeEmployees = this.employeesData.filter(
        (emp) => emp.totalOrders > 0
      ).length;
      this.summary.totalOrders = this.employeesData.reduce(
        (sum, emp) => sum + emp.totalOrders,
        0
      );
      this.summary.totalSales = this.employeesData.reduce(
        (sum, emp) => sum + emp.totalSales,
        0
      );
      this.summary.avgPerEmployee =
        this.summary.totalEmployees > 0
          ? this.summary.totalSales / this.summary.totalEmployees
          : 0;
      this.summary.avgOrderValue =
        this.summary.totalOrders > 0
          ? this.summary.totalSales / this.summary.totalOrders
          : 0;
    },

    prepareChartData() {
      // Top 10 employees bar chart
      if (this.topEmployees.length > 0) {
        this.topEmployeesChartData = {
          labels: this.topEmployees.map((emp) => emp.name),
          datasets: [
            {
              label: "ยอดขาย",
              data: this.topEmployees.map((emp) => emp.totalSales),
              backgroundColor: this.topEmployees.map((_, i) =>
                this.getRankColor(i)
              ),
            },
          ],
        };
      }

      // All employees pie chart (top 8 + others)
      if (this.employeesData.length > 0) {
        const top8 = this.employeesData.slice(0, 8);
        const others = this.employeesData.slice(8);
        const othersSales = others.reduce(
          (sum, emp) => sum + emp.totalSales,
          0
        );

        const labels = [...top8.map((emp) => emp.name)];
        const data = [...top8.map((emp) => emp.totalSales)];

        if (othersSales > 0) {
          labels.push("อื่นๆ");
          data.push(othersSales);
        }

        this.employeesPieData = {
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

      // Daily orders line chart (last 7 days average)
      this.prepareDailyOrdersChart();
    },

    prepareDailyOrdersChart() {
      const dayjs = this.$dayjs;
      const last7Days = [];

      for (let i = 6; i >= 0; i--) {
        const date = dayjs().subtract(i, "day");
        last7Days.push({
          date: date.format("DD/MM"),
          dayName: date.format("ddd"),
          orders: 0,
        });
      }

      // Count orders per day
      this.billsData.forEach((bill) => {
        const billDate = dayjs(bill.timestamp);
        const dayIndex = last7Days.findIndex(
          (day) => day.date === billDate.format("DD/MM")
        );
        if (dayIndex !== -1) {
          last7Days[dayIndex].orders += 1;
        }
      });

      this.dailyOrdersData = {
        labels: last7Days.map((day) => day.dayName),
        datasets: [
          {
            label: "จำนวนออเดอร์",
            data: last7Days.map((day) => day.orders),
            borderColor: "#846537",
            backgroundColor: "rgba(132, 101, 55, 0.1)",
            tension: 0.4,
            fill: true,
          },
        ],
      };
    },

    getRankColor(index) {
      const colors = {
        0: "#FFD700", // Gold
        1: "#C0C0C0", // Silver
        2: "#CD7F32", // Bronze
      };
      return colors[index] || "#846537";
    },

    getPerformanceColor(performance) {
      const colors = {
        ดีเยี่ยม: "#43e97b",
        ดีมาก: "#4facfe",
        ดี: "#B27D41",
        ปานกลาง: "#ffa726",
        ต้องปรับปรุง: "#ef5350",
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
      };
      return icons[performance] || "mdi-circle";
    },

    getAvatarColor(index) {
      const colors = [
        "#846537",
        "#B27D41",
        "#A57156",
        "#6E4C2E",
        "#D4A574",
        "#8B6F47",
      ];
      return colors[index % colors.length];
    },

    getInitials(name) {
      if (!name) return "?";
      const words = name.split(" ");
      if (words.length >= 2) {
        return (words[0][0] + words[1][0]).toUpperCase();
      }
      return name.substring(0, 2).toUpperCase();
    },
  },
};
