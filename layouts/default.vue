<template>
  <v-app dark>
    <Toolbar/>
    <nuxt/>
    <v-footer app>
      <Footer/>
    </v-footer>
  </v-app>
</template>
<script>
import Toolbar from "~/components/Toolbar";
import Footer from "~/components/Footer";
import axios from "~/api/config";
// import login from "../pages/login";

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
    // this.$nuxt.$emit('adduser')
    // this.$nuxt.$on('loadModules', () => this.getModule())
    // this.getModule()
  },
  methods: {
    checkLogin() {
      this.$nextTick(() => {
        return this.$auth.loggedIn
      })
    },
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
