<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <!--        <v-row style="background-image: url('/head-bar.png'); height: 220px" align="center">-->
        <!--          <v-container style="max-width: 1140px;">-->
        <!--            <Header title="ข้อมูลส่วนตัว" :img="'myprofile.png'"/>-->
        <!--          </v-container>-->
        <!--        </v-row>-->
        <v-container style="max-width: 1140px;">
          <Header title="ข้อมูลส่วนตัว" :img="'/head.jpg'"/>
          <v-col style="padding-left: 0; padding-right: 0;" align="center">
            <v-card style="padding: 12px;">
              <v-row style="margin: 15px;">
                <v-col sm="8" align="left">
                  <p style="font-size: 20px;">ข้อมูลทั่วไป</p>
                </v-col>
                <v-col cols="12" sm="6" align="left">
                  <v-text-field label="ชื่อจริง" v-model="profile.firstname"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" align="left">
                  <v-text-field label="นามสกุล" v-model="profile.lastname"></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" align="left">
                  <v-text-field
                    label="เลขบัตรประชาชน" v-mask="'#-####-#####-##-#'" v-model="profile.citizen_id"
                    :rules="[rules.required]"/>
                </v-col>
                <v-col cols="12" sm="6" align="left" style="margin-top: 18px">
                  <v-menu
                    ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition" offset-y
                    min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="birthday"
                        label="วัน เดือน ปีเกิด"
                        light dense prepend-inner-icon="mdi-calendar-month-outline"
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
                <v-col cols="12" sm="6" align="left">
                  <v-text-field
                    label="อีเมล" v-model="profile.email" :rules="[rules.required, rules.email]"/>
                </v-col>
                <v-col cols="12" sm="6" align="left">
                  <v-text-field
                    label="เบอร์" v-model="profile.mobile" v-mask="'## #### ####'"
                    :rules="[rules.phone]"/>
                </v-col>
                <v-col sm="12" align="left">
                  <p style="font-size: 20px;">ข้อมูลผู้ใช้งาน</p>
                </v-col>
                <v-col sm="6" align="left">
                  <v-text-field label="ชื่อผู้ใช้งาน" readonly v-model="profile.username"></v-text-field>
                </v-col>
                <v-col sm="6" align="left">
                  <v-text-field label="รหัสสมาชิก" readonly v-model="profile.memberCode"></v-text-field>
                </v-col>
                <v-col>
                  <dropzone
                    id="bar"
                    ref="bar"
                    :options="options"
                    :destroyDropzone="false"
                    :useCustomSlot="true"
                    v-on:vdropzone-removed-file="remove"
                    v-on:vdropzone-success="success"
                  >
                    <div class="dropzone-custom-content">
                      <v-col style="align-content: center">
                        <p class="subtitle">
                          <v-icon color="#e3ab3f">mdi-plus-circle</v-icon>
                          กดเพื่อเลือกเฉพราะรูปบัตรประชาชน
                        </p>
                      </v-col>
                    </div>
                  </dropzone>
                </v-col>
              </v-row>
            </v-card>
            <v-row style=" margin-top: 12px; margin-right: 0">
              <v-spacer/>
              <v-btn style="margin-right: 12px" outlined color="#7b1817" @click="$router.back()">ยกเลิก</v-btn>
              <v-btn color="#7b1817" dark @click="updateProfile">บันทึก</v-btn>
            </v-row>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
.v-application p {
  margin: 0;
}
</style>
<script>
// import ItemMonkNumber from "~/components/ItemMonkNumber"
import Vue from 'vue'
import VueMask from 'v-mask'
import {VueMaskDirective} from 'v-mask'

Vue.use(VueMask);
Vue.directive('mask', VueMaskDirective);
import VueQrcode from '@chenfengyuan/vue-qrcode';

import serve from "~/api/server";
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";

Vue.component(VueQrcode.name, VueQrcode);

export default {
  components: {
    // ItemMonkNumber,
    Dropzone,
    VueMask,
  },
  data() {
    return {
      activePicker: null,
      options: {
        url: `${serve.api}/upload/insert`,
        headers: {
          Authorization: `Bearer ${this.$auth.$storage.getLocalStorage('token')}`,
          'Type-upload': 'sacred_object_out',
        },
        thumbnailWidth: 150,
        maxFilesize: 5,
        addRemoveLinks: true,
        clickable: true,
        uploadMultiple: false, // อัพโหลดไฟล์หลายไฟล์
        maxFiles: 1,

        // updateSingle:true,
        dictRemoveFile: "Remove", // ชื่อ ปุ่ม remove
        dictCancelUpload: "Cancel", // ชื่อ ปุ่ม ยกเลิก
        dictDefaultMessage: "เลือก Gallery", // ข้อความบนพื้นที่แสดงรูปจะแสดงหลังจากโหลดเพจเสร็จ
        dictFileTooBig: "ไม่อนุญาตให้อัพโหลดไฟล์เกิน 5 MB", //ข้อความแสดงเมื่อเลือกไฟล์ขนาดเกินที่กำหนด
        acceptedFiles: "image/*", // อนุญาตให้เลือกไฟล์ประเภทรูปภาพได้
      },
      profile: {},
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
          return usernameRegex.test(value) || 'ต้องเป็นภาษาอังกฤษและสามารถผสมกับอักษรพิเศษได้'
        },
        phone: value => {
          const usernameRegex = /^[ 0-9_.]+$/
          return (usernameRegex.test(value) && value.length >= 12) || 'หมายเลขต้องครบ 10 ตัว'
        },
      },
      birthday: '',
      menu: false,
      images: [],
      pathImg: [],
    }
  },
  mounted() {
    this.profile = Object.assign({}, this.$auth.user)
    this.birthday = this.profile.birthday
    this.loadGalleries()
  },
  methods: {
    formatTime(time, format = 'DD MMM YYYY') {
      return this.$dayjs(time).format(format)
    },
    async updateProfile() {
      this.$nuxt.$loading.start()
      await this.$axios.post(`/member/updateProfile`, {
        firstname: this.profile.firstname,
        lastname: this.profile.lastname,
        citizen_id: this.profile.citizen_id.replaceAll('-', ''),
        email: this.profile.email,
        birthday: this.birthday,
        mobile: this.profile.mobile.replaceAll(' ', ''),
        password: '',
        confPassword: '',
        coverImage: '',
        contentImage: this.images.toString()
      }).then((res) => {
        this.$router.back()
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e)
      })
    },
    save(date) {
      this.$refs.menu.save(date)
    },
    async remove(file) {
      // if (this.$route.query.edite > -1) {
      //   await this.$axios.delete(`/image-upload/${file.id}`).then(() => {
      //   }).catch((error) => {
      //     console.log(error)
      //   })
      // } else {

      let index = this.pathImg.indexOf(file);
      if (index === -1) return
      await this.$axios.post(`/upload/delete`, {
        filename: this.images[index]
      }).then((res) => {
        this.images.splice(this.images[index], 1)
      }).catch((error) => {
        console.log(error)
      })
      // }
    },
    async success(file, res) {
      // file.path = res.path
      this.pathImg.push(file)
      this.images.push(res.data.file_name)
    },
    async addGalleries(id, amuletOwner, img) {
      // console.log(JSON.stringify(img))
      await this.$axios.post(`/galleries`, {
        'amulet': id,
        'amulet_owner': amuletOwner,
        'path': img.path,
        'name': img.name,
        'type': img.type,
        'size': img.size,
      }).then(() => {
      }).catch((error) => {
        console.log(error)
      })
    },
    async loadGalleries() {
      this.profile.contentImage.map((d) => {
        const file = {size: '300'};
        this.$refs.bar.manuallyAddFile(file, d);
      })
    },
  },
}
</script>
