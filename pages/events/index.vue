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
          <Header :title="$i18n.t('index').news"/>
<!--          <v-row style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; margin-top: 12px;">-->
<!--            <v-spacer/>-->
<!--            <v-btn color="#7b1817" dark @click="()=>this.$router.push(`/events`)" style="padding: 12px">ดูเพิ่มเติม-->
<!--              <v-icon>mdi-chevron-right</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
          <v-row style="padding-top: 12px; padding-bottom: 12px; margin-top: 12px;">
            <v-spacer/>
            <v-select
              label="เลือกวัดที่ต้องการดู"
              :items="measure"
              required
              dense
              style="max-width: 357px; padding-right: 24px"
              hide-details
            ></v-select>
            <v-pagination
              v-model="page"
              :length="items.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
          <v-row>
            <v-col v-for="i in items.data" :key="i.newsId" sm="3" align="center">
              <ItemEvents :item="i"/>
            </v-col>
          </v-row>
          <v-row style="padding-top: 12px; padding-bottom: 12px; margin-top: 12px;">
            <v-spacer/>
            <v-pagination
              v-model="page"
              :length="items.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
</style>
<script>
import axios from "~/api/config";
import serve from "~/api/server";
import Register from "~/components/Register";
import Pagination from "~/components/Pagination";
import ItemEvents from "~/components/ItemEvents";

export default {
  components: {
    Pagination,
    Register,
    ItemEvents
  },
  created() {
    this.$nextTick(function () {
      this.loading = false
    })
    this.$nuxt.$on('register', () => {
      this.overlay = !this.overlay
    })
  },
  watch: {
    page(val){
      this.getEvens()
    }
  },
  data() {
    return {
      loading: true,
      overlay: false,
      page: 1,
      measure: [
        't1',
        't2'
      ],
      items: []
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      this.getEvens()
    })
  },
  computed: {
    t() {
      if (this.items.data.length <= 0) return
      return this.items.data.length
    },
  },
  methods: {
    test(val) {
      console.log("kkkkk" + val)
      this.page = val
    },
    async getEvens() {
      await axios.get(`/news/list`, {
        params: {
          keyword: '',
          page: this.page,
          limit: 16
        }
      }).then((res) => {
        this.items = res.data
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        console.log(error.message)
      })
    }
  }
}
</script>
