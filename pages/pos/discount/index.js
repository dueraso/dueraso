import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";

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
      headTitle: "จัดการส่วนลด",
      rules: [
        v => !!v || 'จำเป็น',
      ],
      loading: true,
      search: "",
      dialog: false,
      dialogDelete: false,
      isLoading: false,
      instead: [
        {
          id:1,
          name:"เป็นบาท"
        },
        {
          id:2,
          name:"เป็นเปอร์เซ็นต์"
        }
      ],
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อส่วนลด",
          width: ""
        },
        {
          title: "ใช้งาน",
          width: "5%"
        },
      ],
      desserts: {
        meta:{}
      },
      item: {},
      use:[],
      valid:false,
      page:1
    };
  },
watch:{
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
    myUtils,
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },

    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/posDiscount",{
        params:{
          page:this.page,
          per:10
        }
      }).then((res) => {
        this.desserts = res.data
        // this.desserts = Object.assign({},res.data)
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      if(!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      if (this.item.id) {
        // console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        // console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    async onUse(val){
      val.use = !val.use
      await this.$axios.put("/posDiscount/"+val.id,{
        use:val.use,
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    openItem(val = {}) {
      this.dialog = true
      this.item = Object.assign({}, val)
      this.insteadSelect = this.instead.find(d=>d.id == this.item.type_discount)
    },

    async onUpdate(){
      this.dialog = false
      await this.$axios.put("/posDiscount/"+this.item.id,{
        name:this.item.name,
        type_discount:this.insteadSelect.id,
        total:this.item.total,
        use:1,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate(){
      this.dialog = false
      await this.$axios.post("/posDiscount",{
        name:this.item.name,
        type_discount:this.insteadSelect.id,
        total:this.item.total,
        use:1,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
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
      await this.$axios.delete("/posDiscount/"+this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
