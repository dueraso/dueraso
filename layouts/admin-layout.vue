<template>
  <v-app dark style="background-color: #F3F1ED;">
    <navigation-drawer v-model="drawer" :modules="modules"/>

    <v-app-bar :clipped-left="clipped" fixed app class="pl-1 pr-1">
      <!-- Top navigation -->
      <div class="topnav" style="width: 100%">

        <!-- Centered link -->
        <div class="topnav-centered">
          <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">
            ADMIN
          </strong>
        </div>

        <!-- Left-aligned links (default) -->
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="color: #B27D41"/>

        <div class="topnav-right d-none d-md-flex ">
          <v-row class="m-0">
            <v-btn color="#E8AE0F" icon text>
              <v-icon>mdi-bell-badge-outline</v-icon>
            </v-btn>
            <p class="m-0 mr-5 mt-2" style="font-size: 20px" v-if="user">
              <v-icon>mdi-account-outline</v-icon>
              {{ user.name }}
            </p>
            <v-btn color="#B27D41" rounded outlined class="pl-2 mr-3 mt-1" @click="$router.push('/all-apps')">
              <v-icon>mdi-keyboard-backspace</v-icon>
              กลับหน้าเว็บ
            </v-btn>
            <v-btn class="custom-primary mt-1" rounded @click="logout">ออกจากระบบ</v-btn>
          </v-row>
        </div>
      </div>
    </v-app-bar>
    <Nuxt/>
  </v-app>
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

.topnav-centered pre {
  float: none;
  position: absolute;
  top: 50%;
  left: 52%;
  transform: translate(-37%, -58%);
}

.topnav-right {
  float: right;
}

/* Responsive navigation menu (for mobile devices) */
@media screen and (max-width: 1200px) {

  .topnav-centered pre {
    float: none;
    position: absolute;
    top: 50%;
    left: 53%;
    transform: translate(-37%, -58%);
  }
}
</style>
<script>
import Cookies from 'js-cookie';

export default {
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      right: false,
      rightDrawer: false,
      modules: [
        {
          title: "แดชบอร์ด",
          icon: "mdi-home-variant-outline",
          diractory: "/admin"
        },
        {
          title: "จัดการหน้าแรก",
          icon: "mdi-folder-home-outline",
          diractory: "/admin/home"
        },
        {
          title: "จัดการบทความ",
          icon: "mdi-newspaper-variant-multiple",
          diractory: "/admin/blog"
        },
        {
          title: "จัดการคำถาม",
          icon: "mdi-help-box-multiple-outline",
          diractory: "/admin/faq"
        },
        {
          title: "จัดการติดต่อเรา",
          icon: "mdi-card-account-phone-outline",
          diractory: "/admin/contact-us"
        },
        {
          title: "จัดการแพ็คเกจ",
          icon: "mdi-gift-open",
          diractory: "/admin/package"
        },
        {
          title: "จัดการแอปพลิเคชัน",
          icon: "mdi-apple-keyboard-command",
          diractory: "/admin/all-apps"
        },
        {
          title: "จัดการนโยบาย",
          icon: "mdi-police-badge-outline",
          diractory: "/admin/policy"
        },
        {
          title: "จัดการคุกกี้",
          icon: "mdi-cookie-outline",
          diractory: "/admin/cookie"
        },
        {
          title: "รายงาน",
          icon: "mdi-chart-box-multiple-outline",
          children:[
            {
              title: "รายงานการใช้งาน",
              icon: "mdi-folder-home-outline",
            },
            {
              title: "รายงาน",
              icon: "mdi-folder-home-outline",
            },
          ],
        }
      ],
      user:null
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.user = JSON.parse(Cookies.get("get_user"));
      // if(localStorage.getItem("admin") === null) this.$router.push("/admin/login")
      // this.saveLocal()
    })
  },
  methods: {
  //   saveLocal() {
  //     let per = JSON.parse(localStorage.getItem("policy"))
  //     if (per) {
  //       this.$gates.setPermissions(per.permissions);
  //     }
  //     this.$gates.setRoles([this.$auth.user.roles.name]);
  //   },
    logout() {
      Cookies.remove('auth_token');
      Cookies.remove('get_user');
      this.$router.push('/sign');
    }
  }
};
</script>
