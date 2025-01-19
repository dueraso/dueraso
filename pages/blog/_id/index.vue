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
          <img
            src="/forums.png"
            style="left: 2%; top: 30%; position: absolute;" alt="forums"/>
          <v-img :src="item.image_main" class="mb-4" max-height="539" contain/>
          <v-card style="border-radius: 15px" class="p-3">
            <p style="font-size: 30px; color: #B27D41" class="m-0">
              {{ item.title }}
            </p>
            <p class="mb-6">
              {{ convert.datetime(item.created_at, "DD/MM/YYYY") }}&nbsp;&nbsp;<v-icon>mdi-eye</v-icon>&nbsp;{{item.view}}&nbsp;views
            </p>
            <div v-if="item.detail" v-html="`${item.detail}`"></div>
          </v-card>
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
img{
  max-width: -webkit-fill-available;
}
</style>
<script src="./index.js"/>
