import isAdmin from "@/middleware/is-admin";
import convert from "@/plugins/convert";

export default {
  layout: "seller-layout",
  middleware: ["auth", isAdmin],
  head() {
    return {
      title: this.headTitle,
    };
  },
  data() {
    return {
      headTitle: "ระบบสะสมแต้ม",
      loading: true,

      // Stats
      stats: {
        totalMembers: 0,
        newMembersToday: 0,
        totalPointsGiven: 0,
        pointsThisMonth: 0,
        totalPointsUsed: 0,
        totalRedemptions: 0,
        topReward: "",
        topRewardCount: 0,
      },

      // Menus
      menus: [
        {
          title: "สมาชิก",
          icon: "mdi-account-group",
          path: "/dashboard/loyalty/members",
          color: "#B27D41",
          bgColor: "#ECE6E0",
        },
        {
          title: "แต้มสะสม",
          icon: "mdi-star-circle",
          path: "/dashboard/loyalty/points",
          color: "#4CAF50",
          bgColor: "#E8F5E9",
        },
        {
          title: "รางวัล",
          icon: "mdi-gift",
          path: "/dashboard/loyalty/rewards",
          color: "#FF9800",
          bgColor: "#FFF3E0",
        },
        {
          title: "ระดับสมาชิก",
          icon: "mdi-medal",
          path: "/dashboard/loyalty/tiers",
          color: "#9C27B0",
          bgColor: "#F3E5F5",
        },
        {
          title: "แคมเปญ",
          icon: "mdi-bullhorn",
          path: "/dashboard/loyalty/campaigns",
          color: "#E91E63",
          bgColor: "#FCE4EC",
        },
        {
          title: "ตั้งค่า",
          icon: "mdi-cog",
          path: "/dashboard/loyalty/settings",
          color: "#607D8B",
          bgColor: "#ECEFF1",
        },
      ],

      // Recent data
      recentMembers: [],
      recentRedemptions: [],
      topMembers: [],

      // Charts
      memberChartOptions: {
        chart: {
          type: "area",
          toolbar: { show: false },
        },
        colors: ["#B27D41"],
        dataLabels: { enabled: false },
        stroke: { curve: "smooth", width: 2 },
        fill: {
          type: "gradient",
          gradient: {
            shadeIntensity: 1,
            opacityFrom: 0.4,
            opacityTo: 0.1,
          },
        },
        xaxis: {
          categories: [
            "ม.ค.",
            "ก.พ.",
            "มี.ค.",
            "เม.ย.",
            "พ.ค.",
            "มิ.ย.",
            "ก.ค.",
            "ส.ค.",
            "ก.ย.",
            "ต.ค.",
            "พ.ย.",
            "ธ.ค.",
          ],
        },
        tooltip: { y: { formatter: (val) => val + " คน" } },
      },
      memberChartSeries: [{ name: "สมาชิกใหม่", data: [] }],

      tierChartOptions: {
        chart: { type: "donut" },
        colors: ["#CD7F32", "#C0C0C0", "#FFD700", "#B27D41"],
        labels: ["Bronze", "Silver", "Gold", "Platinum"],
        legend: { position: "bottom" },
        dataLabels: {
          formatter: (val) => val.toFixed(1) + "%",
        },
      },
      tierChartSeries: [],
    };
  },
  computed: {
    convert() {
      return convert;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false;
      this.getDashboardData();
    });
  },
  methods: {
    getTierColor(tier) {
      const colors = {
        Bronze: "#CD7F32",
        Silver: "#9E9E9E",
        Gold: "#FFD700",
        Platinum: "#B27D41",
      };
      return colors[tier] || "#846537";
    },

    // API Functions (Mock data for now)
    async getDashboardData() {
      this.$nuxt.$loading.start();
      try {
        // TODO: Replace with actual API calls
        // const res = await this.$axios.get('/loyalty/dashboard');
        // this.stats = res.data.stats;

        // Mock data
        await this.getMockDashboardData();
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async getMockDashboardData() {
      await new Promise((resolve) => setTimeout(resolve, 300));
      console.log("งงงง");

      // Mock Stats
      this.stats = {
        totalMembers: 1234,
        newMembersToday: 12,
        totalPointsGiven: 456789,
        pointsThisMonth: 23456,
        totalPointsUsed: 123456,
        totalRedemptions: 567,
        topReward: "ส่วนลด 50 บาท",
        topRewardCount: 234,
      };

      // Mock Recent Members
      this.recentMembers = [
        {
          id: 1,
          name: "สมชาย ใจดี",
          phone: "081-234-5678",
          tier: "Gold",
          points: 1250,
        },
        {
          id: 2,
          name: "สมหญิง รักเรียน",
          phone: "082-345-6789",
          tier: "Silver",
          points: 580,
        },
        {
          id: 3,
          name: "สมศรี มั่งมี",
          phone: "083-456-7890",
          tier: "Platinum",
          points: 3200,
        },
        {
          id: 4,
          name: "สมพร สุขใจ",
          phone: "084-567-8901",
          tier: "Bronze",
          points: 120,
        },
        {
          id: 5,
          name: "สมบัติ รวยมาก",
          phone: "085-678-9012",
          tier: "Gold",
          points: 890,
        },
      ];

      // Mock Recent Redemptions
      this.recentRedemptions = [
        {
          id: 1,
          memberName: "สมชาย ใจดี",
          rewardName: "ส่วนลด 50 บาท",
          points: 200,
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: 2,
          memberName: "สมหญิง รักเรียน",
          rewardName: "ส่วนลด 20 บาท",
          points: 100,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
          id: 3,
          memberName: "สมศรี มั่งมี",
          rewardName: "ส่วนลด 10%",
          points: 300,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
        {
          id: 4,
          memberName: "สมพร สุขใจ",
          rewardName: "ฟรีเครื่องดื่ม",
          points: 150,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
        {
          id: 5,
          memberName: "สมบัติ รวยมาก",
          rewardName: "ส่วนลด 50 บาท",
          points: 200,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
        },
      ];

      // Mock Top Members
      this.topMembers = [
        { id: 1, name: "สมศรี มั่งมี", points: 5800, tier: "Platinum" },
        { id: 2, name: "สมบัติ รวยมาก", points: 4500, tier: "Platinum" },
        { id: 3, name: "สมชาย ใจดี", points: 3200, tier: "Gold" },
        { id: 4, name: "สมใจ ดีงาม", points: 2800, tier: "Gold" },
        { id: 5, name: "สมปอง รักดี", points: 2100, tier: "Gold" },
      ];

      // Mock Chart Data
      this.memberChartSeries = [
        {
          name: "สมาชิกใหม่",
          data: [45, 52, 38, 65, 72, 85, 91, 78, 82, 95, 88, 102],
        },
      ];

      this.tierChartSeries = [450, 320, 280, 184]; // Bronze, Silver, Gold, Platinum
    },

    // API Functions (Ready for implementation)
    async apiGetDashboardStats() {
      return await this.$axios.get("/loyalty/dashboard/stats");
    },

    async apiGetRecentMembers(limit = 5) {
      return await this.$axios.get("/loyalty/members", {
        params: { limit, sort: "created_at", order: "desc" },
      });
    },

    async apiGetRecentRedemptions(limit = 5) {
      return await this.$axios.get("/loyalty/redemptions", {
        params: { limit, sort: "created_at", order: "desc" },
      });
    },

    async apiGetTopMembers(limit = 10) {
      return await this.$axios.get("/loyalty/members/top", {
        params: { limit },
      });
    },

    async apiGetMemberChartData(year) {
      return await this.$axios.get("/loyalty/stats/members-by-month", {
        params: { year },
      });
    },

    async apiGetTierDistribution() {
      return await this.$axios.get("/loyalty/stats/tier-distribution");
    },
  },
};
