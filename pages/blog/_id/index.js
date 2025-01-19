import dayjs from "dayjs";
import convert from "@/plugins/convert";

export default {
  head() {
    return {
      title: this.headTitle,
    }
  },
  data: () => ({
    headTitle: "บทความ",

    item: {},
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
      this.getData()
    })
  },

  methods: {
    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/blog/${this.$route.params.id}`).then(res => {
        this.item = res.data
      }).catch((e) => {
        console.log(e)
      }).finally(() => {
        this.$nuxt.$loading.finish()
      })
    }
  }
};
