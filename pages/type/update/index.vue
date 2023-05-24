<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">{{ formTitle }}</span>
    </v-card-title>

    <v-card-text>
      <v-container>
        <v-row>
          <v-col
            cols="12"
          >
            <v-text-field
              filled
              v-model="editedItem.name"
              :disabled="isDisabled"
              label="หัวข้อ"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row>
          <v-col
            cols="12"
          >
            <DropzoneSingle
              align="center"
              :urlImgTopic="getUrl()"
              :callback="getPath"/>
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
  middleware: ['auth','is-admin'],
  components: {
    Dropzone,
    DropzoneSingle,
  },
  data() {
    return {
      editedItem: {},
      isDisabled: true,
      // editedIndex: -1,
      place_type: [],
      slide_show: false,
      type_select: null,
      hot: '',
      url: '',
      typeLatest: {},
    }
  },

  computed: {
    formTitle() {
      this.isDisabled = false
      return this.$route.query.edite ? 'แก้ไขข้อมูล' : 'เพิ่มข้อมูล'
    },
  },

  mounted() {
    if (this.$route.query.edite) this.getType()
    this.getTypeLatest()
  },

  methods: {
    getUrl() {
      this.url = this.hot.url
      console.log(">>"+this.url)
      return this.hot.url
    },

    async getPath() {
      this.url = this.$store.state.urlImgTopic
    },

    async addHot(id) {
      await this.$axios.post(`/hot`, {
        id: id,
        url: this.url
      })
        .then((response) => {
        }).catch((error) => {
          console.log(error)
        })
    },

    async editHot() {
      await this.$axios.put(`/hot/${this.editedItem.id}`, {
        url: this.url
      })
        .then((response) => {
        }).catch((error) => {
          console.log(error)
        })
    },
    async getHot() {
      await this.$axios.get(`/hot/${this.editedItem.id}`)
        .then((response) => {
          this.hot = response.data;
        }).catch((error) => {
          console.log(error)
        })
      // return this.hot.url
    },

    async getType() {
      await this.$axios.get(`/place_type/${this.$route.query.edite}`)
        .then((response) => {
          this.editedItem = response.data;
          this.getHot()
        }).catch((error) => {
          console.log(error)
        })
    },

    async getTypeLatest() {
      await this.$axios.get(`/typeLatest`)
        .then((response) => {
          this.typeLatest = response.data;
        }).catch((error) => {
          console.log(error)
        })
    },

    async addType() {
      console.log("add")
      await this.$axios.post(`/place_type`, {
        'name': this.editedItem.name,
      })
        .then((res) => {
          if (this.url) this.addHot(res.data.id)
          this.close()
        }).catch((error) => {
          console.log(error)
        })
    },

    async editType() {
      console.log("edit>>")
      await this.$axios.put(`/place_type/${this.editedItem.id}`, {
        'name': this.editedItem.name,
      })
        .then(() => {
          this.close()
        }).catch((error) => {
          console.log(error)
        })
    },

    save() {
      if (!this.url){
        alert("กรุณาอัปโหลดรูปก่อนทำการบันทึก")
        return
      }
      if (this.$route.query.edite > -1) {
        this.editType()
        if (this.url) this.editHot()
      } else {
        this.addType()
      }
    },

    async close() {
      this.$router.back()
    },
  }
}
</script>
