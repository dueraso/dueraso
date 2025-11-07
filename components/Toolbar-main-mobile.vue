<template>
  <v-card flat style="z-index: 99; background: unset;" width="100%" class="pa-2 ">
    <div
      class="topnav elevation-4 text-left p-2"
      style="border-radius: 15px; justify-content: space-between; width: 100%; background-color: white">

      <!-- Centered link -->
      <div class="topnav-centered">
        <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">
          DUERASO
        </strong>
      </div>

      <v-app-bar-nav-icon @click="openNav" style="color: #B27D41; float: left"/>
    </div>

    <div id="myNav" class="overlay">
      <v-btn icon class="closebtn" @click="closeNav">
        <v-icon color="white">mdi-window-close</v-icon>
      </v-btn>
      <v-overlay class="overlay-content">
        <a style="color: #818181" @click="onChangePage('/')">หน้าหลัก</a>
        <a style="color: #818181" @click="onChangePage('/blog')">บทความ</a>
        <a style="color: #818181" @click="onChangePage('/faq')">คำถามที่พบบ่อย</a>
        <a style="color: #818181" @click="onChangePage('/contact-us')">ติดต่อเรา</a>
        <a style="color: #818181" @click="onChangePage('/package')">แพ็คเกจ</a>
        <a style="color: #818181" @click="onChangePage('/all-apps')">รวมแอป</a>
        <a style="color: #818181" @click="onChangePage('/login')">เข้าสู่ระบบ</a>
        <a style="color: #818181" @click="onChangePage('/login')">ลงทะเบียน</a>
      </v-overlay>
    </div>
  </v-card>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Athiti&family=Belanosima&family=Indie+Flower&display=swap');

.topnav {
  position: relative;
  overflow: hidden;
}

.topnav-centered strong {
  float: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}


.overlay {
  height: 0;
  width: 100%;
  z-index: 100;
  position: fixed;
  top: 0;
  left: 0;
  background-color: rgb(0, 0, 0);
  background-color: rgba(0, 0, 0, 0.9);
  overflow-x: hidden;
  transition: 0.5s;
}

.overlay-content {
  position: relative;
  top: 10%;
  width: 100%;
  text-align: center;
  margin-top: 0;
}

.overlay a {
  padding: 8px;
  text-decoration: none;
  font-size: 36px;
  color: #818181;
  display: block;
  transition: 0.3s;
}

.overlay a:hover, .overlay a:focus {
  color: #f1f1f1;
}

.overlay .closebtn {
  position: absolute;
  top: 20px;
  right: 20px;
  font-size: 60px;
}


</style>

<script>
import axios from "@/con/config";

export default {
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
      drawer: true,
    }
  },
  methods: {
    logout() {
      this.$auth.logout()
      localStorage.clear()
    },
    onChangePage(val) {
      this.closeNav()
      this.$router.push(val)
    },
    openNav() {
      document.getElementById("myNav").style.height = "100%";
    },

    closeNav() {
      document.getElementById("myNav").style.height = "0%";
    },
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
  },
}
</script>
