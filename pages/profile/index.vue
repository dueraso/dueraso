<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #EEF7F6; height: 100px">
      <v-container>
        <v-row>
          <h4 style="align-self: center; color: #5561B0">ข้อมูลส่วนตัว</h4>
          <v-spacer/>
          <v-btn
            @click="()=>this.$router.back()"
            style="align-self: center; margin-left: 12px"
            color="#54B6C8"
            dark>
            ยกเลิก
          </v-btn>
          <v-btn
            @click="save()"
            style="align-self: center; margin-left: 12px"
            color="#54B6C8"
            dark>
            บันทึก
          </v-btn>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row style=" margin-top: 12px">
          <v-col>
            <p style="color: #54B6C8">ชื่อ</p>
            <v-text-field
              label="ชื่อ"
              v-model="first_name"
              outlined
              dense
              full-width
              color="#54B6C8"
              hide-details>
            </v-text-field>
          </v-col>
          <v-col>
            <p style="color: #54B6C8">นามสกุล</p>
            <v-text-field
              color="#54B6C8"
              label="นามสกุล"
              v-model="last_name"
              outlined
              dense
              full-width
              hide-details>
            </v-text-field>
          </v-col>
          <v-col>
            <p style="color: #54B6C8">เบอร์</p>
            <v-text-field
              v-model="phone"
              v-mask="'###-###-####'"
              color="#54B6C8"
              label="089-999-9999"
              outlined
              dense
              full-width
              hide-details>
            </v-text-field>
          </v-col>
          <v-col>
            <p style="color: #54B6C8">อีเมล</p>
            <v-text-field
              color="#54B6C8"
              label="example@mail.com"
              outlined
              dense
              full-width
              v-model="email"
              hide-details>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row style="padding: 12px;">
          <v-divider style="background-color: #54B6C8"/>
        </v-row>

        <v-col align="right" style="padding-right: 0px">
          <v-btn
            dark
            color="#54B6C8"
            @click="()=>this.dialog = !this.dialog"
          >
            เปลี่ยนรหัสผ่าน
          </v-btn>
        </v-col>
        <v-row>
          <v-col>
            <p style="color: #54B6C8">ชื่อผู้ใช้งาน</p>
            <v-text-field
              label="ชื่อผู้ใช้งาน"
              outlined
              dense
              full-width
              color="#54B6C8"
              hide-details
              v-model="userName"
              :disabled="true">
            </v-text-field>
          </v-col>
          <v-col>
            <p style="color: #54B6C8">ตำแหน่ง</p>

            <v-select
              item-text="name"
              return-object
              :items="itemsPosition"
              v-model="roles"
              label="สิทธิ์"
              outlined
              dense
              color="#54B6C8"
              full-width
              :disabled="true"
            ></v-select>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
    <v-dialog
      v-model="dialog"
      width="500"
    >
      <v-card>
        <v-card-title class="text-h5 lighten-2" style="background-color: #5561B0">
          <p style="color: white">เปลี่ยนรหัสผ่าน</p>
        </v-card-title>
        <v-card-text>
          <!--          <v-row>-->
          <v-col>
            <p style="color: #54B6C8">ระบุรหัสผ่าน</p>
            <v-text-field
              color="#54B6C8"
              v-model="password"
              label="ประกอบด้วย 8 ตัวอักษร ใช้อักษร a-z และตัวเลข 0-9 ได้เท่านั้น"
              outlined
              dense
              full-width
              hide-details
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <p style="color: #54B6C8">ระบุรหัสผ่านปัจจุบัน</p>
            <v-text-field
              color="#54B6C8"
              v-model="password"
              label="ประกอบด้วย 8 ตัวอักษร ใช้อักษร a-z และตัวเลข 0-9 ได้เท่านั้น"
              outlined
              dense
              full-width
              hide-details
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
            >
            </v-text-field>
          </v-col>
          <v-col>
            <p style="color: #54B6C8">ยืนยันรหัสผ่าน</p>
            <v-text-field
              color="#54B6C8"
              v-model="passwordConfirm"
              label="ประกอบด้วย 8 ตัวอักษร ใช้อักษร a-z และตัวเลข 0-9 ได้เท่านั้น"
              outlined
              dense
              full-width
              hide-details
              :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
              :type="show ? 'text' : 'password'"
              @click:append="show = !show"
            >
            </v-text-field>
          </v-col>
          <v-row>
            <v-col align="center">
              <v-btn
                @click="dialog = false"
                style="align-self: center; margin-left: 12px"
                color="#54B6C8"
                dark>
                ยกเลิก
              </v-btn>
              <v-btn
                @click=""
                style="align-self: center; margin-left: 12px"
                color="#54B6C8"
                dark>
                บันทึก
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-dialog>
    <v-snackbar
      v-model="snackbar"
      :multi-line="multiLine"
      :timeout="timeout"
      :right="true"
      :top="true"
      color="#54B6C8"
      rounded="pill"
    >
      บันทึกสำเร็จ
      <template v-slot:action="{ attrs }">
        <v-icon
          @click="snackbar = false"
          v-bind="attrs"
        >
          mdi-window-close
        </v-icon>
      </template>
    </v-snackbar>
  </v-card>
</template>
<script>
import Vue from 'vue'
import VueMask from 'v-mask'
import {VueMaskDirective} from 'v-mask'

Vue.use(VueMask);
Vue.directive('mask', VueMaskDirective);

export default {
  components: {
    VueMask,
  },
  middleware: ['auth'],
  data() {
    return {
      snackbar: false,
      multiLine: false,
      timeout: 2000,
      dialog: false,
      show: false,
      isDisabled: false,
      first_name: '',
      last_name: '',
      phone: '',
      email: '',
      userName: '',
      itemsPosition: [],
      roles: {},
      password: '',
      passwordConfirm: '',
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      this.first_name = this.$auth.user.first_name
      this.last_name = this.$auth.user.last_name
      this.phone = this.$auth.user.phone
      this.email = this.$auth.user.email
      this.userName = this.$auth.user.user_name
      this.Roles()
    },
    async Roles() {
      await this.$axios.get(`roles`)
        .then((res) => {
          this.itemsPosition = res.data
          this.getRoles()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async getRoles() {
      await this.$axios.get(`roles/${this.$auth.user.roles}`)
        .then((res) => {
          this.roles = res.data
        })
        .catch((e) => {
          console.log(e)
        })
    },
    ChangePassword() {

    },
    GeneratePassword() {
      this.password = Math.random().toString(36).slice(-8);
      this.passwordConfirm = this.password;
    },
    async save() {
      await this.$axios.put(`users/${this.$auth.user.id}`, {
        'name': this.first_name +" "+ this.last_name,
        'first_name': this.first_name,
        'last_name': this.last_name,
        'phone':this.phone,
        'email':this.email,
        'user_name':this.$auth.user.user_name,
      })
        .then((res) => {
          this.snackbar = true
          console.log(res.date)
        })
        .catch((e) => {
          console.log(e)
        })
    },
  },
}
</script>
