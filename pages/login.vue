<template>
  <div id="app">
    <v-app style="background-image: url('/bg.jpg');background-size: cover;background-repeat: no-repeat">
      <v-row justify="center">
        <v-col cols="12" sm="6">
          <v-container fill-height style="max-width:632px">
            <v-layout wrap align-center>
              <v-flex>
                <v-card elevation="4" light tag="section" style="border-radius:15px">
                  <v-card-title>
                    <v-col>
                      <h3 align="center">
                        เข้าสู่ระบบ
                      </h3>
                    </v-col>
                  </v-card-title>
                  <v-card-text>
                    <v-col align="center">
                      <v-form ref="form" v-model="valid" lazy-validation style="max-width: 484px">
                        <v-text-field
                          outlined dense v-model="username" :rules="userNameRules"
                          label="ชื่อผู้ใช้" required>
                        </v-text-field>
                        <v-text-field
                          outlined dense v-model="password" :rules="passwordRules"
                          label="รหัสผ่าน" type="password" required @keydown.enter="validate"
                        ></v-text-field>
                        <v-btn :disabled="!valid" color="#7b1817" light @click="validate" block>
                          <p style="color: white; margin: 0">เข้าสู่ระบบ</p>
                        </v-btn>
                      </v-form>
                        <p class="mb-0 mt-2" style="font-size: 12px">version {{this.version}}</p>
                    </v-col>
                  </v-card-text>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-col>
      </v-row>
      <DialogCon :detail="messages" :callback="close" :status="snackbar"/>
    </v-app>
  </div>
</template>
<script>
import axios from "@/api/config";
// import Register from "@/components/Register.vue";
import DialogCon from "@/components/DialogCon.vue";

export default {
  layout: 'auth-layout',
  middleware: 'isLoggedIn',
  components: {DialogCon,
    // Register
  },
  data: () => ({
    version:"2.3.0",
    overlay: false,
    valid: true,
    email: '',
    again: false,
    stat: false,
    remember: false,
    snackbar: false,
    vertical: true,
    profile: {},
    emailRules: [
      v => !!v || 'จำเป็น',
      v => /.+@.+\..+/.test(v) || 'รูปแบบอีเมลไม่ถูกต้อง',
    ],
    userNameRules: [
      v => !!v || 'จำเป็น',
    ],
    username: '',
    password: '',
    messages: '',
    passwordRules: [
      v => !!v || 'จำเป็น',
      v => (v && v.length > 5) || 'รหัสผ่าน 6 ตัวขึ้นไป',
      // v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
      // v => /(?=.*\d)/.test(v) || 'Must have one number',
      // v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
    ],
    error: null,
  }),
  mounted() {
    // let data = JSON.parse(localStorage.getItem('remember'))
    // if (data != null) {
    //   this.userName = data.user_name
    //   this.password = data.password
    // }
  },
  methods: {
    close() {
      this.snackbar = false
    },
    async validate() {
      this.$nuxt.$loading.start()
      await axios.post('/member/login', {
        username: this.username,
        password: this.password,
      }).then((res) => {
        if (res.data.status) {
          this.login()
        } else {
          this.messages = res.data.message
          this.$nuxt.$loading.finish()
          this.snackbar = true
        }
      }).catch((e) => {
        console.log("e>" + JSON.stringify(e))
      })
    },
    login() {
      try {
        const login = {
          username: this.username,
          password: this.password
        }
        // let response =
        this.$auth.loginWith('local', {data: login}).then((res)=>{
          this.$nuxt.$loading.finish()
          this.menu = false
          this.$auth.$storage.setLocalStorage('token',res.data.tokens.code)
          // console.log(res.data)
        })
        // console.log('response', response)
      } catch (e) {
        console.log('Error Response', JSON.stringify(e))
      }
    },
  },
}
</script>
