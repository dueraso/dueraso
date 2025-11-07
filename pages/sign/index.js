import pkg from "@/package.json";
import convert from "@/plugins/convert";
import Cookies from 'js-cookie';
import config from "@/con/config";

export default {
  layout: "auth-layout",
  head() {
    return {
      title: this.headTitle,
    };
  },
  data: () => ({
    headTitle: "หน้าล็อกอิน Admin",
    overlay: false,
    valid: true,
    email: "",
    again: false,
    stat: false,
    remember: false,
    version: pkg.version,
    profile: {},
    emailRules: [
      (v) => !!v || "จำเป็น",
      (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง",
    ],
    userNameRules: [(v) => !!v || "จำเป็น"],
    userName: "",
    password: "",
    passwordRules: [
      (v) => !!v || "จำเป็น",
      // (v) => (v && v.length > 5) || "Password must have 6 characters",
      // v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
      // v => /(?=.*\d)/.test(v) || 'Must have one number',
      // v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
    ],
    message: "",
  }),
  mounted() {
    let data = JSON.parse(localStorage.getItem("remember"));
    if (data != null) {
      this.userName = data.email;
      this.password = data.password;
    }
  },

  methods: {
    async validate() {
      if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start();
      await config.post('/admin/login', {
        email: this.userName,
        password: this.password,
      }).then((res) => {
        Cookies.set('auth_token', res.data.data.token); // เก็บ token ไว้ใน cookie
        this.getUser()
      }).catch((e) => {
        this.$nuxt.$loading.finish();
        this.message = e.response.data.message;
        this.again = true
        console.log(e)
      });
    },

    async getUser(){
      await config.get('/user',{
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${Cookies.get('auth_token')}`,
        }
      }).then((res) => {
        this.$nuxt.$loading.finish();
        Cookies.set('get_user', JSON.stringify(res.data.data)); // เก็บ token ไว้ใน cookie
        this.$router.push('/admin');
      }).catch((e) => {
        console.log(e)
      })
    }
  },
};
