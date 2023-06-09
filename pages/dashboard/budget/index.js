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
      desserts: {},
      item: {},
    };
  },
  // async asyncData({ $axios }) {
  //   const photos = await $axios.$get('/budget');
  //   console.log("kkkk>"+JSON.stringify(photos))
  //   return { photos };
  // },
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
    this.getBudgetType()
  },
  computed:{
    dd(){
      return new B()
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
      if (this.item.id) {
        console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val) {
      console.log("val> "+val)
      this.dialog = true
      this.item = Object.assign({}, val)
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

    async onDelete(val){
      this.dialog = false
      await this.$axios.delete("/budget/"+val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
