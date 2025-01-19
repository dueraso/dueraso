import dayjs from "dayjs";
import convert from "../../plugins/convert";
import myUtils from "@/plugins/myUtils";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";

export default {
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "รวมแอปพลิเคชัน",
      loading: false,
      items:[
        {
          id:1,
          title:"แคชเชียร์",
          icon:"/icon1.png",
          rout:"/pos",
          status:false
        },
        {
          id:2,
          title:"จัดการหลังบ้าน",
          icon:"/icon2.png",
          rout:"/dashboard",
          status:false
        },
        {
          id:3,
          title:"จัดการ TikTok",
          icon:"/tiktok.png",
          rout:"/tiktok",
          status:false
        },
        {
          id:4,
          title:"จัดการลูกจ้าง",
          icon:"/icon2.png",
          rout:"",
          status:true
        },
        {
          id:5,
          title:"จัดการร้านอาหาร",
          icon:"/icon2.png",
          rout:"",
          status:true
        },
      ]
    }
  },

  created() {
    this.$nextTick(() => {
      this.loading = false
      this.$recaptcha.destroy()
    })
  },
};
