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
      headTitle: "ระดับสมาชิก",
      loading: true,
      dialog: false,

      tiers: [],
      item: {},

      upgradeStats: {
        thisMonth: 0,
        downgradeThisMonth: 0,
        pendingUpgrade: 0,
      },

      chartOptions: {
        chart: { type: "donut" },
        colors: ["#CD7F32", "#C0C0C0", "#FFD700", "#B27D41"],
        labels: ["Bronze", "Silver", "Gold", "Platinum"],
        legend: { position: "bottom" },
        dataLabels: {
          formatter: (val) => val.toFixed(1) + "%",
        },
      },
      chartSeries: [],
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
      this.getData();
    });
  },
  methods: {
    async getData() {
      this.$nuxt.$loading.start();
      try {
        // TODO: Replace with actual API
        await this.getMockData();
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async getMockData() {
      await new Promise((resolve) => setTimeout(resolve, 300));

      this.tiers = [
        {
          id: 1,
          name: "Bronze",
          color: "#CD7F32",
          icon: "mdi-medal",
          minPoints: 0,
          pointMultiplier: 1,
          pointsPerBaht: 1,
          discount: 0,
          memberCount: 450,
          perks: ["สะสมแต้มทุกการซื้อ"],
        },
        {
          id: 2,
          name: "Silver",
          color: "#9E9E9E",
          icon: "mdi-medal",
          minPoints: 500,
          pointMultiplier: 1.2,
          pointsPerBaht: 1.2,
          discount: 0,
          memberCount: 320,
          perks: ["สะสมแต้ม 1.2x", "รับข่าวสารก่อนใคร"],
        },
        {
          id: 3,
          name: "Gold",
          color: "#FFD700",
          icon: "mdi-medal",
          minPoints: 1500,
          pointMultiplier: 1.5,
          pointsPerBaht: 1.5,
          discount: 5,
          memberCount: 280,
          perks: ["สะสมแต้ม 1.5x", "ส่วนลด 5%", "โบนัสวันเกิด"],
        },
        {
          id: 4,
          name: "Platinum",
          color: "#B27D41",
          icon: "mdi-crown",
          minPoints: 5000,
          pointMultiplier: 2,
          pointsPerBaht: 2,
          discount: 10,
          memberCount: 184,
          perks: [
            "สะสมแต้ม 2x",
            "ส่วนลด 10%",
            "โบนัสวันเกิด x2",
            "บริการพิเศษ",
          ],
        },
      ];

      this.chartSeries = this.tiers.map((t) => t.memberCount);

      this.upgradeStats = {
        thisMonth: 23,
        downgradeThisMonth: 5,
        pendingUpgrade: 45,
      };
    },

    openItem(val = {}) {
      this.item = Object.assign({}, val);
      this.dialog = true;
    },

    async confirm() {
      this.$nuxt.$loading.start();
      try {
        // TODO: Replace with actual API
        // await this.apiUpdateTier(this.item.id, this.item);
        console.log("Update tier:", this.item);
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    // API Functions
    async apiGetTiers() {
      return await this.$axios.get("/loyalty/tiers");
    },

    async apiUpdateTier(id, data) {
      return await this.$axios.put(`/loyalty/tiers/${id}`, data);
    },

    async apiGetUpgradeStats() {
      return await this.$axios.get("/loyalty/tiers/stats");
    },
  },
};
