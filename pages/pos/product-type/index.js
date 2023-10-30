import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";

export default {
  middleware: ['auth'],
  layout: "seller-layout",
  data() {
    return {
      loading: true,
      search: "",
      valid: false,
      dialog: false,
      dialogDel: false,
      isLoading: false,
      rules: [
        v => !!v || 'จำเป็น',
      ],
      instead: null,
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อ",
          width: ""
        }
      ],
      desserts: {},
      item: {},
    };
  },

  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },

  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    this.getData()
    this.getOutlet()
  },

  computed: {
    dd() {
      return new B()
    },
  },

  watch: {
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
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },

    async getOutlet() {
      await this.$axios.get("/organization").then((res) => {
        this.instead = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    async getData() {
      await this.$axios.get("/posProductType").then((res) => {
        // this.desserts = res
        this.desserts = Object.assign({}, res.data)
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      if(!this.$refs.form.validate()) return;
      if (this.item.id) {
        console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val) {
      this.dialog = true
      this.item = Object.assign({}, val)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/posProductType/" + this.item.id, {
        name: this.item.name,
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/posProductType", {
        name: this.item.name,
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
    onDelete(val){
      this.dialogDel = true
      this.item = Object.assign({},val)
    },

    async confirmDel() {
      this.dialogDel = false
      await this.$axios.delete("/posProductType/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
