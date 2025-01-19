import auth from "@/middleware/auth";
import config from "@/con/config";
import Cookies from "js-cookie";

export default {
  layout: 'admin-layout',
  middleware: auth,
  auth: {
    strategy: 'admin',
  },

  data() {
    return {
      headTitle: "จัดการแพ็คเกจ",
      loading: false,

      tableHead: [
        {
          title: "หัวข้อ",
          width: "30%",
          text: "text-left"
        },
        {
          title: "รายละเอียดแบบสั่น",
          width: "50%",
          text: "text-left"
        },
        {
          title: "จำนวนผู้ชม",
          width: "",
          text: "text-left"
        },
      ],
      desserts: {},
      dialogOpen: false,
      content: '', // the content of the editor
      editorOptions: {
        theme: 'snow', // Or 'bubble'
        placeholder: 'รายละเอียด',
        // More options: https://quilljs.com/docs/configuration/
      },
      page: 1,
      item: {},
      appsItems: [],
      typeDayItems: [
        {
          id: 1,
          name: "รายเดือน"
        },
        {
          id: 2,
          name: "รายปี"
        }
      ],
      rules: [
        v => !!v || 'จำเป็น',
      ],
      selectedFile: null,
      file: null,
    }
  },

  watch: {
    page(val) {
      this.getData()
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.getData()
    })
  },

  methods: {
    openItem(val) {
      this.dialogOpen = true
    },

    confirm() {
      this.$nuxt.$loading.start()
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
    },

    async onCreate() {
      await config.post("/package-list", {
        title: this.item.title,
        detail_short: this.item.detail_short,
        detail: this.content,
        image_main: this.file.fullPath,
      }).then(res => {
        console.log(res.data)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.dialogOpen = false
        this.$nuxt.$loading.finish()
      })
    },

    async onUpdate() {
      await config.put(`/package-list/${this.item.id}`).then(res => {
        console.log(res.data)
      }).catch((err) => {
        console.log(err)
      }).finally(() => {
        this.dialogOpen = false
        this.$nuxt.$loading.finish()
      })
    },

    async getData() {
      this.$nuxt.$loading.start()
      await config.get("/package-list", {
        params: {
          page: this.page,
        }
      }).then((res) => {
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      }).finally(() => {
        this.$nuxt.$loading.finish()
      })
    }
  }
}
