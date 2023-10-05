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
          <v-row class="m-0">
            <!--            <v-col>-->
            <v-card width="266" height="244" class="pt-2">
              <v-card width="247" height="158" color="#6E4C2E">
                <v-col align="center" style="align-items: center">

                <v-img src="/icon1.png" width="73"></v-img>
                </v-col>
              </v-card>
              <h2 class="m-0 mt-3">แคชเชียร์</h2>
            </v-card>
          </v-row>
        </v-container>
        <p>รวมแอปพลิเคชัน</p>
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
