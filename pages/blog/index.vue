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
              <v-text-field outlined dense label="ค้นหาบทความ" style="min-width: 250px; max-width: 300px; border-radius: 15px;" hide-details></v-text-field>

              <v-autocomplete
                outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data
                class="ml-2" hide-spin-buttons
                hide-selected return-object label="เลือกร้าน" dense item-text="name" item-value="id" hide-details
                style="border-radius: 15px; min-width: 250px; max-width: 300px"
              ></v-autocomplete>
            </v-row>
          </head-bar>
          <v-img src="./forums.png"
                 style="left: 2%; bottom: 10%; position: absolute;"></v-img>
          <v-row class="m-0">
            <!--            <v-col>-->
<!--            <v-card width="266" height="244" class="pt-2">-->
<!--              <v-card width="247" height="158" color="#6E4C2E">-->
<!--                <v-col align="center" style="align-items: center">-->

<!--                <v-img src="/icon1.png" width="73"></v-img>-->
<!--                </v-col>-->
<!--              </v-card>-->
<!--              <h2 class="m-0 mt-3">แคชเชียร์</h2>-->
<!--            </v-card>-->
          </v-row>
        <p>ไม่มีข้อมูล</p>
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
