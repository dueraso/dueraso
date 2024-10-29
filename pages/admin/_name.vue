<script>
export default {
  layout: 'admin-layout',

  data() {
    return {
      headTitle: "จัดการรายการรายรับ-จ่าย",
      loading: false
    }
  }
}
</script>

<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar :title="headTitle" per="add.add-budget">
          </head-bar>
          <v-col>
            <p>{{$route.params.name}}</p>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<style scoped>

</style>
