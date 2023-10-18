import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";

export default {
  middleware: ['auth'],
  layout: "seller-layout",
  data() {
    return {
      rules: [
        v => !!v || 'จำเป็น',
      ],
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
          text:"text-left"
        },
        {
          title: "ประเภท",
          width: "",
          text:"text-left"
        },
        {
          title: "ราคา",
          width: "",
          text:"text-left"
        },
        {
          title: "รูป",
          width: "5%",
          text:"text-center"
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
    this.getProductType()
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

    async getProductType() {
      await this.$axios.get("/posProductType").then((res) => {
        this.instead = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    async getData() {
      await this.$axios.get("/posProduct").then((res) => {
        this.desserts = Object.assign({},res.data)
        console.log(this.desserts)
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
      console.log("val> "+JSON.stringify(val))
      this.dialog = true
      this.item = Object.assign({}, val)
      this.insteadSelect = this.item.type
    },

    async onUpdate(){
      this.dialog = false
      await this.$axios.put("/posProduct/"+this.item.id,{
        name:this.item.name,
        detail:this.item.detail,
        type:this.insteadSelect.id,
        price:this.item.price,
        image_url:this.item.url
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate(){
      this.dialog = false
      await this.$axios.post("/posProduct",{
        name:this.item.name,
        detail:this.item.detail,
        type:this.insteadSelect.id,
        price:this.item.price,
        image_url:this.item.url
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
      await this.$axios.delete("/posProduct/"+this.item.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
