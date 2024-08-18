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
              <v-text-field outlined dense label="ค้นหาบทความ"
                            style="min-width: 250px; max-width: 300px; border-radius: 15px;" hide-details
                            prepend-inner-icon="mdi-magnify"/>
            </v-row>
          </head-bar>
          <v-row class="m-2">
            <v-col>
              <template>
                <v-row justify="center">
                  <!--                <v-expansion-panels class="custom-expansion">-->
                  <!--                  <v-expansion-panel-->
                  <!--                    v-for="(item,i) in 5"-->
                  <!--                    :key="i"-->
                  <!--                    style="overflow-y: hidden; background: unset;" class="test"-->
                  <!--                  >-->
                  <!--                    <v-expansion-panel-header class="pb-0 test">ระบบ DUERASO สามาถใช้งานได้กับอะไรบ้าง?</v-expansion-panel-header>-->
                  <!--                    <v-expansion-panel-content class="pt-3 ml-3 white text-left test" style="border-radius: 15px">-->
                  <!--                      ปัจจุบันสามารถใช้งานได้บนเครื่อง PC เท่านั้น-->
                  <!--                    </v-expansion-panel-content>-->
                  <!--                  </v-expansion-panel>-->
                  <!--                </v-expansion-panels>-->

                  <v-expansion-panels>
                    <v-expansion-panel
                      elevation="10"
                      style="background: unset; overflow: hidden;"
                      v-for="(item, i) in 5"
                      :key="i"
                    >
                      <v-expansion-panel-header class="pl-0" style="color: #B27D41; font-weight: 500; font-size: 18px">
                        <v-img src="./question_mark.png" max-width="30px" class="m-1"/>
                        ระบบ DUERASO สามารถใช้งานได้กับอะไรบ้าง?
                      </v-expansion-panel-header>
                      <v-expansion-panel-content class="pt-3 ml-3 mr-4 white text-left" style="border-radius: 15px; color: #5B4840">
                        สามารถใช้งานแบบฟรีได้ในส่วนของแคชเชียร์เป็นหลักแต่ปิดการใช้งานระบบหลัก เช่น จัดการร้าน จัดการสาขา  และการจัดการหลังบ้านทั้งหมดเอาไว้สามารถใช้งานแบบฟรีได้ในส่วนของแคชเชียร์เป็นหลักแต่ปิดการใช้งานระบบหลัก เช่น จัดการร้าน จัดการสาขา  และการจัดการหลังบ้านทั้งหมดเอาไว้                      </v-expansion-panel-content>
                    </v-expansion-panel>
                  </v-expansion-panels>
                </v-row>
              </template>
            </v-col>
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
        </v-container>
        <p>ไม่มีข้อมูล</p>
      </v-main>
    </v-app>
  </div>
</template>
<style>
.test {
  border: none;
  text-decoration: none;
}

.v-expansion-panel-content__wrap {
  border: none;
}

.v-expansion-panel-header {
  border-bottom: none;
  text-decoration: none;
}

.v-expansion-panel {
  box-shadow: none;
  border: none;
}
</style>
<script src="./index.js"/>
