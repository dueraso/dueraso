<template>
  <v-card max-width="287" align="center" style="padding: 12px">
    <v-img :src="check()" max-width="100%" height="237" contain></v-img>
    <a style="font-size: 18px; font-weight: bold;color: #4e98e7; margin-bottom: 12px; margin-top: 12px"
       align="left" class="cut-text-2" @click="changePage">{{
        item.phim_phra
      }}</a>
    <p align="left" class="cut-text-2">พุทธศิลป์ {{ item.buddhist_art }}<br/>
      เลขที่แลป {{ item.lab_no }}</p>
    <v-divider/>
    <p align="left" class="cut-text-2" style="margin: 0; padding-bottom: 12px">
      บันทึกเมื่อ {{ convertDay(item.createDate) }}
    </p>
    <v-chip :color="color" text-color="white">
      <p style="color: white; margin: 0">{{ item.statusText }}</p>
    </v-chip>
  </v-card>
</template>
<script>

import dayjs from "dayjs";
import serve from "~/api/server";
import convert from "~/api/convert";
import axios from "~/api/config";

export default {
  props: {
    item: Object,
    color: String
  },
  mounted() {
    // console.log(this.item)
  },
  methods: {
    convortDo(val) {
      if (val === undefined) return
      return convert.domain(val)
    },
    check() {
      return this.item.coverImage.length > 0 ? this.convortDo(this.item.coverImage[0]) : '/defaultimage.png'
    },
    changePage() {
      if (this.item.status === '0') {
        this.$router.push(this.localeLocation(`/items_list/${this.item.id}/payment`))
      } else {
        this.$router.push(this.localeLocation(`/items_list/${this.item.id}`))
      }
    },
    convertDay(val, short = true) {
      return dayjs(val).locale('th').add(543, 'year').format(short ? 'D MMM YYYY' : 'D MMMM YYYY')
    },
  }
}
</script>
