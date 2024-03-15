<template>
  <div id="app">
    <v-app
      style="background-color: #F3F1ED;background-size: cover;background-repeat: no-repeat;">
      <v-row justify="center">
        <v-img src="./login.png"
               style="width: 855.27px; height: 187.52px; right: 0%; bottom: 0%; position: absolute;"></v-img>
        <v-col cols="12" sm="6" align="center" style="align-self: center">
          <h1 style="font-weight: bold; font-size: 60px; color: #A44E1C" class="m-0">DUERASO</h1>
          <p style="font-size: 40px;color: #6E4C2E; font-weight: lighter">ยินดีต้อนรับ</p>
          <v-img src="./image1.png" width="812"/>
        </v-col>
        <v-col cols="12" sm="6" align="center" align-self="center">
          <v-card elevation="4" light tag="section" style="border-radius: 15px" width="611px">
            <v-card-text>
              <v-col align="left" class="pl-8 pr-8">
                <h3 style="font-size: 50px; font-weight: bold; color: #846537" class="">REGISTER</h3>
                <h5 style="color: #846537" class="mb-7">ลงทะเบียน</h5>
                <v-form ref="form" v-model="valid" lazy-validation class="pb-4">
                  <v-row>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        v-model="userName"
                        label="ชื่อ"
                        required
                        color="#B27D41"
                        style="border-radius: 15px;"
                        prepend-inner-icon="mdi-email-outline"
                      ></v-text-field>
                    </v-col>
                    <v-col>
                      <v-text-field
                        outlined
                        dense
                        v-model="userName"
                        label="นามสกุล"
                        required
                        color="#B27D41"
                        style="border-radius: 15px;"
                        prepend-inner-icon="mdi-email-outline"
                      ></v-text-field>
                    </v-col>
                  </v-row>
                  <v-text-field
                    outlined
                    dense
                    v-model="userName"
                    label="เบอร์โทร"
                    required
                    color="#B27D41"
                    style="border-radius: 15px;"
                    prepend-inner-icon="mdi-email-outline"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    dense
                    v-model="userName"
                    label="อีเมล"
                    required
                    color="#B27D41"
                    style="border-radius: 15px;"
                    prepend-inner-icon="mdi-email-outline"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    dense
                    v-model="password"
                    label="ระบุรหัสผ่าน"
                    type="password"
                    required
                    color="#B27D41"
                    @keydown.enter="validate"
                    prepend-inner-icon="mdi-lock-outline"
                    style="border-radius: 15px;"
                    @click:append="show = !show"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                  ></v-text-field>

                  <v-text-field
                    outlined
                    dense
                    v-model="password"
                    label="ยืนยันรหัสผ่าน"
                    type="password"
                    required
                    color="#B27D41"
                    @keydown.enter="validate"
                    prepend-inner-icon="mdi-lock-outline"
                    style="border-radius: 15px;"
                    @click:append="show = !show"
                    :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                    :type="show ? 'text' : 'password'"
                  ></v-text-field>

                  <!--                  <v-checkbox-->
                  <!--                    v-model="remember" label="ข้าพเจ้าอ่านและยอมรับ" color="#B27D41" class="m-0 p-0 mb-2"-->
                  <!--                    hide-details>-->
                  <!--                    <template v-slot:activator="{ on }">-->
                  <!--                      <a-->
                  <!--                        target="_blank"-->
                  <!--                        href="https://vuetifyjs.com"-->
                  <!--                        @click.stop-->
                  <!--                        v-on="on"-->
                  <!--                      >-->
                  <!--                        Vuetify-->
                  <!--                      </a>-->
                  <!--                    </template>-->
                  <!--                  </v-checkbox>-->
                  <v-checkbox v-model="remember" color="#B27D41" class="m-0 p-0 mb-4" hide-details>
                    <template v-slot:label>
                      <div style="color: #B27D41">
                        ข้าพเจ้าอ่านและยอมรับ
                        <a style="color: #E8AF14" target="_blank" :href="`${serve.url}/privacy-policy`" @click.stop>
                          ข้อตกลงและนโยบายความเป็นส่วนตัว
                        </a>
                      </div>
                    </template>
                  </v-checkbox>

                  <v-btn
                    :disabled="!valid" color="#B27D41" @click="validate" block
                    style="color: white; font-size: 16px" rounded>
                    ลงทะเบียน
                  </v-btn>
                </v-form>
              </v-col>
              <v-col align-self="center" class="p-0">
                <v-divider
                  :thickness="1" class="border-opacity-100; pb-1" color="#B27D41"
                  style="border-radius: 20px; width: 200px"/>
                <p style="font-size: 16px; font-weight: normal; color: #846537" class="pt-4 mb-1">
                  หรือลงทะเบียนด้วย</p>
              </v-col>

              <v-row class="m-0 pt-3" style="width: 200px; justify-content: center;">
                <img src="/facebook.png" width="68" height="69" class="m-2 p-2" alt="facebook"/>
                <img src="/google.png" width="68" height="69" class=" m-2 p-2" @click="googleOauth" alt="google"/>
              </v-row>
              <p style="font-size: 16px; font-weight: normal; color: #846537" class="mt-3">
                กลับไปหน้า
                <a @click="$router.push('/login')" style="color: #2196f3">ล็อกอิน</a>
              </p>
            </v-card-text>
            <v-row align="center mr-2">
              <v-col class="p-0">
                <p class="text-right m-0 mr-2" style="font-size: 10px">
                  เวอร์ชั่น {{ version }} เบต้า
                </p>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
      <v-snackbar v-model="snackbar" :timeout="3000" right top color="red accent-2" elevation="24">
        <h6 class="m-0">
          <v-icon x-large>
            mdi-close-octagon
          </v-icon>
          {{ message }}
        </h6>
      </v-snackbar>
    </v-app>
  </div>
</template>
<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
<script src="./index.js"/>
