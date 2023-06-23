<template>
  <v-app dark style="background-color: white;">
    <ToolbarPos/>
    <Nuxt/>
<!--    <FooterBar/>-->
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

export default {
  components: {
    ToolbarSeller, FooterBar
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
