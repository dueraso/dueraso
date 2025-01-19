import dayjs from "dayjs";
import convert from "../../plugins/convert";
import Carousel from 'primevue/carousel';
import Avatar from 'primevue/avatar';

export default {
  head() {
    return {
      title: this.headTitle,
    }
  },
  components: {
    Carousel,
    Avatar
  },
  data() {
    return {
      headTitle: "แพ็คเกจ",
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
      dialog: false,
      responsiveOptions: [
        {
          breakpoint: '1024px',
          numVisible: 3,
          numScroll: 3
        },
        {
          breakpoint: '600px',
          numVisible: 2,
          numScroll: 2
        },
        {
          breakpoint: '480px',
          numVisible: 1,
          numScroll: 1
        }
      ],
      products: [],
    }
  },

  computed: {
    convert() {
      return convert
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.$recaptcha.destroy()
      this.getData()
    })
  },

  methods: {
    async getData() {
      await this.$axios.get("/package-list").then(res => {
        this.products = res.data.data
        console.log(res.data);
      }).catch((e) => {
        console.log(e)
      })
    }
  }
};
