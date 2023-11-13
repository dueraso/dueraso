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
          <v-col>
            <v-row class="m-0">
              <!--            <v-col>-->
              <!--              <v-card width="266" height="244" class="pt-2">-->
              <!--                <v-card width="247" height="158" color="#6E4C2E">-->
              <!--                  <v-col align="center" style="align-items: center">-->
              <!--                    <v-img src="/icon1.png" width="73"></v-img>-->
              <!--                  </v-col>-->
              <!--                </v-card>-->
              <!--                <h2 class="m-0 mt-3">แคชเชียร์</h2>-->
              <!--              </v-card>-->
              <div class="Group225" style="width: 390px; height: 793px; position: relative">
                <v-card
                  style="width: 390px; height: 726px; top: 67px; position: absolute; border-radius: 15px">

                  <h4 style="color: #5C3D8D; font-weight: 700; padding-top: 90px">
                    แพ็คเกจระดับสูง
                  </h4>
                </v-card>
                <div class="24201T" style="width: 329px; height: 307px; left: 33px; top: 296px; position: absolute">
                  <div
                    style="left: 0px; top: 0px; position: absolute; color: #846537; font-size: 23px; font-family: Athiti; font-weight: 500; word-wrap: break-word">
                    - ระบบแคชเชียร์
                  </div>
                  <div
                    style="left: 0px; top: 45px; position: absolute; color: #846537; font-size: 23px; font-family: Athiti; font-weight: 500; word-wrap: break-word">
                    - ระบบจัดการร้านค้าหลังบ้าน
                  </div>
                  <div
                    style="left: 0px; top: 90px; position: absolute; color: #846537; font-size: 23px; font-family: Athiti; font-weight: 500; word-wrap: break-word">
                    - ระบบจัดการสาขา
                  </div>
                  <div
                    style="left: 0px; top: 135px; position: absolute; color: #846537; font-size: 23px; font-family: Athiti; font-weight: 500; word-wrap: break-word">
                    - ระบบจัดการหลังบ้านแบบเต็มรูปแบบ
                  </div>
                  <div class="24"
                       style="left: 0px; top: 180px; position: absolute; color: #846537; font-size: 23px; font-family: Athiti; font-weight: 500; word-wrap: break-word">
                    - ติดต่อผู้ดูแลระบบ 24 ชม.
                  </div>
                  <div class="20"
                       style="left: 0px; top: 225px; position: absolute; color: #846537; font-size: 23px; font-family: Athiti; font-weight: 500; word-wrap: break-word">
                    - ใช้ได้ 20 ผู้ใช้งานในระบบ
                  </div>
                  <div class="1T"
                       style="left: 0px; top: 270px; position: absolute; color: #846537; font-size: 23px; font-family: Athiti; font-weight: 500; word-wrap: break-word">
                    - พื้นที่เก็บข้อมูล 1 T
                  </div>
                </div>
                <div
                  style="width: 134px; height: 134px; left: 33%; position: absolute; background: #906EC5; border-radius: 100px">
                  <v-icon size="87" dark>mdi-storefront-outline</v-icon>
                </div>
                <div class="Group228" style="width: 345px; height: 118px; left: 33px; top: 646px; position: absolute">
                  <div class="199"
                       style="left: 0px; top: 0px; position: absolute; color: #E8BD14; font-size: 60px; font-family: Athiti; font-weight: 700; word-wrap: break-word">
                    1,199 บาท
                  </div>
                  <div
                    style="left: 257px; top: 30px; position: absolute; color: #E8BD14; font-size: 30px; font-family: Athiti; font-weight: 700; word-wrap: break-word">
                    / เดือน
                  </div>
                  <div class="13000"
                       style="left: 0px; top: 78px; position: absolute; color: #B27D41; font-size: 25px; font-family: Athiti; font-weight: 700; word-wrap: break-word">
                    พิเศษ 13,000 บาทต่อปี
                  </div>
                </div>
                <div class="5" style="width: 274px; height: 67px; left: 58.59px; top: 197px; position: absolute">
                  <div
                    style="left: 0px; top: 0px; position: absolute; color: #686868; font-size: 23px; font-family: Athiti; font-weight: 400; word-wrap: break-word">
                    เหมาะสำหรับร้านค้าที่มีแฟรนไชส์
                  </div>
                  <div class="5"
                       style="left: 23.69px; top: 30px; position: absolute; color: #686868; font-size: 23px; font-family: Athiti; font-weight: 400; word-wrap: break-word">
                    หรือมีสาขามากกว่า 5 สาขา
                  </div>
                </div>
              </div>
            </v-row>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
</style>
<script src="./index.js"/>
