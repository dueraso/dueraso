import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";

export default {
  middleware: ['auth',isAdmin],
  layout: "seller-layout",
  data() {
    return {
      loading: true,
      search: "",
      dialog: false,
      isLoading: false,
      instead: null,
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อสาขา",
          width: ""
        },
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
  },

  computed:{
    dd(){
      return new B()
    },
  },

  watch:{
  },

  methods: {
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },

    async getData() {
      await this.$axios.get("/budgetType").then((res) => {
        // this.desserts = res
        this.desserts = Object.assign({},res.data)
        console.log(this.desserts.data)
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
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
      console.log("val> "+JSON.stringify(val))
      this.dialog = true
      // this.item = Object.assign({}, val)
    },

    async onUpdate(){
      this.dialog = false
      await this.$axios.put("/budgetType/"+this.item.id,{
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
      await this.$axios.post("/budgetType",{
        name:this.item.name,
      }).then((res) => {
        this.getData()
        this.item = Object.assign({})
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val){
      this.dialog = false
      await this.$axios.delete("/budgetType/"+val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
