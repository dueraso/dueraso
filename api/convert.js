const dayjs = require("dayjs");
const axios = require("axios");
const converts = {
  money(exchange, i18n, item) {
    let p1 = item.price.replaceAll("บาท", "")
    let p2 = p1.replaceAll("ล้าน", "")
    let p3 = p2.replaceAll(",", "")

    const formatter = new Intl.NumberFormat(i18n.long, {
      style: 'currency',
      currency: i18n.short,
    });
    if (item.priceType === 'choice') return 'เสนอราคาเช่าบูชา'
    if (Object.keys(exchange).length > 0) {
      let c = parseFloat(p3 / (exchange.SellingRates))
      return isNaN(c) ? p3 : formatter.format(c)
    } else {
      return "฿" + p2
    }
    // if (val) {
    //   return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    // }
  },

  days(val, short = false) {
    if (val) {
      return dayjs(val).locale('th').add(543, 'year').format(short ? 'D MMM YYYY' : 'D MMMM YYYY')
    }
  },

  domain(val){
    // return val.replace('183.88.227.207:8084','siamamuletcollection.com')
    return val.replace('192.168.100.109:8084','siamamuletcollection.com')
  },

  check(val){
    if(val === "en"){
      return {
        long: "en-EN",
        short:"usd"
      }
    } else if(val === "ch"){
      return  {
        long: "zh-CN",
        short:"cny"
      }
    } else {
      return  {
        long: "th-TH",
        short:"thb"
      }
    }
  },
}

module.exports = converts
