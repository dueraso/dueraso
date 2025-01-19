<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <div v-if="!loading">
          <v-carousel cycle height="765" hide-delimiter-background show-arrows-on-hover>
            <NuxtLink :href="item.route" :target="item.target"
               v-for="(item,i) in items"
               :key="i" :to="item.route">
              <v-carousel-item
                :src="item.src"
                reverse-transition="fade-transition"
              ></v-carousel-item>
            </NuxtLink>
          </v-carousel>
          <div style="background-color: #F3F1ED">
            <v-img src="./dueraso.png" style="left: 2%; position: absolute;"></v-img>
            <v-container>
              <v-row class="align-items-center m-0">
                <svg xmlns="http://www.w3.org/2000/svg" width="6" height="115" viewBox="0 0 6 115" fill="none">
                  <path d="M6 0H0V115H6V0Z" fill="#B27D41"/>
                </svg>
                <v-col>
                  <h2 class="pl-2" style="color: #B27D41; font-weight: 700;">Dueraso POS</h2>
                  <p class="pl-2 m-0" style="font-weight: 400; font-size: 23px">
                    ระบบบริหารจัดการร้านค้ารวมทุกฟีเจอร์ที่จำเป็นไว้ในระบบเดียว</p>
                </v-col>
              </v-row>
              <v-row class="m-0" style="padding-top: 70px;">
                <v-col cols="12" md="2" class="p-2 mt-12" v-for="(item,i) in 7" :key="i">
                  <!--          <v-card style="border-radius: 15px" class="p-4 my-2">-->
                  <!--            <v-card-->
                  <!--              style="left: 30%; top: -20%; position: absolute; background: #6E4C2E; border-radius: 100%;" width="100px"-->
                  <!--              class="p-3">-->
                  <!--              <v-img width="70" class="m-1" src="./icon2.png" style="border-radius: unset"></v-img>-->
                  <!--            </v-card>-->
                  <!--            <v-card-title style="color: #A44E1C; padding-top: 40px" class="px-0">-->
                  <!--              จัดการง่าย <br>-->
                  <!--              ทุกยอดขายและเมนู-->
                  <!--            </v-card-title>-->
                  <!--            <v-card-text style="color: #686868;" class="px-0">-->
                  <!--              ค้นหา และจัดการเมนูได้ไว<br>-->
                  <!--              เปิดโต๊ะปิดบิล<br>-->
                  <!--              บันทึกยอดการขายรายวัน<br>-->
                  <!--              ใช้งานสะดวกหน้าตาดูง่าย-->
                  <!--            </v-card-text>-->
                  <!--          </v-card>-->


                  <v-card style="border-radius: 15px; height: 100%;" class="p-3">
                    <v-card color="#70B183" style="border-radius: 100px; justify-self: center;" class="icon">
                      <!--              <v-icon size="50" dark class="m-5">mdi-storefront-outline</v-icon>-->
                      <v-img max-width="50" class="m-1" src="./icon2.png" style="border-radius: unset"></v-img>
                    </v-card>

                    <v-card-title style="color: #A44E1C; padding-top: 40px" class="px-0">
                      จัดการง่าย ทุกยอดขายและเมนู
                    </v-card-title>
                    <v-card-text style="color: #686868;" class="px-0">
                      ค้นหา และจัดการเมนูได้ไว<br>
                      เปิดโต๊ะปิดบิล<br>
                      บันทึกยอดการขายรายวัน<br>
                      ใช้งานสะดวกหน้าตาดูง่าย
                    </v-card-text>
                    <!--            <p style="font-size: 24px; color: #70B183; font-weight: 700; padding-top: 35px" class="mb-3 text-center">-->
                    <!--              แพ็คเกจระดับทดลองใช้-->
                    <!--            </p>-->
                    <!--            <h5 style="color: #686868; font-weight: 400;">-->
                    <!--              เหมาะสำหรับร้านค้าเดี่ยว และ-->
                    <!--            </h5>-->
                    <!--            <h5 style="color: #686868; font-weight: 400;" class="mb-7">-->
                    <!--              ผู้ที่พึ่งเริ่มใช้งานระบบ-->
                    <!--            </h5>-->
                    <!--            <h2 class="text-left" style="color: #846537; font-weight: 700;">-->
                    <!--              <s style="color: gray; font-size: 20px">฿199.-</s>-->
                    <!--              ฿99.- -->
                    <!--            </h2>-->
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </div>
          <Partner/>

          <v-col style="background-color: #F3F1ED">
            <v-img src="./forums.png" style="right: -5%; bottom: 5%; position: absolute;"></v-img>
            <v-container>
              <v-row class="m-0">
                <v-col cols="12">
                  <v-row class="justify-content-end m-0">
                    <img style="height: 50px" src="/line.png" alt="line">
                    <h2 class="m-0 pl-2 align-content-center">
                      บทความล่าสุด
                    </h2>
                    <v-spacer/>
                    <v-btn outlined color="#B27D41" rounded to="/blog" style="">
                      ดูบทความอื่นๆ
                      <v-icon>mdi-chevron-right</v-icon>
                    </v-btn>
                  </v-row>
                </v-col>
                <v-col md="3" cols="12" v-for="item in 1" :key="item">
                  <v-card style="border-radius: 15px; text-align: -webkit-center; padding: 10px">
                    <v-img src="./img.png" style=""/>
                    <v-card-title class="text-left p-0 pt-2" style="color: #B27D41">
                      POS101 สิ่งทีควรรู้ก่อนตัดสินใจ
                      เลือกใช้ “เครื่อง POS”
                    </v-card-title>
                    <v-card-text class="text-left px-0 py-3">
                      ระบบ POS หรือ เครื่อง POS ในปัจจุบัน
                      มีหลากหลายแบบให้เลือกแล้วเรา
                      จะเลือกแบบไหน เพื่อให้เหมาะสม
                      กับธุรกิจของเรา? บทความนี้ มีคำตอบ
                    </v-card-text>
                  </v-card>
                </v-col>
              </v-row>
            </v-container>
          </v-col>
        </div>
      </v-main>
    </v-app>
  </div>
</template>
<style lang="scss">
.truncate {
  max-width: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.primary {
  color: #B27D41;
}

a:hover {
  text-decoration: none;
}
</style>
<script src="./index.js"/>
