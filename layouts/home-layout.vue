<template>
  <v-app dark>
    <Toolbar class="d-none d-lg-flex"/>
    <ToolbarMainMobile class="d-flex d-lg-none position-fixed"/>
    <nuxt/>
    <v-footer>
      <Footer/>
    </v-footer>
  </v-app>
</template>
<script>
import Toolbar from "~/components/Toolbar-home.vue";
import Footer from "~/components/Footer";
import ToolbarMainMobile from "@/components/Toolbar-main-mobile.vue";

export default {
  components: {
    ToolbarMainMobile,
    Toolbar,
    Footer
  },
  data() {
    return {
      expandOnHover: false,
    };
  },
  created() {
    if (!this.$auth.loggedIn) return
  },
  methods: {
    async getModule() {
      await this.$axios.get(`/module`).then((res) => {
        this.modules = res.data
      }).catch((error) => {
        console.log(error)
      })
    },
  },
};
</script>
