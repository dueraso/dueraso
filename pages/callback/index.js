import serve from "@/con/server";
import axios from "axios";
import error from "@/layouts/error.vue";
import convert from "@/plugins/convert";

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
      console.log(res.data)
      this.saveLocal();
      this.setManu();
      if(this.$auth.user.status === 1){
        this.$router.replace('/all-apps');
      }else {
        this.$router.push({path: `/first`});
      }
    })
    // this.Login()
    // console.log(this.$route.query.code)
  },
  methods: {
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

    async Login() {
      this.$axios.post(`https://oauth2.googleapis.com/token`, {
        client_id: serve.clientId,
        client_secret: serve.clientSecret,
        code: this.$route.query.code,
        grant_type: "authorization_code",
        redirect_uri: serve.redirectUri
      }).then((res) => {
        console.log(res.data)
        // this.getMe(res.data.access_token)
      })
    },
    async getMe(token) {
      await axios.get(`https://openidconnect.googleapis.com/v1/userinfo`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }).then((res) => {
        console.log(res.data)
        //   this.$auth.setUser(res.data)
        // console.log(this.$auth.user)
      })
    }
  },
}
