import pkg from "@/package.json";
import convert from "@/plugins/convert";

export default {
  layout: "auth-layout",
  middleware: "isLoggedIn",
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
    async googleOauth() {
      const clientId = "436601941584-ng05st9ub5lijn8lqic6bphgq7mblru6.apps.googleusercontent.com";
      const redirectUri = 'http://localhost:3000/callback';
      const scope = 'https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email';
      const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}&response_type=code`;
      window.location.assign(url);
    },

    async validate() {
      if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start();
      // let res =
      await this.$auth.loginWith("local", {
        data: {
          email: this.userName,
          password: this.password,
        },
      }).then((res) => {
        console.log(res.data)
        // if (res.data.success) {
        this.saveLocal();
        this.setManu();
        this.$nuxt.$loading.finish();
        // } else {
        //   this.$nuxt.$loading.finish();
        // }
      }).catch(e=>{
        this.message = e.response.data.message
        this.again = true
        this.$nuxt.$loading.finish();
      })
    },

    saveLocal() {
      localStorage.setItem("policy", this.$auth.user.roles.policy);
      let per = JSON.parse(localStorage.getItem("policy"));
      if (per) {
        this.$gates.setPermissions(per.permissions);
      }
      this.$gates.setRoles([this.$auth.user.roles.name]);
    },

    setManu() {
      let _item;
      if (this.$auth.user.roles.id === 1) {
        _item = this.$auth.user.title;
      } else {
        _item = JSON.parse(localStorage.getItem("policy")).titleBar;
        // _item = _item.sort((a, b) => a.sort - b.sort)
      }
      localStorage.setItem(
        "modules",
        JSON.stringify(convert.groupChildren(_item))
      );
    },
  },
};
