<template>
  <b-navbar
    toggleable="lg" bg="dark" class="elevation-4 navbar-elements-position is-link navbar-inner"
    variant="white">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav class="container">
      <!--    <v-spacer/>-->
      <b-navbar-nav class="ml-auto pl-0" fixed-top style="width: 1440px">
        <b-nav-item
          v-for="(itemBar, i) in itemsBar" :key="i" class="app-nav-link" style="padding-right: 0"
          @click="$router.push(itemBar.route)"
          :active='$route.name === itemBar.route.name'>{{ itemBar.name }}
        </b-nav-item>
        <v-menu offset-y left v-model="menu" :close-on-content-click="false" :nudge-width="200" max-width="290">
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              type="submit" outlined color="#7b1817" @click="$router.push('login')" v-b-hover=""
              style="padding: 6px; text-transform: capitalize"
              v-show="!$auth.loggedIn" class="mx-auto">
              login
              <!--              {{ $i18n.t("header").login }}-->
            </v-btn>
          </template>
          <v-card>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title align="center">
                    <!--                    <p style="color: #7b1817; font-size: 18px">{{$i18n.t("header").loginToUse}}</p>-->
                  </v-list-item-title>
                  <!--                    <v-form-->
                  <!--                      ref="form"-->
                  <!--                      v-model="valid"-->
                  <!--                      lazy-validation-->
                  <!--                      style="max-width: 475px"-->
                  <!--                    >-->
                  <v-list-item-subtitle>
                    <v-text-field
                      light dense style="margin-top: 12px"
                      prepend-inner-icon="mdi-account-outline"
                      type="name" @keydown.enter="validate"
                      v-model="username"
                      :rules="[rules.required]">
                    </v-text-field>
                  </v-list-item-subtitle>
                  <v-list-item-subtitle>
                    <v-text-field
                      light dense style="margin-top: 12px"
                      prepend-inner-icon="mdi-lock-outline" type="password"
                      v-model="password"
                      :rules="[rules.required]" @keydown.enter="validate">
                    </v-text-field>
                  </v-list-item-subtitle>
                  <!--                    </v-form>-->
                  <v-list-item-subtitle align="center">
                    <v-col align="center" style="padding: 0">
                      <v-btn @click="register" text style="padding: 12px;">
                        <!--                        {{$i18n.t('header').register}}-->
                        register
                      </v-btn>
                      <v-btn color="#7b1817" dark style="padding: 12px;" @click="validate">
                        login
                        <!--                        {{$i18n.t('header').login}}-->
                      </v-btn>
                    </v-col>
                  </v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-card>
        </v-menu>
        <!--        <v-menu offset-y left v-model="myPage">-->
        <!--          <template v-slot:activator="{ on, attrs }" style="padding-right: 0px">-->
        <!--            <b-nav-item v-bind="attrs" v-on="on" :active="active()" v-show="$auth.loggedIn">-->
        <!--              {{ $i18n.t('header').myPage }}-->
        <!--              <v-badge :value="active()" style="left: calc(-50% - 5px);" color="#7b1817" bottom dot-->
        <!--                       v-show="showBadge()"></v-badge>-->
        <!--            </b-nav-item>-->
        <!--          </template>-->
        <!--          <v-card>-->
        <!--            <v-list>-->
        <!--              <v-list-item-->
        <!--                v-for="(item, index) in items"-->
        <!--                :key="index" @click="changePage(item.route)">-->
        <!--                <v-list-item-title>{{ item.name }}</v-list-item-title>-->
        <!--              </v-list-item>-->
        <!--            </v-list>-->
        <!--          </v-card>-->
        <!--        </v-menu>-->
      </b-navbar-nav>
    </b-collapse>
    <!--    <Register :callback="register" :overlay="overlay"/>-->
    <!--    <DialogCon :detail="messages" :callback="close" :textBtn="textBtn" :status="snackbar"/>-->
  </b-navbar>
</template>
<style>
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
// import Register from "~/components/Register";
// import DialogCon from "./DialogCon";
// import DialogRegister from "./DialogRegister";

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
      itemsBar: [
        {
          name: "หน้าแรก",
          route: '/'
        },
        {
          name: "ข่าว",
          route: '/news'
        },
        {
          name: "ติดต่อ",
          route: '/contact-us'
        },
        {
          name: "หน้าร้านของฉัน",
          route: '/pos-dashboard'
        },
        {
          name: "หลังร้านของฉัน",
          route: '/dashboard'
        },
      ],
      items: [
        // {
        //   name: this.$i18n.t('header').personalInformation,
        //   route: this.localeLocation("profile")
        // },
        // // {
        // //   name: 'แจ้งเรื่อง',
        // //   route: 'admin'
        // // },
        // {
        //   name: this.$i18n.t('header').registrationStatus,
        //   route: this.localeLocation('status')
        // },
        // {
        //   name: this.$i18n.t('header').logOut,
        //   route: 'logout'
        // },
      ],
      itemsPost: [
        {
          name: 'พระสมเด็จมาตรฐาน PSDA',
          route: "1"
        },
        {
          name: 'พระเครื่องพร้อมใบตรวจอัตลักษณ์',
          route: '2'
        },
      ],
      rules: {
        required: value => !!value || "จำเป็น",
        min: v => (v && v.length >= 8) || "ตัวอักษร 8 ขึ้นไป",
        confirmPassword: value => value === this.password || 'รหัสผ่านไม่ต้องกัน',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'กรุณากรอก e-mail'
        }
      },
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
    // test(i) {
    //   console.log(this.$route.name)
    //   console.log(JSON.stringify(this.itemsBar[i].route.name))
    // },
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
