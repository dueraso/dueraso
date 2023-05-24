<template>
  <v-card>
    <v-card-title style="background-color: #EEF7F6; height: 100px">
      <v-container>
        <v-row>
          <v-btn @click="()=>this.$router.back()" text fab>
            <v-icon
              large
              color="#54B6C8"
            >mdi-chevron-left
            </v-icon>
          </v-btn>
          <h4 style="align-self: center; color: #5561B0">เพิ่มสถานที่</h4>
          <v-spacer/>
          <v-btn
            @click="()=>this.$router.back()"
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
        <v-row>
          <v-col cols="12">
            <p style="color: #54B6C8">ชื่อสถานที่</p>
            <v-text-field
              label="ระบุสถานที่"
              outlined
              dense
              full-width
              color="#54B6C8"
              hide-details
              v-model="editedItem.topic">
            </v-text-field>
          </v-col>

          <v-col cols="12">
            <p style="color: #54B6C8">รายละเอียดสถานที่</p>
            <v-textarea
              outlined
              dense
              full-width
              color="#54B6C8"
              hide-details
              v-model="editedItem.detail"
              label="ระบุข้อมูลคำบรรยาย รายละเอียด สถานที่ หรือ วัตถุ"
            ></v-textarea>
          </v-col>

          <!--          <v-col cols="12" sm="6" md="2">-->
          <v-col cols="12" sm="6" md="2">
            <p style="color: #54B6C8">ประเภทของสถานที่</p>
            <v-select
              dense
              :items="items"
              v-model="priority"
              label="ประเภทของสถานที่"
              outlined
              hide-details
            ></v-select>
          </v-col>
          <v-col cols="12" sm="6" md="10">
            <p style="color: #54B6C8">ระบุสถานที่อ้างอิง</p>
            <!--            <v-select-->
            <!--              dense-->
            <!--              :items="items"-->
            <!--              label="พิมพ์เพื่อค้นหาสถานที่อ้างอิง"-->
            <!--              hide-details-->
            <!--              outlined-->
            <!--            ></v-select>-->
            <v-autocomplete
              outlined
              auto-select-first
              chips
              clearable
              deletable-chips
              multiple
              small-chips
              :items="sub_location"
              v-model="is_sub_location"
              return-object
              item-text="topic"
              item-value="id"
              label="พิมพ์เพื่อค้นหาสถานที่อ้างอิง"
              hide-details
              dense
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p style="color: #54B6C8">ละติจูด</p>
            <v-text-field
              outlined
              dense
              v-model="editedItem.latitude"
              full-width
              color="#54B6C8"
              hide-details
              label="ละติจูด"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p style="color: #54B6C8">ลองจิจูด</p>
            <v-text-field
              outlined
              dense
              v-model="editedItem.longitude"
              full-width
              color="#54B6C8"
              hide-details
              label="ลองจิจูด"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <p style="color: #54B6C8">URL สำหรับ YouTube</p>
            <v-text-field
              dense
              outlined
              v-model="editedItem.url_youtube"
              full-width
              color="#54B6C8"
              hide-details
              label="ระบุURL"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <p style="color: #54B6C8">URL เพิ่มเติมเพื่อเชื่อมโยงไปยังแหล่งข้อมูลที่เกี่ยวข้อง เช่น wiki </p>
            <v-text-field
              dense
              outlined
              v-model="editedItem.url_wiki"
              full-width
              color="#54B6C8"
              hide-details
              label="ระบุURL"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p style="color: #54B6C8">รูปภาพประกอบ</p>
            <dropzone
              id="bar"
              ref="bar"
              :options="options"
              :destroyDropzone="this.desDropzone"
              :useCustomSlot="true"
              v-on:vdropzone-removed-file="remove"
              v-on:vdropzone-success="success"
            >
              <div class="dropzone-custom-content">
                <v-col style="align-content: center">
                  <v-chip label class="subtitle" style="margin: 0px" color="#54B6C8" dark>
                    <v-icon>mdi-plus</v-icon>
                    กดเพื่อเลือกรูปภาพ
                  </v-chip>
                </v-col>
              </div>
            </dropzone>
          </v-col>
          <v-col cols="12" sm="6" md="6">
            <p style="color: #54B6C8">รูปไอคอน</p>
            <DropzoneSingle
              align="center"
              :callback="getPath"
              :addRemove="true"
              :clickable="true"
              :maxFiles="1"
              :image="loadImage"
            />
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<style>
.dropzone .dz-preview .dz-image {
  position: unset;
}

.vue-dropzone > .dz-preview .dz-remove {
  position: sticky;
  margin: 0px;
}
</style>
<script>
import Dropzone from "nuxt-dropzone";
import DropzoneSingle from "@/components/DropzoneSingle.vue";
import "nuxt-dropzone/dropzone.css";
import serve from "~/api/server";
import log from "./log";

export default {
  middleware: 'auth',
  components: {
    Dropzone,
    DropzoneSingle,
  },
  data() {
    return {
      items: ['A', 'B', 'C'],
      sub_location: [],
      is_sub_location: [],
      editedItem: {},
      priority: '',
      places: {},
      isDisabled: true,
      isEdite: true,
      // editedIndex: -1,
      place_type: [],
      slide_show: false,
      isId: null,
      type_select: null,
      desDropzone: false,
      images: [],
      image: '',

      options: {
        url: `${serve.api}/${this.$route.query.edite > -1 ? "image-upload/" + this.$route.query.edite : "single-upload"}`,
        thumbnailWidth: 150,
        maxFilesize: 2,
        addRemoveLinks: true,
        clickable: true,
        uploadMultiple: false, // อัพโหลดไฟล์หลายไฟล์
        // maxFiles: 1,
        // updateSingle:true,
        dictRemoveFile: "Remove", // ชื่อ ปุ่ม remove
        dictCancelUpload: "Cancel", // ชื่อ ปุ่ม ยกเลิก
        dictDefaultMessage: "เลือก Gallery", // ข้อความบนพื้นที่แสดงรูปจะแสดงหลังจากโหลดเพจเสร็จ
        dictFileTooBig: "ไม่อนุญาตให้อัพโหลดไฟล์เกิน 2 MB", //ข้อความแสดงเมื่อเลือกไฟล์ขนาดเกินที่กำหนด
        acceptedFiles: "image/*", // อนุญาตให้เลือกไฟล์ประเภทรูปภาพได้
      }
    }
  },

  computed: {
    formTitle() {
      // if (this.isDisabled) {
      if (this.$route.query.open) {
        this.isId = this.$route.query.open
        this.isDisabled = true
        return 'อ่านข้อมูล'
      }
      this.isDisabled = false

      if (this.$route.query.edite) {
        this.isId = this.$route.query.edite
        this.desDropzone = false
        return 'แก้ไขข้อมูล'
      } else {
        this.isId = null
        this.desDropzone = true
        return 'เพิ่มข้อมูล'
      }
      // this.desDropzone = this.editedIndex === -1
      // return this.editedIndex === -1 ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'
    },
    loadImage() {
      this.image = this.editedItem.url_icon
      return this.editedItem.url_icon
    },
  },

  mounted() {
    this.checkEdite()
    this.getData()
  },

  methods: {
    checkEdite() {
      if (this.$route.query.edite !== undefined) {
        this.isEdite = false
        this.getPlace(this.$route.query.edite)
      }
    },

    getPath(res) {
      this.image = res.path
      console.log(this.image)
    },

    async loadGalleries() {
      this.editedItem.galleries.map((d) => {
        const file = {id: d.id, size: d.size, name: d.name, type: d.type};
        this.$refs.bar.manuallyAddFile(file, d.path);
      })
    },

    async getPlace(id) {
      await this.$axios.get(`/places/${id}`)
        .then((res) => {
          this.editedItem = res.data
          this.priority = this.editedItem.priority
          this.loadGalleries()
          this.toObject()
        }).catch((error) => {
          alert(error)
        })
    },

    async addPlace() {
      await this.$axios.post(`/places`, {
        'topic': this.editedItem.topic,
        'detail': this.editedItem.detail,
        'latitude': this.editedItem.latitude,
        'longitude': this.editedItem.longitude,
        'priority': this.priority,
        'url_youtube': this.editedItem.url_youtube,
        'url_wiki': this.editedItem.url_wiki,
        'url_icon': this.image,
        'sub_location': this.editedItem.sub_location,
      })
        .then((res) => {
          console.log(JSON.stringify(this.images))
          this.images.map(async (d) => {
            await this.addGalleries(res.data.id, d)
          })
          this.close()
        }).catch((error) => {
          console.log(error)
        })
    },

    async getData() {
      await this.$axios.get('/full_places')
        .then((response) => {
          this.sub_location = response.data;
          // this.is_sub_location = this.sub_location.filter((value) => value.id === 1)
          // console.log(">>"+JSON.stringify(this.sub_location.filter((value) => value.id === 1)))
        }).catch((error) => {
          alert(error)
          console.log(error)
        })
    },

    async toObject() {
      if(this.editedItem.sub_location === null) return
      let s = this.editedItem.sub_location.split(",")
      await s.map(async (i) => {
        await this.$axios.get(`/places/${i}`)
          .then((res) => {
            this.is_sub_location.push(res.data)
          }).catch((error) => {
            alert(error)
          })
      })
    },

    async addGalleries(id, img) {
      await this.$axios.post(`/galleries`, {
        'place_id': id,
        'path': img.path,
        'name': img.name,
        'type': img.type,
        'size': img.size,
      })
        .then(() => {
        }).catch((error) => {
          console.log(error)
          console.log(error)
        })
    },

    async editPlace() {
      await this.$axios.put(`/places/${this.editedItem.id}`, {
        'topic': this.editedItem.topic,
        'detail': this.editedItem.detail,
        'latitude': this.editedItem.latitude,
        'longitude': this.editedItem.longitude,
        'priority': this.priority,
        'url_youtube': this.editedItem.url_youtube,
        'url_wiki': this.editedItem.url_wiki,
        'url_icon': this.image,
        'sub_location': this.editedItem.sub_location,
      })
        .then(() => {
          this.close()
        }).catch((error) => {
          alert(error)
        })
    },

    save() {
      let _id = JSON.stringify(this.is_sub_location.map((d) => d.id))
      let isSubstr = _id.substr(1, _id.length - 1)
      this.editedItem.sub_location = isSubstr.substr(0, isSubstr.length - 1)
      if (this.$route.query.edite !== undefined) {
        this.editPlace()
      } else {
        this.desDropzone = false
        this.addPlace()
      }
    },

    async remove(file) {
      if (this.$route.query.edite > -1) {
        await this.$axios.delete(`/image-upload/${file.id}`)
          .then(() => {
          }).catch((error) => {
            console.log(error)
          })
      } else {
        let index = this.images.indexOf(file);
        if (index === -1) return
        this.images.splice(index, 1)
        let _url = file.path.split('/')

        await this.$axios.delete(`/single-upload/${_url[_url.length - 1]}`)
          .then(() => {
          }).catch((error) => {
            console.log(error)
          })
      }
    },

    async close() {
      this.$router.back()
    },

    async success(file, res) {
      file.path = res.path
      this.images.push(res)
    },
  }
}
</script>
