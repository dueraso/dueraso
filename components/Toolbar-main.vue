<template>
  <!--  <v-app app fixed style="background: unset" align="center" class="pa-4 elevation-0">-->
  <v-card flat style="z-index: 99; background: unset" width="100%" class="pa-4">
    <b-navbar v-model="e"
              toggleable="lg" class="elevation-4 text-left topnav1 pt-0 pb-0" variant="white"
              style="border-radius: 20px; justify-content: space-between">
      <!--        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>-->
      <div style="width: 215px"></div>
      <div>
        <v-row class="m-0  align-items-center">
          <div align="center">
            <a style="align-content: center">หน้าหลัก</a>
          </div>
          <div >
            <a>บทความ</a>
          </div>
          <div >
            <a :class="$route.name === 'faq' ? 'active':''" @click="$router.push('/faq')">คำถามที่พบบ่อย</a>
          </div>
          <div style="width: 200px; text-align-last: center;">
            <p style="font-size: 35px; font-weight: 700; color: #846537" class="m-0">DUERASO</p>
          </div>
          <div >
            <a>ติดต่อเรา</a>
          </div>
          <div >
            <a :class="$route.name === 'package' ? 'active':''" @click="$router.push('/package')">แพ็คเกจ</a>
          </div>
          <div >
            <a :class="$route.name === 'all-apps' ? 'active':''" @click="$router.push('/all-apps')">รวมแอป</a>
          </div>
        </v-row>
      </div>
      <div style=" justify-items: flex-end">
        <v-btn right rounded color="#B27D41" dark @click="$router.push('/login')">เข้าสู่ระบบ</v-btn>
        <v-btn right outlined rounded color="#B27D41" dark @click="$router.push('/login')" class="ml-3">ลงทะเบียน</v-btn>
      </div>
      <!--        <div class="topnav" style="width: 100%;">-->

      <!--          &lt;!&ndash; Centered link &ndash;&gt;-->
      <!--          <div class="topnav-centered">-->
      <!--            <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">-->
      <!--              DUERASO-->
      <!--            </strong>-->
      <!--          </div>-->

      <!--          &lt;!&ndash; Left-aligned links (default) &ndash;&gt;-->
      <!--          <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="color: #B27D41"/>-->
      <!--          <div class="topnav-right">-->
      <!--            <v-row class="m-0">-->
      <!--&lt;!&ndash;              <v-btn color="#E8AE0F" icon text>&ndash;&gt;-->
      <!--&lt;!&ndash;                <v-icon>mdi-bell-badge-outline</v-icon>&ndash;&gt;-->
      <!--&lt;!&ndash;              </v-btn>&ndash;&gt;-->
      <!--&lt;!&ndash;              <p class="m-0 mr-5 mt-2" style="font-size: 20px">&ndash;&gt;-->
      <!--&lt;!&ndash;                <v-icon>mdi-account-outline</v-icon>&ndash;&gt;-->
      <!--&lt;!&ndash;&lt;!&ndash;                {{ $auth.user.name }}&ndash;&gt;&ndash;&gt;-->
      <!--&lt;!&ndash;              </p>&ndash;&gt;-->
      <!--              <v-btn color="#B27D41" rounded outlined class="pl-2 mr-3 mt-1" @click="$router.push('/all-apps')">-->
      <!--                <v-icon>mdi-keyboard-backspace</v-icon>-->
      <!--                กลับหน้าเว็บ-->
      <!--              </v-btn>-->
      <!--              <v-btn class="custom-primary mt-1" rounded>ออกจากระบบ</v-btn>-->
      <!--            </v-row>-->
      <!--          </div>-->
      <!--        </div>-->


      <!--        <b-collapse id="nav-collapse" is-nav class="container p-0">-->
      <!--          <b-navbar-nav class="ml-auto pl-0" align="center"-->
      <!--                        style="width: 1440px; align-items: center; font-weight: 600">-->
      <!--            &lt;!&ndash;        <b-nav-item&ndash;&gt;-->
      <!--            &lt;!&ndash;          v-for="(itemBar, i) in itemsBar" :key="i"&ndash;&gt;-->
      <!--            &lt;!&ndash;          @click="$router.push(itemBar.route)"&ndash;&gt;-->
      <!--            &lt;!&ndash;          :active='$route.name === itemBar.route.name'>{{ itemBar.name }}&ndash;&gt;-->
      <!--            &lt;!&ndash;        </b-nav-item>&ndash;&gt;-->
      <!--            <b-nav-item @click="$router.push('/')" class="pl-4 pr-4">-->
      <!--              หน้าแรก-->
      <!--            </b-nav-item>-->
      <!--            <b-nav-item @click="$router.push('/blog')" class="pl-4 pr-4">-->
      <!--              บทความ-->
      <!--            </b-nav-item>-->
      <!--            <b-nav-item @click="$router.push('/faq')" class="pl-4 pr-4">-->
      <!--              คำถามที่พบบ่อย-->
      <!--            </b-nav-item>-->
      <!--            <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">-->
      <!--              DUERASO-->
      <!--            </strong>-->
      <!--            <b-nav-item @click="$router.push('/contact-us')" class="pl-4 pr-4">-->
      <!--              ติดต่อเรา-->
      <!--            </b-nav-item>-->
      <!--            <b-nav-item @click="$router.push('/package')" class="pl-4 pr-4">-->
      <!--              แพ็คเกจ-->
      <!--            </b-nav-item>-->
      <!--            <b-nav-item @click="$router.push('/all-apps')" class="pl-4 pr-4">-->
      <!--              รวมแอป-->
      <!--            </b-nav-item>-->
      <!--          </b-navbar-nav>-->
      <!--          <v-btn right class="custom-primary" rounded @click="$router.push('/login')">ลงทะเบียน</v-btn>-->
      <!--        </b-collapse>-->
    </b-navbar>
  </v-card>
  <!--  </v-app>-->
</template>
<style lang="scss">
@import '@/assets/css/custom-vuetify.scss';

//.color_main {
//  color: #B27D41;
//}
//
//#v-btn {
//  color: #B27D41;
//}
//
//.navbar-light .navbar-nav .show > .nav-link, .navbar-light .navbar-nav .active >
//.nav-link, .navbar-light .navbar-nav .nav-link.show, .navbar-light .navbar-nav .nav-link.active {
//  color: rgb(123, 24, 23);
//}
//
//.v-badge__badge {
//  position: relative;
//}
//
//.v-badge__wrapper {
//  top: 5px;
//}

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

/*.navbar-expand-lg .navbar-nav .nav-link {*/
/*  padding-right: 0.5rem;*/
/*  padding-left: 0;*/
/*}*/
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
    if (this.$auth.user === undefined || this.$auth.user === null) return
    if (this.$auth.user.mobile === '') {
      this.snackbar = true
      this.messages = 'ข้อมูลของท่านยังไม่สมบูรณ์ <br/>กรุณากรอบข้อมูลและอัพรูปบัตรประชาชน'
      this.textBtn = 'ยืนยัน'
    }
  },
  methods: {
    showBadge() {
      return this.$vuetify.breakpoint.width > 990
    },
    lock() {
      this.snackbar = true
      this.messages = "ขณะนี้ระบบยังไม่เปิดใช้บริการ"
    },
    close() {
      if (this.$auth.user !== undefined && this.$auth.user !== null) {
        if (this.$auth.user.mobile === '') {
          this.$router.push(this.localePath("index") + '/profile/edit')
        }
      }
      this.snackbar = false
      this.show = false
    },
    changePage(val) {
      if (val === 'logout') {
        this.$auth.logout()
        // console.log("if<")
      } else if (val === '') {
        // console.log("else if<")
        this.lock()
      } else {
        // console.log("else<")
        this.$router.push(val)
      }
    },
    active() {
      return this.items.findIndex((s) => s.route === this.$route.params.post) >= 0 || this.items.findIndex((s) => s.route === this.$route.name) >= 0
    },
    async validate() {
      this.$nuxt.$loading.start()
      await axios.post('/login', {
        username: this.username,
        password: this.password,
      }).then((res) => {
        if (res.data.status) {
          // console.log("1>"+this.$route.fullPath)
          this.login()
        } else {
          this.messages = res.data.message
          this.$nuxt.$loading.finish()
          this.snackbar = true
        }
      }).catch((e) => {
        console.log("e>" + JSON.stringify(e))
      })
    },
    login() {
      try {
        const login = {
          username: this.username,
          password: this.password
        }
        this.$auth.loginWith('local', {data: login}).then((res) => {
          this.$nuxt.$loading.finish()
          this.menu = false
          this.$auth.$storage.setLocalStorage('token', res.data.tokens.code)
          this.username = ''
          this.password = ''
        })
      } catch (e) {
        console.log('Error Response', JSON.stringify(e))
      }
    },
    register() {
      this.menu = false
      this.overlay = !this.overlay
    },
  },
}
</script>
