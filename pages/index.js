import dayjs from "dayjs";
import partner from "@/components/Partner.vue";

export default {
  // middleware: "auth",
  layout:"home-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  components:{
    partner
  },
  data: () => ({
    loading: true,
    headTitle: "หน้าแรก",
    items: [
      // {
      //   src: './firs-regis.gif',
      //   target:"",
      //   route:"/login"
      // },
      {
        src: './banner-01@2x.png',
        target:"",
        route:""
      },
      {
        src: './arin.png',
        target:"_blank",
        route:"https://www.instagram.com/a.rinofficial_"
      }
    ],
    itemOptions:[
      {
        title:"ระบบจัดการเมนูสินค้าและยอดขาย",
        detail:"ช่วยให้ร้านค้าสามารถเพิ่ม, ลบ, และจัดการเมนูสินค้าได้ง่าย พร้อมบันทึกยอดขายในแต่ละวันเพื่อดูผลประกอบการแบบเรียลไทม์"
      },
      {
        title:"การชำระเงินที่หลากหลาย",
        detail:"รองรับการชำระเงินผ่านเงินสด, หรือ QR Code ช่วยให้ลูกค้าทำรายการได้รวดเร็วและสะดวกสบาย"
      },
      {
        title:"การจัดการคลังสินค้า",
        detail:"ระบบช่วยตัดสต๊อกและบริหารวัตถุดิบโดยอัตโนมัติ พร้อมคำนวณต้นทุนและปรับปรุงการบริหารคลังสินค้าให้แม่นยำ"
      },
      {
        title:"ระบบตรวจสอบการทำงานของพนักงาน",
        detail:"สามารถติดตามเวลาการทำงานของพนักงานแบบเรียลไทม์ รวมถึงจัดแบ่งหน้าที่การทำงานเพื่อความชัดเจนและมีประสิทธิภาพ"
      },
      {
        title:"รายงานวิเคราะห์ข้อมูลธุรกิจ",
        detail:"ระบบจัดทำรายงานการขายที่เข้าใจง่ายและสามารถนำไปวิเคราะห์ต่อยอดธุรกิจ ช่วยสร้างโอกาสในการพัฒนาและเพิ่มยอดขาย"
      },
    ]
  }),
  computed: {
    height () {
      if(this.$vuetify) {
        return this.$vuetify.breakpoint.name
      }
      return ""
    }
  },
  watch: {
  },

  created() {
    // console.log(this.$vuetify.breakpoint)
    // this.getData();
  },

  mounted() {
    this.$nextTick(()=>{
      this.loading = false
    })
  },

  methods: {
  },
};
