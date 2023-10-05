<template>
<!--  <v-app app fixed style="background: unset" align="center" class="pa-4 elevation-0">-->
    <v-card flat style="z-index: 99; background: unset" width="100%" class="pa-4">
      <b-navbar
        toggleable="lg" bg="dark" class="elevation-4" variant="white" style="border-radius: 20px">
        <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
        <b-collapse id="nav-collapse" is-nav class="container p-0">
          <b-navbar-nav class="ml-auto pl-0" align="center"
                        style="width: 1440px; align-items: center; font-weight: 600">
            <!--        <b-nav-item-->
            <!--          v-for="(itemBar, i) in itemsBar" :key="i"-->
            <!--          @click="$router.push(itemBar.route)"-->
            <!--          :active='$route.name === itemBar.route.name'>{{ itemBar.name }}-->
            <!--        </b-nav-item>-->
            <b-nav-item @click="$router.push('/')" class="pl-4 pr-4">
              หน้าแรก
            </b-nav-item>
            <b-nav-item @click="$router.push('/blog')" class="pl-4 pr-4">
              บทความ
            </b-nav-item>
            <b-nav-item @click="$router.push('/faq')" class="pl-4 pr-4">
              คำถามที่พบบ่อย
            </b-nav-item>
            <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">
              DUERASO
            </strong>
            <b-nav-item @click="$router.push('/contact-us')" class="pl-4 pr-4">
              ติดต่อเรา
            </b-nav-item>
            <b-nav-item @click="$router.push('/package')" class="pl-4 pr-4">
              แพ็คเกจ
            </b-nav-item>
            <b-nav-item @click="$router.push('/all-apps')" class="pl-4 pr-4">
              รวมแอป
            </b-nav-item>
          </b-navbar-nav>
          <v-btn right class="custom-primary" rounded @click="$router.push('/login')">ลงทะเบียน</v-btn>
        </b-collapse>
      </b-navbar>
    </v-card>
<!--  </v-app>-->
</template>
<style lang="scss">
@import '@/assets/css/custom-vuetify.scss';

.color_main {
  color: #B27D41;
}

#v-btn {
  color: #B27D41;
}

.navbar-light .navbar-nav .show > .nav-link, .navbar-light .navbar-nav .active >
.nav-link, .navbar-light .navbar-nav .nav-link.show, .navbar-light .navbar-nav .nav-link.active {
  color: rgb(123, 24, 23);
}

.v-badge__badge {
  position: relative;
}

.v-badge__wrapper {
  top: 5px;
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
