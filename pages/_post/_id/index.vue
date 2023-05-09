<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <div v-if="loading">
        <v-col align="center">
          Loading..
        </v-col>
      </div>
      <v-main v-if="!loading">
        <v-container style="max-width: 1140px;" v-show="items.data.status == 2">
          <Header :title="items.data.type_of_phra"/>
          <v-col style="padding-right: 0; padding-left: 0">
            <v-card style="padding: 12px;">
              <v-row style="padding: 12px;">
                <v-col sm="6">
                  <v-row style="margin: 0">
                    <v-col
                      v-show="items.data.coverImage.length > 0" style="padding: 3px"
                      v-for="(item, index) in items.data.coverImage" :key="index" :cols="index > 0?2:12">
                      <v-img :src="con(item)" @click="openImage(index)"/>
                    </v-col>
                    <v-img v-show="items.data.coverImage.length === 0" src="/defaultimage.png"></v-img>
                  </v-row>
                </v-col>
                <v-col style="padding-bottom: 0px;padding-top: 0px">
                  <v-row style="padding: 12px">
                    <!--                    <strong style="font-size: 18px;">{{ items.amulet.name }} รุ่น {{ items.amulet.model }}</strong>-->
                    <v-spacer/>
                    <!--                    <v-btn-->
                    <!--                      color="#7b1817" style="margin-left: 10px" dark v-if="items.owner.id === this.$auth.user.id"-->
                    <!--                      @click="deleteItem(items)" outlined>-->
                    <!--                      ลบการเสนอให้เช่า-->
                    <!--                    </v-btn>-->

                    <!--                    <v-btn-->
                    <!--                      color="#7b1817" style="margin-left: 10px" dark v-if="items.owner.id === this.$auth.user.id"-->
                    <!--                      @click="()=>this.$router.push(`${this.$route.name}/${this.$route.query.id}`)">-->
                    <!--                      แก้ไขข้อมูล-->
                    <!--                    </v-btn>-->
                    <v-btn
                      color="#7b1817" style="margin-left: 10px" dark
                      @click="deleteItem(items)" outlined v-show="checkBtn()">
                      ลบการเสนอให้เช่า
                    </v-btn>
                    <v-btn
                      color="#7b1817" style="margin-left: 10px" dark @click="$router.push(`${$route.path}/edit`)"
                      v-show="checkBtn()">
                      แก้ไขข้อมูล
                    </v-btn>
                  </v-row>
                  <v-row style="padding-top: 0px">
                    <v-col style="padding-top: 0px">
                      <!--                      <p style="padding-bottom: 6px">-->
                      <!--                        <strong style="font-size: 24px;">-->
                      <!--                          ประเภทพระ {{ items.data.type_of_phra }}-->
                      <!--                        </strong>-->
                      <!--                      </p>-->
                      <p style="padding-bottom: 6px">
                        <strong>{{$i18n.t('items_list').phimPhra}}: {{ items.data.phim_phra }}</strong>
                      </p>
                      <p style="padding-bottom: 6px">
                        <strong>{{$i18n.t('items_list').buddhistArt}}: {{ items.data.buddhist_art }}</strong>
                      </p>
                      <p style="padding-top: 12px;">
                        {{$i18n.t('items_list').amuletInformation}}: {{ items.data.phra_information }}
                      </p>
                      <p style="min-height: 120px;padding-top: 12px; padding-bottom: 12px">
                        {{$i18n.t('items_list').additionalDetails}}: {{ items.data.sale.detail }}
                      </p>
                      <p style="padding-bottom: 6px">
                        {{$i18n.t('items_list').contactToBuy}}:
                        <a :href="'tel:'+items.data.sale.mobile">{{ items.data.sale.mobile }}</a>
                      </p>
                      <p style="padding-bottom: 6px">LINE ID:
                        <a :href="'https://line.me/ti/p/~'+items.data.sale.line" target="_blank">
                          {{
                            items.data.sale.line
                          }}
                        </a>
                      </p>
                      <p style="padding-bottom: 6px">
                        {{$i18n.t('items_list').announcer}}: {{ items.data.memberCode }}<br>
                        {{$i18n.t('items_list').announcementNo}}: {{ convertId(items.data.sale.saleId) }}
                      </p>
                      <p>{{$i18n.t('items_list').sellingPrice}}:
                        <strong style="font-size: 24px; color: #7B1817">
                          {{ conMoney() }}
                        </strong>
                      </p>
                      <v-divider/>
                      <p style="font-size: 14px;color: #646464">{{$i18n.t('items_list').announcementDate}} {{ formatTime(items.data.createDate) }}</p>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-row style="margin-top: 12px; margin-bottom: 0">
            <v-spacer></v-spacer>
            <p style="align-self: center">{{$i18n.t('items_list').allResponses}} {{ postItems.recordsTotal }} {{$i18n.t('items_list').post}}</p>
            <v-pagination
              v-model="page"
              :length="postItems.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
          <v-col style="padding-left: 0; padding-right: 0">
            <v-card style="padding: 12px;">
              <v-row style="padding: 12px; margin: 0" align-md="center">
                <v-text-field :label="$i18n.t('items_list').typeComment" hide-details v-model="comment" :readonly="!this.$auth.loggedIn">
                </v-text-field>
                <v-btn
                  color="#7b1817" style="margin-left: 10px" :dark="this.$auth.loggedIn" @click="addPost"
                  :disabled="!this.$auth.loggedIn">
                  ส่ง
                </v-btn>
              </v-row>
            </v-card>
          </v-col>
          <ItemPost v-for="(item, index) in postItems.data" :key="index" :item="item" :rent="items.data"
                    :callback="callReply"/>
          <v-row style="margin-top: 0px;">
            <v-spacer/>
            <p style="align-self: center">{{$i18n.t('items_list').allResponses}} {{ postItems.recordsTotal }} {{$i18n.t('items_list').post}}</p>
            <v-pagination
              v-model="page"
              :length="postItems.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
        </v-container>

        <v-container style="max-width: 1140px;" v-show="items.data.status != 2">
          <Header title="ประกาศซื้อ-ขาย"/>
          <v-col style="padding-right: 0; padding-left: 0">
            <v-card class="d-flex align-center" flat height="300">
              <v-col align="center">
                <p>ไม่มีข้อมูล ยังไม่พร้อมใช้งาน</p>
                <br>
                <a href="/"><p>To Home</p></a>
              </v-col>
            </v-card>
          </v-col>
        </v-container>
        <!--        <v-dialog v-model="dialogDelete" persistent max-width="598">-->
        <!--          <v-card>-->
        <!--            <v-col style="align-self: center;padding: 30px">-->
        <!--              <p align="center">กรุณายืนยันการลบข้อมูล</p>-->
        <!--              <br/>-->
        <!--              <v-row>-->
        <!--                <v-col style="text-align-last: center;">-->
        <!--                  <v-btn outlined rounded color="#E4AB40" class="mr-3" @click="dialogDelete = false">-->
        <!--                    ยกเลิก-->
        <!--                  </v-btn>-->
        <!--                  <v-btn rounded color="#E4AB40" dark @click="confirmDelete">-->
        <!--                    บันทึก-->
        <!--                  </v-btn>-->
        <!--                </v-col>-->
        <!--              </v-row>-->
        <!--            </v-col>-->
        <!--          </v-card>-->
        <!--        </v-dialog>-->
      </v-main>
      <DialogCon
        :callback="close" :status="dialogDelete" :confirm="confirmDelete" textBtn="ยกเลิก"
        detail="คุณต้องการลบรายการนี้ใช่หรือไม่"/>
      <DialogInput :callback="close" :status="replyComment" textBtn="ยกเลิก" :confirm="reply"/>
      <SliderImg :status="overlay" :callback="close" :items="items.data.coverImage" :start="indexImg"/>
    </v-app>
  </div>
</template>
<style>
.v-application p {
  margin: 0;
}
</style>
<script>
import ItemPost from "~/components/ItemPost"
import convert from "~/api/convert";
import SliderImg from "~/components/SliderImg";
import DialogCon from "../../../components/DialogCon";
import DialogInput from "../../../components/DialogInput";
import {getUpdateInDay} from "@/utils/exchangeRates";

export default {
  // middleware: 'auth',
  components: {
    DialogInput,
    DialogCon,
    SliderImg,
    ItemPost,
  },
  data() {
    return {
      loading:true,
      page: 1,
      dialogDelete: false,
      overlay: false,
      replyComment: false,
      comment: '',
      parentId: 0,
      indexImg: 0,
      postItems: {},
      items: {
        data: {
          coverImage: [],
          memberCode: '',
          status: '',
          sale: {
            price: '',
            detail: '',
            mobile: '',
            line: '',
          }
        }
      },
      itemsDel: {},
      exchange: {},
    }
  },
  watch: {
    page(val){
      this.getPost()
    }
  },
  created() {
    this.$nextTick(function () {
      this.loading = false
    })
  },
  async mounted() {
    this.$nextTick(() => {
      this.getDetail()
    })
    if(this.$i18n.locale !== "th") {
      this.exchange = await getUpdateInDay(this.$i18n.locale)
    }
    // this.getDetail()
    this.getPost()
  },
  methods: {
    convertId(val){
      if(val === undefined) {
        return
      }
      let pad = "0000000"
      return  pad.substring(0, pad.length - val.length) + val
    },
    callReply(val) {
      this.parentId = val
      this.replyComment = true
    },
    reply(val) {
      this.replyComment = false
      this.comment = val
      this.addPost()
      // console.log(val)
    },
    checkBtn() {
      if (!this.$auth.loggedIn) {
        return false
      }
      return this.$auth.user.memberCode === this.items.data.memberCode
    },
    close() {
      this.overlay = false
      this.status = false
      this.dialogDelete = false
      this.replyComment = false
      this.parentId = 0
      // console.log("close>")
    },
    openImage(index) {
      this.indexImg = index
      this.overlay = true
    },
    con(val) {
      return convert.domain(val)
    },
    conMoney() {
      // if(val === "") return
      return convert.money(this.exchange, convert.check(this.$i18n.locale), this.items.data.sale)
      // return convert.money(val).replaceAll("บาท","") +" บาท"
    },
    async getDetail() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/sacred-object-out/detail`, {
        params: {
          id: this.$route.params.id,
          my: 0
        }
      }).then((res) => {
        if (!Array.isArray(res.data.data)) {
          this.items = res.data;
        }
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        this.$nuxt.$loading.finish()
        // alert(error)
        console.log(error)
      })
    },
    formatTime(time, format = 'DD MMM YYYY HH:mm') {
      return this.$dayjs(time).format(format)
    },
    async getPost() {
      await this.$axios.get(`/comment/list`, {
        params: {
          limit: 100,
          id: this.$route.params.id,
          type: "sacred_object_out",
          page:this.page
        }
      }).then((response) => {
        this.$nuxt.$loading.finish()
        this.postItems = response.data;
        // console.log(this.postItems)
      }).catch((error) => {
        this.$nuxt.$loading.finish()
        // alert(error)
        console.log(error)
      })
    },
    async addPost() {
      await this.$axios.post(`/comment/save`, {
        id: this.$route.params.id,
        parentId: this.parentId,
        detail: this.comment,
        type: 'sacred_object_out',
      }).then((response) => {
        this.$nuxt.$loading.finish()
        this.comment = ''
        this.parentId = 0
        this.getPost()
      }).catch((error) => {
        this.$nuxt.$loading.finish()
        // alert(error.message)
        console.log(error.response)
      })
    },
    async deleteItem(item) {
      // console.log(JSON.stringify(item))
      this.dialogDelete = true
      this.itemsDel = item
    },
    async confirmDelete() {
      // console.log(JSON.stringify(this.items.data)+"<<id>>"+this.items.data.sale.saleId)
      await this.$axios.post(`/sacred-object-out/forsaleDelete`, {
        id: this.items.data.sale.saleId
      }).then((res) => {
        // this.$router.back()
        this.$router.replace(this.localeLocation("/post"))
      }).catch((error) => {
        console.log(error.response)
      })
    },
  },
}
</script>
