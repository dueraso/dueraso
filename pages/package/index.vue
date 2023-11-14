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
          <v-img src="./package.png"
                 style="left: 2%; bottom: 10%; position: absolute;"></v-img>
            <v-row class="m-0">
              <v-card
                style="width: 320px; top: 67px; border-radius: 15px" class="p-4 m-2">
                <v-card
                  style="left: 30%; top: -15%; position: absolute; background: #70B183; border-radius: 100px"
                  class="p-3">
                  <v-icon size="87" dark>mdi-storefront-outline</v-icon>
                </v-card>
                <h4 style="color: #70B183; font-weight: 700; padding-top: 70px" class="mb-3">
                  แพ็คเกจระดับทดลองใช้
                </h4>
                <h5 style="color: #686868; font-weight: 400;">
                  เหมาะสำหรับร้านค้าเดี่ยว และ
                </h5>
                <h5 style="color: #686868; font-weight: 400;" class="mb-7">
                  ผู้ที่พึ่งเริ่มใช้งานระบบ
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ระบบแคชเชียร์
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ระบบจัดการร้านค้าหลังบ้าน
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ใช้ได้ 5 ผู้ใช้งานในระบบ
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left pb-6">
                  - พื้นที่เก็บข้อมูล 10 G
                </h5>
                <h2 style="color: #846537; font-weight: 700;" class="text-left">
                  ฟรี
                </h2>
              </v-card>
              <v-card
                style="width: 320px; top: 67px; border-radius: 15px" class="p-4 m-2">
                <v-card
                  style="left: 30%; top: -15%; position: absolute; background: #48B4E3; border-radius: 100px"
                  class="p-3">
                  <v-icon size="87" dark>mdi-home-assistant</v-icon>
                </v-card>
                <h4 style="color: #195A77; font-weight: 700; padding-top: 70px" class="mb-3">
                  แพ็คเกจทั่วไป
                </h4>
                <h5 style="color: #686868; font-weight: 400;">
                  เหมาะสำหรับร้านค้าเดี่ยว และ
                </h5>
                <h5 style="color: #686868; font-weight: 400;" class="mb-7">
                  ผู้ที่พึ่งเริ่มใช้งานระบบ
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ระบบแคชเชียร์
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ระบบจัดการร้านค้าหลังบ้าน
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ใช้ได้ 5 ผู้ใช้งานในระบบ
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left pb-6">
                  - พื้นที่เก็บข้อมูล 10 G
                </h5>
                <h2 style="color: #846537; font-weight: 700;" class="text-left">
                  ติดต่อเจ้าหน้าที่
                </h2>
              </v-card>
              <v-card
                style="width: 320px; top: 67px; border-radius: 15px" class="p-4 m-2">
                <v-card
                  style="left: 30%; top: -15%; position: absolute; background: #906EC5; border-radius: 100px"
                  class="p-3">
                  <v-icon size="87" dark>mdi-home-city-outline</v-icon>
                </v-card>
                <h4 style="color: #5C3D8D; font-weight: 700; padding-top: 70px" class="mb-3">
                  แพ็คเกจระดับสูง
                </h4>
                <h5 style="color: #686868; font-weight: 400;" class="mb-7">
                  เหมาะสำหรับร้านค้าที่ต้องการแยกใช้งานเป็นของส่วนตัว
                </h5>

                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ระบบแคชเชียร์
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ระบบจัดการร้านค้าหลังบ้าน
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left">
                  - ใช้ได้ 5 ผู้ใช้งานในระบบ
                </h5>
                <h5 style="color: #846537; font-weight: 500;" class="text-left pb-6">
                  - พื้นที่เก็บข้อมูล 10 G
                </h5>
                <h2 style="color: #846537; font-weight: 700;" class="text-left">
                  ติดต่อเจ้าหน้าที่
                </h2>
              </v-card>
            </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
</style>
<script src="./index.js"/>
