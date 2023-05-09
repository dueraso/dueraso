<template>
  <v-overlay :value="loading">
    <v-progress-circular
      :size="100"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>

<script>
export default {
  data: () => ({
    loading: false
  }),
  methods: {
    start() {
      // console.log("load>>>")
      this.loading = true
    },
    finish() {
      // console.log("finish>>>")
      this.loading = false
    }
  }
}
</script>
