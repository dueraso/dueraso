import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";
import {createOrganization} from "@/plugins/apiUtils";

export default {
  middleware: ['auth', isAdmin],
  layout: "seller-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการหมวดหมู่รายรับ-จ่าย",
      valid: false,
      dialogDelete: false,
      loading: true,
      search: "",
      dialog: false,
      instead: {},
      insteadSelect: {},
      tableHead: [
        {
          title: "ชื่อรายการ",
          width: "",
          text: "text-left"
        },
        {
          title: "ประเภท",
          width: "15%",
          text: "text-left"
        },
      ],
      rules: [
        v => !!v || 'จำเป็น',
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
      this.$nuxt.$loading.start()
      this.getData()
      this.getBudgetType()
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

    async getBudgetType() {
      await this.$axios.get("/budgetType").then((res) => {
        this.instead = res.data.data
      }).catch((e) => {
        console.log(e);
      });
    },

    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/budget", {
        params: {
          page: this.page,
          per: 10
        }
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.desserts = res.data
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
      this.insteadSelect = this.item.budget_type
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/budget/" + this.item.id, {
        name: this.item.name,
        budget_type: this.insteadSelect.id
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/budget", {
        name: this.item.name,
        budget_type: this.insteadSelect.id
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
      await this.$axios.delete("/budget/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
