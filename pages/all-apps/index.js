import dayjs from "dayjs";
import convert from "../../plugins/convert";
import myUtils from "@/plugins/myUtils";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";

export default {
  data() {
    return {
      loading: false,
      items:[
        {
          id:1,
          title:"แคชเชียร์",
          icon:"/icon1.png",
          rout:"/pos",
        },
        {
          id:2,
          title:"จัดการหลังบ้าน",
          icon:"/icon2.png",
          rout:"/dashboard",
        },
      ]
    }
  },

  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
};
