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
          <Service/>
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
                <v-col :cols="height === 'xl'?2:3" v-for="item in 1" :key="item">
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
