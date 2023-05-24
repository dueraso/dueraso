<template>
  <div id="app">
    <v-app>
      <v-row
        justify="center"
      >
        <v-col cols="7">
          <v-container fill-height>
            <v-layout wrap align-center>
              <v-flex>
                <v-card elevation="4" light tag="section" align="center">
<!--                  <img src="/icon.png" style="max-width: 150px; padding-top: 10px">-->
                  <v-card-title>
                    <v-layout align-center justify-space-between>
                      <h3 class="headline">
                        {{ platformName }}
                      </h3>
                      <v-flex>
                        <!--                        <v-img :alt="platformName" class="ml-3" contain height="48px" position="center right"-->
                        <!--                               src="https://www.mobygames.com/images/i/12/25/1435075.png"></v-img>-->
                      </v-flex>
                    </v-layout>
                  </v-card-title>
                  <v-divider></v-divider>
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
                        v-model="phone"
                        :rules="phoneRules"
                        label="เบอร์"
                        required
                      ></v-text-field>
                      <v-text-field
                        v-model="email"
                        :rules="emailRules"
                        label="อีเมล"
                        required
                      ></v-text-field>
                      <v-row>
                        <v-col>
                          <v-text-field
                            v-model="password"
                            :rules="passwordRules"
                            label="รหัสผ่าน"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"
                            required
                          ></v-text-field>
                        </v-col>
                        <v-col>
                          <v-text-field
                            v-model="verify"
                            :rules="[rules.required, passwordMatch]"
                            label="รหัสผ่านอีกครั้ง"
                            :append-icon="show1 ? 'mdi-eye' : 'mdi-eye-off'"
                            :type="show1 ? 'text' : 'password'"
                            @click:append="show1 = !show1"
                            required
                          ></v-text-field>
                        </v-col>
                      </v-row>
                      <v-row>
                        <p style="margin: 0px; padding-left: 12px; padding-top: 15px">หมวดหมู่</p>
                        <v-col>
                          <v-row>
                            <v-col cols="3" v-for="type in types" :key="type.name">
                              <v-checkbox
                                style="margin: 0px"
                                :label="`${type.name}`"
                                color="success"
                                v-model="typeCheck"
                                :value="type"
                                :value-comparator="comparator"
                                hide-details
                              ></v-checkbox>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                    </v-form>
                    <p style="color: red" v-show="again" align="left">user หรือ password
                      ของท่านไม่ถูกต้องกรุณาลองใหม่อีกครั้ง</p>
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
                      สมัคร
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-flex>
            </v-layout>
          </v-container>
        </v-col>
      </v-row>
      <v-overlay :value="overlay">
        <v-card width="500px" light align="center" v-if="profile.active === 1">
          <v-card-title>สถานะของคุณคือ</v-card-title>
          <br>
          <v-card-subtitle v-if="profile.status.id === 2"><h1 style="color: orange">{{ profile.status.name }}</h1>
          </v-card-subtitle>
          <v-card-subtitle v-else><h1 style="color: red">{{ profile.status.name }}</h1></v-card-subtitle>
          <v-card-actions align="center">
            <v-btn text @click="()=>this.overlay = false">ปิด</v-btn>
          </v-card-actions>
        </v-card>
        <v-card width="500px" light align="center" v-else>
          <v-card-title>สถานะของคุณคือ</v-card-title>
          <br>
          <v-card-subtitle><h3 style="color: red">ผู้ใช้ของท่านถูกระงับการใช้งาน กรุณาติดต่อผู้ดูแลระบบ</h3>
          </v-card-subtitle>
          <v-card-actions align="center">
            <v-btn text @click="()=>this.overlay = false">ปิด</v-btn>
          </v-card-actions>
        </v-card>
      </v-overlay>
    </v-app>
  </div>
</template>
<script>
export default {
  layout: 'auth-layout',
  computed: {
    passwordMatch() {
      return () => this.password === this.verify || "Password must match";
    }
  },
  data: () => ({
    platformName: 'Yalae Betong',
    overlay: false,
    valid: true,
    again: false,
    profile: {},
    verify: '',
    show1: false,
    typeCheck: [],
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
      v => (v && v.length > 10) || 'Password must have 10 characters',
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
    this.getData()
  },
  methods: {
    comparator(a, b) {
      return a.id === b.id;
    },
    async getData() {
      await this.$axios.get(`place_type`)
        .then((res) => {
          this.types = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    },
    async validate() {
      this.$refs.form.validate()
      await this.addPermissionType()
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
    async register(id) {
      await this.$axios.post(`register`, {
        name: this.firstName+" "+this.lastName,
        email: this.email,
        password: this.password,
        c_password: this.verify,
        phone: this.phone,
        active: 1,
        status: 2,
        roles: 2,
        permission_type: id,
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
