import isAdmin from "@/middleware/is-admin";
import my from "@/utils/myFunction";
import dayjs from "dayjs";
import myUtils from "@/plugins/myUtils";
import convert from "@/plugins/convert";

export default {
  layout: "seller-layout",
  middleware: ['auth', isAdmin],
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการผู้ใช้งาน",

      loading: true,
      dialog: false,
      hidePass: false,
      dialogDelete: false,
      rules: [
        v => !!v || 'จำเป็น',
      ],
      tableHead: [
        {
          title: "ชื่อ-สกุล",
          width: ""
        },
        {
          title: "อีเมล",
          width: "15%"
        },
        {
          title: "เบอร์",
          width: ""
        },
        {
          title: "สถานะ",
          width: "10%"
        },
        {
          title: "สิทธิ์",
          width: "10%"
        },
        {
          title: "สร้างเมื่อ",
          width: "10%"
        },
      ],
      desserts: {
        roles: {}
      },
      item: {},
      showPass: false,
      roles: [],
      rolesSelect: {},
      branch: [],
      branchSelect: {},
    };
  },
  computed: {
    convert() {
      return convert
    }
  },
  created() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.loading = false
    })
  },
  mounted() {
    this.getData()
    this.getRoles()
    this.getBranch()
    this.executeExtendedFunction()
  },
  methods: {
    myUtils,
    executeExtendedFunction() {
      // http.get(); // Call the extended function
    },
    status(val) {
      return val === 1 ? "ปกติ" : "ปิดใช้งาน"
    },

    async getBranch() {
      await this.$axios.get("/branch").then((res) => {
        this.branch = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    async getRoles() {
      await this.$axios.get("/role", {
        params: {
          isAll: true
        }
      }).then((res) => {
        this.roles = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    async getData() {
      await this.$axios.get("/users", {
        params: {
          page: 20
        }
      }).then((res) => {
        this.desserts = res.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e)
      })
    },

    confirm() {
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
    },

    openItem(val) {
      // console.log("val> " + JSON.stringify(val))
      this.hidePass = Object.keys(val) == 0
      this.dialog = true
      this.item = Object.assign({}, val)
      this.rolesSelect = this.item.roles
      this.branchSelect = this.item.branch
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/users/" + this.item.id, {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/users", {
        name: this.item.name,
        email: this.item.email,
        password: this.item.password,
        phone: this.item.phone,
        salary_id: this.item.salary_id,
        roles: !this.hidePass ? 1 : this.rolesSelect.id
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    onDelete(val) {
      this.dialogDelete = true
      this.item = Object.assign({}, val)
    },

    async confirmDel() {
      this.dialogDelete = false
      await this.$axios.delete("/users/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
