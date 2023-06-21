import isAdmin from "@/middleware/is-admin";
import my from "@/utils/myFunction";
import dayjs from "dayjs";
import myUtils from "@/plugins/myUtils";
import convert from "@/plugins/convert";

export default {
  layout: "seller-layout",
  name: "IndexPage",
  middleware: ['auth', isAdmin],
  data() {
    return {
      loading: true,
      dialog: false,
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
      desserts: {},
      item: {},
      roles: [],
      rolesSelect: {},
    };
  },
  computed: {
    convert() {
      return convert
    }
  },
  created() {
    console.log(this.$auth.user)
    this.$nextTick(() => {
      this.loading = false
    })
  },
  mounted() {
    this.getData()
    this.getRoles()
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
    async getRoles() {
      await this.$axios.get("/role").then((res) => {
        this.roles = res.data
        console.log(this.roles)
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
      }).catch((e) => {
        console.log(e)
      })
    },

    confirm() {
      if (this.item.id) {
        // console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        // console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val) {
      // console.log("val> " + JSON.stringify(val))
      this.dialog = true
      this.item = Object.assign({}, val)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/users/" + this.item.id, {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/users", {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val) {
      this.dialog = false
      await this.$axios.delete("/users/" + val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
