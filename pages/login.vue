<template>
  <div id="app">
    <v-app
      style="
        background-image: url('/bg.png');
        background-size: cover;
        background-repeat: no-repeat;
      "
    >
      <v-row justify="center">
        <v-col cols="12" sm="6">
          <v-container fill-height style="max-width:632px">
            <v-layout wrap align-center>
              <v-flex>
                <v-card
                  elevation="4"
                  light
                  tag="section"
                  style="border-radius: 15px"
                >
                  <v-card-title>
                    <v-col>
                      <h3 align="center">เข้าสู่ระบบ</h3>
                    </v-col>
                  </v-card-title>
                  <v-card-text>
                    <v-col align="center">
                      <v-form
                        ref="form"
                        v-model="valid"
                        lazy-validation
                        style="max-width: 484px"
                      >
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

                        <v-checkbox
                          v-model="remember"
                          label="จดจำรหัสผ่าน"
                          color="#38857D"
                          class="m-0 p-0"
                          hide-details
                        ></v-checkbox>

                        <v-btn
                          :disabled="!valid"
                          color="#54B6C8"
                          @click="validate"
                          block
                          style="color: white"
                        >
                          เข้าสู่ระบบ
                        </v-btn>
                      </v-form>
                    </v-col>
                  </v-card-text>
                  <!--                  <v-row align="center mr-2">-->
                  <!--                    <v-col class="p-0">-->
                  <!--                      <p class="text-right m-0 mr-2" style="font-size: 10px">-->
                  <!--                        เวอร์ชั่น {{ version }} เบต้า-->
                  <!--                      </p>-->
                  <!--                    </v-col>-->
                  <!--                  </v-row>-->
                </v-card>
              </v-flex>
            </v-layout>
            <v-row align="center mr-2">
              <v-col class="p-0">
                <p class="text-center m-0" style="font-size: 12px">
                  เวอร์ชั่น {{ version }} เบต้า
                </p>
              </v-col>
            </v-row>
          </v-container>
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
