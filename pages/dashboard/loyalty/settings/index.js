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
      headTitle: "ตั้งค่าระบบสะสมแต้ม",
      loading: true,
      saving: false,

      settings: {
        systemEnabled: true,
        pointsPerBaht: 10,
        pointExpireDays: 365,
        minPurchaseForPoints: 0,
        maxPointsPerTransaction: 0,
        enableRounding: true,
        enableBirthdayBonus: true,
        birthdayBonusPoints: 100,
        enableReferral: true,
        referralPoints: 50,
        notifyPointsEarned: true,
        notifyPointsExpiring: true,
        expiryNotifyDays: 7,
        notifyTierUpgrade: true,
      },

      confirmDialog: false,
      confirmMessage: "",
      confirmText: "",
      confirmInput: "",
      confirmAction: null,
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
        // const res = await this.apiGetSettings();
        // this.settings = res.data;
        await new Promise((resolve) => setTimeout(resolve, 300));
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async saveSettings() {
      this.saving = true;
      try {
        // TODO: Replace with actual API
        // await this.apiSaveSettings(this.settings);
        console.log("Save settings:", this.settings);
        await new Promise((resolve) => setTimeout(resolve, 500));
        alert("บันทึกการตั้งค่าสำเร็จ!");
      } catch (e) {
        console.log(e);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      } finally {
        this.saving = false;
      }
    },

    confirmResetPoints() {
      this.confirmMessage =
        "การรีเซ็ตแต้มจะทำให้แต้มสะสมของสมาชิกทุกคนกลายเป็น 0 ไม่สามารถกู้คืนได้";
      this.confirmText = "RESET";
      this.confirmInput = "";
      this.confirmAction = "resetPoints";
      this.confirmDialog = true;
    },

    confirmDeleteAllMembers() {
      this.confirmMessage =
        "การลบสมาชิกทั้งหมดจะลบข้อมูลสมาชิก แต้ม และประวัติทั้งหมด ไม่สามารถกู้คืนได้";
      this.confirmText = "DELETE ALL";
      this.confirmInput = "";
      this.confirmAction = "deleteAllMembers";
      this.confirmDialog = true;
    },

    async executeConfirm() {
      if (this.confirmInput !== this.confirmText) return;

      this.confirmDialog = false;
      this.$nuxt.$loading.start();

      try {
        if (this.confirmAction === "resetPoints") {
          // TODO: Replace with actual API
          // await this.apiResetAllPoints();
          console.log("Reset all points");
          alert("รีเซ็ตแต้มทั้งหมดสำเร็จ!");
        } else if (this.confirmAction === "deleteAllMembers") {
          // TODO: Replace with actual API
          // await this.apiDeleteAllMembers();
          console.log("Delete all members");
          alert("ลบสมาชิกทั้งหมดสำเร็จ!");
        }
      } catch (e) {
        console.log(e);
        alert("เกิดข้อผิดพลาด");
      } finally {
        this.$nuxt.$loading.finish();
      }
    },

    // API Functions
    async apiGetSettings() {
      return await this.$axios.get("/loyalty/settings");
    },

    async apiSaveSettings(data) {
      return await this.$axios.put("/loyalty/settings", data);
    },

    async apiResetAllPoints() {
      return await this.$axios.post("/loyalty/reset-points");
    },

    async apiDeleteAllMembers() {
      return await this.$axios.delete("/loyalty/members/all");
    },
  },
};
