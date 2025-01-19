import dayjs from "dayjs";
import isAdmin from "@/middleware/is-admin";
import convert from "../../../plugins/convert";
import Fieldset from "primevue/fieldset";

export default {
  components: {Fieldset},
  computed: {
    convert() {
      return convert
    }
  },
  middleware: ['auth', isAdmin],
  layout: "seller-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการประวัติการขาย",
      rules: [
        v => !!v || 'จำเป็น',
      ],
      loading: true,
      search: "",
      dialog: false,
      dialogOrder: false,
      dialogDelete: false,
      isLoading: false,
      instead: [
        {
          id: 1,
          name: "เป็นบาท"
        },
        {
          id: 2,
          name: "เป็นเปอร์เซ็นต์"
        }
      ],
      insteadSelect: null,
      itemHead: [
        {
          title: "ชื่อ",
          width: "40%",
          text: "text-left"
        },
        {
          title: "ออเดอร์",
          width: "",
          text: "text-left"
        },
        {
          title: "ชำระโดย",
          width: "",
          text: "text-left"
        },
        {
          title: "ส่วนลด",
          width: "",
          text: "text-left"
        },
        {
          title: "ยอดสุทธิ",
          width: "",
          text: "text-left"
        },
        {
          title: "สร้างเมื่อ",
          width: "150px",
          text: "text-left"
        },
      ],
      tableHead: [
        {
          title: "สาขา/ออกงาน/ไลฟ์สด",
          width: "70%",
          text: "text-left"
        },
        {
          title: "ออเดอร์",
          width: "15%",
          text: "text-left"
        },
        {
          title: "ยอดทั้งหมด",
          width: "15%",
          text: "text-left"
        }
      ],
      orderHeads: [
        {
          title: "ชื่อ",
          width: "40%",
          text: "text-left"
        },
        {
          title: "ออเดอร์",
          width: "",
          text: "text-left"
        },
        {
          title: "ยอด",
          width: "",
          text: "text-left"
        },
      ],
      desserts: {
        meta: {},
        branch:{}
      },
      item: {
        employee:{},
        discount:{},
        product:[],
        branch:{}
      },
      use: [],
      valid: false,
      page: 1,
      dialogStart: false,
      dateStart: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      itemOrder:{}
    };
  },
  watch: {
    page(val) {
      this.getData()
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.getData()
    })
  },

  methods: {
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },

    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/getBillList", {
        params: {
          page: this.page,
          per: 10,
          date: this.dateStart
        }
      }).then((res) => {
        this.desserts = res.data
        // this.desserts = Object.assign({},res.data)
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    openItem(val = {}) {
      this.dialog = true
      this.item = Object.assign({}, val)
      this.item.items.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    },

    openOrder(val = {}) {
      console.log(val)
      this.dialogOrder = true
      this.itemOrder = Object.assign({}, val)
    },
  }
};
