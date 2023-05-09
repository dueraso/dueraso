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
          <Header title="การประกาศของฉัน"/>
          <v-row style="margin: 0px; padding-top: 12px">
            <v-col cols="12" sm="9" style="padding: 0px">
              <v-text-field
                label="ค้นหาชื่อพระ"
                append-icon="mdi-magnify"
                style="padding-right: 12px"
                hide-details
                v-model="search"
                @keydown.enter="getSale"
              ></v-text-field>
            </v-col>
            <v-col cols="12" sm="3" style="padding: 0px">
              <v-select
                disabled
                :items="items"
                label="เลือกประเภทพระเครื่อง"
                hide-details
              ></v-select>
            </v-col>
<!--            <v-col cols="12" sm="2" style="padding-right: 0; padding-left: 0">-->
<!--              <v-row style="margin: 0;" class="justify-end">-->
<!--                <v-btn color="#7b1817" style="padding: 5px;" dark @click="$router.push(`${$route.path}/my-sale`)">-->
<!--                  การประกาศของฉัน-->
<!--                </v-btn>-->
<!--                                <v-btn color="#7b1817" dark @click="$router.push(`${$route.path}/add/edit`)">ประกาศขาย</v-btn>-->
<!--              </v-row>-->
<!--            </v-col>-->
          </v-row>
          <v-row style="margin-top: 12px; margin-bottom: 12px">
            <v-spacer/>
            <p style="margin: 0; align-self: center">ประกาศทั้งหมด {{ itemsSale.recordsTotal }} ประกาศ</p>
            <v-pagination
              v-model="page"
              :length="itemsSale.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
          <v-row v-show="itemsSale.data.length > 0">
            <v-col v-for="(item, index) in itemsSale.data" :key="index" cols="12" sm="3">
              <ItemsHire :item="item" :exchange="exchange"/>
            </v-col>
          </v-row>
          <v-col style="padding-right: 0; padding-left: 0" v-show="itemsSale.data.length <= 0">
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
import ItemsHire from "~/components/ItemsHire"
import axios from "axios";

export default {
  middleware: 'auth',
  components: {
    ItemsHire,
  },
  data() {
    return {
      loading:true,
      page: 1,
      search: "",
      snackbar: true,
      dialogDelete: false,
      comment: '',
      postItems: [],
      items: ['กำลังดำเนินการ', 'ข้อมูลไม่ถูกต้อง', 'ทำการเปลี่ยนแปลงข้อมูลแล้ว'],
      itemsSale: {data: []},
      itemsDel: {},
      exchange: {},
    }
  },
  watch: {
    page(val){
      this.getSale()
    }
  },
  created() {
    this.$nextTick(function () {
      this.loading = false
    })
  },
  mounted() {
    this.$nextTick(() => {
      this.getSale()
    })
  },
  methods: {
    async getSale() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/sacred-object-out/forsale`, {
        params: {
          keyword: this.search,
          page: this.page,
          limit: 12,
          all: 0
        }
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.itemsSale = res.data
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
