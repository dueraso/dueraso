<template>
  <v-app dark>
    <Toolbar/>
    <nuxt/>
    <v-footer>
      <Footer/>
    </v-footer>
  </v-app>
</template>
<script>
import Toolbar from "~/components/Toolbar-home.vue";
import Footer from "~/components/Footer";

export default {
  components: {
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
