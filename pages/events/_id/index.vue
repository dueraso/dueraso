<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <div v-if="loading">
        <v-col align="center">
          Loading..
        </v-col>
      </div>
      <v-main v-if="!loading">
        <v-container style="max-width: 1140px;">
          <Header :title="item.title"/>
          <v-row style="margin: 0">
            <v-col align="center">
              <v-img :src="convortDo()" max-width="1140"></v-img>
              <v-card style="padding: 12px; margin-top: 12px" v-show="item.detail != ''">
                <div id="detail" align="left" style="padding: 12px;" v-html='convortDo(false)'/>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
#detail img {
  width: 100%;
}
</style>
<script>
import axios from "~/api/config";
import Pagination from "~/components/Pagination";
import convert from "~/api/convert";

export default {
  components: {Pagination},
  created() {
    this.$nextTick(function () {
      this.loading = false
    })
    this.$nuxt.$on('register', () => {
      this.overlay = !this.overlay
    })
  },
  data() {
    return {
      loading: true,
      overlay: false,
      page: 1,
      item: {}
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    this.getItem()
  },
  methods: {
    convortDo(isCover = true) {
      if (isCover) {
        if (this.item.cover === undefined) return
        return convert.domain(this.item.cover)
      } else {
        if (this.item.detail === undefined) return
        return this.item.detail.replaceAll("http://183.88.227.207:8084", "https://siamamuletcollection.com")
      }
    },
    async getItem() {
      await axios.get(`/news/detail`, {
        params: {
          newsId: this.$route.params.id
        }
      }).then((res) => {
        this.item = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        console.log(error.message)
      })
    }
  }
}
</script>
