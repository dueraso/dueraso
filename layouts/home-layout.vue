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
    check() {
      if (this.$auth.user.ngx_permissions.indexOf('booking.super_admin') !== -1) {
        return 'super_admin'
      } else if (this.$auth.user.ngx_permissions.indexOf('booking.admin') !== -1) {
        return 'admin'
      } else if (this.$auth.user.ngx_permissions.indexOf('booking.library') !== -1) {
        return 'library'
      } else {
        return 'user'
      }
    }
  },
};
</script>
