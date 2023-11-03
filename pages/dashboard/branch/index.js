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
      headTitle: "จัดการสาขา",
      loading: true,
      search: "",
      dialogDelete: false,
      dialog: false,
      isLoading: false,
      instead: null,
      insteadSelect: null,
      promptItems: null,
      promptSelect: null,
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
    this.getOutlet()
    this.getPrompt()
  },

  computed:{
    dd(){
      return new B()
    },
  },

  watch:{
    page(val) {
      this.getData()
    },
    async search(val) {
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
      }).catch((e) => {
        console.log(e)
      }).finally(() => (this.isLoading = false))
    },
  },

  methods: {
    myUtils,
    convertDay(val) {
      if (val === undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },

    async getPrompt() {
      await this.$axios.get("/posPromptPay").then((res) => {
        this.promptItems = res.data.data
      }).catch((e) => {
        console.log(e);
      });
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
      await this.$axios.get("/branch",{
        params: {
          page: this.page,
        }
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.desserts = Object.assign({},res.data)
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      if(!this.$refs.form.validate()) return;
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
      this.insteadSelect = Object.assign({}, val.organization)
      this.promptSelect = this.item.promptpay
    },

    async onUpdate(){
      this.dialog = false
      await this.$axios.put("/branch/"+this.item.id,{
        title:this.item.title,
        detail:this.item.detail,
        address:this.item.address,
        organization:this.insteadSelect.id,
        promptpay:this.promptSelect.id
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
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
        organization:this.insteadSelect.id,
        promptpay:this.promptSelect.id
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
      await this.$axios.delete("/branch/"+this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
