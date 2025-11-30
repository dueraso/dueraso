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
      headTitle: "จัดการแต้มสะสม",
      loading: true,
      tab: 0,

      // Filters
      search: "",
      dateRange: [],
      dateMenu: false,
      page: 1,
      totalPages: 1,

      // Stats
      stats: {
        totalEarned: 0,
        totalUsed: 0,
        expiringSoon: 0,
        totalBalance: 0,
      },

      // Data
      earnedPoints: [],
      usedPoints: [],
      expiringPoints: [],

      searchTimeout: null,
    };
  },
  computed: {
    convert() {
      return convert;
    },
    dateRangeText() {
      if (this.dateRange.length === 2) {
        return this.dateRange.join(" ~ ");
      }
      return "";
    },
  },
  watch: {
    tab() {
      this.page = 1;
      this.getData();
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

    onDateChange() {
      this.dateMenu = false;
      this.page = 1;
      this.getData();
    },

    clearDateRange() {
      this.dateRange = [];
      this.page = 1;
      this.getData();
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

      // Mock Stats
      this.stats = {
        totalEarned: 45678,
        totalUsed: 12345,
        expiringSoon: 2340,
        totalBalance: 33333,
      };

      // Mock Earned Points
      this.earnedPoints = [
        {
          id: 1,
          memberName: "สมชาย ใจดี",
          memberTier: "Gold",
          description: "ซื้อสินค้า",
          billNumber: "B2411001",
          amount: 450,
          points: 45,
          createdAt: new Date(Date.now() - 1000 * 60 * 30),
        },
        {
          id: 2,
          memberName: "สมหญิง รักเรียน",
          memberTier: "Silver",
          description: "ซื้อสินค้า",
          billNumber: "B2411002",
          amount: 280,
          points: 28,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2),
        },
        {
          id: 3,
          memberName: "สมศรี มั่งมี",
          memberTier: "Platinum",
          description: "โบนัสแต้ม x2",
          billNumber: "B2411003",
          amount: 1200,
          points: 240,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5),
        },
        {
          id: 4,
          memberName: "สมพร สุขใจ",
          memberTier: "Bronze",
          description: "ซื้อสินค้า",
          billNumber: "B2411004",
          amount: 150,
          points: 15,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 8),
        },
        {
          id: 5,
          memberName: "สมบัติ รวยมาก",
          memberTier: "Gold",
          description: "โบนัสวันเกิด",
          billNumber: null,
          amount: 0,
          points: 100,
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12),
        },
      ];

      // Mock Used Points
      this.usedPoints = [
        {
          id: 1,
          memberName: "สมชาย ใจดี",
          memberTier: "Gold",
          rewardName: "ส่วนลด 50 บาท",
          points: 200,
          branch: "สาขาสยาม",
          createdAt: new Date(Date.now() - 1000 * 60 * 45),
        },
        {
          id: 2,
          memberName: "สมศรี มั่งมี",
          memberTier: "Platinum",
          rewardName: "ส่วนลด 10%",
          points: 300,
          branch: "สาขาเซ็นทรัล",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3),
        },
        {
          id: 3,
          memberName: "สมหญิง รักเรียน",
          memberTier: "Silver",
          rewardName: "ฟรีเครื่องดื่ม",
          points: 150,
          branch: "สาขาสยาม",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 6),
        },
        {
          id: 4,
          memberName: "สมบัติ รวยมาก",
          memberTier: "Gold",
          rewardName: "ส่วนลด 20 บาท",
          points: 100,
          branch: "สาขาลาดพร้าว",
          createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24),
        },
      ];

      // Mock Expiring Points
      this.expiringPoints = [
        {
          id: 1,
          name: "สมชาย ใจดี",
          phone: "0812345678",
          tier: "Gold",
          expiringPoints: 350,
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5),
          daysLeft: 5,
        },
        {
          id: 2,
          name: "สมหญิง รักเรียน",
          phone: "0823456789",
          tier: "Silver",
          expiringPoints: 180,
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 12),
          daysLeft: 12,
        },
        {
          id: 3,
          name: "สมพร สุขใจ",
          phone: "0845678901",
          tier: "Bronze",
          expiringPoints: 80,
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 20),
          daysLeft: 20,
        },
        {
          id: 4,
          name: "สมนึก คิดดี",
          phone: "0889012345",
          tier: "Gold",
          expiringPoints: 420,
          expiryDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 28),
          daysLeft: 28,
        },
      ];

      this.totalPages = 3;
    },

    notifyMember(member) {
      // TODO: Implement notification
      alert(`ส่งการแจ้งเตือนไปยัง ${member.name} (${member.phone})`);
    },

    // API Functions
    async apiGetEarnedPoints(params) {
      return await this.$axios.get("/loyalty/points/earned", { params });
    },

    async apiGetUsedPoints(params) {
      return await this.$axios.get("/loyalty/points/used", { params });
    },

    async apiGetExpiringPoints(params) {
      return await this.$axios.get("/loyalty/points/expiring", { params });
    },

    async apiGetPointStats() {
      return await this.$axios.get("/loyalty/points/stats");
    },

    async apiSendNotification(memberId) {
      return await this.$axios.post(`/loyalty/members/${memberId}/notify`);
    },
  },
};
