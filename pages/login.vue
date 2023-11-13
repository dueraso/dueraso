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
                <h3 style="font-size: 50px; font-weight: bold; color: #846537" class="">LOG IN</h3>
                <h5 style="color: #846537" class="mb-7">เข้าสู่ระบบ</h5>
                <v-form ref="form" v-model="valid" lazy-validation class="pb-4">
                  <v-text-field
                    outlined
                    dense
                    v-model="userName"
                    :rules="emailRules"
                    label="ชื่อผู้ใช้งาน"
                    required
                    color="#B27D41"
                    style="border-radius: 15px;"
                    prepend-inner-icon="mdi-email-outline"
                  ></v-text-field>
                  <v-text-field
                    outlined
                    dense
                    v-model="password"
                    :rules="passwordRules"
                    label="ระบุรหัสผ่าน"
                    type="password"
                    required
                    color="#B27D41"
                    @keydown.enter="validate"
                    prepend-inner-icon="mdi-lock-outline"
                    style="border-radius: 15px;"
                  ></v-text-field>

                  <v-checkbox v-model="remember" label="จดจำรหัสผ่าน" color="#B27D41" class="m-0 p-0 mb-2"
                              hide-details/>

                  <v-btn :disabled="!valid" color="#B27D41" @click="validate" block
                         style="color: white; font-size: 16px" rounded>
                    เข้าสู่ระบบ
                  </v-btn>
                </v-form>
              </v-col>
              <v-col align-self="center" class="p-0">
                <v-divider :thickness="1" class="border-opacity-100; pb-1" color="#B27D41"
                           style="border-radius: 20px; width: 200px"/>
                <p style="font-size: 16px; font-weight: normal; color: #846537" class="pt-5 mb-2">
                  หรือเข้าสู่ระบบด้วย</p>
              </v-col>
              <v-row class="m-0 pt-3" style="width: 200px; justify-content: center;">
                <img src="/facebook.png" width="68" height="69" class="m-2 p-2" alt="facebook"/>
                <img src="/google.png" width="68" height="69" class=" m-2 p-2" @click="googleOauth" alt="google"/>
              </v-row>
              <p style="font-size: 16px; font-weight: normal; color: #846537" class="mt-3">ยังไม่มีบัญชี?
                <a @click="$router.push('/register')" style="color: #2196f3">สมัคร</a>
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
    </v-app>
  </div>
</template>
<script>
import pkg from "@/package.json";

export default {
  layout: "auth-layout",
  middleware: "isLoggedIn",
  head() {
    return {
      title: this.headTitle,
    }
  },
  data: () => ({
    headTitle: "หน้าล็อกอิน",
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
    async googleOauth() {
      // await this.$auth.loginWith('google');
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
        this.$nuxt.$loading.finish();
      }).catch((e) => {
        this.$nuxt.$loading.finish();
        this.message = e.response.data.message
      });
    },
  },
};
</script>
