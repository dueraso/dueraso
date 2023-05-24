<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #EEF7F6; height: 100px">
      <v-container>
        <v-row>
          <v-btn @click="back" text fab>
            <v-icon
              large
              color="#54B6C8"
            >mdi-chevron-left
            </v-icon>
          </v-btn>
          <h4 style="align-self: center; color: #5561B0">เพิ่ม / แก้ไขผู้ใช้งาน</h4>
          <v-spacer/>
          <v-btn
            @click="back"
            style="align-self: center; margin-left: 12px"
            color="#54B6C8"
            dark>
            ยกเลิก
          </v-btn>
          <v-btn
            @click="save"
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
              v-model="defaultItem.first_name"
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
              v-model="defaultItem.last_name"
              outlined
              dense
              full-width
              hide-details>
            </v-text-field>
          </v-col>
          <v-col>
            <p style="color: #54B6C8">เบอร์</p>
            <v-text-field
              v-model="defaultItem.phone"
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
              v-model="defaultItem.email"
              hide-details>
            </v-text-field>
          </v-col>
        </v-row>
        <v-row style="padding: 12px;">
          <v-divider style="background-color: #54B6C8"/>
        </v-row>

        <v-col align="right" style="padding-right: 0px"  v-if="isEdite">
          <v-btn
            dark
            color="#54B6C8"
            @click="GeneratePassword"
          >
            สุ่มรหัส
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
              :disabled="!isEdite"
              v-model="defaultItem.user_name">
            </v-text-field>
          </v-col>
          <v-col>
            <p style="color: #54B6C8">สิทธิ์</p>
            <v-select
              :items="itemsPosition"
              item-text="name"
              return-object
              v-model="roles"
              label="สิทธิ์"
              outlined
              dense
              color="#54B6C8"
              full-width
            ></v-select>
          </v-col>
        </v-row>
        <v-row v-if="isEdite">
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
        </v-row>
      </v-container>
    </v-card-text>
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
      show: false,
      password: '',
      passwordConfirm: '',
      roles: {},
      isEdite: true,
      defaultItem: {
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        user_name: '',
      },
      itemsPosition: [],
    }
  },
  mounted() {
    this.getRoles()
    this.checkEdite()
  },
  methods: {
    checkEdite() {
      if(this.$route.query.edite !== undefined)
      {
        this.isEdite = false
        this.getUser(this.$route.query.edite)
      }
    },
    async getRoles() {
      await this.$axios.get(`roles`)
        .then((res) => {
          this.itemsPosition = res.data.filter((d) => d.id !== 1)
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async getUser(id) {
      await this.$axios.get(`users/${id}`)
        .then((res) => {
          this.defaultItem = res.data
          this.roles = this.defaultItem.roles
          // console.log(JSON.stringify(res.data))
        })
        .catch((e) => {
          console.log(e)
        })
    },
    GeneratePassword() {
      this.password = Math.random().toString(36).slice(-8);
      this.passwordConfirm = this.password;
    },
    save(){
      if(this.$route.query.edite === undefined){
        this.addUser()
      }else {
        this.updateUser()
      }
    },
    async addUser() {
      await this.$axios.post(`register`, {
        'first_name': this.defaultItem.first_name,
        'last_name': this.defaultItem.last_name,
        'user_name': this.defaultItem.user_name,
        'name': this.defaultItem.first_name + " " + this.defaultItem.last_name,
        'phone': this.defaultItem.phone,
        'email': this.defaultItem.email,
        'password': this.password,
        'c_password': this.passwordConfirm,
        'active': 1,
        'status': 1,
        'roles': this.roles.id,
      })
        .then(() => {
          this.back()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    async updateUser() {
      await this.$axios.put(`users/${this.defaultItem.id}`, {
        'first_name': this.defaultItem.first_name,
        'last_name': this.defaultItem.last_name,
        'user_name': this.defaultItem.user_name,
        'name': this.defaultItem.first_name + " " + this.defaultItem.last_name,
        'phone': this.defaultItem.phone,
        'email': this.defaultItem.email,
        'active': 1,
        'status': 1,
        'roles': this.roles.id,
      })
        .then((res) => {
          this.snackbar = true
          this.back()
        })
        .catch((e) => {
          console.log(e)
        })
    },
    back() {
      this.$router.back()
    },
  },
}
</script>
