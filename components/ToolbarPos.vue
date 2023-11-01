<template>
  <v-app-bar fixed app class="pl-1 pr-1">
  <!-- Top navigation -->
  <div class="topnav" style="width: 100%">

    <!-- Centered link -->
    <div class="topnav-centered">
      <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">
        DUERASO
      </strong>
    </div>

    <!-- Left-aligned links (default) -->
    <div class="topnav-right">
      <v-row class="m-0">
        <v-btn color="#E8AE0F" icon text>
          <v-icon>mdi-bell-badge-outline</v-icon>
        </v-btn>
        <p class="m-0 mr-5 mt-2" style="font-size: 20px">
          <v-icon>mdi-account-outline</v-icon>
          {{ $auth.user.name }}
        </p>
        <v-btn color="#B27D41" rounded outlined class="pl-2 mr-3 mt-1" @click="$router.push('/all-apps')">
          <v-icon>mdi-keyboard-backspace</v-icon>
          กลับหน้าเว็บ
        </v-btn>
        <v-btn class="custom-primary mt-1" rounded>ออกจากระบบ</v-btn>
      </v-row>
    </div>
  </div>
</v-app-bar>
</template>
<style>
.topnav {
  position: relative;
  overflow: hidden;
}

.topnav a {
  float: left;
  color: #f2f2f2;
  text-align: center;
  padding: 14px 16px;
  text-decoration: none;
  font-size: 17px;
}

.topnav a:hover {
  background-color: #ddd;
}

.topnav a.active {
  background-color: #04AA6D;
  color: white;
}

.topnav-centered strong {
  float: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

.topnav-right {
  float: right;
}

/* Responsive navigation menu (for mobile devices) */
@media screen and (max-width: 600px) {

}
</style>
<script>
import axios from "@/con/config";
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
