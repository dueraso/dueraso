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
          <v-img src="./contact-us.png"
                 style="left: 2%; bottom: 10%; position: absolute;"></v-img>
          <v-row justify="center">
            <v-col cols="12" sm="6" align="center">
              <v-card style="border-radius: 15px" class="p-3">
                <v-row class="m-0 pb-6">
                  <v-row class="m-0">
                    <v-icon class="mr-1">mdi-phone-outline</v-icon>
                    <h6 class="m-0">-</h6>
                  </v-row>
                  <v-row class="m-0">
                    <img src="/line-icon.svg" class="mr-1"/>
                    <h6 class="m-0">-</h6>
                  </v-row>
                </v-row>
                <v-row class="m-0">
                  <v-row class="m-0 pb-6">
                    <v-icon class="mr-1">mdi-email-outline</v-icon>
                    <h6 class="m-0">info@dueraso.com</h6>
                  </v-row>
                  <v-row class="m-0 pb-6">
                    <v-icon class="mr-1">mdi-clock-time-three-outline</v-icon>
                    <h6 class="m-0">08:00 - 18:00 น.</h6>
                  </v-row>
                  <v-row class="m-0">
                    <v-icon class="mr-1">mdi-map-check-outline</v-icon>
                    <h6 class="m-0">ที่อยู่ 999/01 ซ.ชื่อซอย หมู่ 1 ถ.ชื่อถนน ชื่อเขต
                      ชื่อแขวง ชื่อจังหวัด 10999</h6>
                  </v-row>
                </v-row>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" align="center" style="align-self: center">
              <v-card style="border-radius: 15px" class="p-3">
                <h3 style="color: #846537; font-weight: 600" class="pb-4">แบบฟอร์มติดต่อ</h3>
                <v-text-field label="ชื่อ-นามสกุล ผู้ติดต่อ*" outlined style="border-radius: 15px" dense></v-text-field>
                <v-row class="p-0">
                  <v-col class="m-0">
                    <v-text-field label="เบอร์โทรศัพท์" outlined style="border-radius: 15px" dense></v-text-field>
                  </v-col>
                  <v-col class="m-0">
                    <v-text-field label="อีเมล" outlined style="border-radius: 15px" dense></v-text-field>
                  </v-col>
                </v-row>
                <v-text-field label="สนใจติดต่อเรื่อง" outlined style="border-radius: 15px" dense></v-text-field>
                <v-textarea label="รายละเอียด" outlined style="border-radius: 15px"></v-textarea>
                <v-btn block color="#B27D41" rounded dark style="font-weight: 600">ส่ง</v-btn>
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
