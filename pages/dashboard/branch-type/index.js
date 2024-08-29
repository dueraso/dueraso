import dayjs from "dayjs";
import isAdmin from "@/middleware/is-admin";

export default {
  middleware: ['auth',isAdmin],
  layout: "seller-layout",
  //
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการประเภทสาขา",
      loading: true,
      search: "",
      dialogDelete: false,
      dialog: false,
      isLoading: false,
      instead: null,
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อประเภท",
          width: "",
          text: "text-left"
        },
      ],
      desserts: {
        meta:{}
      },
      item: {},
      page:1,
      rules: [
        v => !!v || 'จำเป็น',
      ],
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.loading = false
    this.getData()
    })
  },

  watch:{
    page(val) {
      this.getData()
    },
  },

  methods: {
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },

    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/branchType",{
        params: {
          page: this.page,
          per:10
        }
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.desserts = Object.assign({},res.data)
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      // if(!this.$refs.form.validate()) return;
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
    },

    async onUpdate(){
      this.dialog = false
      await this.$axios.put("/branchType/"+this.item.id,{
        name:this.item.name
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate(){
      this.dialog = false
      await this.$axios.post("/branchType",{
        name:this.item.name,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
        this.item = Object.assign({})
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
      await this.$axios.delete("/branchType/"+this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
