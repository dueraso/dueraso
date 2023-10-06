<template>
  <b-navbar
    toggleable="lg" bg="dark" class="elevation-4" variant="white">
    <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>
    <b-collapse id="nav-collapse" is-nav class="container p-0">
      <b-navbar-nav class="ml-auto pl-0" align="center"
                    style="width: 100%; align-items: center; font-weight: 600">
        <!--        <b-nav-item-->
        <!--          v-for="(itemBar, i) in itemsBar" :key="i"-->
        <!--          @click="$router.push(itemBar.route)"-->
        <!--          :active='$route.name === itemBar.route.name'>{{ itemBar.name }}-->
        <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">
          DUERASO
        </strong>
      </b-navbar-nav>
    </b-collapse>
    <v-btn right color="#E8AE0F" icon text>
      <v-icon>mdi-bell-badge-outline</v-icon>
    </v-btn>
    <p class="m-0 mr-3" style="font-size: 20px">
      <v-icon>mdi-account-outline</v-icon>
      {{ $auth.user.name }}
    </p>
    <v-btn right color="#B27D41" rounded outlined class="pl-2 mr-3">
      <v-icon>mdi-keyboard-backspace</v-icon>
      กลับหน้าเว็บ
    </v-btn>
    <v-btn right class="custom-primary" rounded>ออกจากระบบ</v-btn>
  </b-navbar>
</template>
<style>
.circle {
  position: absolute;
  bottom: -10px;
  left: calc(-50% - 5px);
}


.navbar-light .navbar-nav .show > .nav-link, .navbar-light .navbar-nav .active >
.nav-link, .navbar-light .navbar-nav .nav-link.show, .navbar-light .navbar-nav .nav-link.active {
  color: rgb(84, 182, 200);
}

.v-badge__badge {
  position: relative;
}

.v-badge__wrapper {
  top: 5px;
}
</style>
<script>
import axios from "~/api/config";
import DialogCon from "./DialogCon";

export default {
  components: {
    DialogCon,
  },
  data() {
    return {
      selectedLetter: '',
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
          title: "หน้าแรก",
          directory: "/",
        },
        {
          title: "แคชเชียร์",
          directory: "/pos",
        },
        {
          title: "จัดการรายการ",
          directory: "/pos/product",
        },
        {
          title: "จัดการประเภท",
          directory: "/pos/product-type",
        },
        {
          title: "จัดการส่วนลด",
          directory: "/pos/discount",
        },

      ],
      items: [
        {
          name: 'ตั้งค่า',
          route: '/dashboard/setting'
        },
        {
          name: 'ออกจากระบบ',
          route: 'logout'
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
  created() {
  },
  mounted() {
    // this.$nextTick(() => this.savePolicy())
    this.selectedLetter = this.$route.path
    if (this.$auth.user === undefined || this.$auth.user === null) return
    if (this.$auth.user.mobile === '') {
      this.snackbar = true
      this.messages = 'ข้อมูลของท่านยังไม่สมบูรณ์ <br/>กรุณากรอบข้อมูลและอัพรูปบัตรประชาชน'
      this.textBtn = 'ยืนยัน'
    }
  },
  methods: {
    savePolicy() {
      localStorage.setItem("policy", this.$auth.user.roles.policy)
      if (JSON.parse(localStorage.getItem("policy")) == null) return
      this.itemsBar = JSON.parse(localStorage.getItem("policy")).titleBar
      console.log(this.itemsBar)
      // this.itemsBar.sort((a, b) => a.id - b.id)
    },
    addCircle(val) {
      this.selectedLetter = val.directory;
      this.$router.push(val.directory)
    },

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
          this.$router.push('/profile/edit')
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
    async validate() {
      this.$nuxt.$loading.start()
      await axios.post('/member/login', {
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
