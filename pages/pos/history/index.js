import dayjs from "dayjs";
import B from "@/utils/myFunction";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";
import convert from "../../../plugins/convert";

export default {
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
          width: "40%"
        },
        {
          title: "ออเดอร์",
          width: ""
        },
        {
          title: "ส่วนลด",
          width: ""
        },
        {
          title: "ยอดสุทธิ",
          width: ""
        },
        {
          title: "สร้างเมื่อ",
          width: "150px"
        },
      ],
      tableHead: [
        {
          title: "สาขา",
          width: ""
        },
        {
          title: "ออเดอร์",
          width: ""
        },
        {
          title: "ยอดทั้งหมด",
          width: ""
        }
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
  }
};
