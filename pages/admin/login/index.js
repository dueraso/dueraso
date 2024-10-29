import pkg from "@/package.json";
import convert from "@/plugins/convert";

export default {
  layout: "auth-layout",
  head() {
    return {
      title: this.headTitle,
    };
  },
  data: () => ({
    headTitle: "หน้าล็อกอิน",
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
      await this.$axios.post("login", {
        email: this.userName,
        password: this.password,
      }).then((res) => {
        this.$nuxt.$loading.finish();
      }).catch((e) => {
        console.log(e)
        this.message = e.response.data.message;
        this.again = true
        this.$nuxt.$loading.finish();
      })
    },
  },
};
