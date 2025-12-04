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
      headTitle: "จัดการสมาชิก",
      loading: true,
      dialog: false,
      dialogDelete: false,
      pointDialog: false,
      historyDialog: false,
      birthdayMenu: false,

      // Filters
      search: "",
      filterTier: null,
      filterStatus: null,
      page: 1,
      itemsPerPage: 20,
      totalCount: 0,
      totalPages: 1,

      // Options
      tierOptions: ["Bronze", "Silver", "Gold", "Platinum"],
      statusOptions: [
        { text: "ปกติ", value: 1 },
        { text: "ระงับ", value: 0 },
      ],

      // Stats
      tierCounts: {
        bronze: 0,
        silver: 0,
        gold: 0,
        platinum: 0,
      },

      // Table
      tableHead: [
        { title: "#", width: "50px", text: "text-center" },
        { title: "ชื่อ-สกุล", width: "", text: "text-left" },
        { title: "เบอร์โทร", width: "", text: "text-left" },
        { title: "อีเมล", width: "", text: "text-left" },
        { title: "ระดับ", width: "", text: "text-center" },
        { title: "แต้ม", width: "", text: "text-right" },
        { title: "ยอดซื้อสะสม", width: "", text: "text-right" },
        { title: "สถานะ", width: "", text: "text-center" },
        { title: "สร้างเมื่อ", width: "", text: "text-left" },
      ],
      desserts: { data: [] },
      item: {},
      selectedMember: {},

      // Point adjustment
      pointAction: "add",
      pointAmount: null,
      pointReason: "",

      // History
      pointHistory: [],

      // Rules
      rules: {
        required: (value) => !!value || "จำเป็น",
        phone: (value) =>
          (value && value.length === 10 && !isNaN(value)) ||
          "เบอร์โทรต้องเป็นตัวเลข 10 หลัก",
      },

      searchTimeout: null,
    };
  },
  computed: {
    convert() {
      return convert;
    },
    calculatedPoints() {
      const current = this.selectedMember.points || 0;
      const amount = parseInt(this.pointAmount) || 0;
      return this.pointAction === "add" ? current + amount : current - amount;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false;
      this.getData();
      this.getTiers();
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

    onSearch() {
      clearTimeout(this.searchTimeout);
      this.searchTimeout = setTimeout(() => {
        this.page = 1;
        this.getData();
      }, 500);
    },

    async getData() {
      this.$nuxt.$loading.start();
      try {
        const res = await this.$axios.get("/loyalty/members", {
          params: {
            page: this.page,
            per_page: this.itemsPerPage,
            search: this.search || undefined,
            tier_id: this.filterTier || undefined,
            is_active: this.filterStatus,
          },
        });

        // แปลงข้อมูลให้ตรงกับ format ที่ใช้
        this.desserts.data = res.data.data.map((m) => ({
          id: m.id,
          name: m.full_name || m.name,
          phone: m.phone,
          email: m.email || "",
          tier: m.tier?.name || m.tier_name || "Bronze",
          tier_color: m.tier?.color || "#CD7F32",
          points: m.current_points || m.points || 0,
          totalSpent: m.total_spent || 0,
          status: m.status ? 1 : 0,
          createdAt: new Date(m.created_at),
          birthday: m.birthday,
          member_code: m.member_code,
        }));

        this.totalCount = res.data.total;
        this.totalPages = res.data.last_page;

        // Get tier statistics
        await this.getTierStats();

        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    async getTierStats() {
      try {
        const res = await this.$axios.get("/loyalty/members/statistics");
        if (res.data) {
          this.tierCounts = {
            bronze: res.data.tier_distribution?.Bronze || 0,
            silver: res.data.tier_distribution?.Silver || 0,
            gold: res.data.tier_distribution?.Gold || 0,
            platinum: res.data.tier_distribution?.Platinum || 0,
          };
        }
      } catch (e) {
        console.log(e);
      }
    },

    async getMockData() {
      await new Promise((resolve) => setTimeout(resolve, 300));

      const allMembers = [
        {
          id: 1,
          name: "สมชาย ใจดี",
          phone: "0812345678",
          email: "somchai@email.com",
          tier: "Gold",
          points: 1250,
          totalSpent: 45000,
          status: 1,
          createdAt: new Date("2024-01-15"),
          birthday: "1990-05-15",
        },
        {
          id: 2,
          name: "สมหญิง รักเรียน",
          phone: "0823456789",
          email: "somying@email.com",
          tier: "Silver",
          points: 580,
          totalSpent: 18500,
          status: 1,
          createdAt: new Date("2024-02-20"),
          birthday: "1988-08-22",
        },
        {
          id: 3,
          name: "สมศรี มั่งมี",
          phone: "0834567890",
          email: "somsri@email.com",
          tier: "Platinum",
          points: 3200,
          totalSpent: 125000,
          status: 1,
          createdAt: new Date("2023-11-10"),
          birthday: "1985-12-01",
        },
        {
          id: 4,
          name: "สมพร สุขใจ",
          phone: "0845678901",
          email: "",
          tier: "Bronze",
          points: 120,
          totalSpent: 3800,
          status: 1,
          createdAt: new Date("2024-06-05"),
          birthday: null,
        },
        {
          id: 5,
          name: "สมบัติ รวยมาก",
          phone: "0856789012",
          email: "sombat@email.com",
          tier: "Gold",
          points: 890,
          totalSpent: 32000,
          status: 1,
          createdAt: new Date("2024-03-18"),
          birthday: "1992-03-30",
        },
        {
          id: 6,
          name: "สมใจ ดีงาม",
          phone: "0867890123",
          email: "",
          tier: "Silver",
          points: 450,
          totalSpent: 15000,
          status: 0,
          createdAt: new Date("2024-04-22"),
          birthday: null,
        },
        {
          id: 7,
          name: "สมปอง รักดี",
          phone: "0878901234",
          email: "sompong@email.com",
          tier: "Bronze",
          points: 80,
          totalSpent: 2500,
          status: 1,
          createdAt: new Date("2024-07-10"),
          birthday: "1995-07-15",
        },
        {
          id: 8,
          name: "สมนึก คิดดี",
          phone: "0889012345",
          email: "",
          tier: "Gold",
          points: 1100,
          totalSpent: 38000,
          status: 1,
          createdAt: new Date("2024-01-28"),
          birthday: "1987-11-20",
        },
      ];

      // Filter
      let filtered = allMembers;
      if (this.search) {
        const s = this.search.toLowerCase();
        filtered = filtered.filter(
          (m) =>
            m.name.toLowerCase().includes(s) || m.phone.includes(this.search)
        );
      }
      if (this.filterTier) {
        filtered = filtered.filter((m) => m.tier === this.filterTier);
      }
      if (this.filterStatus !== null && this.filterStatus !== undefined) {
        filtered = filtered.filter((m) => m.status === this.filterStatus);
      }

      this.totalCount = filtered.length;
      this.totalPages = Math.ceil(filtered.length / this.itemsPerPage);
      this.desserts.data = filtered.slice(
        (this.page - 1) * this.itemsPerPage,
        this.page * this.itemsPerPage
      );

      // Tier counts
      this.tierCounts = {
        bronze: allMembers.filter((m) => m.tier === "Bronze").length,
        silver: allMembers.filter((m) => m.tier === "Silver").length,
        gold: allMembers.filter((m) => m.tier === "Gold").length,
        platinum: allMembers.filter((m) => m.tier === "Platinum").length,
      };
    },

    openItem(val = {}) {
      this.item = Object.assign({}, val);
      console.log(this.item);
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
        await this.$axios.post("/loyalty/members", {
          name: this.item.name,
          phone: this.item.phone,
          email: this.item.email || null,
          birthday: this.item.birthday || null,
        });
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          alert(errors.join("\n"));
        } else {
          alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
        }
        this.$nuxt.$loading.finish();
      }
    },

    async onUpdate() {
      try {
        await this.$axios.put(`/loyalty/members/${this.item.id}`, {
          name: this.item.name,
          phone: this.item.phone,
          email: this.item.email || null,
          birthday: this.item.birthday || null,
          status: this.item.status,
        });
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        if (e.response?.data?.errors) {
          const errors = Object.values(e.response.data.errors).flat();
          alert(errors.join("\n"));
        } else {
          alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
        }
        this.$nuxt.$loading.finish();
      }
    },

    onDelete(val) {
      this.item = Object.assign({}, val);
      this.dialogDelete = true;
    },

    async confirmDel() {
      try {
        await this.$axios.delete(`/loyalty/members/${this.item.id}`);
        this.dialogDelete = false;
        this.getData();
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
      }
    },

    openPointDialog(member) {
      this.selectedMember = Object.assign({}, member);
      this.pointAction = "add";
      this.pointAmount = null;
      this.pointReason = "";
      this.pointDialog = true;
    },

    async confirmAdjustPoints() {
      try {
        if (this.pointAction === "add") {
          await this.$axios.post(
            `/loyalty/members/${this.selectedMember.id}/add-points`,
            {
              points: this.pointAmount,
              description: this.pointReason || "ปรับแต้มด้วยมือ",
            }
          );
        } else {
          await this.$axios.post(
            `/loyalty/members/${this.selectedMember.id}/deduct-points`,
            {
              points: this.pointAmount,
              description: this.pointReason || "หักแต้มด้วยมือ",
            }
          );
        }
        this.pointDialog = false;
        alert("ปรับแต้มสำเร็จ!");
        this.getData();
      } catch (e) {
        console.log(e);
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
      }
    },

    async viewHistory(member) {
      this.selectedMember = Object.assign({}, member);
      this.$nuxt.$loading.start();

      try {
        const res = await this.$axios.get(
          `/loyalty/members/${member.id}/point-history`
        );
        this.pointHistory = (res.data || []).map((h) => ({
          id: h.id,
          description: h.description || h.type,
          points: h.points,
          balance: h.balance || 0,
          createdAt: new Date(h.created_at),
        }));

        this.$nuxt.$loading.finish();
        this.historyDialog = true;
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
        alert(e.response?.data?.message || "เกิดข้อผิดพลาด");
      }
    },

    exportData() {
      // TODO: Implement export
      alert("กำลังพัฒนา...");
    },

    async getTiers() {
      return await this.$axios
        .get("/loyalty/tiers")
        .then((res) => {
          this.tierOptions = res.data;
        })
        .catch((err) => {
          console.log(err);
        });
    },

    // API Functions (Ready for implementation)
    async apiGetMembers() {
      return await this.$axios.get("/loyalty/members", {
        params: {
          page: this.page,
          limit: this.itemsPerPage,
          search: this.search,
          tier: this.filterTier,
          status: this.filterStatus,
        },
      });
    },

    async apiCreateMember(data) {
      return await this.$axios.post("/loyalty/members", data);
    },

    async apiUpdateMember(id, data) {
      return await this.$axios.put(`/loyalty/members/${id}`, data);
    },

    async apiDeleteMember(id) {
      return await this.$axios.delete(`/loyalty/members/${id}`);
    },

    async apiAdjustPoints(memberId, data) {
      return await this.$axios.post(
        `/loyalty/members/${memberId}/points`,
        data
      );
    },

    async apiGetPointHistory(memberId) {
      return await this.$axios.get(`/loyalty/members/${memberId}/history`);
    },

    async apiExportMembers() {
      return await this.$axios.get("/loyalty/members/export", {
        responseType: "blob",
      });
    },
  },
};
