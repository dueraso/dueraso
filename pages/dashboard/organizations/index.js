import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";
import DialogFull from "@/components/DialogFull.vue";

export default {
  middleware: ['auth', isAdmin],
  layout: "seller-layout",
  components: {
    DialogFull
  },
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการชื่อร้าน/ชื่อแบรนด์",

      loading: true,
      search: "",
      dialog: false,
      dialogDelete: false,
      isLoading: false,
      instead: null,
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อ-สกุล",
          width: "",
          text: "text-left"
        },
        {
          title: "รายละเอียด",
          width: "",
          text: "text-left"
        },
        {
          title: "สร้างโดย",
          width: "15%",
          text: "text-left"
        },
      ],
      desserts: {
        meta: {}
      },
      item: {},
      page: 1,
      rules: [
        v => !!v || 'จำเป็น',
      ],
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.getData()
    })
  },

  watch: {
    page(val) {
      this.getData()
    },
    async search(val) {
      if (val == null) return
      if (val.length < 2) return
      if (this.isLoading) return
      this.isLoading = true
      await this.$axios.get(`findUsers`, {
        params: {
          q: val
        }
      }).then((res) => {
        // const {count, data} = res.data
        // this.count = count
        // this.entries = data
      }).catch((e) => {
        console.log(e)
      }).finally(() => (this.isLoading = false))
    },
  },
  methods: {
    myUtils,
    nameCreate(val) {
      if (val === null) return
      return val.name
    },
    convertDay(val) {
      if (val === undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },
    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/organization", {
        params: {
          page: this.page,
          per: 10
        }
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.desserts = Object.assign({}, res.data)
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      // if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
    },

    openItem(val) {
      this.dialog = true
      this.item = Object.assign({}, val)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/organization/" + this.item.id, {
        title: this.item.title,
        detail: this.item.detail,
        create_by: this.$auth.user.id
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/organization", {
        title: this.item.title,
        detail: this.item.detail,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        alert(e.response.data.message)
        console.log(e)
      })
    },

    onDelete(val) {
      this.dialogDelete = true
      this.item = Object.assign({}, val)
    },

    async confirmDel() {
      this.dialogDelete = false
      await this.$axios.delete("/organization/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
