<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;">
          <Header title="ยื่นเรื่องเพิ่มข้อมูลวัตถุมงคล"/>
          <v-card style="padding: 12px; margin-top: 12px">
            <v-row style="margin: 12px">
              <v-col cols="12" sm="12">
                <v-select
                  :items="promotions.data"
                  v-model="selectPromotion"
                  style="padding-right: 12px"
                  label="เลือกจำนวนปีที่ลงทะเบียนวัตถุมงคล"
                  required
                  :rules="[rules.required]"
                  :readonly="promotionsId !== null && this.promotionsId !== '0'"
                  return-object
                  item-text="title"
                  @change="getPro"
                  hide-details
                ></v-select>
              </v-col>
              <v-col cols="12" sm="3" v-show="check">
                <p><strong>ชื่อรายการ:</strong> {{ selectPromotion.title }}</p>
              </v-col>
              <v-col v-show="check">
                <p><strong>รายละเอียด:</strong> {{ selectPromotion.detail }}</p>
              </v-col>
              <v-col cols="12" sm="2" v-show="check">
                <p><strong>ราคา:</strong> {{ convert() }}</p>
              </v-col>
              <v-col cols="12" sm="12">
                <p style="padding-bottom: 12px">ช่องทางการจ่ายเงิน</p>
                <p style="padding-bottom: 12px"><strong>นางสาวปสุตา ปัญญาทิพย์</strong></p>
                <p style="padding-bottom: 12px"><strong>ธนาคารทหารไทยธนชาต</strong> บัญชีออมทรัพย์ เลขที่ <strong>021-735483-6</strong>
                <p style="padding-bottom: 12px">ชำระแล้ว กรุณาส่งหลักฐานการจ่ายเงินมาที่ Line ของ Siamamuletcollection
                  (ID : <strong>@577owbay</strong>) หรือ แนบภาพหลักการจ่ายเงิน มาในกรอบข้างล่างนี้ครับ
                </p>
                <v-img src="/qrpayment.jpg" max-width="300"></v-img>
              </v-col>
              <v-col>
                <!--                    <DropzoneSingle-->
                <!--                        :callback="getPath"-->
                <!--                        :addRemove="true"-->
                <!--                        :maxFiles="4"-->
                <!--                        :maxSize="4"-->
                <!--                        :multiple="true"-->
                <!--                        :clickable="true"/>-->
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
                        กดเพื่อเลือกสลิปโอนเงิน
                      </p>
                    </v-col>
                  </div>
                </dropzone>
              </v-col>
            </v-row>
            <v-row style="margin: 12px">
              <v-spacer/>
              <v-btn color="#7b1817" outlined dark class="mr-3" @click="()=>{$router.replace('/status')}">
                จ่ายเงินภายหลัง
              </v-btn>
              <v-btn color="#7b1817" dark @click="submit">
                ยืนยัน
              </v-btn>
            </v-row>
          </v-card>
          <DialogCon :detail="massage" :callback="close" :status="status"/>
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
import AddItemMonkNumber from "~/components/AddItemMonkNumber"
import DropzoneSingle from "~/components/DropzoneSingle"
import serve from "~/api/server";

import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";
import Header from "~/components/Header";
import axios from "~/api/config";
import con from "~/api/convert";
import DialogCon from "../../../components/DialogCon";

export default {
  middleware: 'auth',
  components: {
    DialogCon,
    Header,
    Dropzone,
    AddItemMonkNumber,
    DropzoneSingle
  },
  data() {
    return {
      //
      files: null,
      data: null,
      toStatus: false,
      massage: '',
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

      promotionsId: '0',
      activePicker: null,
      date: null,
      menu: false,
      overlay: false,
      valid: true,
      addOwner: false,
      total: 0,
      promotions: {},
      selectPromotion: {
        title: '',
        detail: '',
        price: ''
      },
      selectMaterial: [],
      items_list: [],
      users: [],
      ownerItems: {},
      status: false,
      selectUser: '',
      owner: '',
      check: false,
      btnAddOwner: false,
      editedItem: {},
      rules: {
        required: value => !!value || "จำเป็น",
        min: v => (v && v.length >= 8) || "ตัวอักษร 8 ขึ้นไป",
        confirmPassword: value => value === this.password || 'รหัสผ่านไม่ต้องกัน',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'กรุณากรอก e-mail'
        }
      },
      images: [],
      pathImg: [],
      detail: {},
    }
  },
  mounted() {
    this.getPromotions()
  },
  methods: {
    close() {
      this.status = false
      if (this.toStatus) {
        this.$router.replace('/status')
      }
    },
    async submit() {
      if (this.selectPromotion.id === undefined) {
        this.status = true
        this.massage = 'กรุณาเลือกโปรโมชั่นก่อนทำรายการ'
        return
      }
      await this.$axios.post(`/sacred-object-out/updatePromotions`, {
        id: this.$route.params.id,
        promotionsId: this.selectPromotion.id,
        docAttachSlip: this.images.toString()
      }).then((res) => {
        this.toStatus = true
        this.summarize()
        // console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
    summarize() {
      this.status = true
      this.massage = `<p align="left" style="padding-left: 30px; padding-right: 30px; padding-bottom: 6px">
                      <strong>โปรโมชั่นที่เลือก</strong>: ${this.selectPromotion.title}</p>
                      <p align="left" style="padding-left: 30px; padding-right: 30px; padding-bottom: 6px">
                      <strong style="padding-bottom: 12px">ราคา</strong>: ${this.selectPromotion.price}</p>
                      <p align="left" style="padding-left: 30px; padding-right: 30px; padding-bottom: 6px">
                      <strong>ไอดีผู้ใช้งาน</strong>: ${this.$auth.user.memberCode}</p>
                      <p align="left" style="padding-left: 30px; padding-right: 30px; padding-bottom: 6px">
                      <strong>เลขที่แลป</strong>: ${this.detail.data.lab_no}
                      </p>`
    },
    async getDetail() {
      await this.$axios.get('/sacred-object-out/detail', {
        params: {
          id: this.$route.params.id,
          my:1
        }
      }).then((res) => {
        this.detail = res.data
        this.promotionsId = this.detail.data.promotionsId
        if (this.promotionsId !== null && this.promotionsId !== '0' && this.promotions.data !== undefined && this.promotions.data.length > 0) {
          this.promotions.data.map(async (s) => {
            if (s.id === this.promotionsId) {
              this.selectPromotion = s
            }
          });
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    convert() {
      if (this.selectPromotion.price) {
        return con.money(this.selectPromotion.price)
      }
    },
    getPro() {
      this.check = true
      // console.log(this.selectPromotion)
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
    save(date) {
      this.$refs.menu.save(date)
    },
    getPath(res) {
      this.image = res.path
      // console.log(JSON.stringify(res))
    },
    async getPromotions() {
      await this.$axios.get('/sacred-object/promotions').then((res) => {
        this.promotions = res.data;
        this.getDetail()
        // console.log(JSON.stringify(this.promotions))
      }).catch((error) => {
        console.log(error)
      })
    },
    openImage() {
      this.overlay = false
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
      this.editedItem.galleries.map((d) => {
        const file = {id: d.id, size: d.size, name: d.name, type: d.type};
        this.$refs.bar.manuallyAddFile(file, d.path);
      })
    },
  },
}
</script>
