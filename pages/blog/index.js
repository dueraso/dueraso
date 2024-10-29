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

  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  methods:{
  }
};
