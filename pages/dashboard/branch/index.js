import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";

export default {
  middleware: ['auth', isAdmin],
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
        {
          title: "รายละเอียด",
          width: ""
        },
        {
          title: "ที่อยู่/สถานที่",
          width: "15%"
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
    this.getOutlet()
  },

  computed:{
    dd(){
      return new B()
    },
  },

  watch:{
    async search(val) {
      console.log(val)
      if (val == null)return
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
        console.log(res)
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
        // this.desserts = res
        this.instead = res.data.data
        console.log("fff>"+JSON.stringify(this.instead))
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    async getData() {
      await this.$axios.get("/branch").then((res) => {
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
      await this.$axios.put("/branch/"+this.item.id,{
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
      await this.$axios.post("/branch",{
        title:this.item.title,
        detail:this.item.detail,
        address:this.item.address,
        organization_id:this.insteadSelect.id
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val){
      this.dialog = false
      await this.$axios.delete("/branch/"+val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
