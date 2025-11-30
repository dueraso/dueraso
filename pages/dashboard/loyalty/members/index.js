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
        // TODO: Replace with actual API
        // const res = await this.apiGetMembers();
        // this.desserts = res.data;

        await this.getMockData();
        this.$nuxt.$loading.finish();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
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
        // await this.apiCreateMember(this.item);
        console.log("Create member:", this.item);
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
        // await this.apiUpdateMember(this.item.id, this.item);
        console.log("Update member:", this.item);
        this.dialog = false;
        this.getData();
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    onDelete(val) {
      this.item = Object.assign({}, val);
      this.dialogDelete = true;
    },

    async confirmDel() {
      try {
        // TODO: Replace with actual API
        // await this.apiDeleteMember(this.item.id);
        console.log("Delete member:", this.item.id);
        this.dialogDelete = false;
        this.getData();
      } catch (e) {
        console.log(e);
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
        // TODO: Replace with actual API
        // await this.apiAdjustPoints(this.selectedMember.id, {
        //   action: this.pointAction,
        //   amount: this.pointAmount,
        //   reason: this.pointReason
        // });
        console.log("Adjust points:", {
          memberId: this.selectedMember.id,
          action: this.pointAction,
          amount: this.pointAmount,
          reason: this.pointReason,
        });
        this.pointDialog = false;
        alert("ปรับแต้มสำเร็จ!");
        this.getData();
      } catch (e) {
        console.log(e);
        alert("เกิดข้อผิดพลาด");
      }
    },

    async viewHistory(member) {
      this.selectedMember = Object.assign({}, member);
      this.$nuxt.$loading.start();

      try {
        // TODO: Replace with actual API
        // const res = await this.apiGetPointHistory(member.id);
        // this.pointHistory = res.data;

        // Mock data
        this.pointHistory = [
          {
            id: 1,
            description: "ซื้อสินค้า Bill#001",
            points: 45,
            balance: 1250,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
          },
          {
            id: 2,
            description: "แลกส่วนลด 50 บาท",
            points: -200,
            balance: 1205,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
          },
          {
            id: 3,
            description: "ซื้อสินค้า Bill#002",
            points: 120,
            balance: 1405,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48),
          },
          {
            id: 4,
            description: "โบนัสวันเกิด",
            points: 100,
            balance: 1285,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72),
          },
          {
            id: 5,
            description: "ซื้อสินค้า Bill#003",
            points: 85,
            balance: 1185,
            createdAt: new Date(Date.now() - 1000 * 60 * 60 * 96),
          },
        ];

        this.$nuxt.$loading.finish();
        this.historyDialog = true;
      } catch (e) {
        console.log(e);
        this.$nuxt.$loading.finish();
      }
    },

    exportData() {
      // TODO: Implement export
      alert("กำลังพัฒนา...");
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
