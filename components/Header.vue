<template>
  <v-img :src="img === undefined?'/head.jpg':img" style="align-items: center; padding: 0" height="100%">
    <v-row style="margin: 12px">
      <p style="color: white; font-size: 25px;margin: 0; align-self: center; max-width: 750px; padding-left: 24px">
        {{ title }}</p>
      <p style="color: white; margin: 0; align-self: center; font-size: 25px" align="center">
        {{ detail === undefined ? '' : '(' + detail + ')' }}</p>
    </v-row>
  </v-img>
</template>
<script>
export default {
  props: {
    img: String,
    title: String,
    detail: String
  },
  data() {
    return {}
  }
}
</script>
