import auth from "@/middleware/auth";

export default {
  layout: 'admin-layout',
  middleware:auth,
  auth: {
    strategy: 'admin',
  },

  data() {
    return {
      headTitle: "จัดการหน้าแรก",
      loading: false
    }
  }
}
