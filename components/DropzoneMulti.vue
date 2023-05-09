<template>
  <div>
    <dropzone
        id="bar"
        ref="bar"
        :options="options"
        :destroyDropzone="this.desDropzone"
        :useCustomSlot="true"
        v-on:vdropzone-removed-file="remove"
        v-on:vdropzone-success="success"
        style="
      .dropzone .dz-preview .dz-image {
  position: unset;
}

.dropzone .dz-preview {
  margin: 0px;
}

.dropzone .dz-preview .dz-image {
  border-radius: 20px;
}

.vue-dropzone > .dz-preview .dz-remove {
  position: sticky;
  margin: 0px;
}

.dropzone {
  padding: 0px;
}
"
    >
      <div class="dropzone-custom-content">
        <v-col style="align-content: center">

          <p class="subtitle"><v-icon color="#e3ab3f">mdi-plus-circle</v-icon>กดเพื่อเลือกรูปภาพจากเครื่อง หรือ ลากรูปใส่ภายในกล่องนี้</p>
        </v-col>
      </div>
    </dropzone>
  </div>
</template>
<script>
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";

export default {
  components: {
    Dropzone,
  },
  props: {
    callback: {
      type: Function
    },
    urlImgTopic: ''
  },
  data() {
    return {
      urlTopic: '',
      options: {
        url: `https://yalaebetong.yru.ac.th/api/public/api/${this.$route.query.edite > -1?"image-upload/"+this.$store.state.placeId:"single-upload"}`,
        thumbnailWidth: 150,
        maxFilesize: 2,
        headers: {
          "My-Awesome-Header": "header value",
          'Authorization': `Bearer 4|QEcWcHD2GGqCqZ9Q3gdriOAPfvSvxuIaLV9YccE3`
        },
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
    };
  },
  mounted() {
    setTimeout(() => {
      this.urlTopic = this.urlImgTopic
      if (this.urlTopic) this.loadImage()
    }, 1000)
  },

  methods: {
    loadImage() {
      let file = {size: 123, name: "Icon", type: "image/png"};
      this.$refs.bar.manuallyAddFile(file, this.urlTopic);
      this.$refs.bar.disable()
    },

    async added(file) {
      console.log("add" + JSON.stringify(file))
    },

    async success(file, response) {
      this.$store.commit("setUrlImgTopic", response.path)
      // let nameImg = response.path.split('/')
      // file.url = nameImg[nameImg.length - 1]
      file.url = this.splitNameImg(response.path)
      this.urlTopic = response.path
      this.$refs.bar.disable()
      this.execute()
    },

    async error(file, response) {
      this.$refs.bar.disable()
    },

    splitNameImg(url) {
      console.log(">>" + JSON.stringify(url))
      let _url = url.split('/')
      return _url[_url.length - 1]
    },

    async remove(file) {
      this.$refs.bar.enable()
      console.log(">>" + this.urlTopic)
      await this.$axios.delete(`/single-upload/${this.splitNameImg(this.urlTopic)}`)
          .then(() => {
            this.$store.commit("setUrlImgTopic", '')
          }).catch((error) => {
            console.log(error)
          })
    },

    execute() {
      if (this.callback) {
        console.log("dropzone<<<")
        this.callback()
      }
    },
  },

};
</script>
