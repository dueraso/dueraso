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
      {
        src: './firs-regis.gif',
        target:"",
        route:"/login"
      },
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
