import dayjs from "dayjs";
import convert from "../../plugins/convert";
import myUtils from "@/plugins/myUtils";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";

export default {
  head() {
    return {
      title: this.headTitle,
    }
  },
  data: () => ({
    headTitle: "บทความ",

    loading: false,
    cards: {},
    calories: '',
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
    discount: [],
    discountSel: [],
    tags: {},
    total: 1,
    rules: {
      required: value => !!value || 'จำเป็น.',
      min: value => value >= 1,
      max: value => value <= 99,
    },
    branch: {},
    branchList: [],
    branchSelect: null,
    priceTotal: 0.00,
    discountTotal: 0.00,
    dialog: false,
    dialogPay: false,
    dialogCancelPay: false,
    qr: "",
    tab: null,
    valid: true,
    cash: 0,
    price: [
      1000, 500, 100
    ],
    items: [
      'web', 'shopping', 'videos', 'images', 'news',
    ],
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',

    // select: null,
    checkbox: false,
  }),
  computed: {
    convert() {
      return convert
    },
    roles() {
      return this.$auth.user.roles <= 2;
    },
  },
  watch: {
    changeMoney(val) {
      this.checkPayMoney = (val >= 0)
      return val
    },
    branch(val) {
      return val
    },
    discountSel(val) {
      this.onDiscountTotal()
      return val
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },

};
