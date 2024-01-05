<template>
  <v-app dark style="background-color: #F3F1ED;">
    <navigation-drawer v-model="drawer"/>

    <v-app-bar :clipped-left="clipped" fixed app class="pl-1 pr-1">
      <!-- Top navigation -->
      <div class="topnav" style="width: 100%">

        <!-- Centered link -->
        <div class="topnav-centered">
          <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">
            DUERASO
          </strong>
        </div>

        <!-- Left-aligned links (default) -->
        <v-app-bar-nav-icon @click.stop="drawer = !drawer" style="color: #B27D41"/>

        <div class="topnav-right d-none d-md-flex ">
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
            <v-btn class="custom-primary mt-1" rounded @click="logout">ออกจากระบบ</v-btn>
          </v-row>
        </div>
      </div>
    </v-app-bar>
    <Nuxt/>
  </v-app>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Athiti&family=Belanosima&family=Indie+Flower&display=swap');

* {
  font-family: "Athiti", sans-serif;
  /*color: #686770;*/
  /*font-weight: bolder;*/
}

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
import ToolbarSeller from "~/components/ToolbarSeller";
import FooterBar from "~/components/FooterBar";
import axios from "@/con/config";

export default {
  components: {
    ToolbarSeller,
    FooterBar,
  },
  data() {
    return {
      clipped: true,
      drawer: true,
      fixed: false,
      right: false,
      rightDrawer: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.saveLocal()
    })
  },
  methods: {
    saveLocal() {
      let per = JSON.parse(localStorage.getItem("policy"))
      if(per) {
        this.$gates.setPermissions(per.permissions);
      }
      this.$gates.setRoles([this.$auth.user.roles.name]);
    },
    logout() {
      this.$auth.logout()
      localStorage.clear()
    }
  }
};
</script>
