<template>
  <v-overlay :value="overlay">
    <v-progress-circular
      :size="100"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>
<script>
import serve from "../../api/server";

export default {
  layout: 'auth-layout',
  data() {
    return {
      overlay: true,
      error: null,
    };
  },
  mounted() {
    if (this.$route.query.code) {
      this.Login();
    } else {
      this.Logout()
    }
  },
  methods: {
    async Logout() {
      await this.$auth.logout()
      await this.$router.push('/')
      // await this.$router.push('/login')
    },
    async Login() {
      const payload = {
        data: {
          grant_type: "authorization_code",
          client_id: serve.clientId,
          client_secret: serve.clientSecret,
          redirect_uri: serve.redirectUri,
          code: this.$route.query.code,
          headers: {
            Accept: "application/json",
          },
        },
      };
      await this.$auth.loginWith("local", payload)
      // this.$nuxt.$emit('loadModules')
      // this.$nuxt.$on('eventName', ($event) => this.pendingTotal = $event)
      // this.$router.push('/')
    },
  },
};
</script>
