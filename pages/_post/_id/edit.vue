<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;" v-show="check()">
          <Header title="เพิ่มข้อมูลประกาศให้เช่าบูชา"/>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card style="padding: 12px; margin-top: 12px">
              <v-row style="margin: 12px">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editeItem.phim_phra" label="พิมพ์พระ (Phim Phra)" required dense
                    :rules="[rules.required]" readonly/>
                  <!--                  <v-autocomplete-->
                  <!--                    :items="itemsAmulet.data" item-value="id" label="พิมพ์พระ (Phim Phra)" dense @change="test"-->
                  <!--                    v-model="editeItem" :rules="[rules.required]" return-object item-text="phim_phra"-->
                  <!--                  ></v-autocomplete>-->
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editeItem.buddhist_art" label="พุทธศิลป์ (Buddhist Art)" required dense
                    :rules="[rules.required]" readonly>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="editeItem.type_of_phra" :rules="[rules.required]" readonly label="ประเภทพระ (Type of Phra)"
                    dense :items="typePhra"/>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editeItem.lab_no" label="เลขที่แลป (Lab No.)" required dense
                    :rules="[rules.required]" readonly/>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editeItem.date_of_issue" required label="วันที่ออกผลแลป (Date of Issue)" dense
                    :rules="[rules.required]" readonly/>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-textarea
                    label="ข้อมูลเกี่ยวกับพระ (Phra Information)" hide-details v-model="editeItem.phra_information"
                    :rules="[rules.required]" readonly/>
                </v-col>
                <v-col cols="12" style="padding: 0">
                  <v-row>
                  <v-col cols="12" sm="3" v-for="(item, index) in editeItem.coverImage" :key="index">
                    <v-img :src="convortDo(item)" @click="openImage(index)"/>
                  </v-col>
                  </v-row>
                </v-col>
<!--                <v-col cols="12" style="padding-top: 0; padding-bottom: 0">-->
<!--                  <v-radio-group v-model="row" row @change="checkContact">-->
<!--                    <v-radio-->
<!--                      label="ติดต่อเช่าบูชากับเจ้าของวัตถุมงคล"-->
<!--                      value="owner"-->
<!--                    ></v-radio>-->
<!--                    <v-radio-->
<!--                      label="ให้ติดต่อเช่าบูชาผ่านทีมงานสยามอมูเลทคอลเลคชั่น"-->
<!--                      value="staff"-->
<!--                    ></v-radio>-->
<!--                  </v-radio-group>-->
<!--                </v-col>-->
                <v-row class="m-1 mt-5">
                <v-col cols="12" sm="6" class="pt-2">
                  <v-text-field
                    label="เบอร์ติดต่อ" v-model="phone" required dense
                    v-mask="'## #### ####'" disabled/>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="Line ID" v-model="line" required dense disabled/>
                </v-col>
                </v-row>
                <v-col cols="12" sm="12">
                  <v-radio-group v-model="typePrice" row @change="checkPrice">
                    <v-radio
                      label="ตั้งราคาเอง"
                      value="custom"
                    ></v-radio>
                    <v-radio
                      label="เสนอราคา"
                      value="choice"
                    ></v-radio>
                  </v-radio-group>
                </v-col>
                <v-col>
                  <v-text-field
                    label="ราคา" v-model="price" required dense
                    v-show="typePrice === 'custom'"/>
                  <v-select
                    v-show="typePrice !== 'custom'"
                    v-model="selectPrice"
                    :items="itemPrice"
                    @change="checkPrice"
                    label="เลือกช่วงราคาที่ต้องการ"
                  ></v-select>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-textarea label="รายละเอียดเพิ่มเติม" v-model="sale.detail" required dense
                              :rules="[rules.required]"/>
                </v-col>
              </v-row>
              <v-row style="margin: 12px">
                <v-spacer/>
                <v-btn color="#7b1817" dark outlined class="mr-3" @click="()=>{this.$router.back()}">
                  ยกเลิก
                </v-btn>
                <v-btn color="#7b1817" dark @click="nextPage">
                  บันทึก
                </v-btn>
              </v-row>
            </v-card>
          </v-form>
        </v-container>
        <v-container style="max-width: 1140px;" v-show="!check()">
          <!--          <v-sheet-->
          <!--            :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"-->
          <!--            class="pa-3">-->
          <!--            <v-skeleton-loader-->
          <!--              class="mx-auto"-->
          <!--              type="article"-->
          <!--            ></v-skeleton-loader>-->
          <!--          </v-sheet>-->
          <!--          <v-sheet-->
          <!--            :color="`grey ${theme.isDark ? 'darken-2' : 'lighten-4'}`"-->
          <!--            class="pa-3">-->
          <!--            <v-skeleton-loader-->
          <!--              class="mx-auto"-->
          <!--              type="article"-->
          <!--            ></v-skeleton-loader>-->
          <!--          </v-sheet>-->

          <Header title="ประกาศซื้อ-ขาย"/>
          <v-col style="padding-right: 0; padding-left: 0">
            <v-card class="d-flex align-center" flat height="300">
              <v-col align="center">
                <strong style="font-size: 130px">404</strong>
                <p>Page not found: {{ $route.params.id }}</p><br>
                <v-btn outlined color="#7b1817" to="/">To Home</v-btn>
              </v-col>
            </v-card>
          </v-col>
        </v-container>
      </v-main>
      <SliderImg :status="overlay" :callback="close" :items="editeItem.coverImage" :start="indexImg"/>
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
import SliderImg from "../../../components/SliderImg";
import convert from "~/api/convert";

export default {
  middleware: 'auth',
  inject: {
    theme: {
      default: {isDark: false},
    },
  },
  components: {
    SliderImg,
    Header,
    Dropzone,
    AddItemMonkNumber,
    DropzoneSingle
  },
  watch: {
    price(val) {
      if (val === undefined) return val
      let m = val.replaceAll(",","")
      this.price = m.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    },
  },
  data() {
    return {
      indexImg: 0,
      row: "owner",
      typePrice: 'custom',
      isEditing: false,
      sale: {},
      itemPrice: [
        "ราคาที่คาดหวัง XX,XXX (หลักหมื่น)",
        "ราคาที่คาดหวัง XXX,XXX (หลักแสน)",
        "ราคาที่คาดหวัง X,XXX,XXX (หลักล้าน)",
        "ราคาที่คาดหวัง XX,XXX,XXX (หลักสิบล้าน)",
      ],
      temple: [],
      materialOther: '',
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
        maxFiles: 6,

        // updateSingle:true,
        dictRemoveFile: "Remove", // ชื่อ ปุ่ม remove
        dictCancelUpload: "Cancel", // ชื่อ ปุ่ม ยกเลิก
        dictDefaultMessage: "เลือก Gallery", // ข้อความบนพื้นที่แสดงรูปจะแสดงหลังจากโหลดเพจเสร็จ
        dictFileTooBig: "ไม่อนุญาตให้อัพโหลดไฟล์เกิน 5 MB", //ข้อความแสดงเมื่อเลือกไฟล์ขนาดเกินที่กำหนด
        acceptedFiles: "image/*", // อนุญาตให้เลือกไฟล์ประเภทรูปภาพได้
      },
      activePicker: null,
      date: null,
      menu: false,
      overlay: false,
      valid: true,
      addOwner: false,
      total: 0,
      selectMaterial: [],
      itemsAmulet: [],
      typePhra: ["พระสมเด็จ", "พระรอด", "พระคง", "พระเปิม", "พระซุ้มกอ"],
      selectPrice: "",
      price: "",
      line: "",
      phone: "",
      detail: "",
      btnAddOwner: false,
      editeItem: {},
      defaultItem: {},
      itemsSale: {},
      rules: {
        required: value => !!value || "จำเป็น",
        min: v => (v && v.length >= 8) || "ตัวอักษร 8 ขึ้นไป",
        confirmPassword: value => value === this.password || 'รหัสผ่านไม่ต้องกัน',
        email: value => {
          const pattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
          return pattern.test(value) || 'กรุณากรอก e-mail'
        },
        phone: value => {
          const usernameRegex = /^[ 0-9_.]+$/
          return (usernameRegex.test(value) && value.length >= 12) || 'หมายเลขต้องครบ 10 ตัว'
        },
      },
      images: [],
      pathImg: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getSale()
    })
    // this.getMyApproved()
  },
  methods: {
    checkPrice(){
      // console.log(this.typePrice+"+++"+this.selectPrice)
      this.price = this.typePrice === 'custom'?this.sale.price:this.selectPrice
    },
    checkContact(){
      this.phone = '06 3651 9741'
      this.line = '@057vduzp'
      // console.log(this.phone+">>"+this.row)
    },
    check() {
      return this.editeItem != ''
    },
    convortDo(val) {
      if (val === undefined) return
      return convert.domain(val)
    },
    test() {
      // console.log(this.editeItem)
    },
    async getSale() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/sacred-object-out/detail`, {
        params: {
          id: this.$route.params.id,
          my: 1
        }
      }).then((res) => {
        this.editeItem = res.data.data
        this.sale = Object.assign({}, this.editeItem.sale === '' ? {} : this.editeItem.sale)
        this.typePrice = this.editeItem.sale === '' ? 'custom' : this.editeItem.sale.priceType
        this.row = this.editeItem.sale === '' ? 'owner' : this.editeItem.sale.contactType
        this.checkContact()
        this.checkPrice()
        this.$nuxt.$loading.finish()
        // console.log(JSON.stringify(this.editeItem.lab_typeId))
      }).catch((e) => {
        this.$nuxt.$loading.finish()
        console.log(e)
      })
    },
    async getMyApproved() {
      await this.$axios.get(`/sacred-object-out/my_approved`, {
        params: {
          keyword: "",
          page: 1,
          limit: 10,
        }
      }).then((res) => {
        this.itemsAmulet = res.data
        // console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
    async addSale() {
      await this.$axios.post(`/sacred-object-out/forsale`, {
        id: this.editeItem.id,
        price: this.price,
        line: this.line,
        mobile: this.phone.replaceAll(' ',''),
        detail: this.sale.detail,
        contactType: this.row,
        priceType: this.typePrice,
      }).then(() => {
        // console.log(res.data)
        this.$router.push(`/${this.editeItem.lab_typeId}`)
      }).catch((e) => {
        console.log(e)
      })
    },
    close() {
      this.overlay = false
    },
    nextPage() {
      if (!this.$refs.form.validate()) return
      if (Object.values(this.sale).length > 0 && this.sale.saleId !== undefined) {
        // console.log('edit'+JSON.stringify(this.editeItem))
        this.editSale()
      } else {
        console.log('add')
        this.addSale()
      }
    },
    async remove(file) {
      // console.log(JSON.stringify(file))
      // await this.$axios._post('/upload/delete', {
      //   filename: file
      // }).then((res) => {
      //   console.log(res.data)
      // }).catch((e) => {
      //   console.log(e)
      // })

      // if (this.$route.query.edite > -1) {
      //   await this.$axios.delete(`/image-upload/${file.id}`).then(() => {
      //   }).catch((error) => {
      //     console.log(error)
      //   })
      // } else {
      // console.log("file>"+JSON.stringify(file))
      // console.log("pathImg>"+this.pathImg)
      let index = this.pathImg.indexOf(file);
      if (index === -1) return
      await this.$axios.post(`/upload/delete`, {
        filename: this.images[index]
      }).then(() => {
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
    async addAmulet() {
      await this.$axios.post(`/sacred-object-out/save`, {
        phim_phra: this.editeItem.title,
        type_of_phra: this.editeItem.modelName,
        date_of_issue: this.date,
        phra_information: this.editeItem.history,
        buddhist_art: this.editeItem.procedureOther,
        lab_no: this.editeItem.serialNumber,
        coverImage: this.images.toString()
      }).then((res) => {
        this.$router.replace(`/items_list/${res.data.data.id}/payment`)
        // this.selectRoles = res.data.roles
        // this.images.map((d) => {
        //   this.addGalleries(res.data.data.id, '', d)
        // })
        // this.$router.back()
      }).catch((e) => {
        console.log(e)
        alert(e)
      })
    },
    onSelect() {
      // console.log(this.selectMaterial.toString())
    },

    async editSale() {
      await this.$axios.post(`/sacred-object-out/forsaleUpdate`, {
        id: this.editeItem.sale.saleId,
        price: this.price,
        line: this.line,
        mobile: this.phone.replaceAll(' ',''),
        detail: this.sale.detail,
        contactType: this.row,
        priceType: this.typePrice,
      }).then((res) => {
        // console.log(res.data)
        this.$router.push(`/${this.editeItem.lab_typeId}`)
      }).catch((e) => {
        console.log(e)
      })
    },
    openImage(val) {
      this.overlay = true
      this.indexImg = val
    },
    OnClick() {
      this.$router.push(`${this.$route.path}/history`)
    },

    async addGalleries(id, amuletOwner, img) {
      // console.log(JSON.stringify(img))
      await axios.post(`${serve.upload}/galleries`, {
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
      this.editeItem.galleries.map((d) => {
        const file = {id: d.id, size: d.size, name: d.name, type: d.type};
        this.$refs.bar.manuallyAddFile(file, d.path);
      })
    },
  },
}
</script>
