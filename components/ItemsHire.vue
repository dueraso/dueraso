<template>
  <v-card max-width="281" max-height="466" align="center" style="padding: 12px">
    <v-img :src="check()" max-width="100%" height="237" contain></v-img>
    <a
      style="font-size: 18px; font-weight: bold;color: #4e98e7; margin-bottom: 12px; margin-top: 12px"
      align="left" class="cut-text" @click="changePage">
      {{ item.phim_phra }}
    </a>
    <p align="left" class="cut-text" style="margin: 0">
      พุทธศิลป์ {{ item.buddhist_art }}
    </p>
    <p align="left" style="margin: 0">
      โดย {{ item.memberCode }}
    </p>
    <p align="left" class="mb-2">
      เลขประกาศ {{ convertId(item.saleId) }}
    </p>
    <p align="left" class="cut-text-2 h5 pb-2 m-0" style="color: black">
      {{ money() }}
    </p>
<!--    <p align="left" class="m-0" style="height: 24px">-->
<!--      <s>{{ money() }}</s>-->
<!--    </p>-->
  </v-card>
</template>
<style>
.cut-text-2 {
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.cut-text {
  text-decoration: none;
  text-overflow: ellipsis; /* เพิ่ม ... จุดจุดจุดท้ายสุด */
  display: block;
  overflow: hidden;
  white-space: nowrap;
  inline-size: -webkit-fill-available;
}
</style>
<script>
import dayjs from "dayjs";
import serve from "~/api/server";
import axios from "~/api/config";
import convert from "~/api/convert";

export default {
  props: {
    exchange: Object,
    item: Object,
    images: Object,
  },
  mounted() {

    // console.log(JSON.stringify(this.item))
    //ให้ผู้เช่าบูชาเสนอราคา
  },
  methods: {
    convertId(val) {
      let pad = "0000000"
      return pad.substring(0, pad.length - val.length) + val
    },
    money() {
      return convert.money(this.exchange, convert.check(this.$i18n.locale), this.item)
      // let p1 = this.item.price.replaceAll("บาท", "")
      // let p2 = p1.replaceAll("ล้าน", "")
      // let p3 = p2.replaceAll(",", "")
      //
      // let d = convert.check(this.$i18n.locale)
      // const formatter = new Intl.NumberFormat(d.long, {
      //   style: 'currency',
      //   currency: d.short,
      // });
      //
      // if (this.item.priceType === 'choice') return 'เสนอราคาเช่าบูชา'
      // if (Object.keys(this.exchange).length > 0) {
      //   let c = parseFloat(p3 / (this.exchange.SellingRates))
      //   return isNaN(c) ? p3 : formatter.format(c)
      // } else {
      //   return "฿" + p2
      // }
      // return convert.money(val).replaceAll("บาท", "") + " บาท"
    },
    convortDo(val) {
      if (val === undefined) return
      return convert.domain(val)
    },
    check() {
      return this.item.coverImage.length > 0 ? this.convortDo(this.item.coverImage[0]) : '/defaultimage.png'
    },
    changePage() {
      this.$router.push(this.localeLocation("/post/" + this.item.id))
    },
    convertDay(val, short = true) {
      return dayjs(val).locale('th').add(543, 'year').format(short ? 'D MMM YYYY' : 'D MMMM YYYY')
    },
  }
}
</script>
