<template>
  <v-app dark style="background-color: #F3F1ED;">
    <navigation-drawer v-model="drawer" :modules="modules" v-if="!this.dialog"/>

    <v-app-bar :clipped-left="clipped" fixed app class="pl-1 pr-1">
      <!-- Top navigation -->
      <div class="topnav" style="width: 100%">

        <!-- Centered link -->
        <div class="topnav-centered">
          <strong class="m-0 pl-4 pr-4 custom-secondary" style="font-size: 35px;">
            DUERASO
          </strong>
          <pre class="m-0 pl-4" style="font-size: 10px; color: green">
            Premium
          </pre>
          <!--            <p>FREE</p>-->
          <!--          <v-chip-->
          <!--            class="ma-2 justify-center h1 test"-->
          <!--            color="success"-->
          <!--            outlined-->
          <!--            style="position: absolute;"-->
          <!--          >-->
          <!--            <v-icon left>-->
          <!--              mdi-vector-link-->
          <!--            </v-icon>-->
          <!--&lt;!&ndash;          <p>&ndash;&gt;-->
          <!--            Premium-->
          <!--&lt;!&ndash;          </p>&ndash;&gt;-->
          <!--          </v-chip>-->
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
              กลับหน้าแอพ
            </v-btn>
            <v-btn class="custom-primary mt-1" rounded @click="logout">ออกจากระบบ</v-btn>
          </v-row>
        </div>
      </div>
      <dialog-mid v-model="dialog" title="แจ้งเตือน">

      </dialog-mid>
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
import ToolbarSeller from "~/components/ToolbarSeller";
import FooterBar from "~/components/FooterBar";
import axios from "@/con/config";
import convert from "@/plugins/convert";

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
      dialog: false,
      rightDrawer: false,
      modules: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.saveLocal()

      if (/*this.$auth.user.roles.group === "*" || */this.$auth.user.roles.group === "admin") {
        console.log(this.$auth.user)
        if (this.$auth.user.status == 1) {
          this.$nuxt.$loading.start()
          this.getModule()
        }else this.dialog = true
      } else {
        if (localStorage.getItem("policy") === "null") return
        this.modules = convert.groupChildren(JSON.parse(localStorage.getItem("policy")).titleBar)
      }
    })
  },
  methods: {
    async getModule() {
      await this.$axios.get("module", {
        params: {
          per: 30
        }
      }).then((res) => {
        this.modules = convert.groupChildren(res.data.data)
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e)
      })
    },
    saveLocal() {
      let per = JSON.parse(localStorage.getItem("policy"))
      if (per) {
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
