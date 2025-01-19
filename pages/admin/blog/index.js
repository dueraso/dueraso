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
      headTitle: "จัดการบทความ",
      loading: false,

      tableHead: [
        {
          title: "หัวข้อ",
          width: "30%",
          text: "text-left"
        },
        {
          title: "รายละเอียดแบบสั่น",
          width: "50%",
          text: "text-left"
        },
        {
          title: "จำนวนผู้ชม",
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
      console.log(val)
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
      await config.post("/blog",{
        title: this.item.title,
        detail_short: this.item.detail_short,
        detail: this.content,
        image_main: this.file.fullPath,
      }).then(res => {
        console.log(res.data)
      }).catch((err) => {
        console.log(err)
      }).finally(()=>{
        this.dialogOpen = false
        this.$nuxt.$loading.finish()
      })
    },

    async onUpdate(){
      await config.put(`/blog/${this.item.id}`).then(res => {
        console.log(res.data)
      }).catch((err) => {
        console.log(err)
      }).finally(()=>{
        this.dialogOpen = false
        this.$nuxt.$loading.finish()
      })
    },

    onDelete(val){

    },

    async uploadImage() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        try {
          // Use Axios or your preferred HTTP client to send the image to the server
          await this.$axios.post('/uploadImage', formData).then((res) => {
            this.file = res.data
          }).catch((e) => {
            console.log(e)
          });

          // Handle the response or any further actions
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    },

    onDeleteImage() {
      let img = this.file == null ? JSON.parse(this.item.image_url) : this.file
      this.$axios.post("destroyImage", {
        id: Object.keys(this.item).length === 0 ? 0 : this.item.id,
        image_url: img.newName
      }).then((res) => {
        this.selectedFile = null
        this.file = null
      }).catch((e) => {
        console.log(e)
      })
    },

    async getData(){
      this.$nuxt.$loading.start()
      await config.get("/blog").then((res) => {
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      }).finally(()=>{
        this.$nuxt.$loading.finish()
      })
    }
  }
}
