import convert from "../../plugins/convert";
import Accordion from 'primevue/accordion';
import AccordionTab from 'primevue/accordiontab';

export default {
  head() {
    return {
      title: this.headTitle,
    }
  },
  components: {
    Accordion,
    AccordionTab
  },
  data: () => ({
    headTitle: "คำถามที่พบบ่อย",
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
    rules: {
      required: value => !!value || 'จำเป็น.',
      min: value => value >= 1,
      max: value => value <= 99,
    },
    valid: true,
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters',
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
    ],
    checkbox: false,
  }),
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
      this.$nuxt.$loading.start()
      await this.$axios.get("/faq").then(res => {
        console.log(res.data);
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      }).finally(() => {
        this.$nuxt.$loading.finish()
      })
    }
  }
};
