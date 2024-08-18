<template>
  <div id="app">
    <v-app style="
        background-color: #f3f1ed;
        background-size: cover;
        background-repeat: no-repeat;
      "
    >
      <v-row justify="center" class="text-center">
        <v-card
          class="my-auto p-3"
          max-width="544"
          min-width="544"
          style="border-radius: 15px"
        >
          <v-card-text>
            <h4>
              ตรวจสอบอีเมลของคุณ
            </h4>
            <p class="align-items-center" style="font-size: 16px">
              เราได้ส่งอีเมลยืนยันไปที่ arthit.d@yru.ac.th ป้อน OTP 6 หลักเพื่อยินยัน
            </p>

            <div class="p-3">
              <div class="ma-auto position-relative" style="max-width: 300px">
                <v-otp-input
                  v-model="otp"
                  :disabled="loading"
                  @finish="onFinish"
                ></v-otp-input>
                <v-overlay absolute :value="loading">
                  <v-progress-circular
                    indeterminate
                    color="primary"
                  ></v-progress-circular>
                </v-overlay>
              </div>

              <v-snackbar
                v-model="snackbar"
                :color="snackbarColor"
                :timeout="2000"
              >
                {{ text }}
              </v-snackbar>
            </div>
            <p style="font-size: 16px" class="m-0">
              ไม่ได้รับ OTP?
              <a class="bold" style="color: #6e4c2e">ส่งซ้ำ</a>
            </p>
          </v-card-text>
          </v-card>
      </v-row>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
