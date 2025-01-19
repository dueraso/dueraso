import auth from "@/middleware/auth";
import config from "@/con/config";

export default {
  layout: 'admin-layout',
  middleware:auth,
  auth: {
    strategy: 'admin',
  },

  data() {
    return {
      headTitle: "จัดการติดต่อเรา",
      loading: false,

      tableHead: [
        {
          title: "หัวข้อ",
          width: "30%",
          text: "text-left"
        },
        {
          title: "icon",
          width: "50%",
          text: "text-left"
        },
        {
          title: "route",
          width: "",
          text: "text-left"
        },
      ],
      desserts: {
      },
      dialogOpen:false,
      content: '', // the content of the editor
      editorOptions: {
        theme: 'snow', // Or 'bubble'
        placeholder: 'รายละเอียดแบบเต็ม',
        // More options: https://quilljs.com/docs/configuration/
      },
      page:1,
      item: {},
      rules: [
        v => !!v || 'จำเป็น',
      ],
      selectedFile:null,
      file: null,
    }
  },

  watch: {
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
  methods:{
    openItem(val){
      this.dialogOpen = true
      this.item = Object.assign({}, val)
    },
    confirm(){
      this.$nuxt.$loading.start()
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
    },

    async onCreate(){
      await config.post("/all-app",{
        title: this.item.title,
        icon: this.item.icon,
        route: this.item.route,
      }).then(res => {
        this.getData()
      }).catch((err) => {
        console.log(err)
      }).finally(()=>{
        this.dialogOpen = false
        this.$nuxt.$loading.finish()
      })
    },

    async onUpdate(){
      await config.put(`/all-app/${this.item.id}`,{
        title: this.item.title,
        icon: this.item.icon,
        route: this.item.route,
      }).then(() => {
        this.getData()
      }).catch((err) => {
        console.log(err)
      }).finally(()=>{
        this.dialogOpen = false
        this.$nuxt.$loading.finish()
      })
    },

    onDelete(val){

    },

    async getData(){
      this.$nuxt.$loading.start()
      await config.get("/all-app").then((res) => {
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      }).finally(()=>{
        this.$nuxt.$loading.finish()
      })
    }
  }
}
