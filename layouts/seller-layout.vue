<template>
  <v-app dark style="background-color: white;">
<!--    <v-main style="background-color: white; " class="pt-0 pb-0">-->
<!--      <v-container style="max-width: 1140px;">-->
<!--        <v-row style="border-radius: 10px" class="m-0 pr-2 pl-2 pb-0 pt-0">-->
<!--          <b-img src="/logo-new copy.png" target="nav-collapse" style="max-width: 80px; max-height: 80px" class="p-2"/>-->
<!--          <v-col>-->
<!--            <p class="m-0 text-h6">{{ $i18n.t("header").title }}</p>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--      </v-container>-->
<!--    </v-main>-->
<!--    <NavigationDrawer/>-->
    <ToolbarSeller/>
<!--    <LangBar/>-->
    <Nuxt/>
    <FooterBar/>
  </v-app>
</template>
<style>
@import url('https://fonts.googleapis.com/css2?family=Sarabun&display=swap');

* {
  font-family: "Sarabun", sans-serif;
  /*color: #686770;*/
  /*font-weight: bolder;*/
}

.v-input .v-label {
  line-height: 25px;
  height: 25px;
}
</style>
<script>
import ToolbarSeller from "~/components/ToolbarSeller";
import FooterBar from "~/components/FooterBar";
import axios from "~/api/config";
import NavigationDrawer from "@/components/NavigationDrawer.vue";

export default {
  components: {
    ToolbarSeller,
    FooterBar,
    NavigationDrawer,
  },
  data() {
    return {
      expandOnHover: false,
      modules: []
    };
  },
  mounted() {
    // this.getModule()
  },
  methods: {
    async getModule() {
      await axios.get(`module`).then((res) => {
        this.modules = res.data
      }).catch((error) => {
        console.log(error)
      })
    },
  },
};
</script>
