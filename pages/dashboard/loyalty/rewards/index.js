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
        const res = await this.$axios.get("/loyalty/rewards");
        this.rewards = (res.data || []).map((r) => ({
          id: r.id,
          name: r.name,
          description: r.description || "",
          points: r.points_required,
          type: r.type,
          value: r.value || 0,
          stock: r.stock,
          status: r.status ? 1 : 0,
          redemptionCount: r.redemption_count || 0,
          image: r.image,
          startDate: r.start_date,
          endDate: r.end_date,
        }));
        this.totalRedemptions = this.rewards.reduce(
          (sum, r) => sum + r.redemptionCount,
          0
        );
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
        await this.$axios.post("/loyalty/rewards", {
          name: this.item.name,
          description: this.item.description || null,
          type: this.item.type,
          points_required: this.item.points,
          value: this.item.value || null,
          stock: this.item.stock || null,
          start_date: this.item.startDate || null,
          end_date: this.item.endDate || null,
          status: this.item.status,
        });
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
        this.$nuxt.$loading.finish();
      }
    },

    async onUpdate() {
      try {
        await this.$axios.put(`/loyalty/rewards/${this.item.id}`, {
          name: this.item.name,
          description: this.item.description || null,
          type: this.item.type,
          points_required: this.item.points,
          value: this.item.value || null,
          stock: this.item.stock || null,
          start_date: this.item.startDate || null,
          end_date: this.item.endDate || null,
          status: this.item.status,
        });
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
        this.$nuxt.$loading.finish();
      }
    },

    async toggleStatus(reward) {
      try {
        const newStatus = reward.status === 1 ? 0 : 1;
        await this.$axios.put(`/loyalty/rewards/${reward.id}`, {
          status: newStatus,
        });
        reward.status = newStatus;
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
      }
    },

    onDelete(val) {
      this.item = Object.assign({}, val);
      this.dialogDelete = true;
    },

    async confirmDel() {
      try {
        await this.$axios.delete(`/loyalty/rewards/${this.item.id}`);
        this.dialogDelete = false;
        this.getData();
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
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
