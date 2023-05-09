<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;">
          <Header title="สถานะการลงทะเบียน"/>
          <v-row style="margin-top: 12px; margin-bottom: 12px">
            <v-col style="padding-bottom: 0" cols="12" sm="3">
              <v-text-field label="ค้นหาด้วยชื่อ" dense append-icon="mdi-magnify" v-model="search" @keydown.enter="getMyStatus(search)"></v-text-field>
            </v-col>
            <v-col align="right">
              ข้อมูลที่ลงทะเบียนทั้งหมด {{items.recordsTotal}} รายการ
            </v-col>
            <v-pagination
              v-model="page"
              :length="this.items.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
          <v-row>
            <v-col v-for="(i,index) in items.data" :key="index" sm="3" align="center">
              <ItemStatus :item="i" :color="itemStatus[toInt(i.status)].color"/>
            </v-col>
          </v-row>
          <v-row style="margin-top: 12px; margin-bottom: 12px">
            <v-col align="right">
              ข้อมูลที่ลงทะเบียนทั้งหมด {{items.recordsTotal}} รายการ
            </v-col>
            <v-pagination
              v-model="page"
              :length="items.pageTotal"
              @click="getMyStatus"
              :total-visible="7"
            ></v-pagination>
          </v-row>
        </v-container>
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
</style>
<script>
import axios from "~/api/config";
import serve from "~/api/server";
import ItemStatus from "../../components/ItemStatus";

export default {
  components: {
    ItemStatus,
  },
  watch:{
    page(val){
      console.log(val)
      this.getMyStatus()
    }
  },
  data() {
    return {
      search: '',
      page: 1,
      videoId: null,
      startTime: null,
      overlay: false,
      temple: {
        templeId: ''
      },
      templeItems: [],
      items: {},
      itemStatus:[
        {
          id:"0",
          name:'รอชำระเงิน',
          color:'#D88E1F'
        },
        {
          id:"1",
          name:'กำลังดำเนินการ',
          color:'#B195C9'
        },
        {
          id:"2",
          name:'อนุมัต',
          color:'#58E74E'
        },
        {
          id:"3",
          name:'ไม่อนุมัติ',
          color:'#E83232'
        },
        {
          id:"4",
          name:'ตีกลับ',
          color:'#ff00f2'
        },
      ]
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
      // this.getEvens()
    })
    this.getMyStatus()
  },
  methods: {
    toInt(val){
      return parseInt(val)
    },
    async getMyStatus(search = '') {
      await this.$axios.get(`/sacred-object-out/my`, {
        params: {
          keyword: search,
          page: this.page,
          limit: 8,
          templeId: ''
        }
      }).then((res) => {
        this.items = res.data
        // console.log(JSON.stringify(this.items))
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        console.log(error.message)
      })
    },
  }
}
</script>
