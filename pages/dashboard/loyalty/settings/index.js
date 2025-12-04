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
        const res = await this.$axios.get("/loyalty/settings");
        if (res.data) {
          const s = res.data;
          this.settings = {
            systemEnabled: s.system_enabled ?? true,
            pointsPerBaht: s.points_per_baht ?? 10,
            pointExpireDays: s.point_expire_days ?? 365,
            minPurchaseForPoints: s.min_purchase_for_points ?? 0,
            maxPointsPerTransaction: s.max_points_per_transaction ?? 0,
            enableRounding: s.enable_rounding ?? true,
            enableBirthdayBonus: s.enable_birthday_bonus ?? true,
            birthdayBonusPoints: s.birthday_bonus_points ?? 100,
            enableReferral: s.enable_referral ?? true,
            referralPoints: s.referral_points ?? 50,
            notifyPointsEarned: s.notify_points_earned ?? true,
            notifyPointsExpiring: s.notify_points_expiring ?? true,
            expiryNotifyDays: s.expiry_notify_days ?? 7,
            notifyTierUpgrade: s.notify_tier_upgrade ?? true,
          };
        }
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async saveSettings() {
      this.saving = true;
      try {
        await this.$axios.put("/loyalty/settings", {
          system_enabled: this.settings.systemEnabled,
          points_per_baht: this.settings.pointsPerBaht,
          point_expire_days: this.settings.pointExpireDays,
          min_purchase_for_points: this.settings.minPurchaseForPoints,
          max_points_per_transaction: this.settings.maxPointsPerTransaction,
          enable_rounding: this.settings.enableRounding,
          enable_birthday_bonus: this.settings.enableBirthdayBonus,
          birthday_bonus_points: this.settings.birthdayBonusPoints,
          enable_referral: this.settings.enableReferral,
          referral_points: this.settings.referralPoints,
          notify_points_earned: this.settings.notifyPointsEarned,
          notify_points_expiring: this.settings.notifyPointsExpiring,
          expiry_notify_days: this.settings.expiryNotifyDays,
          notify_tier_upgrade: this.settings.notifyTierUpgrade,
        });
        alert("บันทึกการตั้งค่าสำเร็จ!");
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด กรุณาลองใหม่");
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
          await this.$axios.post("/loyalty/settings/reset");
          alert("รีเซ็ตแต้มทั้งหมดสำเร็จ!");
        } else if (this.confirmAction === "deleteAllMembers") {
          // Not recommended - implement with caution
          alert("ฟังก์ชันนี้ถูกปิดเพื่อความปลอดภัย");
        }
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
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
