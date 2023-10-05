<template>
  <div id="app">
    <v-app
      style="background-color: #F3F1ED;background-size: cover;background-repeat: no-repeat;">
      <v-row justify="center">
        <v-col cols="12" sm="6" align="center" style="align-self: center">
          <h1 style="font-weight: bold; font-size: 60px" class="m-0">DUERASO</h1>
          <p style="font-size: 40px; font-weight: lighter">ยินดีต้อนรับ</p>
          <v-img src="./image1.png" width="812"/>
        </v-col>
        <v-col cols="12" sm="6" align="center" align-self="center">
          <!--          <v-container fill-height>-->
          <!--            <v-layout wrap align-center>-->
          <!--              <v-flex>-->
          <v-card elevation="4" light tag="section" style="border-radius: 15px" width="611px">
            <v-card-text>
              <v-col align="left" class="pl-8 pr-8">
                <p style="font-size: 50px; font-weight: bold" class="mb-5">LOG IN</p>
                <p style="font-weight:normal; font-size: 23px" class="mb-7">เข้าสู่ระบบ</p>
                <v-form ref="form" v-model="valid" lazy-validation class="pb-4">
                  <v-text-field
                    outlined
                    dense
                    v-model="userName"
                    :rules="emailRules"
                    label="ชื่อผู้ใช้งาน"
                    required
                    color="#38857D"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    dense
                    v-model="password"
                    :rules="passwordRules"
                    label="ระบุรหัสผ่าน"
                    type="password"
                    required
                    color="#38857D"
                    @keydown.enter="validate"
                  ></v-text-field>

                  <p style="color: red" align="left">
                    {{ message }}
                  </p>

                  <v-checkbox v-model="remember" label="จดจำรหัสผ่าน" color="#38857D" class="m-0 p-0" hide-details></v-checkbox>

                  <v-btn :disabled="!valid" color="#54B6C8" @click="validate" block style="color: white; font-size: 23px" rounded>
                    เข้าสู่ระบบ
                  </v-btn>
                </v-form>
              </v-col>
              <v-col align-self="center">
                <v-divider :thickness="15" class="border-opacity-100; pb-1" color="info" style="border-radius: 20px; width: 200px"/>
                <p style="font-size: 23px; font-weight: normal" class="pt-5 mb-2">หรือเข้าสู่ระบบด้วย</p>
              </v-col>
              <v-row class="m-0 pt-4" style="width: 200px; justify-content: center;">
                <img src="/facebook.png" width="78" height="78" class="m-2 p-2"/>
                <img src="/google.png" width="78" height="78" class=" m-2 p-2" @click="googleOauth"/>
              </v-row>
            </v-card-text>
            <!--                  <v-row align="center mr-2">-->
            <!--                    <v-col class="p-0">-->
            <!--                      <p class="text-right m-0 mr-2" style="font-size: 10px">-->
            <!--                        เวอร์ชั่น {{ version }} เบต้า-->
            <!--                      </p>-->
            <!--                    </v-col>-->
            <!--                  </v-row>-->
          </v-card>
          <!--              </v-flex>-->
          <!--            </v-layout>-->
          <!--&lt;!&ndash;            <v-row align="center mr-2">&ndash;&gt;-->
          <!--&lt;!&ndash;              <v-col class="p-0">&ndash;&gt;-->
          <!--&lt;!&ndash;                <p class="text-center m-0" style="font-size: 12px">&ndash;&gt;-->
          <!--&lt;!&ndash;                  เวอร์ชั่น {{ version }} เบต้า&ndash;&gt;-->
          <!--&lt;!&ndash;                </p>&ndash;&gt;-->
          <!--&lt;!&ndash;              </v-col>&ndash;&gt;-->
          <!--&lt;!&ndash;            </v-row>&ndash;&gt;-->
          <!--          </v-container>-->
        </v-col>
      </v-row>
      <!--      <v-overlay :value="overlay">-->
      <!--        <v-card width="500px" light align="center" v-if="profile.active === 1">-->
      <!--          <v-card-title>สถานะของคุณคือ</v-card-title>-->
      <!--          <br/>-->
      <!--          <v-card-subtitle v-if="profile.status.id === 2"-->
      <!--          ><h1 style="color: orange">{{ profile.status.name }}</h1>-->
      <!--          </v-card-subtitle>-->
      <!--          <v-card-subtitle v-else>-->
      <!--            <h1 style="color: red">-->
      <!--              {{ profile.status.name }}-->
      <!--            </h1>-->
      <!--          </v-card-subtitle>-->
      <!--          <v-card-actions align="center">-->
      <!--            <v-btn text @click="() => (this.overlay = false)">ปิด</v-btn>-->
      <!--          </v-card-actions>-->
      <!--        </v-card>-->
      <!--        <v-card width="500px" light align="center" v-else>-->
      <!--          <v-card-title>สถานะของคุณคือ</v-card-title>-->
      <!--          <br/>-->
      <!--          <v-card-subtitle-->
      <!--          ><h3 style="color: red">-->
      <!--            {{ message }}-->
      <!--          </h3>-->
      <!--          </v-card-subtitle>-->
      <!--          <v-card-actions align="center">-->
      <!--            <v-btn text @click="() => (this.overlay = false)">ปิด</v-btn>-->
      <!--          </v-card-actions>-->
      <!--        </v-card>-->
      <!--      </v-overlay>-->
    </v-app>
  </div>
</template>
<script>
import pkg from "@/package.json";

export default {
  layout: "auth-layout",
  middleware: "isLoggedIn",
  data: () => ({
    overlay: false,
    valid: true,
    email: "",
    again: false,
    stat: false,
    remember: false,
    version: pkg.version,
    profile: {},
    emailRules: [
      (v) => !!v || "จำเป็น",
      (v) => /.+@.+\..+/.test(v) || "รูปแบบอีเมลไม่ถูกต้อง",
    ],
    userNameRules: [(v) => !!v || "จำเป็น"],
    userName: "",
    password: "",
    passwordRules: [
      (v) => !!v || "จำเป็น",
      // (v) => (v && v.length > 5) || "Password must have 6 characters",
      // v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
      // v => /(?=.*\d)/.test(v) || 'Must have one number',
      // v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
    ],
    message: "",
  }),
  mounted() {
    let data = JSON.parse(localStorage.getItem("remember"));
    if (data != null) {
      this.userName = data.email;
      this.password = data.password;
    }
  },

  methods: {
    async googleOauth(){
      await this.$auth.loginWith('google');
    },
    async validate() {
      if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start();
      const payload = {
        data: {
          email: this.userName,
          password: this.password,
        },
      };

      await this.$auth.loginWith("local", payload).then((res) => {
        if (this.remember) {
          let data = {
            email: this.userName,
            password: this.password,
          }
          localStorage.setItem("remember", JSON.stringify(data));
        }
        console.log(res)
        this.$nuxt.$loading.finish();
      }).catch((e) => {
        this.$nuxt.$loading.finish();
        this.message = e.response.data.message
        console.log(e.response.data.message);
      });
    },
  },
};
</script>
