import isAdmin from "@/middleware/is-admin";
import dayjs from "dayjs";
import convert from "@/plugins/convert";
import InputMask from 'primevue/inputmask';


export default {
  layout: "seller-layout",
  middleware: ['auth', isAdmin],
  head() {
    return {
      title: this.headTitle,
    }
  },
  components: {InputMask},
  watch: {
    'item.email': 'validateEmailAvailability',
    dialogReset(val){
      if(!val){
        this.newPassword = ""
      }
      return val
    }
  },
  data() {
    return {
      headTitle: "จัดการผู้ใช้งาน",

      loading: true,
      dialog: false,
      dialogReset: false,
      hidePass: false,
      dialogDelete: false,
      b: true,
      rules: {
        required: value => !!value || 'จำเป็น',
        password: value => (value && value.length >= 8) || 'รหัสขั้นต่ำ 8 ตัวขึ้นไป',
        counter: value => (value && value.length <= 10) && value.length === 10 || 'เบอร์โทรต้องครบ 10 ตัว',
        number: value => (value && !isNaN(value)) || 'กรอกตัวเลขเท่านั้น',
      }
      ,
      rulesEmail: {
        required: v => !!v || 'จำเป็น',
        emailMatch: v => /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(v) || 'รู้แบบอีเมลไม่ถูกต้อง',
        // Availability: v => (v && this.checkEmailAvailability(v)) || 'อีเมลไม่ถูกต้อง',
      },
      tableHead: [
        {
          title: "ชื่อ-สกุล",
          width: "",
          text: "text-left"
        },
        {
          title: "อีเมล",
          width: "10%",
          text: "text-left"
        },
        {
          title: "เบอร์",
          width: "",
          text: "text-left"
        },
        {
          title: "สถานะ",
          width: "10%",
          text: "text-left"
        },
        {
          title: "สิทธิ์",
          width: "10%",
          text: "text-left"
        },
        {
          title: "สร้างเมื่อ",
          width: "10%",
          text: "text-left"
        },
      ],
      desserts: {
        roles: {}
      },
      item: {},
      showPass: false,
      roles: [],
      rolesSelect: {},
      branch: [],
      branchSelect: {},
      newPassword: "",

      emailError: false,
      emailErrorMessages: '',
      snackbarCopy: false,
    };
  },
  computed: {
    convert() {
      return convert
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.loading = false
      this.getData()
      this.getRoles()
      this.getBranch()
    })
  },
  methods: {
    checkAdmin() {
      if (this.rolesSelect) {
        return this.rolesSelect.name !== 'admin'
      } else {
        return true
      }
    },
    async checkEmailAvailability(v) {
      // Your logic to check email availability, which returns a promise
      // const available = await this.validateEmailAvailability(v);
      // console.log(available)
      return "dd";
    },

    async validateEmailAvailability(value) {
      try {
        let res = await this.$axios.get(`check-mail/${value}`);

        if (res.data.length === 0) {
          this.emailError = false;
          this.emailErrorMessages = '';
        } else {
          // ถ้าอีเมลนี้มีอยู่ในระบบแล้ว
          this.emailError = true;
          this.emailErrorMessages = 'อีเมลนี้มีอยู่ในระบบแล้ว';
        }
      } catch (error) {
        console.error('เกิดข้อผิดพลาดในการตรวจสอบอีเมล', error);
        this.emailError = true;
        this.emailErrorMessages = 'เกิดข้อผิดพลาดในการตรวจสอบอีเมล';
      }
    },
    status(val) {
      return val === 1 ? "ปกติ" : "ปิดใช้งาน"
    },

    async getBranch() {
      await this.$axios.get("/branch").then((res) => {
        this.branch = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    async getRoles() {
      await this.$axios.get("/role", {
        params: {
          isAll: false
        }
      }).then((res) => {
        // console.log(res.data)
        this.roles = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    async getData() {
      await this.$axios.get("/users", {
        params: {
          page: 20
        }
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      })
    },

    confirm() {
      // if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
    },

    openItem(val) {
      // console.log("val> " + JSON.stringify(val))
      this.hidePass = Object.keys(val).length == 0
      this.dialog = true
      this.item = Object.assign({}, val)
      this.rolesSelect = this.item.roles
      this.branchSelect = this.item.branch
    },

    openResetPass(val){
      this.item = Object.assign({}, val)
      this.dialogReset = true
    },

    genPass() {
      this.newPassword = convert.generatePasswork(12)
      console.log(this.newPassword)
    },

    copyPass(){
      navigator.clipboard.writeText(this.newPassword);
      this.snackbarCopy = true
    },

    async resetPassword(){
      this.$nuxt.$loading.start()
      await this.$axios.put("/changePassword/" + this.item.id, {
        password: this.newPassword,
      }).then((res) => {
        this.newPassword = ""
        this.dialogReset = false
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/users/" + this.item.id, {
        name: this.item.name,
        email: this.item.email,
        phone: this.item.phone,
        salary_id: this.item.salary_id,
        roles: this.rolesSelect.id,
        status: 1,
        branch: this.checkAdmin() ? this.branchSelect.id : null,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/users", {
        name: this.item.name,
        email: this.item.email,
        password: this.item.password,
        password_conf: this.item.passwordConf,
        phone: this.item.phone,
        salary_id: this.item.salary_id,
        roles: !this.hidePass ? 1 : this.rolesSelect.id,
        status: 1,
        branch: this.checkAdmin() ? this.branchSelect.id : null,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    onDelete(val) {
      this.dialogDelete = true
      this.item = Object.assign({}, val)
    },

    async confirmDel() {
      this.dialogDelete = false
      await this.$axios.delete("/users/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
}
