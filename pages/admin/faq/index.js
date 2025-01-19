import auth from "@/middleware/auth";
import config from "@/con/config";
import {object} from "underscore";

export default {
  layout: 'admin-layout',
  middleware: auth,
  auth: {
    strategy: 'admin',
  },

  watch: {
    page(val) {
      this.getData()
    },
  },
  data() {
    return {
      headTitle: "จัดการคำถามที่พบบ่อย",
      loading: true,
      dialog: false,

      tableHead: [
        {
          title: "ชื่อ",
          width: "30%",
          text: "text-left"
        },
        {
          title: "รายละเอียด",
          width: "",
          text: "text-left"
        },
        {
          title: "สถานะ",
          width: "50px",
          text: "text-center"
        },
      ],
      desserts: {},
      rules: [
        v => !!v || 'จำเป็น',
      ],
      item: {},
      page: 1,
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.getData()
    })
  },

  methods: {
    openItem(val) {
      this.dialog = true
      this.item = Object.assign({}, val)
    },

    async onUse(val) {
      val.use = !val.use
      await this.$axios.put("/faq/" + val.id, {
        status: val.use,
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    confirm() {
      this.$nuxt.$loading.start()
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
    },

    async getData() {
      await config.get("/faq").then(res => {
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      }).finally(() => {
      })
    },

    async onCreate() {
      await config.post("/faq", {
        title: this.item.name,
        detail: this.item.detail,
        status: 1,
      }).then(() => {
        this.getData()
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.dialog = false
        this.$nuxt.$loading.finish()
      })
    },

    async onUpdate() {
      await this.$axios.put("/faq/" + this.item.id, {
        title: this.item.title,
        detail: this.item.detail,
        status: this.item.status,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      }).finally(() => {
        this.dialog = false
        this.$nuxt.$loading.finish()
      })
    },
  }
}
