import serve from "@/con/server";

export default {
  layout: 'auth-layout',
  data() {
    return {
      overlay: true,
      error: null,
    };
  },
  mounted() {
    console.log(this.$route.query)
    if (this.$route.query.code) {
      this.Login();
    } else {
      this.Logout()
    }
  },
  methods: {
    async Logout() {
      await this.$auth.logout()
      localStorage.clear()
      await this.$router.push('/')
      // await this.$router.push('/login')
    },
    async Login() {
      this.$axios.post(`https://oauth2.googleapis.com/token`, {
        client_id: serve.clientId,
        client_secret: serve.clientSecret,
        code: this.$route.query.code,
        grant_type: "authorization_code",
        redirect_uri: serve.redirectUri
      }).then((res) => {
        this.getMe(res.data.access_token)
      })
    },
    async getMe(token){
      await this.$axios.get(`https://openidconnect.googleapis.com/v1/userinfo`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }).then((res)=>{
        console.log(res.data)
      })
    }
  },
}
