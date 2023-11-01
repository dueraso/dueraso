import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";

export default {
  middleware: ['auth',isAdmin],
  layout: "seller-layout",
  data() {
    return {
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
          width: ""
        },
        {
          title: "ประเภท",
          width: "15%"
        },
      ],
      rules: [
        v => !!v || 'จำเป็น',
      ],
      desserts: {
        meta:{}
      },
      item: {},
      page:1
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.$nuxt.$loading.start()
    })
    this.getData()
    this.getBudgetType()
  },
  watch:{
    page(val) {
      this.getData()
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

    async getBudgetType() {
      await this.$axios.get("/budgetType").then((res) => {
        this.instead = res.data.data
      }).catch((e) => {
        console.log(e);
      });
    },

    async getData() {
      await this.$axios.get("/budget").then((res) => {
        this.desserts = res.data
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
      this.insteadSelect = this.item.budget_type
    },

    async onUpdate(){
      this.dialog = false
      await this.$axios.put("/budget/"+this.item.id,{
        title:this.item.title,
        detail:this.item.detail
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate(){
      this.dialog = false
      await this.$axios.post("/budget",{
        name:this.item.title,
        budget_type:this.insteadSelect.id
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    onDelete(val){
      this.dialogDelete = true
      this.item = Object.assign({},val)
    },

    async confirmDel(){
      this.dialogDelete = false
      await this.$axios.delete("/budget/"+this.item.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
