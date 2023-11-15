<template>
  <v-row class="pa-3 m-0" style="align-items: center;">
    <h2 align="left" class="m-0" style="color: #5B4840">
      <img style="height: 50px" src="/line.png" alt="line"> {{ title }}
    </h2>
    <v-btn rounded @click="openItem()" class="ml-3" color="#B27D41" dark small v-show="callback" v-permission="'add'">
<!--           v-role:all="'super_admin|writer'">-->
      <v-icon>mdi-plus</v-icon>
      เพิ่ม
    </v-btn>
    <slot></slot>
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
  },
  mounted() {
    // console.log(this.$auth.user.role)
    this.$gates.setRoles(['writer','edit','delete','product', 'admin']);
    this.$gates.setPermissions(['product', 'add']);
    console.log(this.$gates.getPermissions())
  }
}
</script>
