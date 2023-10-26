import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";
import convert from "../../../plugins/convert";

export default {
  computed: {
    convert() {
      return convert
    }
  },
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
    return this.insteadSelect = val
  }
},

  methods: {
    covertTypeProm(val){
      if (val === null) return "-"
      return val.length > 10?convert.formatIc(val):convert.formatPhoneNumber(val)
    },
    typePro(val){
      switch (val) {
        case 1:
          return "เบอร์โทรศัพท์";
        break
        case 2:
          return "เลขบัตรประชาชน";
        break
        default:
          return "รูปภาพ";
          break
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
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      if(!this.$refs.form.validate()) return;
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
      await this.$axios.put("/posPromptPay/"+val.id,{
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
      this.insteadSelect = this.instead.find(d=>d.id == this.item.type_promptpay)
      console.log(this.item)
    },

    async onUpdate(){
      this.dialog = false
      this.resetData()
      await this.$axios.put("/posPromptPay/"+this.item.id,{
        name:this.item.name,
        type_promptpay:this.insteadSelect.id,
        promptpay:this.item.promptpay,
        image_promptpay:this.file?this.file.path:null
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate(){
      this.dialog = false
      this.resetData()
      await this.$axios.post("/posPromptPay",{
        name:this.item.name,
        type_promptpay:this.insteadSelect.id,
        promptpay:this.item.promptpay,
        image_promptpay:this.file?this.file.path:null
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
    resetData(){
      this.insteadSelect.id != 3?this.file=null:this.item.promptpay = null
    },

    onDelete(val){
      this.dialogDelete = true
      this.item = Object.assign({},val)
    },

    async confirmDel(){
      this.dialogDelete = false
      await this.$axios.delete("/posPromptPay/"+this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
