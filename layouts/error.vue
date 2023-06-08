<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-img src="/404.jpg" width="100%" v-if="error.statusCode === 404"/>
        <v-img src="/404.jpg" width="100%" v-else-if="error.statusCode === 403"/>
        <h1 v-else>
          {{ otherError }}
        </h1>
      </v-main>
    </v-app>
  </div>
</template>

<script>
export default {
  name: 'EmptyLayout',
  layout: 'auth-layout',
  props: {
    error: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      pageNotFound: '404 Not Found',
      otherError: 'An error occurred'
    }
  },
  mounted() {
    console.log(JSON.stringify(this.error))
  },
  head() {
    const title =
      this.error.statusCode === 404 ? this.pageNotFound : this.otherError
    return {
      title
    }
  }
}
</script>

<style scoped>
h1 {
  font-size: 20px;
}
</style>
