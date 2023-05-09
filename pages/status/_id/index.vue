<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;">
          <Header title="ยื่นเรื่องเพิ่มข้อมูลวัตถุมงคล"/>
          <v-form ref="form" v-model="valid" lazy-validation>
            <v-card style="padding: 12px; margin-top: 12px">
              <v-row style="margin: 12px">
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="editedItem.title" readonly label="ชื่อวัตถุมงคล" required dense
                    :rules="[rules.required]"/>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="editedItem.templeName" readonly label="ชื่อวัด" required dense
                    :rules="[rules.required]"/>
                </v-col>
                <v-col>
                  <v-text-field v-model="editedItem.modelName" readonly label="ชื่อรุ่น" required dense>
                  </v-text-field>
                </v-col>
                <v-col cols="12" sm="3">
                  <v-text-field v-model="editedItem.numberStart" readonly label="หมายเลขเริ่มต้น" required dense/>
                </v-col>
                <p style="align-self: center">-</p>
                <v-col cols="12" sm="3">
                  <v-text-field v-model="editedItem.numberEnd" label="หมายเลขสิ้นสุด" required dense readonly/>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field label="ราคา" v-model="convertMoney" required dense readonly/>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field v-model="convertDays" required label="วันที่ผลิต" dense readonly/>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-textarea label="ประวัติ" hide-details v-model="editedItem.history" readonly/>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-textarea v-model="editedItem.productionProcess" label="กรรมวิธีการผลิต" hide-details readonly/>
                </v-col>
              </v-row>
              <v-row style="margin: 12px">
                <v-col>
                  <p>วัสดุ</p>
                </v-col>
                <v-col style="" cols="11" sm="11">
                  <v-row>
                    <v-col v-for="(item, index) in items_list.data" :key="index" cols="6" sm="3">
                      <v-row>
                        <v-checkbox
                          :label="`${item}`"
                          v-model="convertMat"
                          :value="`${item}`"
                          readonly
                          @change="onSelect"/>
                        <v-text-field
                          style="padding-left: 5px"
                          readonly v-model="editedItem.materialOther"
                          v-if="items_list.data.indexOf(item) === (items_list.data.length - 1)">
                        </v-text-field>
                      </v-row>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col sm="12">
                  <v-textarea
                    readonly
                    v-model="editedItem.procedureOther"
                    label="ขั้นตอนอื่นๆ"
                    hide-details/>
                </v-col>
                <v-col sm="12">
                  <v-text-field
                    readonly
                    v-model="editedItem.serialNumber"
                    label="เลขซีเรียล"
                    hide-details/>
                </v-col>
                <v-col sm="12">
                  <p>รูปภาพประกอบ(ต้องมีอย่างน้อย6รูป สำหรับ6ด้าน)</p>
                </v-col>
                <v-col sm="3" v-for="(item, index) in editedItem.coverImage" :key="index">
                  <v-img :src="item"/>
                </v-col>
                <v-col cols="12" sm="12">
                  <v-text-field
                    v-model="editedItem.note" label="หมายเหตุ"
                    required dense
                  ></v-text-field>
                </v-col>
              </v-row>
              <v-row style="margin: 12px">
                <v-btn
                  color="#E4AB40" class="mr-3" @click="addOwner = true"
                  :disabled="editedItem.total <= ownerItems.total" v-if="btnAddOwner">
                  <p style="color: white">เพิ่มผู้ถือครอง</p>
                </v-btn>
                <v-spacer/>
                <v-btn color="#7b1817" dark outlined class="mr-3" @click="()=>{this.$router.back()}">
                  กลับ
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
import con from "~/api/convert";

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
      options: {
        url: `${serve.api}/single-upload`,
        thumbnailWidth: 150,
        maxFilesize: 2,
        addRemoveLinks: true,
        clickable: true,
        uploadMultiple: false, // อัพโหลดไฟล์หลายไฟล์
        maxFiles: 6,
        // updateSingle:true,
        dictRemoveFile: "Remove", // ชื่อ ปุ่ม remove
        dictCancelUpload: "Cancel", // ชื่อ ปุ่ม ยกเลิก
        dictDefaultMessage: "เลือก Gallery", // ข้อความบนพื้นที่แสดงรูปจะแสดงหลังจากโหลดเพจเสร็จ
        dictFileTooBig: "ไม่อนุญาตให้อัพโหลดไฟล์เกิน 2 MB", //ข้อความแสดงเมื่อเลือกไฟล์ขนาดเกินที่กำหนด
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
      ownerItems: {},
      selectUser: '',
      owner: '',
      btnAddOwner: false,
      editedItem: {},
      defaultItem: {
        amulet_detail: {
          model: '',
          mfg: '',
          price: '',
        },
        update_by: {
          username: '',
        }
      },
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
    }
  },
  computed: {
    convertMoney() {
      if (this.editedItem.price) {
        // return con.money(val)
        return con.money(this.editedItem.price)
      }
    },
    convertDays() {
      if (this.editedItem.manufactureDate) {
        return con.days(this.editedItem.manufactureDate)
      }
    },
    convertMat() {
      if (this.editedItem.material) {
        return JSON.parse(this.editedItem.material)
      }
    },
  },
  mounted() {
    this.getDetail()
    this.getMaterial()
  },
  methods: {
    async remove(file) {
      if (this.$route.query.edite > -1) {
        await this.$axios.delete(`/image-upload/${file.id}`).then(() => {
        }).catch((error) => {
          console.log(error)
        })
      } else {
        let index = this.images.indexOf(file);
        if (index === -1) return
        this.images.splice(index, 1)
        let _url = file.path.split('/')

        await this.$axios.delete(`/single-upload/${_url[_url.length - 1]}`).then(() => {
        }).catch((error) => {
          console.log(error)
        })
      }
    },
    async success(file, res) {
      file.path = res.path
      // console.log(JSON.stringify(res))
      this.images.push(res)
    },
    formatTime(time, format = 'DD MMM YYYY') {
      return this.$dayjs(time).format(format)
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
    async getDetail() {
      await axios.get('/sacred-object/detail', {
        params: {
          id: this.$route.params.id
        }
      }).then((res) => {
        this.editedItem = res.data.data;
        // console.log(this.editedItem)
      }).catch((error) => {
        console.log(error)
      })
    },
    saveAmulet() {
      if (!this.$refs.form.validate()) return
      // console.log(2+">>"+this.$refs.form.validate())
      if (this.$route.params.id !== 'add') {
        console.log('edit')
        this.editAmulet()
      } else {
        this.addAmulet()
      }
    },
    async saveOwner() {
      await this.$axios.post(`/owner`, {
        'number': this.ownerItems.total + 1,
        'amulet': this.editedItem.id,
        'update_by': this.$auth.user.id,
        'owner': this.owner.id,
      }).then(() => {
        this.getOwner()
        this.addOwner = false
      }).catch((error) => {
        alert(error)
        console.log(error)
      })
    },
    async addAmulet() {
      await this.$axios.post(`/amulet`, {
        'name': this.editedItem.name,
        'total': this.editedItem.total,
        'model': this.editedItem.model,
        'price': this.editedItem.price,
        'mfg': this.date,
        'history': this.editedItem.history,
        'manufacturing': this.editedItem.manufacturing,
        'other': this.editedItem.other,
        'material': JSON.stringify(this.selectMaterial),
        'note': this.editedItem.note,
        'update_by': this.$auth.user.id,
      }).then((res) => {
        // this.selectRoles = res.data.roles
        // console.log(JSON.stringify(this.images))
        this.images.map((d) => {
          this.addGalleries(res.data.id, '', d)
        })
        this.$router.back()
      }).catch((e) => {
        console.log(e)
        alert(e)
      })
    },
    onSelect() {
      // console.log(this.selectMaterial)
    },

    async editAmulet() {
      await this.$axios.put(`/amulet/${this.editedItem.id}`, {
        'total': this.editedItem.total,
        'number': this.editedItem.number,
        'update_by': this.$auth.user.id,
        'name': this.editedItem.name,
        'model': this.editedItem.model,
        'price': this.editedItem.price,
        'mfg': this.date,
        'history': this.editedItem.history,
        'manufacturing': this.editedItem.manufacturing,
        'other': this.editedItem.other,
        'material': JSON.stringify(this.selectMaterial),
        'note': this.editedItem.note,
      })
        .then(() => {
          this.$router.back()
        }).catch((error) => {
          console.log(error)
          alert(error)
        })
    },
    openImage() {
      this.overlay = false
    },
    OnClick() {
      this.$router.push(`${this.$route.path}/history`)
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
