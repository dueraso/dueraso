import dayjs from "dayjs";
import convert from "../../plugins/convert";

export default {
  head() {
    return {
      title: this.headTitle,
    }
  },
  data: () => ({
    headTitle: "ติดต่อเรา",
    loading: false,

    valid: true,
    rules: {
      required: value => !!value || 'จำเป็น.',
      min: value => value >= 1,
      max: value => value <= 99,
    },
    dialog: false,
    item:{}
  }),
  computed: {
    convert() {
      return convert
    },
  },

  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },

  async mounted() {
    try {
      await this.$recaptcha.init()
    } catch (e) {
      console.error(e);
    }
  },
  methods: {
    async onSubmit() {
      if (!this.$refs.form.validate()) return;
      await this.$recaptcha.execute('contactUs').then(res => {
        this.verifyRecaptcha(res)
      }).catch((error) => {
        console.log('Login error:', error)
      })
    },

    async verifyRecaptcha(token) {
      await this.$axios.post("/contact-us", {
        token: token,...this.item
      }).then(() => {
        this.$refs.form.reset()
      }).catch((e) => {
        console.log(e)
      })
    },
  },
}
