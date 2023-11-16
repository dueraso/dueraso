import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import super_admin from "@/middleware/super";

export default {
  middleware: ['auth'],
  layout: "seller-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการโมดูล",
      rules: [
        v => !!v || 'จำเป็น',
      ],
      selectedFile: null,
      file: null,
      loading: true,
      search: "",
      dialog: false,
      dialogDelete: false,
      valid: false,
      isLoading: false,
      instead: null,
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อ",
          width: "",
          text: "text-left"
        },
        {
          title: "link url",
          width: "",
          text: "text-left"
        },
        {
          title: "ไอคอน",
          width: "",
          text: "text-left"
        },
        {
          title: "อยู่ภายใต้",
          width: "",
          text: "text-left"
        },
        {
          title: "เรียง",
          width: "",
          text: "text-left"
        },
        {
          title: "สถานะ",
          width: "",
          text: "text-left"
        },
      ],
      desserts: {
        meta: {}
      },
      item: {},
      page: 1
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.getData()
      this.getProductType()
    })
  },

  watch: {
    page(val) {
      this.getData()
    },
  },

  methods: {
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },

    async getProductType() {
      await this.$axios.get("/posProductType").then((res) => {
        this.instead = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/module", {
        params: {
          page: this.page,
          per: 10
        }
      }).then((res) => {
        this.desserts = Object.assign({}, res.data)
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      if (this.item.id) {
        // console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        // console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val) {
      this.dialog = true
      this.item = Object.assign({}, val)
      this.insteadSelect = this.item.type
      this.file = this.item.imageUrl != null ? JSON.parse(this.item.imageUrl) : null
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/posProduct/" + this.item.id, {
        name: this.item.name,
        detail: this.item.detail,
        type: this.insteadSelect.id,
        price: this.item.price,
        image_url: this.file ? JSON.stringify(this.file) : null
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/posProduct", {
        name: this.item.name,
        detail: this.item.detail,
        type: this.insteadSelect.id,
        price: this.item.price,
        image_url: this.file ? JSON.stringify(this.file) : null
      }).then((res) => {
        this.$nuxt.$loading.finish()
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
      await this.$axios.delete("/posProduct/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
