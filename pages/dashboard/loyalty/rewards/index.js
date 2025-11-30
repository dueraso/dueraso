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
      headTitle: "จัดการรางวัล",
      loading: true,
      dialog: false,
      dialogDelete: false,
      startDateMenu: false,
      endDateMenu: false,

      rewards: [],
      totalRedemptions: 0,
      item: {
        status: 1,
      },

      rewardTypes: [
        { text: "ส่วนลดเงิน", value: "discount" },
        { text: "ส่วนลด %", value: "percent" },
        { text: "ของฟรี", value: "free_item" },
        { text: "อื่นๆ", value: "other" },
      ],

      rules: {
        required: (value) => !!value || "จำเป็น",
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
      this.loading = false;
      this.getData();
    });
  },
  methods: {
    getTypeColor(type) {
      const colors = {
        discount: "#4CAF50",
        percent: "#2196F3",
        free_item: "#FF9800",
        other: "#9E9E9E",
      };
      return colors[type] || "#846537";
    },

    getTypeName(type) {
      const names = {
        discount: "ส่วนลดเงิน",
        percent: "ส่วนลด %",
        free_item: "ของฟรี",
        other: "อื่นๆ",
      };
      return names[type] || type;
    },

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

      this.rewards = [
        {
          id: 1,
          name: "ส่วนลด 20 บาท",
          description: "ใช้เป็นส่วนลดในบิลถัดไป",
          points: 100,
          type: "discount",
          value: 20,
          stock: null,
          status: 1,
          redemptionCount: 156,
          image: null,
          startDate: null,
          endDate: null,
        },
        {
          id: 2,
          name: "ส่วนลด 50 บาท",
          description: "ใช้เป็นส่วนลดในบิลถัดไป",
          points: 200,
          type: "discount",
          value: 50,
          stock: 100,
          status: 1,
          redemptionCount: 234,
          image: null,
          startDate: null,
          endDate: null,
        },
        {
          id: 3,
          name: "ส่วนลด 10%",
          description: "ลดราคา 10% ทั้งบิล (สูงสุด 100 บาท)",
          points: 300,
          type: "percent",
          value: 10,
          stock: null,
          status: 1,
          redemptionCount: 89,
          image: null,
          startDate: null,
          endDate: null,
        },
        {
          id: 4,
          name: "ฟรีเครื่องดื่ม 1 แก้ว",
          description: "เลือกเครื่องดื่มฟรี 1 แก้ว (ไม่เกิน 50 บาท)",
          points: 150,
          type: "free_item",
          value: 50,
          stock: 50,
          status: 1,
          redemptionCount: 45,
          image: null,
          startDate: null,
          endDate: null,
        },
        {
          id: 5,
          name: "ส่วนลด 100 บาท",
          description: "ใช้เมื่อซื้อครบ 500 บาทขึ้นไป",
          points: 400,
          type: "discount",
          value: 100,
          stock: 20,
          status: 0,
          redemptionCount: 12,
          image: null,
          startDate: "2024-12-01",
          endDate: "2024-12-31",
        },
      ];

      this.totalRedemptions = this.rewards.reduce(
        (sum, r) => sum + r.redemptionCount,
        0
      );
    },

    openItem(val = {}) {
      this.item = Object.assign({ status: 1 }, val);
      this.dialog = true;
    },

    async confirm() {
      this.$nuxt.$loading.start();
      if (this.item.id) {
        await this.onUpdate();
      } else {
        await this.onCreate();
      }
    },

    async onCreate() {
      try {
        // TODO: Replace with actual API
        // await this.apiCreateReward(this.item);
        console.log("Create reward:", this.item);
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async onUpdate() {
      try {
        // TODO: Replace with actual API
        // await this.apiUpdateReward(this.item.id, this.item);
        console.log("Update reward:", this.item);
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async toggleStatus(reward) {
      try {
        // TODO: Replace with actual API
        // await this.apiUpdateReward(reward.id, { status: reward.status === 1 ? 0 : 1 });
        reward.status = reward.status === 1 ? 0 : 1;
        console.log("Toggle status:", reward.id, reward.status);
      } catch (e) {
        console.log(e);
      }
    },

    onDelete(val) {
      this.item = Object.assign({}, val);
      this.dialogDelete = true;
    },

    async confirmDel() {
      try {
        // TODO: Replace with actual API
        // await this.apiDeleteReward(this.item.id);
        console.log("Delete reward:", this.item.id);
        this.dialogDelete = false;
        this.getData();
      } catch (e) {
        console.log(e);
      }
    },

    // API Functions
    async apiGetRewards() {
      return await this.$axios.get("/loyalty/rewards");
    },

    async apiCreateReward(data) {
      return await this.$axios.post("/loyalty/rewards", data);
    },

    async apiUpdateReward(id, data) {
      return await this.$axios.put(`/loyalty/rewards/${id}`, data);
    },

    async apiDeleteReward(id) {
      return await this.$axios.delete(`/loyalty/rewards/${id}`);
    },
  },
};
