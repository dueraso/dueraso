<template>
  <v-row class="pa-3 m-0" style="align-items: center;">
    <v-btn rounded icon @click="$router.back()" class="mr-3" color="#A57156" dark v-show="back">
      <v-icon x-large>mdi-chevron-left</v-icon>
    </v-btn>
    <img style="height: 50px" src="/line.png" alt="line">
    <p class="pl-2 m-0" style="color: #5B4840; font-size: 32px; font-weight: 500">
      {{ title }}
    </p>
    <v-btn rounded @click="openItem()" class="ml-3" color="#B27D41" dark small v-show="callback"
           v-role:any.required.autofocus="'admin|super'">
      <!--           v-role-or-permission="`admin|${per}`">-->
      <!--           v-permission="'add'">-->
      <!--           v-role:all="'super_admin|writer'">-->
      <v-icon>mdi-plus</v-icon>
      เพิ่ม
    </v-btn>
    <slot></slot>
  </v-row>
</template>
<style>
.truncate {
  width: 200px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<script>
export default {
  props: {
    back: Boolean,
    callback: Function,
    title: String,
    per: String,
  },
  methods: {
    openItem() {
      !this.callback({})
    },
  },
  mounted() {
    // console.log(this.$auth.user.role)
    // this.$gates.setRoles(['writer','edit','delete','product', 'admin']);
    // this.$gates.setPermissions(['product', 'add']);
    // console.log(this.$gates.getPermissions())
  }
}
</script>
