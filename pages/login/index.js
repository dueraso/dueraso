import pkg from "@/package.json";
import convert from "@/plugins/convert";
import serve from "@/con/server";
import error from "@/layouts/error.vue";

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
      window.location.assign(`${serve.api}/auth/google`);
        // `https://accounts.google.com/o/oauth2/v2/auth?client_id=${serve.clientId}&redirect_uri=${serve.redirectUri}&scope=${serve.scope}&response_type=code`
    },

    async validate() {
      if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start();
      await this.$auth.loginWith("local1", {
        data: {
          email: this.userName,
          password: this.password,
        },
      }).then((res) => {
        // if (res.data.success) {
        this.saveLocal();
        this.setManu();
        this.$nuxt.$loading.finish();
        // } else {
        //   this.$nuxt.$loading.finish();
        // }
      }).catch((e) => {
        console.log(e)
        this.message = e.response.data.message;
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
      this.$gates.setRoles([this.$auth.user.roles.group]);
    },

    setManu() {
      let _item;
      if (this.$auth.user.roles.group === "admin"/* || this.$auth.user.roles.group === "*"*/) {
        _item = this.$auth.user.title;
      } else if (this.$auth.user.roles.policy) {
        console.log("error1")
        _item = JSON.parse(localStorage.getItem("policy")).titleBar;
        // _item = _item.sort((a, b) => a.sort - b.sort)
      } else {
        console.log("error2")
        error(
          {
            statusCode: 403,
            message: 'ACCESS DENIED'
          }
        )
      }
      localStorage.setItem(
        "modules",
        JSON.stringify(convert.groupChildren(_item))
      );
    },
  },
};
