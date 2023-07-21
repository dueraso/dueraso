import dayjs from "dayjs";
import convert from "../../plugins/convert";
import myUtils from "@/plugins/myUtils";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";
import {select} from "underscore";
// import fs from "fs";
// import fs from "../../api/test";

export default {
  // middleware: "auth",
  layout: "pos-layout",
  data: () => ({
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
      required: value => !!value || 'Required.',
      min: value => value >= 1,
      max: value => value <= 99,
    },
    branch: "",
    branchList: [],
    branchSelect: {},
    priceTotal: 0.00,
    discountTotal: 0.00,
    dialog: false,
    dialogPay: false,
    dialogCancelPay: false,
    qr: "",
    tab: null,
    cash: 0,
    price: [
      1000, 500, 100
    ],
    items: [
      'web', 'shopping', 'videos', 'images', 'news',
    ],
    text: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.',
    changeMoney: 0
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
      return val
    },
    branch(val) {
      return val
    },
    discountSel(val) {
      this.onDiscountTotal()
      return val
    },
    desserts(val) {
      this.priceTotal = convert.calculateArray(val, true)
      this.onDiscountTotal()
      return val
    },
    countOrder(val) {
      return '1'
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

  mounted() {
    this.getData()
    this.getDiscount()
    this.getType()
    if (!this.$auth.loggedIn) {
      this.branchSelect = ""
      return
    }
    if (this.$auth.user.branch == null) {
      this.getBranch()
    } else {
      this.branchSelect = this.$auth.user.branch
      this.convertBranchSelect()
    }
    // this.qrTest()
  },
  methods: {
    select,
    getCash(val) {
      this.cash += parseFloat(val)
      this.changeMoney = this.cash - this.priceTotal
    },
    confirmClose() {
      this.dialogCancelPay = false
      this.dialogPay = false
    },
    pay() {
      this.dialogPay = true
      const mobileNumber = '095-432-9380'
      const IDCardNumber = '0-0000-00000-00-0'
      let amount = this.priceTotal
      const payload = generatePayload(mobileNumber, {amount}) //First parameter : mobileNumber || IDCardNumber
      const options = {type: 'svg', color: {dark: '#000', light: '#fff'}}
      qrcode.toString(payload, options, (err, svg) => {
        if (err) return console.log(err)
        this.qr = svg
      })
    },
    convertBranchSelect() {
      this.branch = this.branchSelect.organization.title + '(' + this.branchSelect.title + ')'
    },
    async getBranch() {
      this.dialog = true
      this.$axios.get("branch").then((res) => {
        console.log(res.data)
        this.branchList = res.data
      }).catch((e) => {
        console.log(e)
      })
    },
    checkBranch() {
      return this.$auth.user
    },
    onDiscountTotal() {
      if (this.discountSel.length === 0) return
      this.discountTotal = Math.round(this.priceTotal / 100 * this.discountSel[0].total)
      this.priceTotal -= this.discountTotal
    },
    addDiscount(val) {
      this.discountSel.push(val)
    },
    removeDiscount(val) {
      this.priceTotal += this.discountTotal
      this.discountSel.splice(this.discountSel.indexOf(val), 1)
    },

    addOrder(val) {
      val.total = 1
      let s = this.desserts
      s.push(val)
      this.desserts = convert.countObjectArray(s)
    },

    removeOrder(val) {
      this.desserts.splice(this.desserts.indexOf(val), 1)
    },

    onConfirm() {
      console.log("")
    },
    myUtils,
    convertDay(day) {
      return dayjs(day).format("DD-MM-YYYY HH:mm:ss");
    },

    async getDiscount() {
      await this.$axios.get("/getDiscountForUse").then((res) => {
        this.discount = res.data
      }).catch((error) => {
        console.log(error);
      });
    },

    async getData(_type = "") {
      await this.$axios.get("/posProduct", {
        params: {
          type: _type
        }
      }).then((res) => {
        this.cards = res.data
      }).catch((error) => {
        console.log(error);
      });
    },

    async deleteItemConfirm() {
      console.log(JSON.stringify(this.editedItem));
      await this.$axios.delete(`/places/${this.editedItem.id}`).then(() => {
        this.getData();
        this.closeDelete();
      }).catch((error) => {
        console.log(error);
      });
    },

    async getType() {
      await this.$axios.get("/posProductType").then((res) => {
        this.tags = res.data;
      }).catch((error) => {
        console.log(error);
      });
    },

    async searchPlaces() {
      await this.$axios.get(`/filter_places`, {
        params: {
          search: this.search,
        },
      }).then((response) => {
        this.desserts = response.data;
      }).catch((error) => {
        alert(error);
        console.log(error);
      });
    },

    async createItem() {
      await this.getPlaceList();
      this.$store.commit("setReadOnly", false);
      await this.$router.push("/update");
    },

    async editItem(item) {
      await this.$router.push({
        path: "/update",
        query: {
          edite: Object.assign({}, item).id,
        },
      });
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    closeDelete() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
