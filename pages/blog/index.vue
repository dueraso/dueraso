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
          <head-bar :title="headTitle">
            <v-row class="m-0" style="justify-content: right;">
              <v-text-field
                outlined dense label="ค้นหาบทความ"
                style="min-width: 250px; max-width: 300px; border-radius: 15px;"
                hide-details/>

              <v-autocomplete
                outlined required :rules="rules" :items="sort" v-model="sortItems" hide-no-data
                class="ml-2" hide-spin-buttons
                hide-selected return-object label="เรียงตามวันที่ล่าสุด" dense item-text="name" item-value="id"
                hide-details
                style="border-radius: 15px; min-width: 250px; max-width: 300px"
              ></v-autocomplete>
            </v-row>
          </head-bar>
          <v-img
            src="./forums.png"
            style="left: 2%; bottom: 10%; position: absolute;"/>
          <v-row class="m-0">

            <v-col md="3" :cols="12" v-for="(item, i) in desserts.data" :key="i" v-if="desserts.data.length > 0">
              <v-card style="border-radius: 15px; text-align: -webkit-center; padding: 10px">
                <v-img :src="item.image_main" max-height="220"/>
                <v-card-title class="text-left p-0" style="color: #B27D41">
                  <nuxt-link :to="`/blog/${item.id}`" style="color: #B27D41">
                    {{ item.title }}
                  </nuxt-link>
                </v-card-title>
                <v-card-text class="text-left px-0 pb-0">
                  <v-card-text class="mx-0 px-0">
                    {{ item.detail_short }}
                  </v-card-text>
                  <v-card-subtitle class="row m-0 p-0">
                    <v-col class="m-0 p-0 text-left align-content-center">
                      <v-icon>mdi-eye</v-icon>
                      {{ item.view }}&nbsp;views
                    </v-col>
                    <v-col class="m-0 p-0 text-right align-content-center">
                      {{ convert.datetime(item.created_at, "DD/MM/YYYY") }}
                    </v-col>
                  </v-card-subtitle>
                </v-card-text>
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

a:hover {
  text-decoration: none;
}
</style>
<script src="./index.js"/>
