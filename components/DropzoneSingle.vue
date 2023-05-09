<template>
  <div>
    <dropzone
        id="bar"
        ref="bar"
        :options="options"
        :destroyDropzone="false"
        :useCustomSlot="true"
        v-on:vdropzone-file-added="added"
        v-on:vdropzone-removed-file="remove"
        v-on:vdropzone-success="success"
        v-on:vdropzone-error="error"
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
          <v-chip label class="subtitle" style="margin: 0px" color="#54B6C8" dark>
            <v-icon>mdi-plus</v-icon>
            กดเพื่อเลือกรูปภาพ
          </v-chip>
        </v-col>
      </div>
    </dropzone>
  </div>
</template>
<script>
import Dropzone from "nuxt-dropzone";
import "nuxt-dropzone/dropzone.css";
import serve from "~/api/server";


// v-on:vdropzone-removed-file="remove"
// v-on:vdropzone-success="success"

export default {
  components: {
    Dropzone,
  },
  props: {
    callback: {
      type: Function
    },
    addRemove: false,
    clickable: false,
    uploadMultiple: false,
    readOnly: false,
    maxSize: Number,
    maxFiles: Number,
    images: {
      type: Array
    },
    image: String
  },
  watch: {
    images(img) {
      this.loadImages(img)
    },
    image(img) {
      this.loadImage(img)
    },
  },
  data() {
    return {
      url: '',
      options: {
        url: `${serve.api}/single-upload`,
        thumbnailWidth: 150,
        maxFilesize: 2,
        addRemoveLinks: true,
        clickable: true,
        uploadMultiple: false, // อัพโหลดไฟล์หลายไฟล์

        dictRemoveFile: "Remove", // ชื่อ ปุ่ม remove
        dictCancelUpload: "Cancel", // ชื่อ ปุ่ม ยกเลิก
        dictDefaultMessage: "เลือก Gallery", // ข้อความบนพื้นที่แสดงรูปจะแสดงหลังจากโหลดเพจเสร็จ
        dictFileTooBig: `อัพโหลดไฟล์เกิน ${this.maxSize} MB`, //ข้อความแสดงเมื่อเลือกไฟล์ขนาดเกินที่กำหนด
        acceptedFiles: "image/*", // อนุญาตให้เลือกไฟล์ประเภทรูปภาพได้
      },
    };
  },

  methods: {
    loadImages(images) {
      images.map((d) => {
        const file = {id: d.id, size: d.size, name: d.name, type: d.type};
        this.$refs.bar.manuallyAddFile(file, d.path);
        if (this.maxFiles === 1) {
          this.$refs.bar.disable()
        }
      })
    },
    loadImage(images) {
      if (images === null) return
      const file = {size: 123, name: images, type: 'image/png'};
      this.$refs.bar.manuallyAddFile(file, images);
      if (this.maxFiles === 1) {
        this.$refs.bar.disable()
      }
    },

    async added(file) {
      // console.log("add" + JSON.stringify(file))
    },

    async success(file, response) {
      // this.$store.commit("setUrlImgTopic", response.path)
      // let nameImg = response.path.split('/')
      // file.url = nameImg[nameImg.length - 1]
      file.url = this.splitNameImg(response.path)
      this.url = response.path
      this.$refs.bar.disable()
      this.execute(response)
    },

    async error(file, response) {
      this.$refs.bar.disable()
    },

    splitNameImg(url) {
      let _url = url.split('/')
      return _url[_url.length - 1]
    },

    async remove(file) {
      this.$refs.bar.enable()
      await this.$axios.delete(`/single-upload/${this.splitNameImg(this.url)}`)
          .then(() => {
            this.$store.commit("setUrlImgTopic", '')
          }).catch((error) => {
            console.log(error)
          })
    },

    execute(res) {
      if (this.callback) {
        this.callback(res)
      }
    },
  },

};
</script>
