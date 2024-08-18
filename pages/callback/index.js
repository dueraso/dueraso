import serve from "@/con/server";
import axios from "axios";

export default {
  layout: 'auth-layout',
  data() {
    return {
      overlay: true,
      error: null,
    };
  },
  mounted() {
    this.$auth.loginWith("local2", {
      data: this.$route.query
    }).then((res) => {
      this.$router.push({ path: `/setup` });
      console.log(res.data)
    })
  },
  methods: {
    // async Login() {
    //   this.$axios.post(`https://oauth2.googleapis.com/token`, {
    //     client_id: serve.clientId,
    //     client_secret: serve.clientSecret,
    //     code: this.$route.query.code,
    //     grant_type: "authorization_code",
    //     redirect_uri: serve.redirectUri
    //   }).then((res) => {
    //     this.getMe(res.data.access_token)
    //   })
    // },
    // async getMe(token) {
    //   await axios.get(`https://openidconnect.googleapis.com/v1/userinfo`, {
    //     headers: {
    //       Authorization: `Bearer ${token}`
    //     }
    //   }).then((res) => {
    //     console.log(res.data)
    //     //   this.$auth.setUser(res.data)
    //     // console.log(this.$auth.user)
    //   })
    // }
  },
}
