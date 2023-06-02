import dayjs from "dayjs";
import B from "@/utils/myFunction";

export default {
  middleware: ['auth'],
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
          title: "ชื่อ-สกุล",
          width: ""
        },
        {
          title: "รายละเอียด",
          width: ""
        },
        {
          title: "สร้างโดย",
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
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },
    async getData() {
      await this.$axios.get("/organization").then((res) => {
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
      await this.$axios.put("/organization/"+this.item.id,{
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
      await this.$axios.post("/organization",{
        title:this.item.title,
        detail:this.item.detail,
        create_by:this.$auth.user.id
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val){
      this.dialog = false
      await this.$axios.delete("/organization/"+val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
