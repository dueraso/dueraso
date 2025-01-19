<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading" style="max-width: 1200px">
          <head-bar :title="headTitle"/>

          <v-img
            src="./all-apps.png"
            style="left: 2%; bottom: 10%; position: absolute;"/>

          <v-row class="m-0">
            <v-col cols="12" sm="3" v-for="(item, i) in items" :key="i" style="text-align: -webkit-center;">
              <v-card
                width="266" class="pt-2" style="text-align-last: left;border-radius: 15px"
                @click="$router.push({path:item.rout,meta:{title:'dddd'}})" :disabled="item.status">
                <v-card width="247" height="136" color="#6E4C2E" style="border-radius: 15px">
                  <v-col align="center" style="align-items: center" class="pt-8 pb-8">
                    <v-img :src="item.icon" width="73"/>
                  </v-col>
                </v-card>
                <h4 class="m-0 mt-3 pb-3 pl-3 pr-3">{{ item.title }}</h4>
              </v-card>
            </v-col>
          </v-row>

        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
.truncate {
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate1 {
  max-width: 25%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.my-large-input-field {
  font-size: 3em;
}
</style>
<script src="./index.js"/>
