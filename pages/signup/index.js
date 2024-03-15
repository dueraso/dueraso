import pkg from "@/package.json";
import convert from "@/plugins/convert";
import serve from "@/con/server";

export default {
  layout: "auth-layout",
  middleware: "isLoggedIn",
  head() {
    return {
      title: this.headTitle,
    }
  },
  computed:{
    serve(){
      return serve
    }
  },
  data: () => ({
    headTitle: "หน้าลงทะเบียน",
    overlay: false,
    valid: true,
    email: "",
    again: false,
    stat: false,
    remember: false,
    version: pkg.version,
    rules: [
      (v) => !!v || "จำเป็น",
      (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง",
    ],
    userName: "",
    password: "",
    message: "",
    snackbar: false,
    show: false,
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
      await this.$auth.loginWith('google');
      // this.$auth.loginWith('social', {
      //   params: {
      //     another_post_key: '436601941584-ng05st9ub5lijn8lqic6bphgq7mblru6'
      //   }
      // })
    },
    async validate() {
      if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start();
      // let res =
      await this.$auth.loginWith("local", {
        data: {
          email: this.userName,
          password: this.password,
        }
      }).then((res) => {
        console.log(res)
        this.saveLocal()
        this.setManu()
        this.$nuxt.$loading.finish();
      }).catch((e) => {
        this.snackbar = true
        this.message = e.response.data.message
        console.log(e.response.data.message)
        this.$nuxt.$loading.finish();
      })
      // console.log(res.data)
      // if(res.data.success){
      // }else {
      //   // console.log(res.data)
      // }
    },
  },
};
