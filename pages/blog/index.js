import dayjs from "dayjs";
import convert from "../../plugins/convert";
// import Toast from 'primevue/toast';
// import ToastService from 'primevue/toastservice';
// import Button from 'primevue/button';
// import Editor from 'primevue/editor';


export default {
  head() {
    return {
      title: this.headTitle,
    }
  },
  components: {
  },
  data: () => ({
    headTitle: "บทความ",
    loading: false,
    tableHead: [
      {
        title: "ชื่อรายการ",
        width: "",
        text: "text-left"
      },
      {
        title: "จำนวน",
        width: "15%",
        text: "text-center"
      },
      {
        title: "ราคา",
        width: "20%",
        text: "text-right"
      },
    ],
    desserts: [],
    sortItems: [],
    sort: null,
    rules: [
      v => !!v || 'จำเป็น',
    ],
  }),
  computed: {
    convert() {
      return convert
    },
    height () {
      if(this.$vuetify) {
        return this.$vuetify.breakpoint.name
      }
      return ""
    }
  },
  watch: {
    // changeMoney(val) {
    //   this.checkPayMoney = (val >= 0)
    //   return val
    // },
  },

  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.$recaptcha.destroy()
      this.getData()
    })
  },

  methods:{
    async getData(){
      this.$nuxt.$loading.start()
      await this.$axios.get("/blog").then(res => {
        this.desserts = res.data
        console.log(res.data);
      }).catch((e) => {
        console.log(e)
      }).finally(()=>{
        this.$nuxt.$loading.finish()
      })
    }
  }
};
