<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container style="max-width: 1140px;" v-if="!loading">
          <Header :title="$i18n.t('header').amuletMarket"/>
          <v-row style="margin: 0px; padding-top: 12px">
            <v-col cols="12" sm="8" style="padding: 0px">
              <v-text-field
                label="ค้นหาชื่อพระ"
                append-icon="mdi-magnify"
                style="padding-right: 12px"
                hide-details
                v-model="search"
                @keydown.enter="getSale"
              ></v-text-field>
            </v-col>
            <!--            <v-col cols="12" sm="3" style="padding: 0px">-->
            <!--              <v-select-->
            <!--                disabled-->
            <!--                :items="items"-->
            <!--                label="เลือกประเภทพระเครื่อง"-->
            <!--                hide-details-->
            <!--                style="padding-right: 12px"-->
            <!--              ></v-select>-->
            <!--            </v-col>-->
            <v-col cols="12" sm="2" style="padding: 0px">
              <v-select
                :items="sortItems"
                v-model="sort"
                label="เรียง"
                return-object
                item-text="name"
                @change="getSale"
                style="padding-right: 12px"
                hide-details
              ></v-select>
            </v-col>
            <v-col cols="12" sm="2" style="padding-right: 0; padding-left: 0">
              <!--              <v-row style="margin: 0;" class="justify-end">-->
              <v-btn color="#7b1817" style="padding: 5px;" dark @click="$router.push(`${$route.path}/my-sale`)" block>
                การประกาศของฉัน
              </v-btn>
              <!--                &lt;!&ndash;                <v-btn color="#7b1817" dark @click="$router.push(`${$route.path}/add/edit`)">ประกาศขาย</v-btn>&ndash;&gt;-->
              <!--              </v-row>-->
            </v-col>
          </v-row>
          <v-row style="margin-top: 12px;">
            <v-spacer/>
            <p style="margin: 0; align-self: center">ประกาศทั้งหมด {{ itemsSale.recordsTotal }} ประกาศ</p>
            <v-pagination
              v-model="page"
              :length="itemsSale.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
          <v-row>
            <v-col style="max-width: 280px">
              <NavigationBar/>
            </v-col>
            <v-col style="max-width: 860px">
              <v-row v-show="itemsSale.data.length > 0">
                <v-col v-for="(item, index) in itemsSale.data" :key="index" cols="12" sm="3" align="center"
                       class="pl-1 pr-1">
                  <ItemsHire :item="item" :exchange="exchange"/>
                </v-col>
              </v-row>
              <v-col class="p-0" v-show="itemsSale.data.length <= 0">
                <v-card class="d-flex align-center" flat height="300">
                  <v-col align="center">
                    <p>ไม่มีข้อมูล ยังไม่พร้อมใช้งาน</p>
                  </v-col>
                </v-card>
              </v-col>
              <v-row style="margin-top: 12px;">
                <v-spacer/>
                <p style="margin: 0; align-self: center">ประกาศทั้งหมด {{ itemsSale.recordsTotal }} ประกาศ</p>
                <v-pagination
                  v-model="page"
                  :length="itemsSale.pageTotal"
                  :total-visible="7"
                ></v-pagination>
              </v-row>
            </v-col>
          </v-row>
        </v-container>
        <v-dialog v-model="dialogDelete" persistent max-width="598">
          <v-card>
            <v-col style="align-self: center;padding: 30px">
              <!--              <v-autocomplete-->
              <!--                  label="ชื่อ - นามสกุลผู้ถือครอง"-->
              <!--                  clearable-->
              <!--                  deletable-chips-->
              <!--                  small-chips-->
              <!--                  required-->
              <!--                  rounded-->
              <!--                  dense-->
              <!--                  outlined-->
              <!--                  :items="users.data"-->
              <!--                  v-model="owner"-->
              <!--                  return-object-->
              <!--                  full-width-->
              <!--                  item-text="username"-->
              <!--                  hide-details-->
              <!--              ></v-autocomplete>-->
              <p align="center">กรุณายืนยันการลบข้อมูล</p>
              <br/>
              <v-row>
                <v-col style="text-align-last: center;">
                  <v-btn outlined rounded color="#E4AB40" class="mr-3" @click="dialogDelete = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn rounded color="#E4AB40" dark @click="confirmDetele">
                    บันทึก
                  </v-btn>
                </v-col>
              </v-row>
            </v-col>
          </v-card>
        </v-dialog>
        <!--        <DialogCon detail="ขณะนี้ระบบยังไม่เปิดใช้บริการ" :callback="close" :status="snackbar"/>-->
      </v-main>
    </v-app>
  </div>
</template>
<style>
</style>
<script>
import { getUpdateInDay } from '~/utils/exchangeRates'

import ItemsHire from "~/components/ItemsHire"
import axios from "axios";
import dayjs from "dayjs";
import convert from "@/api/convert";

export default {
  // middleware: 'auth',
  scrollToTop: false,
  components: {
    ItemsHire,
  },
  data() {
    return {
      loading: true,
      page: 1,
      search: "",
      snackbar: true,
      dialogDelete: false,
      comment: '',
      postItems: [],
      items: ['กำลังดำเนินการ', 'ข้อมูลไม่ถูกต้อง', 'ทำการเปลี่ยนแปลงข้อมูลแล้ว'],
      sort: {},
      sortItems: [
        {
          id: 0,
          type: 'desc',
          name: 'มากไปหาน้อย',
        },
        {
          id: 1,
          type: 'asc',
          name: 'น้อยไปหามาก'
        },
        {
          id: 2,
          type: 'desc',
          name: 'ใหม่ไปเก่า'
        },
        {
          id: 3,
          type: 'asc',
          name: 'เก่าไปใหม่'
        }
      ],
      itemsSale: {data: []},
      itemsDel: {},
      priceMin: '',
      priceMax: '',
      title: "",
      exchange: {},
    }
  },
  async created() {
    this.$nextTick(function () {
      this.loading = false
    })
    if(this.$i18n.locale !== "th") {
      this.exchange = await getUpdateInDay(this.$i18n.locale)
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getSale()
      // this.getLabType()
    })
  },
  watch: {
    page(val) {
      this.$nextTick(() => {
        this.getSale()
      })
      this.$router.push({
        query: {
          page: val
        },
      })
    }
  },
  methods: {
    async getSale() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/sacred-object-out/forsale`, {
        params: {
          keyword: this.search,
          page: this.page,
          limit: 12,
          all: 1,
          isLabNo: 1,
          dateCreateSort: this.sort.id > 1 ? this.sort.type : '',
          priceMin: this.priceMin,
          priceMax: this.priceMax,
          priceSort: this.sort.id <= 1 ? this.sort.type : '',
          lab_typeId: "",
          categoryId: this.$route.params.post === "post" ? '' : this.$route.params.post,
        }
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.itemsSale = res.data
        if (this.$route.query.page) {
          this.page = parseInt(this.$route.query.page)
        }
        //   this.itemsSale.data.sort((a)=> {
        //     console.log(a.price)
        //   })
        // console.log(JSON.stringify(d))
      }).catch((e) => {
        this.$nuxt.$loading.finish()
        console.log(e)
      })
    },
    close() {
      this.snackbar = false
    },
    formatTime(time, format = 'DD MMM YYYY HH:mm') {
      return this.$dayjs(time).format(format)
    },
    async getPost(url = ``) {
      await this.$axios.get(`/find_mypost/${this.$route.query.id}`).then((response) => {
        this.postItems = response.data;
        // console.log(JSON.stringify(this.postItems))
      }).catch((error) => {
        alert(error)
        console.log(error)
      })
    },
    async addPost() {
      await this.$axios.post(`/post`, {
        'owner': this.$auth.user.id,
        'detail': this.comment,
        'rent': this.$route.query.id,
      }).then((response) => {
        this.comment = ''
        this.getPost()
        // console.log(response.data)
      }).catch((error) => {
        alert(error.message)
        console.log(error.response)
      })
    },
    async deleteItem(item) {
      // console.log(JSON.stringify(item))
      this.dialogDelete = true
      this.itemsDel = item
    },
    async confirmDetele() {
      await this.$axios.delete(`/rent/${this.itemsDel.id}`).then((response) => {
        this.$router.back()
        // console.log(response.data)
      }).catch((error) => {
        alert(error.message)
        console.log(error.response)
      })
    },
  },
}
</script>
