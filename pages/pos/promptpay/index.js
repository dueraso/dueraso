import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";

export default {
  middleware: ['auth'],
  layout: "seller-layout",
  data() {
    return {
      selectedFile: null,
      file: null,

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
          name:"เบอร์โทรศัพท์"
        },
        {
          id:2,
          name:"เลขบัตรประชาชน"
        },
        {
          id:3,
          name:"รูปภาพ"
        }
      ],
      insteadSelect: {},
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
      use:[],
      valid:false
    };
  },

  created() {
    // this.insteadSelect = this.instead[0]
    console.log(this.insteadSelect)
    this.$nextTick(() => {
      this.loading = false
    })
  },

  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    this.getData()
    // window.onbeforeunload = function(event)
    // {
    //   return confirm("Confirm refresh");
    // };
  },
watch:{
  insteadSelect(val){
    if (val == undefined) {
      this.insteadSelect = this.instead[0]
      return
    }
    console.log(val)
    return this.insteadSelect = val
  }
},

  methods: {
    typePro(val){
      switch (val) {
        case val:1
          return "เบอร์โทรศัพท์";
        case val:2
          return "เลขบัตรประชาชน";
        default:
          return "รูปภาพ";
      }
    },
    async uploadImage() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        try {
          // Use Axios or your preferred HTTP client to send the image to the server
          await this.$axios.post('/uploadImage', formData).then((res)=>{
            this.file = res.data
          }).catch((e)=>{
            console.log(e)
          });

          // Handle the response or any further actions
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    },

    myUtils,
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },

    async getData() {
      await this.$axios.get("/posPromptPay").then((res) => {
        this.desserts = res.data
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

    async onUse(val){
      val.use = !val.use
      await this.$axios.put("/posPromptPay/"+val.id,{
        use:val.use,
      }).then((res) => {
        this.getData()
        console.log(res.data)
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
      await this.$axios.put("/posPromptPay/"+this.item.id,{
        name:this.item.name,
        type_discount:this.insteadSelect.id,
        total:this.item.total,
        use:1,
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate(){
      this.dialog = false
      await this.$axios.post("/posPromptPay",{
        name:this.item.name,
        type_promptpay:this.insteadSelect.id,
        promptpay:this.item.promptpay,
        image_promptpay:this.file?this.file.path:null
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
      await this.$axios.delete("/posPromptPay/"+this.item.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
