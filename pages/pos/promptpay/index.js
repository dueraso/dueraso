import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
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
          id: 1,
          name: "เบอร์โทรศัพท์"
        },
        {
          id: 2,
          name: "เลขบัตรประชาชน"
        },
        {
          id: 3,
          name: "รูปภาพ"
        }
      ],
      insteadSelect: {},
      tableHead: [
        {
          title: "ชื่อ",
          width: "",
          text: "text-left"
        },
        {
          title: "ประเภท",
          width: "",
          text: "text-left"
        },
        {
          title: "ราคา",
          width: "",
          text: "text-left"
        },
        {
          title: "รูป",
          width: "5%",
          text: "text-center"
        },
      ],
      desserts: {},
      item: {},
      use: [],
      valid: false
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
      this.getData()
    })
    // window.onbeforeunload = function(event)
    // {
    //   return confirm("Confirm refresh");
    // };
  },
  watch: {
    insteadSelect(val) {
      if (val == undefined) {
        this.insteadSelect = this.instead[0]
        return
      }
      return this.insteadSelect = val
    }
  },

  methods: {
    covertTypeProm(val) {
      if (val === null) return "-"
      return val.length > 10 ? convert.formatIc(val) : convert.formatPhoneNumber(val)
    },
    typeProm(val) {
      switch (val) {
        case 1:
          return "เบอร์โทรศัพท์";
        case 2:
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

    async getData() {
      await this.$axios.get("/posPromptPay").then((res) => {
        this.desserts = res.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      if (this.item.id) {
        // console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        // console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val = {}) {
      this.dialog = true
      this.item = Object.assign({}, val)
      this.insteadSelect = this.instead.find(d => d.id == this.item.type_promptpay)
      // this.selectedFile = this.item.image_promptpay != null?JSON.parse(this.item.image_promptpay).fullPath:null
    },

    async onUpdate() {
      this.dialog = false
      this.resetData()
      await this.$axios.put("/posPromptPay/" + this.item.id, {
        name: this.item.name,
        type_promptpay: this.insteadSelect.id,
        promptpay: this.item.promptpay,
        image_promptpay: this.file ? JSON.stringify(this.file.data) : null
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      this.resetData()
      await this.$axios.post("/posPromptPay", {
        name: this.item.name,
        type_promptpay: this.insteadSelect.id,
        promptpay: this.item.promptpay,
        image_promptpay: this.file ? JSON.stringify(this.file.data) : null
      }).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
    resetData() {
      this.insteadSelect.id != 3 ? this.file = null : this.item.promptpay = null
    },

    onDelete(val) {
      this.dialogDelete = true
      this.item = Object.assign({}, val)
    },

    async confirmDel() {
      this.dialogDelete = false
      await this.$axios.delete("/posPromptPay/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
