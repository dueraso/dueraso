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
          <v-row class="m-0">
            <v-col cols="12" class="p-0">
              <h2 align="left">
                | รวมแอปพลิเคชัน
              </h2>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card width="266" class="pt-2" style="text-align-last: left;border-radius: 15px" @click="$router.push('/pos')">
                <v-card width="247" height="136" color="#6E4C2E" style="border-radius: 15px">
                  <v-col align="center" style="align-items: center" class="pt-8 pb-8">
                    <v-img src="/icon1.png" width="73"></v-img>
                  </v-col>
                </v-card>
                <h4 class="m-0 mt-3 pb-3 pl-3 pr-3">แคชเชียร์</h4>
              </v-card>
            </v-col>
            <v-col cols="12" sm="3">
              <v-card width="266" class="pt-2" style="text-align-last: left;border-radius: 15px">
                <v-card width="247" height="136" color="#6E4C2E" style="border-radius: 15px">
                  <v-col align="center" style="align-items: center" class="pt-8 pb-8">
                    <v-img src="/icon2.png" width="73"></v-img>
                  </v-col>
                </v-card>
                <h4 class="m-0 mt-3 pb-3 pl-3 pr-3">จัดการหลังบ้าน</h4>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
        <!--        <p>รวมแอปพลิเคชัน</p>-->
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
