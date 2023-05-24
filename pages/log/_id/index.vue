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
            @click=""
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
          <v-col
            cols="12"
          >
            <DropzoneSingle
              align="center"
              :callback="myFunction"
              :urlImgTopic="getUrl()"/>
          </v-col>
          <v-col cols="12">
            <v-text-field
              outlined
              dense
              v-model="editedItem.topic"
              :disabled="isDisabled"
              label="หัวข้อ"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-textarea
              outlined
              dense
              v-model="editedItem.detail"
              :disabled="isDisabled"
              label="รายละเอียด"
            ></v-textarea>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              outlined
              dense
              v-model="editedItem.url_location"
              :disabled="isDisabled"
              label="ละติจูด"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="4">
            <v-text-field
              outlined
              dense
              v-model="editedItem.url_location"
              :disabled="isDisabled"
              label="ลองจิจูด"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-btn color="blue" dark>ดึงตำแหน่งปัจจุบัน</v-btn>
          </v-col>
          <v-col cols="12" sm="6" md="2">
            <v-select
              dense
              :items="items"
              label="ความสำคัญ"
              outlined
            ></v-select>
          </v-col>
          <v-col cols="12">
            <v-text-field
              dense
              outlined
              v-model="editedItem.time"
              :disabled="isDisabled"
              label="url youtube"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
            <v-text-field
              dense
              outlined
              v-model="editedItem.price"
              :disabled="isDisabled"
              label="url wikipedia"
            ></v-text-field>
          </v-col>
          <v-col cols="12">
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
                <h3 class="dropzone-custom-title" style="margin: 0px">รูปแกลเลอรี่</h3>
                <p class="subtitle" style="margin: 0px">
                  <v-icon color="blue">mdi-plus-circle</v-icon>
                  กดเพื่อเลือกรูปภาพจากเครื่อง หรือ ลากรูปใส่ภายในกล่องนี้
                </p>
              </div>
            </dropzone>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>

    <v-card-actions>
      <v-spacer></v-spacer>
      <v-btn
        color="blue darken-1"
        text
        @click="close"
      >
        Cancel
      </v-btn>
      <v-btn
        color="blue darken-1"
        text
        @click="save"
        v-show="!this.isDisabled"
      >
        Save
      </v-btn>
    </v-card-actions>
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

export default {
  middleware: 'auth',
  components: {
    Dropzone,
    DropzoneSingle,
  },
  data() {
    return {
      items: ['A', 'B', 'C'],
      editedItem: {},
      places: {},
      isDisabled: true,
      // editedIndex: -1,
      place_type: [],
      slide_show: false,
      isId: null,
      type_select: null,
      desDropzone: false,
      images: [],

      options: {
        // url: `http://localhost:8000/api/image-upload/${this.$store.state.placeId}`,
        url: `http://localhost:8000/api/${this.$route.query.edite > -1 ? "image-upload/" + this.$store.state.placeId : "single-upload"}`,
        thumbnailWidth: 150,
        maxFilesize: 2,
        headers: {
          "My-Awesome-Header": "header value",
          'Authorization': `Bearer 4|QEcWcHD2GGqCqZ9Q3gdriOAPfvSvxuIaLV9YccE3`
        },
        addRemoveLinks: !this.$store.state.readOnly,
        clickable: !this.$store.state.readOnly,
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
  },

  mounted() {
    this.loadData()
    this.getType()
    console.log("desDropzone>>" + this.desDropzone)
  },

  methods: {
    getUrl() {
      return this.editedItem.url_img_topic
    },
    myFunction() {
      this.editedItem.url_img_topic = this.$store.state.urlImgTopic
    },
    async getType() {
      await this.$axios.get(`permission_type/${this.$auth.user.permission_type}`)
        .then((response) => {
          console.log(response.data.policy)
          this.place_type = JSON.parse(response.data.policy);
        }).catch((error) => {
          console.log(error)
        })
    },

    loadData() {
      // this.isDisabled = this.$store.state.readOnly
      // this.editedIndex = this.$store.state.editedIndex
      if (this.isId) this.getPlace()
      // this.isId = this.editedItem.id
    },

    async loadGalleries() {
      console.log("loadGalleries>>")
      this.editedItem.galleries.map((d) => {
        const file = {id: d.id, size: 123, name: "Icon", type: "image/png"};
        this.$refs.bar.manuallyAddFile(file, d.url_galleries);
      })
    },

    changeType(num) {
      this.type_select = num
    },

    async getPlace() {
      console.log(this.isId + "<<ID")
      await this.$axios.get(`/places/${this.isId}`)
        .then((res) => {
          this.editedItem = res.data
          this.type_select = this.editedItem.place_type.id
          this.slide_show = this.editedItem.slider !== 0
          this.$store.commit("setUrlImgTopic", this.editedItem.url_img_topic)
          this.loadGalleries()
          // this.getUrl()
        }).catch((error) => {
          console.log(error)
        })
    },

    async addPlace() {
      console.log("add")
      await this.$axios.post(`/places`, {
        'type_id': this.type_select,
        'topic': this.editedItem.topic,
        'detail': this.editedItem.detail,
        'url_img_topic': this.editedItem.url_img_topic,
        'url_location': this.editedItem.url_location,
        'phone': this.editedItem.phone,
        'price': this.editedItem.price,
        'create_by': this.$auth.user.id,
        'hot': 0,
        'slider': this.slide_show ? 1 : 0,
        'time': this.editedItem.time,
      })
        .then((res) => {
          this.images.map(async (d) => {
            await this.addGalleries(res.data.id, d.path)
          })
          this.close()
        }).catch((error) => {
          console.log(error)
        })
    },

    async addGalleries(id, path) {
      await this.$axios.post(`/galleries`, {
        'place_id': id,
        'url_galleries': path,
      })
        .then(() => {
        }).catch((error) => {
          console.log(error)
        })
    },

    async editPlace() {
      console.log("edit>>")
      await this.$axios.put(`/places/${this.editedItem.id}`, {
        'type_id': this.type_select,
        'topic': this.editedItem.topic,
        'detail': this.editedItem.detail,
        'url_img_topic': this.editedItem.url_img_topic,
        'url_location': this.editedItem.url_location,
        'phone': this.editedItem.phone,
        'price': this.editedItem.price,
        'create_by': this.$auth.user.id,
        'hot': this.editedItem.hot,
        'slider': this.slide_show ? 1 : 0,
        'time': this.editedItem.time,
      })
        .then(() => {
          this.close()
        }).catch((error) => {
          console.log(error)
        })
    },

    save() {
      if (this.$route.query.edite > -1) {
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
      this.$router.push('/')
    },

    async success(file, res) {
      console.log("path>>" + res.path)
      file.path = res.path
      this.images.push(res)
    },
  }
}
</script>
