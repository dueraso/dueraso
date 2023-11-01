<template>
  <!--  <v-app app fixed style="background: unset" align="center" class="pa-4 elevation-0">-->
  <v-card flat style="z-index: 99; background: unset;" width="100%" class="pa-4">
    <b-navbar v-model="e"
              toggleable="lg" class="elevation-4 text-left topnav1 pt-0 pb-0" variant="white"
              style="border-radius: 20px; justify-content: space-between">
      <!--        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>-->
      <div style="width: 215px"></div>
      <div>
        <v-row class="m-0  align-items-center">
          <div align="center">
            <a :class="active('')" @click="$router.push('/')">หน้าหลัก</a>
          </div>
          <div>
            <a :class="active('blog')" @click="$router.push('/blog')">บทความ</a>
          </div>
          <div>
            <a :class="active('faq')" @click="$router.push('/faq')">คำถามที่พบบ่อย</a>
          </div>
          <div style="width: 200px; text-align-last: center;">
            <p style="font-size: 35px; font-weight: 700; color: #846537" class="m-0">DUERASO</p>
          </div>
          <div>
            <a :class="active('contact-us')" @click="$router.push('/contact-us')">ติดต่อเรา</a>
          </div>
          <div>
            <a :class="active('package')" @click="$router.push('/package')">แพ็คเกจ</a>
          </div>
          <div>
            <a :class="active('all-apps')" @click="$router.push('/all-apps')">รวมแอป</a>
          </div>
        </v-row>
      </div>
      <div style=" justify-items: flex-end">
        <v-btn right rounded color="#B27D41" dark @click="$router.push('/login')">เข้าสู่ระบบ</v-btn>
        <v-btn right outlined rounded color="#B27D41" dark @click="$router.push('/login')" class="ml-3">ลงทะเบียน
        </v-btn>
      </div>
    </b-navbar>
  </v-card>
  <!--  </v-app>-->
</template>
<style lang="scss">
@import '@/assets/css/custom-vuetify.scss';
/* Add a black background color to the top navigation */
.topnav1 {
  background-color: #A57156;
  overflow: hidden;
}

/* Style the links inside the navigation bar */
.topnav1 a {
  float: initial;
  display: block;
  color: #000000;
  text-align: center;
  padding: 14px 10px;
  margin-left: 20px;
  margin-right: 20px;
  text-decoration: none;
  font-weight: 500;
  border-bottom: 3px solid transparent;
}

//.topnav1 a:hover {
//  border-bottom: 3px solid red;
//}

.topnav1 a.active {
  color: #A44E1C;
  border-bottom: 3px solid #A44E1C;
}

/* Responsive navigation menu (for mobile devices) */
@media screen and (max-width: 1410px) {
  .topnav1 a {
    float: initial;
    display: block;
    color: #000000;
    text-align: center;
    padding: 14px 10px;
    margin-left: 0px;
    margin-right: 0px;
    text-decoration: none;
    font-weight: 500;
    border-bottom: 3px solid transparent;
  }
}

</style>
<script>
import axios from "~/api/config";

export default {
  // components: {DialogRegister, DialogCon, Register},
  data() {
    return {
      textBtn: undefined,
      overlay: false,
      menu: false,
      show: false,
      myPage: false,
      pagePost: false,
      valid: true,
      snackbar: false,
      vertical: true,
      messages: '',
      username: '',
      password: '',
      e: null
    }
  },
  mounted() {
    // console.log(this.$i18n.locales)
    // if (this.$auth.user === undefined || this.$auth.user === null) return
    // if (this.$auth.user.mobile === '') {
    //   this.snackbar = true
    //   this.messages = 'ข้อมูลของท่านยังไม่สมบูรณ์ <br/>กรุณากรอบข้อมูลและอัพรูปบัตรประชาชน'
    //   this.textBtn = 'ยืนยัน'
    // }
  },
  methods: {
    // showBadge() {
    //   return this.$vuetify.breakpoint.width > 990
    // },
    // lock() {
    //   this.snackbar = true
    //   this.messages = "ขณะนี้ระบบยังไม่เปิดใช้บริการ"
    // },
    // close() {
    //   if (this.$auth.user !== undefined && this.$auth.user !== null) {
    //     if (this.$auth.user.mobile === '') {
    //       this.$router.push(this.localePath("index") + '/profile/edit')
    //     }
    //   }
    //   this.snackbar = false
    //   this.show = false
    // },
    changePage(val) {
      if (val === 'logout') {
        this.$auth.logout()
        // console.log("if<")
      } else if (val === '') {
        // console.log("else if<")
        // this.lock()
      } else {
        // console.log("else<")
        this.$router.push(val)
      }
    },
    active(val) {
      return this.$route.name === val ? 'active' : ''
      // return this.items.findIndex((s) => s.route === this.$route.params.post) >= 0 || this.items.findIndex((s) => s.route === this.$route.name) >= 0
    },
    // async validate() {
    //   this.$nuxt.$loading.start()
    //   await axios.post('/login', {
    //     username: this.username,
    //     password: this.password,
    //   }).then((res) => {
    //     if (res.data.status) {
    //       // console.log("1>"+this.$route.fullPath)
    //       this.login()
    //     } else {
    //       this.messages = res.data.message
    //       this.$nuxt.$loading.finish()
    //       this.snackbar = true
    //     }
    //   }).catch((e) => {
    //     console.log(e)
    //   })
    // },
    // login() {
    //   try {
    //     const login = {
    //       username: this.username,
    //       password: this.password
    //     }
    //     this.$auth.loginWith('local', {data: login}).then((res) => {
    //       this.$nuxt.$loading.finish()
    //       this.menu = false
    //       this.$auth.$storage.setLocalStorage('token', res.data.tokens.code)
    //       this.username = ''
    //       this.password = ''
    //     })
    //   } catch (e) {
    //     console.log('Error Response', JSON.stringify(e))
    //   }
    // },
    // register() {
    //   this.menu = false
    //   this.overlay = !this.overlay
    // },
  },
}
</script>
