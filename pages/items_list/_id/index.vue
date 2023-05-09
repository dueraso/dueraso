<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <div v-if="loading">
        <v-col align="center">
          Loading..
        </v-col>
      </div>
      <v-main v-if="!loading">
        <v-container style="max-width: 1140px;" v-show="defaultItem.data != ''">
          <Header :title="defaultItem.data.phim_phra"/>
          <v-row style="margin: 0">
            <v-card style="padding: 12px; margin-top: 12px" width="100%">
              <v-row>
                <v-col sm="6">
                  <v-row style="margin: 0">
                    <v-col
                      v-show="checkImg()" style="padding: 3px" :cols="index > 0?2:12"
                      v-for="(item, index) in defaultItem.data.coverImage" :key="index">
                    <v-img
                      :src="convortDo(item)" @click="openImage(index)"/>
                    </v-col>
                    <v-img v-show="!checkImg()" src="/defaultimage.png"></v-img>
                  </v-row>
                </v-col>
                <v-col sm="6">
                  <v-row style="margin: 0">
                    <v-spacer/>
                    <v-btn outlined color="#7b1817" small @click="status=true" style="margin-right: 12px">ลบออกจากระบบ
                    </v-btn>
                    <v-btn color="#7b1817" dark small @click="$router.push(`${$route.path}/edit`)"
                           v-show="defaultItem.data.status == 4">แก้ไขข้อมูล
                    </v-btn>
                    <v-btn color="#7b1817" dark small @click="$router.push(localeLocation(`/post/${$route.params.id}/edit`))"
                           v-show="defaultItem.data.status == 2">ประกาศขาย
                    </v-btn>
                  </v-row>
                  <p>
                    <strong>
                      พุทธศิลป์ : {{ defaultItem.data.buddhist_art }} </strong>
                  </p>
                  <p style="margin-top: 6px">
                    <strong>
                      ประเภทพระ : {{ defaultItem.data.type_of_phra }}
                    </strong>
                  </p>
                  <p style="margin-top: 6px">ข้อมูลเกี่ยวกับพระ : {{ defaultItem.data.phra_information }}</p>
                  <p style="margin-top: 10px">เลขที่แลป : {{ defaultItem.data.lab_no }}</p>
                  <p style="margin-top: 6px">วันที่ออกผลแลป : {{ formatTime(defaultItem.data.date_of_issue) }}</p>
                  <p style="margin-bottom: 5px; padding-top: 12px"><strong>อายุการใช้งานระบบ</strong></p>
                  <v-row style="margin: 0">
                    <p style="padding-right: 12px"><strong>วันเริ่มต้น</strong> :
                      {{ formatTime(defaultItem.data.approvedDate) }}</p>
                    <p>
                      <strong>วันสิ้นสุด</strong> : {{ formatTime(defaultItem.data.approvedDate, true) }}
                    </p>
                  </v-row>
                  <v-divider/>
                  <p style="margin-top: 10px; font-size: 14px; color: #AFC0CB">
                    บันทึกเมื่อ {{ formatTime(defaultItem.data.createDate) }}
                  </p>
                </v-col>
              </v-row>
            </v-card>
          </v-row>
          <!--          <v-col v-show="ownerItems.length > 0">-->
          <!--            <ItemMonkNumber-->
          <!--              v-for="(item,index) in ownerItems"-->
          <!--              :key="index"-->
          <!--              :number="index+1"-->
          <!--              :item="item"/>-->
          <!--          </v-col>-->
          <DialogCon
            :callback="close" :status="status" :confirm="confirmDel" textBtn="ยกเลิก"
            detail="คุณต้องการลบรายการนี้ใช่หรือไม่"/>
        </v-container>
        <v-container style="max-width: 1140px;" v-show="defaultItem.data == ''">
          <Header title="ประกาศซื้อ-ขาย"/>
          <v-col style="padding-right: 0; padding-left: 0">
            <v-card class="d-flex align-center" flat height="300">
              <v-col align="center">
                <strong style="font-size: 130px">404</strong>
                <p>Page not found: {{ $route.params.id }}</p>
                <v-btn outlined color="#7b1817" to="/">To Home</v-btn>
              </v-col>
            </v-card>
          </v-col>
        </v-container>
      </v-main>
      <SliderImg :status="overlay" :callback="close" :items="defaultItem.data.coverImage" :start="indexImg"/>
    </v-app>
  </div>
</template>
<script>
import ItemMonkNumber from "~/components/ItemMonkNumber"
import dayjs from 'dayjs'
import axios from "~/api/config";
import serve from "~/api/server";
import convert from "~/api/convert";
import DialogCon from "../../../components/DialogCon";
import SliderImg from "../../../components/SliderImg";

export default {
  middleware: 'auth',
  components: {
    SliderImg,
    DialogCon,
    ItemMonkNumber,
    dayjs,
  },
  mounted() {
    this.getAmulet()
    // this.getGallery()
  },
  data() {
    return {
      loading:true,
      gallery: {},
      status: false,
      page: 1,
      defaultItem: {
        data: {
          coverImage: []
        }
      },
      overlay: false,
      indexImg: 0,
      material: '',
      selectImg: '',
      ownerItems: [],
      ownerOriginal: {},
    }
  },
  created() {
    this.$nextTick(function () {
      this.loading = false
    })
  },
  methods: {
    checkImg() {
      if (this.defaultItem.data == '') return
      return this.defaultItem.data.coverImage.length > 0
    },
    close() {
      this.overlay = false
      this.status = false
    },
    confirmDel() {
      this.$axios.post(`/sacred-object-out/delete`, {
        id: this.$route.params.id
      }).then((res) => {
        this.status = false
        this.$router.back()
      }).catch((e) => {
        console.log(e)
      })
    },
    convortDo(val) {
      if (val === null) return
      return convert.domain(val)
    },
    formatTime(time, add = false, format = 'DD MMM YYYY') {
      // console.log(time)
      if (time === undefined || time === '') return 'รอดำเนินการ'
      if (add) {
        let _month = dayjs(time).add(this.defaultItem.data.a_month, 'month')
        let _year = dayjs(_month).add(this.defaultItem.data.a_year, 'year')
        return this.$dayjs(_year).format(format)
      } else {
        return this.$dayjs(time).format(format)
      }
    },
    async getAmulet() {
      await this.$axios.get(`/sacred-object-out/detail`, {
        params: {
          id: this.$route.params.id,
          my: 1
        }
      }).then((res) => {
        // console.log(res.data.data+"<<>>"+(res.data.data == ''))
        this.defaultItem = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    async getGallery() {
      await axios.get(`${serve.upload}/galleries/${this.$route.params.id}`)
        .then((res) => {
          this.gallery = res.data
        })
        .catch((e) => {
          alert(e)
          console.log(e)
        })
    },
    openImage(index) {
      this.indexImg = index
      this.overlay = true
    },
    OnClick() {
      this.$router.push(`${this.$route.path}/history`)
    },
  },
}
</script>
