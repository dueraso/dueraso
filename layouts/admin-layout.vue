<template>
  <v-app dark>
    <v-navigation-drawer
      v-model="drawer"
      :mini-variant="miniVariant"
      :clipped="clipped"
      fixed
      app
      dark
      style="
        background: linear-gradient(rgba(86, 97, 177, 1), rgba(30, 197, 169, 1)),
          center center / cover no-repeat;">
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title"/>
          </v-list-item-content>
        </v-list-item>
      </v-list>
      <template v-slot:append>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-action>
              <v-icon>mdi-location-exit</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="'ออกจากระบบ'"/>
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-app-bar :clipped-left="clipped" fixed app color="#5561B0">
      <v-app-bar-nav-icon @click.stop="drawer = !drawer" dark/>
      <v-toolbar-title style="color: white" v-text="title"></v-toolbar-title>
      <v-spacer/>
      <v-icon dark>mdi-account-circle-outline</v-icon>
      <p style="margin-bottom: 0px; color: white; margin-left: 12px">
        ยินดีต้อนรับ, {{ name }}
      </p>
    </v-app-bar>
    <v-main>
      <!--      <v-container style="padding: 0">-->
      <Nuxt/>
      <!--      </v-container>-->
    </v-main>
  </v-app>
</template>
<script>
import Footer from "~/components/FooterBar";
import Navigation from "~/components/NavigationDrawer";
import Toolbar from "~/components/Toolbar";

export default {
  components: {Footer, Navigation, Toolbar},
  data() {
    return {
      clipped: true,
      fixed: true,
      miniVariant: false,
      drawer: false,
      name: "",
      title: "TouristSpot",
      items: [
        {
          icon: "mdi-map-marker-radius-outline",
          title: "ข้อมูลสถานที่",
          to: "/",
        },
        {
          icon: "mdi-account-group-outline",
          title: "ผู้ใช้งานในระบบ",
          to: "/manage",
        },
        {
          icon: "mdi-account-outline",
          title: "ข้อมูลส่วนตัว",
          to: "/profile",
        },
      ],
    };
  },
  mounted() {
    // if(this.$auth.user.roles >= 2){
    // this.items = this.items.filter((d)=>d.title !== 'รายงานระบบ')
    this.items = this.items.filter((d) => d.title !== "ผู้ใช้งานในระบบ");
    // }
    // this.name = this.$auth.user.first_name;
    // console.log(this.$auth.user.name )
  },
  methods: {
    async logout() {
      await this.$auth.logout();
      await this.$router.push("/login");
    },
  },
};
</script>
