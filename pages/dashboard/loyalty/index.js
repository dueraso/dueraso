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

    // API Functions
    async getDashboardData() {
      this.$nuxt.$loading.start();
      try {
        // Load all dashboard data in parallel
        await Promise.all([
          this.loadOverview(),
          this.loadRecentMembers(),
          this.loadRecentRedemptions(),
          this.loadTopMembers(),
          this.loadTierDistribution(),
          this.loadMembersChart(),
        ]);
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async loadOverview() {
      try {
        const res = await this.$axios.get("/loyalty/dashboard/overview");
        if (res.data) {
          this.stats = {
            totalMembers: res.data.total_members || 0,
            newMembersToday: res.data.new_members_today || 0,
            totalPointsGiven: res.data.total_points_earned || 0,
            pointsThisMonth: res.data.points_this_month || 0,
            totalPointsUsed: res.data.total_points_used || 0,
            totalRedemptions: res.data.total_redemptions || 0,
            topReward: res.data.top_reward?.name || "-",
            topRewardCount: res.data.top_reward?.count || 0,
          };
        }
      } catch (e) {
        console.log("loadOverview error:", e);
      }
    },

    async loadRecentMembers() {
      try {
        const res = await this.$axios.get("/loyalty/dashboard/recent-members");
        this.recentMembers = (res.data || []).map((m) => ({
          id: m.id,
          name: m.full_name || m.name,
          phone: m.phone,
          tier: m.tier?.name || m.tier_name || "Bronze",
          points: m.current_points || m.points || 0,
        }));
      } catch (e) {
        console.log("loadRecentMembers error:", e);
      }
    },

    async loadRecentRedemptions() {
      try {
        const res = await this.$axios.get(
          "/loyalty/dashboard/recent-redemptions"
        );
        this.recentRedemptions = (res.data || []).map((r) => ({
          id: r.id,
          memberName: r.member?.name || r.member?.full_name || "-",
          rewardName: r.reward?.name || "-",
          points: r.points_used || 0,
          createdAt: new Date(r.created_at),
        }));
      } catch (e) {
        console.log("loadRecentRedemptions error:", e);
      }
    },

    async loadTopMembers() {
      try {
        const res = await this.$axios.get("/loyalty/dashboard/top-members");
        this.topMembers = (res.data || []).map((m) => ({
          id: m.id,
          name: m.full_name || m.name,
          points: m.total_points_earned || m.points || 0,
          tier: m.tier?.name || m.tier_name || "Bronze",
        }));
      } catch (e) {
        console.log("loadTopMembers error:", e);
      }
    },

    async loadTierDistribution() {
      try {
        const res = await this.$axios.get(
          "/loyalty/dashboard/tier-distribution"
        );
        if (res.data) {
          this.tierChartSeries = [
            res.data.Bronze || 0,
            res.data.Silver || 0,
            res.data.Gold || 0,
            res.data.Platinum || 0,
          ];
        }
      } catch (e) {
        console.log("loadTierDistribution error:", e);
      }
    },

    async loadMembersChart() {
      try {
        const res = await this.$axios.get("/loyalty/dashboard/members-chart");
        if (res.data && res.data.length > 0) {
          this.memberChartSeries = [
            {
              name: "สมาชิกใหม่",
              data: res.data.map((d) => d.count || 0),
            },
          ];
        }
      } catch (e) {
        console.log("loadMembersChart error:", e);
      }
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
