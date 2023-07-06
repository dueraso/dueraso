<template>
  <v-row class="pa-3 mt-1" style="background: #eef7f6">
    <h5 class="mb-0 ml-4" style="color: #54b6c8; align-self: center">
      {{ title }}
    </h5>
    <v-spacer/>
    <v-btn outlined @click="openItem()" class="mr-3">
      <v-icon>mdi-plus</v-icon>
      เพิ่ม
    </v-btn>
  </v-row>
</template>
<script>
export default {
  props: {
    callback: Function,
    title: String,
  },
  methods: {
    openItem() {
      !this.callback({})
    }
  }
}
</script>
