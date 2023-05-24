<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">ข้อมูล</span>
    </v-card-title>
    <v-card-text>
      <v-form
        ref="form"
        v-model="valid"
        lazy-validation
      >
        <v-row>
          <v-col>
            <v-text-field
              v-model="firstName"
              :rules="firstNameRules"
              label="ชื่อ"
              required
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              v-model="lastName"
              :rules="lastNameRules"
              label="สกุล"
              required
            ></v-text-field>
          </v-col>
        </v-row>
        <v-text-field
          v-model="profile.phone"
          :rules="phoneRules"
          label="เบอร์"
          required
        ></v-text-field>
        <v-text-field
          v-model="profile.email"
          :rules="emailRules"
          label="อีเมล"
          required
          disabled
        ></v-text-field>
<!--        <v-row>-->
<!--          <v-col>-->
<!--            <v-text-field-->
<!--              v-model="profile.password"-->
<!--              :rules="passwordRules"-->
<!--              label="รหัสผ่าน"-->
<!--              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"-->
<!--              :type="show1 ? 'text' : 'password'"-->
<!--              @click:append="show1 = !show1"-->
<!--              required-->
<!--            ></v-text-field>-->
<!--          </v-col>-->
<!--          <v-col>-->
<!--            <v-text-field-->
<!--              v-model="verify"-->
<!--              :rules="[rules.required, passwordMatch]"-->
<!--              label="รหัสผ่านอีกครั้ง"-->
<!--              :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"-->
<!--              :type="show1 ? 'text' : 'password'"-->
<!--              @click:append="show1 = !show1"-->
<!--              required-->
<!--            ></v-text-field>-->
<!--          </v-col>-->
<!--        </v-row>-->
<!--        <v-row>-->
<!--          <p style="margin: 0px; padding-left: 12px; padding-top: 15px">หมวดหมู่</p>-->
<!--          <v-col>-->
<!--            <v-row>-->
<!--              <v-col cols="3" v-for="type in types" :key="type.name">-->
<!--                <v-checkbox-->
<!--                  style="margin: 0px"-->
<!--                  :label="`${type.name}`"-->
<!--                  color="success"-->
<!--                  v-model="typeCheck[0]"-->
<!--                  :value="type"-->
<!--                  :value-comparator="comparator"-->
<!--                  hide-details-->
<!--                ></v-checkbox>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-col>-->
<!--        </v-row>-->
      </v-form>
    </v-card-text>
    <v-divider></v-divider>
    <v-card-actions :class="{ 'pa-3': $vuetify.breakpoint.smAndUp }">
      <v-btn text @click="()=>this.$router.back()">
        กลับ
      </v-btn>
      <v-spacer></v-spacer>
      <v-btn
        :disabled="!valid"
        color="success"
        @click="validate"
        rounded
      >
        ยืนยัน
      </v-btn>
    </v-card-actions>
  </v-card>
</template>
<script>
export default {
  // layout: 'auth-layout',
  // middleware: ['auth','is-admin'],
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    }
  },
  data: () => ({
    valid: true,
    again: false,
    profile: {},
    verify: '',
    show1: false,
    typeCheck: ['สถานที่เที่ยว','สถานที่กิน'],
    firstName: '',
    firstNameRules: [
      v => !!v || 'required',
    ],
    lastName: '',
    lastNameRules: [
      v => !!v || 'required',
    ],
    phone: '',
    phoneRules: [
      v => !!v || 'required',
      v => (v && v.length >= 10) || 'Password must have 10 characters',
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    password: '',
    passwordRules: [
      v => !!v || 'Password is required',
      v => (v && v.length > 5) || 'Password must have 6 characters',
      v => /(?=.*[A-Z])/.test(v) || 'Must have one uppercase character',
      v => /(?=.*\d)/.test(v) || 'Must have one number',
      v => /([!@$%])/.test(v) || 'Must have one special character [!@#$%]'
    ],
    rules: {
      required: value => !!value || "Required.",
      min: v => (v && v.length >= 8) || "Min 8 characters"
    },
    active: '',
    status: '',
    roles: {},
    error: null,
    types: {},
  }),
  mounted() {
    this.getType()
    this.getUser()
  },
  methods: {
    comparator(a, b) {
      return a.id === b.id;
    },
    async getUser(){
      await this.$axios.get(`users/${this.$route.query.ref}`)
        .then((res) => {
          this.profile = res.data
          this.firstName = this.profile.name.split(' ')[0]
          this.lastName = this.profile.name.split(' ')[1]
          console.log(JSON.stringify(this.profile))
          // this.typeCheck = this.profile.permission_type.policy
        }).catch((error) => {
          console.log(error)
        })
    },
    async getType() {
      await this.$axios.get(`place_type`)
        .then((res) => {
          this.types = res.data
          // this.typeCheck
          // console.log(">>"+JSON.stringify(this.types))
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async validate() {
      this.$refs.form.validate()
      await this.register()
      // await this.addPermissionType()
      // console.log(JSON.stringify(this.typeCheck))
    },
    async addPermissionType() {
      await this.$axios.post(`permission_type`, {
        policy: JSON.stringify(this.typeCheck),
      })
        .then((res) => {
          // console.log(res.data)
          this.register(res.data.id)
        }).catch((error) => {
          console.log(error)
        })
    },
    async register() {
      await this.$axios.put(`users/${this.$route.query.ref}`, {
        name: this.firstName + " " + this.lastName,
        // email: this.email,
        // password: this.password,
        // c_password: this.verify,
        phone: this.profile.phone,
        // active: 1,
        // status: 2,
        // roles: 2,
        // permission_type: id,
      })
        .then((res) => {
          // console.log(res.data)
          this.$router.back()
        }).catch((error) => {
          console.log(error)
        })
    },
  },
}
</script>
