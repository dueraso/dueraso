<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="error.statusCode === 403" class="text-wrapper fill-height">
          <AccessdDenied/>
        </div>
        <v-img src="/404.jpg" width="100%" v-else-if="error.statusCode === 404"/>
        <div v-else class="text-wrapper fill-height">
          <OtherError :error="error" :other-error="otherError"/>
        </div>
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
      otherError: 'เกิดข้อผิดพลาดบ้างอย่าง'
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

.text-wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
