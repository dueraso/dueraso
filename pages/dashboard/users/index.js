import isAdmin from "@/middleware/is-admin";
import my from "@/utils/myFunction";
import dayjs from "dayjs";
import myUtils from "@/plugins/myUtils";

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
    };
  },
  computed: {
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  mounted() {
    this.getData()
  },
  methods: {
    myUtils,
    convertDay(val = "") {
      return dayjs().format("DD/MM/YYYY HH:mm")
    },
    status(val) {
      return val === 1 ? "ปกติ" : "ปิดใช้งาน"
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
        console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val) {
      console.log("val> " + val)
      this.dialog = true
      this.item = Object.assign({}, val)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/post/" + this.item.id, {
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
      await this.$axios.post("/post", {
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
      await this.$axios.delete("/post/" + val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
