import auth from "@/middleware/auth";
import config from "@/con/config";
import convert from "../../../plugins/convert";

export default {
  computed: {
    convert() {
      return convert
    }
  },
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
          width: "25%",
          text: "text-left"
        },
        {
          title: "รายละเอียด",
          width: "45%",
          text: "text-left"
        },
        {
          title: "ชื่อ",
          width: "15%",
          text: "text-left"
        },
        {
          title: "ส่งเมื่อ",
          width: "110px",
          text: "text-left"
        },
      ],
      desserts: {
      },
      dialog:false,
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
      this.dialog = true
    },
    async getData(){
      this.$nuxt.$loading.start()
      await config.get("/contact-us").then((res) => {
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      }).finally(()=>{
        this.$nuxt.$loading.finish()
      })
    }
  }
}
