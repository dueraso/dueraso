<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;">
          <Header title="ยื่นเรื่องเพิ่มข้อมูลวัตถุมงคล"/>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card style="padding: 12px; margin-top: 12px">
              <v-row style="margin: 12px">
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editeItem.phim_phra" label="พิมพ์พระ (Phim Phra)" required dense
                    :rules="[rules.required]"/>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editeItem.buddhist_art" label="พุทธศิลป์ (Buddhist Art)" required dense
                    :rules="[rules.required]">
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="isTypePhra" label="ประเภทพระ (Type of Phra)" required dense
                    :rules="[rules.required]" v-show="$route.params.id !== 'add'" readonly>
                  </v-text-field>
                  <v-autocomplete
                    :items="typePhra" v-show="$route.params.id === 'add'"
                    v-model="isTypePhra" :rules="[rules.required]" return-object item-text="title"
                    item-value="title"
                    label="ประเภทพระ (Type of Phra)" dense
                  ></v-autocomplete>
                </v-col>

                <v-col cols="12" sm="12">
                  <v-radio-group v-model="typeLab" row>
                    <v-radio
                      label="พระสมเด็จมาตรฐาน PSDA"
                      value="1"
                    ></v-radio>
                    <v-radio
                      label="พระเครื่องพร้อมใบตรวจอัตลักษณ์"
                      value="2"
                    ></v-radio>
                  </v-radio-group>
                </v-col>

                <v-col cols="12" sm="6">
                  <v-text-field
                    v-model="editeItem.lab_no" label="เลขที่แลป (Lab No.)" dense :readonly="$route.params.id !== 'add'"/>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-menu
                    ref="menu" v-model="menu" :close-on-content-click="false" transition="scale-transition"
                    offset-y min-width="auto">
                    <template v-slot:activator="{ on, attrs }">
                      <v-text-field
                        v-model="date" label="วันที่ออกผลแลป (Date of Issue)" dense v-bind="attrs" v-on="on"/>
                    </template>
                    <v-date-picker
                      v-model="date" :active-picker.sync="activePicker" locale="th-th" @change="save"
                      :max="(new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)"/>
                  </v-menu>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-textarea
                    label="ข้อมูลเกี่ยวกับพระ (Phra Information)" hide-details v-model="editeItem.phra_information"
                    :rules="[rules.required]"/>
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
                          กดเพื่อเลือกเฉพาะรูปภาพพระและรูปภาพที่เกี่ยวข้อง<br/>
                          ระบบจะเลือกรูปที่ 1 เป็นรูปหน้าปก
                        </p>
                      </v-col>
                    </div>
                  </dropzone>
                </v-col>
              </v-row>
              <v-row style="margin: 12px">
                <v-spacer/>
                <v-btn color="#7b1817" dark outlined class="mr-3" @click="()=>{this.$router.back()}">
                  ยกเลิก
                </v-btn>
                <v-btn color="#7b1817" dark @click="nextPage">
                  {{ $route.params.id === 'add' ? "ถัดไป" : "ยืนยัน" }}
                </v-btn>
              </v-row>
            </v-card>
          </v-form>
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
import convert from "~/api/convert";

import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";
import Header from "~/components/Header";
import axios from "~/api/config";

export default {
  middleware: 'auth',
  components: {
    Header,
    Dropzone,
    AddItemMonkNumber,
    DropzoneSingle
  },
  data() {
    return {
      isEditing: false,
      templesel: {},
      temple: [],
      typeLab: '1',
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
      items_list: [],
      users: [],
      typePhra: [],
      ownerItems: {},
      selectUser: '',
      owner: '',
      btnAddOwner: false,
      editeItem: {},
      defaultItem: {},
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
      isTypePhra: '',
    }
  },
  created() {
    if (this.$route.params.id !== 'add') {
      this.getDetail()
    }
  },
  mounted() {
    this.getMaterial()
    this.getTemple()
    this.getCategory()
  },
  methods: {
    async getCategory() {
      this.$axios.$get("/sacred-object-out/category").then((res) => {
        this.typePhra = res.data
        // console.log(JSON.stringify(res.data))
      }).catch((e) => {
        console.log(e)
      })
    },
    getName(val = '') {
      if (this.editeItem == '') return
      if (val) return val.replace('http://192.168.100.109:8084/admin/uploads/sacred_object_out/', '')
      else return this.editeItem.coverImage.map((d) => d.replace('http://192.168.100.109:8084/admin/uploads/sacred_object_out/', ''))
    },
    async getDetail() {
      await this.$axios.get('/sacred-object-out/detail', {
        params: {
          id: this.$route.params.id
        }
      }).then((res) => {
        this.editeItem = Object.assign({}, res.data.data);
        if (this.editeItem.status != 4) this.$router.push(this.localePath('index'))
        let _phra = this.typePhra.find((t) => t.title === this.editeItem.type_of_phra)
        this.isTypePhra = _phra === undefined ? this.editeItem.type_of_phra : _phra
        this.date = this.editeItem.date_of_issue === '0000-00-00' ? '1830-01-01' : this.editeItem.date_of_issue
        this.images = this.getName()
        // console.log(this.getName())
        this.loadGalleries()
      }).catch((error) => {
        console.log(error)
      })
    },
    nextPage() {
      if (!this.$refs.form.validate()) return
      // console.log(this.isTypePhra)
      if (this.$route.params.id !== 'add') {
        this.editAmulet()
      } else {
        console.log('add')
        this.addAmulet()
      }
    },
    async remove(file) {
      // console.log(JSON.stringify(this.pathImg) + "<<ก่อน img>" + JSON.stringify(file))
      if (file.manal) {
        await this.delImage(file.name)
      } else {
        let index = this.pathImg.indexOf(file);
        if (index === -1) return
        await this.delImage(this.images[index])
      }
      // await this.$axios._post(`/upload/delete`, {
      //   filename: this.images[index]
      // }).then((res) => {
      //   this.images.splice(this.images[index], 1)
      // }).catch((error) => {
      //   console.log(error)
      // })
      // }
    },
    async delImage(val) {
      await this.$axios.post(`/upload/delete`, {
        filename: val
      }).then((res) => {
        let index = this.images.indexOf(val);
        if (index > -1) {
          this.images.splice(index, 1)
        }
      }).catch((error) => {
        console.log(error)
      })
    },
    async success(file, res) {
      // file.path = res.path
      file.manal = false
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
    async getMaterial() {
      await axios.get('/sacred-object/material').then((res) => {
        this.items_list = res.data;
      }).catch((error) => {
        console.log(error)
      })
    },
    async getTemple() {
      await axios.get('/temple/list').then((res) => {
        this.temple = res.data;
        // console.log(this.temple)
      }).catch((error) => {
        console.log(error)
      })
    },
    async addAmulet() {
      await this.$axios.post(`/sacred-object-out/save`, {
        phim_phra: this.editeItem.phim_phra,
        buddhist_art: this.editeItem.buddhist_art,
        // type_of_phra: this.isTypePhra,
        type_of_phra: this.isTypePhra.title,
        lab_typeId: this.typeLab,
        lab_no: this.editeItem.lab_no,
        date_of_issue: this.date,
        phra_information: this.editeItem.phra_information,
        coverImage: this.images.toString(),
        categoryId: this.isTypePhra.categoryId
      }).then((res) => {
        console.log(JSON.stringify(res.data))
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
    async editAmulet() {
      await this.$axios.post(`/sacred-object-out/update`, {
        id: this.editeItem.id,
        phim_phra: this.editeItem.phim_phra,
        buddhist_art: this.editeItem.buddhist_art,
        type_of_phra: this.isTypePhra,
        date_of_issue: this.date,
        phra_information: this.editeItem.phra_information,
        lab_no: this.editeItem.lab_no,
        coverImage: this.images.toString(),
        lab_typeId: this.typeLab,
      }).then((res) => {
        // this.$router.replace(`/items_list/${res.data.data.id}/payment`)
        // this.selectRoles = res.data.roles
        // this.images.map((d) => {
        //   this.addGalleries(res.data.data.id, '', d)
        // })
        // console.log(res.data)
        this.$router.back()
      }).catch((e) => {
        console.log(e)
      })
    },
    onSelect() {
      // console.log(this.selectMaterial.toString())
    },

    // async editAmulet() {
    //   await this.$axios.put(`/amulet/${this.editeItem.id}`, {
    //     'total': this.editeItem.total,
    //     'number': this.editeItem.number,
    //     'update_by': this.$auth.user.id,
    //     'name': this.editeItem.name,
    //     'model': this.editeItem.model,
    //     'price': this.editeItem.price,
    //     'mfg': this.date,
    //     'history': this.editeItem.history,
    //     'manufacturing': this.editeItem.manufacturing,
    //     'other': this.editeItem.other,
    //     'material': JSON.stringify(this.selectMaterial),
    //     'note': this.editeItem.note,
    //   })
    //     .then(() => {
    //       this.$router.back()
    //     }).catch((error) => {
    //       console.log(error)
    //       alert(error)
    //     })
    // },
    openImage() {
      this.overlay = false
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
      this.editeItem.coverImage.map((d) => {
        const file = {size: 500000, name: this.getName(d), manal: true};
        this.$refs.bar.manuallyAddFile(file, convert.domain(d));
      })
    },
  },
}
</script>
