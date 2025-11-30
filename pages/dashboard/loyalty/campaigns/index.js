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
      headTitle: "แคมเปญโปรโมชั่น",
      loading: true,
      dialog: false,
      dialogDelete: false,
      startDateMenu: false,
      endDateMenu: false,

      allCampaigns: [],
      item: {
        status: 1,
        icon: "mdi-star",
        color: "#B27D41",
      },

      campaignTypes: [
        { text: "แต้ม x (คูณ)", value: "multiplier" },
        { text: "โบนัสแต้ม", value: "bonus" },
        { text: "แนะนำเพื่อน", value: "referral" },
        { text: "วันเกิด", value: "birthday" },
        { text: "ซื้อครบรับโบนัส", value: "spend_bonus" },
      ],

      iconOptions: [
        "mdi-star",
        "mdi-fire",
        "mdi-gift",
        "mdi-cake-variant",
        "mdi-account-plus",
        "mdi-percent",
        "mdi-tag",
        "mdi-crown",
        "mdi-trophy",
        "mdi-party-popper",
      ],

      colorOptions: [
        "#B27D41",
        "#4CAF50",
        "#2196F3",
        "#FF9800",
        "#E91E63",
        "#9C27B0",
        "#F44336",
        "#00BCD4",
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
    activeCampaigns() {
      const now = new Date();
      return this.allCampaigns.filter((c) => {
        if (c.status !== 1) return false;
        if (c.startDate && new Date(c.startDate) > now) return false;
        if (c.endDate && new Date(c.endDate) < now) return false;
        return true;
      });
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false;
      this.getData();
    });
  },
  methods: {
    getCampaignTypeName(type) {
      const names = {
        multiplier: "แต้ม x",
        bonus: "โบนัสแต้ม",
        referral: "แนะนำเพื่อน",
        birthday: "วันเกิด",
        spend_bonus: "ซื้อครบรับโบนัส",
      };
      return names[type] || type;
    },

    getValueLabel(type) {
      const labels = {
        multiplier: "ตัวคูณ",
        bonus: "จำนวนแต้ม",
        referral: "แต้มที่ได้รับ",
        birthday: "แต้มโบนัส",
        spend_bonus: "ยอดซื้อขั้นต่ำ",
      };
      return labels[type] || "ค่า";
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

      this.allCampaigns = [
        {
          id: 1,
          name: "แต้ม x2 วันศุกร์",
          description: "รับแต้มเพิ่ม 2 เท่าทุกวันศุกร์",
          type: "multiplier",
          value: 2,
          icon: "mdi-fire",
          color: "#FF9800",
          status: 1,
          startDate: null,
          endDate: null,
          usageCount: 234,
        },
        {
          id: 2,
          name: "โบนัสวันเกิด",
          description: "รับแต้มพิเศษ 100 แต้มในเดือนเกิด",
          type: "birthday",
          value: 100,
          icon: "mdi-cake-variant",
          color: "#E91E63",
          status: 1,
          startDate: null,
          endDate: null,
          usageCount: 89,
        },
        {
          id: 3,
          name: "แนะนำเพื่อน",
          description: "แนะนำเพื่อนสมัครสมาชิก รับ 50 แต้มทั้งคู่",
          type: "referral",
          value: 50,
          icon: "mdi-account-plus",
          color: "#4CAF50",
          status: 1,
          startDate: null,
          endDate: null,
          usageCount: 156,
        },
        {
          id: 4,
          name: "แต้ม x3 เดือนธันวาคม",
          description: "ฉลองปีใหม่! รับแต้ม 3 เท่าตลอดเดือนธันวาคม",
          type: "multiplier",
          value: 3,
          icon: "mdi-party-popper",
          color: "#9C27B0",
          status: 1,
          startDate: "2024-12-01",
          endDate: "2024-12-31",
          usageCount: 0,
        },
        {
          id: 5,
          name: "ซื้อครบ 500 รับ 50 แต้ม",
          description: "ซื้อสินค้าครบ 500 บาทต่อบิล รับโบนัส 50 แต้ม",
          type: "spend_bonus",
          value: 500,
          icon: "mdi-gift",
          color: "#2196F3",
          status: 0,
          startDate: null,
          endDate: null,
          usageCount: 45,
        },
      ];
    },

    openItem(val = {}) {
      this.item = Object.assign(
        { status: 1, icon: "mdi-star", color: "#B27D41" },
        val
      );
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
        // await this.apiCreateCampaign(this.item);
        console.log("Create campaign:", this.item);
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
        // await this.apiUpdateCampaign(this.item.id, this.item);
        console.log("Update campaign:", this.item);
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async toggleCampaign(campaign) {
      try {
        // TODO: Replace with actual API
        // await this.apiUpdateCampaign(campaign.id, { status: campaign.status === 1 ? 0 : 1 });
        campaign.status = campaign.status === 1 ? 0 : 1;
        console.log("Toggle campaign:", campaign.id, campaign.status);
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
        // await this.apiDeleteCampaign(this.item.id);
        console.log("Delete campaign:", this.item.id);
        this.dialogDelete = false;
        this.getData();
      } catch (e) {
        console.log(e);
      }
    },

    // API Functions
    async apiGetCampaigns() {
      return await this.$axios.get("/loyalty/campaigns");
    },

    async apiCreateCampaign(data) {
      return await this.$axios.post("/loyalty/campaigns", data);
    },

    async apiUpdateCampaign(id, data) {
      return await this.$axios.put(`/loyalty/campaigns/${id}`, data);
    },

    async apiDeleteCampaign(id) {
      return await this.$axios.delete(`/loyalty/campaigns/${id}`);
    },
  },
};
