<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
<!--        <v-container style="max-width: 1730px;" v-if="!loading">-->
<!--&lt;!&ndash;          <Header :title="this.$i18n.t('header').home"/>&ndash;&gt;-->
<!--          <v-row-->
<!--            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;-->
<!--            margin-top: 12px; margin-right: 0; margin-left: 0;">-->
<!--            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">-->
<!--              {{this.$i18n.t("header").amuletMarket}}-->
<!--            </p>-->
<!--            <v-spacer/>-->
<!--            <v-btn text dark @click="$router.push(localeLocation('/post'))" style="padding: 12px">-->
<!--              {{ this.$i18n.t("index").seeMore }}-->
<!--              <v-icon>mdi-chevron-right</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
<!--          <v-row style="padding-bottom: 24px">-->
<!--            <v-col v-for="i in itemsPsda.data" :key="i.newsId" sm="3" align="center">-->
<!--              <ItemsHire :item="i" :exchange="exchange"/>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--&lt;!&ndash;          <v-row style="padding-bottom: 24px">&ndash;&gt;-->
<!--&lt;!&ndash;            <v-col v-for="i in itemsSale.data" :key="i.newsId" sm="3" align="center">&ndash;&gt;-->
<!--&lt;!&ndash;              <ItemsHire :item="i" :exchange="exchange"/>&ndash;&gt;-->
<!--&lt;!&ndash;            </v-col>&ndash;&gt;-->
<!--&lt;!&ndash;            <v-col style="padding-right: 12px;" v-show="itemsSale.data.length === 0">&ndash;&gt;-->
<!--&lt;!&ndash;              <v-card class="d-flex align-center" flat height="300">&ndash;&gt;-->
<!--&lt;!&ndash;                <v-col align="center">&ndash;&gt;-->
<!--&lt;!&ndash;                  <p>ไม่มีข้อมูล</p>&ndash;&gt;-->
<!--&lt;!&ndash;                </v-col>&ndash;&gt;-->
<!--&lt;!&ndash;              </v-card>&ndash;&gt;-->
<!--&lt;!&ndash;            </v-col>&ndash;&gt;-->
<!--&lt;!&ndash;          </v-row>&ndash;&gt;-->
<!--          <v-row-->
<!--            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;-->
<!--            margin-top: 12px; margin-right: 0; margin-left: 0;">-->
<!--            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">-->
<!--              {{ this.$i18n.t("header").news }}-->
<!--            </p>-->
<!--            <v-spacer/>-->
<!--&lt;!&ndash;            <v-select&ndash;&gt;-->
<!--&lt;!&ndash;              label="เลือกข่าวที่ต้องการ" :items="templeItems" required return-object dense&ndash;&gt;-->
<!--&lt;!&ndash;              item-text="title" item-value="templeId" v-model="temple" @change="getEvens"&ndash;&gt;-->
<!--&lt;!&ndash;              style="max-width: 357px; padding-right: 24px" hide-details dark&ndash;&gt;-->
<!--&lt;!&ndash;            ></v-select>&ndash;&gt;-->
<!--            <v-btn text dark @click="$router.push(localeLocation('events'))" style="padding: 12px">-->
<!--              {{ this.$i18n.t("index").seeMore }}-->
<!--              <v-icon>mdi-chevron-right</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
<!--          <v-row>-->
<!--            <v-col v-for="i in items.data" :key="i.newsId" sm="3" align="center">-->
<!--              <ItemEvents :item="i"/>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--          <v-row style="margin-top: 12px;" class="m-0 pt-2">-->
<!--              <v-img src="/banner.png" class="m-0" @click="$router.push(localeLocation('/verification'))"></v-img>-->
<!--          </v-row>-->
<!--          <v-row-->
<!--            style="background-color: #7b1817;"-->
<!--            class="p-2 mt-2 ml-0 mr-0 mb-0">-->
<!--            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">-->
<!--              {{ this.$i18n.t("header").aboutUs }}-->
<!--            </p>-->
<!--          </v-row>-->
<!--          <v-row class="p-0 m-0 mb-2">-->
<!--            <v-card class="d-flex p-2" flat>-->
<!--              {{ this.$i18n.t("header").aboutCon }}-->
<!--            </v-card>-->
<!--          </v-row>-->
<!--          <v-img src="/owner.png"></v-img>-->
<!--        </v-container>-->
      </v-main>
    </v-app>
  </div>
</template>
<style>
.cut-text-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

iframe {
  width: 100%;
  max-height: 650px;
}
</style>
<script>
import axios from "~/api/config";
import serve from "~/api/server";
import Register from "../components/Register";
import ItemEvents from "../components/ItemEvents";
import Vue from 'vue'

import VueYouTubeEmbed from 'vue-youtube-embed'
import ItemsHire from "../components/ItemsHire";
import {getUpdateInDay} from "@/utils/exchangeRates";

Vue.use(VueYouTubeEmbed)

Vue.use(VueYouTubeEmbed, {global: true, componentId: "youtube-media"})

export default {
  components: {
    ItemsHire,
    ItemEvents,
    Register
  },
  async created() {
    this.$nextTick(function () {
      this.loading = false
    })
    if(this.$i18n.locale !== "th") {
      this.exchange = await getUpdateInDay(this.$i18n.locale)
    }
    this.$nuxt.$on('register', () => {
      this.overlay = !this.overlay
    })
  },
  data() {
    return {
      loading:true,
      videoId: null,
      startTime: null,
      exchange:{},
      itemsSale: {
        data: [],
      },
      itemsPsda: {
        data: [],
      },
      count: 1,
      count1: 1,
      overlay: false,
      temple: {
        templeId: ''
      },
      templeItems: [],
      items: [],
      contact: "สยามอมูเลทคอลเลคชั่น  : www.siamamuletcollection.com<br>" +
        "บริษัท เอ็กซ์เปอร์ทิส (ประเทศไทย) จำกัด<br>" +
        "42 ซอยโชคอำนวย ถนนสุทธิสารวินิจฉัย แขวงสามเสนนอก เขตห้วยขวาง กรุงเทพมหานคร 10310",
      about: "สยามอมูเลทคอลเลคชั่น เป็นระบบยืนยันผู้ถือครองพระเครื่องและวัตถุมงคลไทย และเป็นตลาดเช่าบูชาพระเครื่องที่ให้บริการผ่านเว็บไซต์ โดยพระเครื่องและวัตถุมงคลทุกชิ้นในระบบยืนยันผู้ถือครองพระเครื่องได้ผ่านกระบวนการสร้างอัตลักษณ์ด้วยกระบวนการทางวิทยาศาสตร์และความเห็นจากผู้เชี่ยวชาญเพื่อยืนยันว่าพระเครื่องและวัตถุมงคลมีความสอดคล้องทั้งเชิงวิทยาศาสตร์และเชิงพุทธศิลป์ว่าจะเป็นพระเครื่องและวัตถุมงคลที่สร้างในยุคที่เกจิผู้สร้างได้บันทึกไว้ ทั้งที่ท่านบันทึกไว้เอง และบันทึกที่เป็นที่ยอมรับในประเทศไทย และเฉพาะพระเครื่องและวัตถุมงคลที่เข้าระบบยืนยันผู้ถือครองแล้วเท่านั้น จึงจะสามารถประกาศขายในตลาดเช่าบูชาพระเครื่องได้ เพื่อให้เกิดการเเลกเปลี่ยนพระเครื่องและวัตถุมงคลที่สามารถพิสูจน์ได้ หมายถึง ผู้เช่าบูชาจะได้รับการส่งมอบพระเครื่องและวัตถุมงคลพร้อมอัตลักษณ์พระเครื่องที่สามารถนำไปตรวจสอบได้ว่าพระเครื่องและวัตถุมงคลที่ได้รับถูกต้องตรงตามที่ประกาศให้เช่าหรือไม่ ยิ่งไปกว่านั้นตลาดเช่าบูชาพระเครื่องของสยามอมูเลทคอลเลคชั่น เป็นตลาดที่เจ้าของวัตถุมงคลเป็นผู้ประกาศให้เช่าบูชาด้วยตนเอง เป็นของสะสมที่ถือครองมายาวนาน ปัจจุบันเป็นตลาดเช่าบูชาพระเครื่องและวัตถุมงคลที่มีจำนวนพระเครื่องที่ได้รับการตรวจพิสูจน์อัตลักษณ์ทางวิทยาศาสตร์แล้ว มากที่สุดในประเทศไทย"
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    this.getCount()
    this.getEvens()
    this.getTemple()
    this.getSalePsda()
    this.getSale()
  },
  methods: {
    getCount() {
      let _c = localStorage.getItem("countPsda")
      this.count = _c === undefined ? 1 : _c
      localStorage.setItem("countPsda", (Math.floor(this.count) + 1))

      let _c1 = localStorage.getItem("count")
      this.count1 = _c1 === undefined ? 1 : _c1
      localStorage.setItem("count", (Math.floor(this.count1) + 1))
    },
    async getSalePsda() {
      await this.$axios.get(`/sacred-object-out/forsale`, {
        params: {
          keyword: '',
          page: this.count,
          limit: 4,
          all: 1,
          isLabNo: 1,
          dateCreateSort: 'asc',
          priceMin: '',
          priceMax: '',
          priceSort: '',
          lab_typeId: 1
        }
      }).then((res) => {
        this.itemsPsda = res.data
        if (localStorage.getItem("countPsda") > this.itemsPsda.pageTotal) {
          localStorage.setItem("countPsda", 1)
        }
        // console.log(JSON.stringify(res.data))
      }).catch((e) => {
        console.log(e)
      })
    },
    async getSale() {
      await this.$axios.get(`/sacred-object-out/forsale`, {
        params: {
          keyword: '',
          page: this.count1,
          limit: 4,
          all: 1,
          isLabNo: 'all',
          dateCreateSort: 'asc',
          priceMin: '',
          priceMax: '',
          priceSort: '',
          lab_typeId: '',
          categoryId: ''
        }
      }).then((res) => {
        this.itemsSale = res.data
        if (localStorage.getItem("count") > this.itemsSale.pageTotal) {
          localStorage.setItem("count", 1)
        }
        // console.log(JSON.stringify(res.data))
      }).catch((e) => {
        console.log(e)
      })
    },
    async getEvens() {
      await axios.get(`/news/list`, {
        params: {
          keyword: '',
          page: 1,
          limit: 4,
          templeId: this.temple.templeId
        }
      }).then((res) => {
        this.items = res.data
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        console.log(error.message)
      })
    },
    async getTemple() {
      await axios.get(`/temple/list`).then((res) => {
        if (res.data.status) {
          let temp = res.data.data
          temp.push({
            templeId: "",
            title: "ทั้งหมด"
          })
          this.templeItems = temp
        }
      }).catch((error) => {
        console.log(error.message)
      })
    }
  }
}
</script>
