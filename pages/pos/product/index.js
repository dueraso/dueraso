import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";

export default {
  middleware: ['auth'],
  layout: "seller-layout",
  data() {
    return {
      rules: [
        v => !!v || 'จำเป็น',
      ],
      selectedFile: null,
      file: null,
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
      let img = this.file == null ? JSON.parse(this.item.image_promptpay) : this.file
      this.$axios.post("destroySingle", {
        id: Object.keys(this.item).length === 0 ? 0 : this.item.id,
        image_promptpay: img.newName
      }).then((res) => {
        this.selectedFile = null
        this.file = null
      }).catch((e) => {
        console.log(e)
      })
    },

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
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
