<template>
  <v-overlay :value="overlay" opacity="1" color="white" light>
    <v-responsive class="overflow-y-auto" :max-height="height">
      <v-responsive class="text-center pa-2">
        <v-lazy v-model="isActive" :options="{ threshold: .5 }" transition="fade-transition">
          <v-card class="mx-auto" max-width="500" light elevation="0">
            <v-btn text light class="float-xl-right" @click="close">
              <v-icon dark>mdi-window-close</v-icon>
            </v-btn>
            <v-form ref="form" v-model="valid">
              <v-row style="max-width: 400px">
                <v-col cols="12" align="center">
                  <p style="font-weight: bold; font-size: 31px; color: #4E98E7; margin: 0;">สมัครสมาชิก</p>
                  <v-spacer/>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0">
                  <v-text-field
                    label="ชื่อ" light outlined dense rounded
                    prepend-inner-icon="mdi-account-outline"
                    type="name" v-model="firstname" :rules="[rules.required]"></v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0">
                  <v-text-field
                    label="นามสกุล" light rounded outlined dense prepend-inner-icon="mdi-account-outline"
                    :rules="[rules.required]" v-model="lastname"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0">
                  <v-text-field
                    prepend-inner-icon="mdi-card-bulleted-outline"
                    label="หมายเลขประจำตัวประชาชน" light dense
                    v-model="identity"
                    rounded outlined
                    v-mask="'#-####-#####-##-#'"
                    :rules="[rules.required]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0">
                  <!--          <v-text-field-->
                  <!--            label="วัน เดือน ปีเกิด" light dense rounded outlined-->
                  <!--            prepend-inner-icon="mdi-calendar-month-outline" :rules="[rules.required()]"-->
                  <!--          ></v-text-field>-->
                  <v-menu
                    ref="menu"
                    v-model="menu"
                    :close-on-content-click="false"
                    transition="scale-transition"
                    offset-y
                    min-width="auto"
                  >
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="birthday"
                        label="วัน เดือน ปีเกิด"
                        light dense rounded outlined prepend-inner-icon="mdi-calendar-month-outline"
                        v-bind="attrs"
                        v-on="on"
                      ></v-text-field>
                    </template>
                    <v-date-picker
                      v-model="birthday" :active-picker.sync="activePicker"
                      :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"
                      min="1850-01-01" :rules="[rules.required()]" locale="th" @change="save"
                    ></v-date-picker>
                  </v-menu>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0">
                  <v-text-field
                    label="อีเมล" light dense rounded outlined prepend-inner-icon="mdi-email-outline"
                    type="email" :rules="[rules.email]" v-model="email"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0">
                  <v-text-field
                    label="เบอร์" light dense rounded outlined prepend-inner-icon="mdi-cellphone"
                    :rules="[rules.phone]" v-model="mobile" v-mask="'## #### ####'"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0">
                  <v-text-field
                    label="ผู้ใช้" light dense rounded outlined prepend-inner-icon="mdi-account-circle-outline"
                    v-model="username" :rules="[rules.required,rules.username]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0">
                  <v-text-field
                    label="รหัสผ่าน" light dense rounded outlined
                    prepend-inner-icon="mdi-lock-outline" type="password" v-model="password"
                    :rules="[rules.required && rules.min]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0">
                  <v-text-field
                    label="ยืนยันรหัสผ่าน" light dense rounded outlined prepend-inner-icon="mdi-lock-outline"
                    type="password"
                    :rules="[rules.required && rules.min && rules.confirmPassword]"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" style="padding-bottom: 0;padding-top: 0" align="center">
                  <v-btn dark color="#7b1817" @click="validate">ยืนยัน</v-btn>
                </v-col>
              </v-row>
            </v-form>
          </v-card>
        </v-lazy>
        <DialogRegister :callback="closeDia" :textBtn="textBtn" :status="regis"/>
        <DialogCon :detail="messages" :callback="closeDia" :textBtn="textBtn" :status="status"/>
      </v-responsive>
    </v-responsive>
  </v-overlay>
</template>
<script>
import Vue from 'vue'
import VueMask from 'v-mask'
import {VueMaskDirective} from 'v-mask'
import axios from "~/api/config";
import DialogCon from "./DialogCon";
import DialogRegister from "./DialogRegister";

Vue.use(VueMask);
Vue.directive('mask', VueMaskDirective);

export default {
  components: {DialogRegister, DialogCon},
  props: {
    overlay: Boolean,
    callback: Function
  },
  computed: {
    height() {
      if (this.$vuetify.breakpoint.height === 0) return
      return this.$vuetify.breakpoint.height
    },
  },
  watch: {
    menu(val) {
      val && setTimeout(() => (this.activePicker = 'YEAR'))
    },
  },
  data() {
    return {
      messages: "",
      textBtn: "ปิด",
      status: false,
      regis: false,
      isActive: false,
      timeout: 1000,
      activePicker: null,
      menu: false,
      valid: false,
      firstname: '',
      lastname: '',
      email: '',
      mobile: '',
      birthday: null,
      username: '',
      identity: '',
      password: '',
      rules: {
        required: value => !!value || "จำเป็น",
        min: v => (v && v.length >= 6) || "ตัวอักษร 6 ขึ้นไป",
        confirmPassword: value => value === this.password || 'รหัสผ่านไม่ต้องกัน',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'กรุณากรอก e-mail'
        },
        username: value => {
          const usernameRegex = /^[a-z0-9_.]+$/
          return usernameRegex.test(value) || 'ต้องเป็นภาษาอังกฤษเท่านั้น'
        },
        phone: value => {
          const usernameRegex = /^[ 0-9_.]+$/
          return (usernameRegex.test(value) && value.length >= 12) || 'หมายเลขต้องครบ 10 ตัว'
        },
      },

      snackbar: false,
      vertical: true,
    }
  },
  methods: {
    save(date) {
      this.$refs.menu.save(date)
    },
    close() {
      this.$refs.form.reset()
      this.snackbar = false
      !this.callback()
    },
    closeDia() {
      if (this.regis) {
        this.regis = false
        this.close()
      }
      this.status = false
    },
    async validate() {
      this.$nuxt.$loading.start()
      if (this.$refs.form.validate()) {
        await axios.post(`/member/register`, {
          firstname: this.firstname,
          lastname: this.lastname,
          citizen_id: this.identity.replaceAll('-', ''),
          mobile: this.mobile.replaceAll(' ', ''),
          email: this.email,
          birthday: this.birthday,
          username: this.username,
          password: this.password,
        }).then((res) => {
          if (res.data.status === true) {
            this.snackbar = true
            this.regis = true
          } else {
            this.status = true
            this.messages = res.data.message
          }
          this.$nuxt.$loading.finish()
        }).catch((error) => {
          this.$nuxt.$loading.finish()
          console.log(error.message)
        })
      }
    },
  },
}
</script>
