import dayjs from "dayjs";
import convert from "../../plugins/convert";
import myUtils from "@/plugins/myUtils";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";
import isPos from "~/middleware/is-pos";
import isAdmin from "~/middleware/is-admin";
// import {select} from "underscore";
import {GlobalEventEmitter} from '@/utils/GlobalEventEmitter'
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";


export default {
  middleware: ["auth", isAdmin],
  layout: "pos-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  data: () => ({
    headTitle: "แคชเชียร์",

    t: 0,
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
    isProm: null,
    valid: true,
    cash: 0,
    extra: 0,
    extraSelect: {},
    price: [
      1000, 500, 100
    ],
    changeMoney: 0.00,
    checkPayMoney: false,
    checkbox: false,
    customDiscount: false,
    search: "",

    provinceItems: [],
    provinceSelect: null,
    districtItems: [],
    districtSelect: null,
    targetElement:null
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
    provinceSelect(val) {
      this.getDistrict()
      return val
    },
    search(val) {
      if (val.length >= 3) {
        this.searchPro()
      }
      if (val.length === 0) {
        this.getData()
      }
    },
    changeMoney(val) {
      this.checkPayMoney = (val >= 0)
      return val
    },
    branch(val) {
      return val
    },
    extra(val) {
      this.extra = parseInt(val)
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

  mounted() {
    this.$nextTick(() => {
      this.loading = false
      if (this.$auth.user.branch) {
        this.getData()
        this.getType()
        if(this.$auth.user.branch.type === 2) {
          this.dialog = true
          this.branchSelect = this.$auth.user.branch
        }
        //dialog
      }
      this.getDiscount()
      this.getProvince()
    })
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
    async lockScroll() {
      await new Promise(resolve => setTimeout(resolve, 0));

      this.targetElement = await this.$refs.modalContent;
      disableBodyScroll(this.targetElement);
    },
    unLockScroll() {
      this.targetElement = this.$refs.modalContent;
      enableBodyScroll(this.targetElement);
    },
    async getDistrict() {
      await this.$axios.get("/district", {
        params: {
          provinceNo: this.provinceSelect.no
        }
      }).then((res) => {
        this.districtItems = res.data
      }).catch((e) => {
        console.log(e);
      });
    },
    async getProvince() {
      await this.$axios.get("/province").then((res) => {
        this.provinceItems = res.data
      }).catch((e) => {
        console.log(e);
      });
    },
    checkType() {
      if (this.branchSelect) {
        return this.branchSelect.type === 2
      }
      return false
    },
    confirmExtra() {
      this.extraSelect = {
        id: 1,
        name: this.extra + " บาท",
        type_discount: 1,
        total: this.extra
      }
      this.addDiscount(this.extraSelect)
      this.extra = 0
      this.customDiscount = false
    },
    async searchPro() {
      this.$nuxt.$loading.start()
      await this.$axios.get("searchPro", {
        params: {
          s: this.search
        }
      }).then((res) => {
        this.cards = res.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e)
        alert(e.response.data.message)
        this.$nuxt.$loading.finish()
      })
    },
    check() {
      if (this.isProm == null) return
      return this.isProm.type_promptpay === 3
    },
    close() {
      if (this.$refs.form.validate()) {
        this.getData()
        this.getType()
        this.dialog = false
      }
    },

    async createOrder(val = 2) {
      this.dialogPay = false
      this.unLockScroll()
      this.$nuxt.$loading.start()
      await this.$axios.post("/posOrder", {
        discount: this.discountSel.length > 0 ? this.discountSel[0].id : null,
        product: this.desserts,
        customer: null,
        branch: this.branch.id,
        pay_type: val,
        bill_number: this.branch.id + dayjs().format('YYMMDDHHmmss'),
        price: this.priceTotal,
        total: convert.calculateArray(this.desserts),
        discountTotal: this.discountTotal,
        province: this.provinceSelect?this.provinceSelect.id:null,
        district: this.districtSelect?this.districtSelect.id:null,
      }).then((res) => {
        this.desserts = []
        this.discountSel = []
        this.cash = 0
        this.changeMoney = 0.0
        this.discountTotal = 0.00
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        this.$nuxt.$loading.finish()
        console.log(e)
      })
    },
    getCash(val, isSum = true) {
      if (isSum) {
        this.cash = parseFloat(this.cash) + parseFloat(val)
        this.changeMoney = parseFloat(this.cash - this.priceTotal)
      } else {
        this.cash = val
        this.changeMoney = this.cash
      }
    },
    sumChange(val, isDel = false) {
      if (isDel) {
        let _del = this.cash.toString().substring(0, this.cash.toString().length - 1)
        this.cash = _del === "" ? 0 : _del
      } else {
        if (this.cash.toString().indexOf(".") > -1) {
          if (this.cash.toString().substring(this.cash.toString().indexOf(".") + 1, this.cash.toString().length).length < 2) {
            if (val === ".") return;
            this.cash = val === "." ? this.cash.toString() + val : parseFloat(this.cash.toString() + val)
          }
          // return
        } else {
          this.cash = val === "." ? this.cash.toString() + val : parseFloat(this.cash.toString() + val)
        }
      }
      this.changeMoney = this.cash - this.priceTotal
    },
    confirmClose() {
      this.dialogCancelPay = false
      this.dialogPay = false
      this.unLockScroll()
    },
    pay() {
      this.dialogPay = true
      this.lockScroll()
      this.isProm = this.branchSelect.promptpay
      if (this.isProm.type_promptpay === 3) {
        this.qr = JSON.parse(this.isProm.image_promptpay).fullPath
      } else {
        let isPay = this.isProm.type_promptpay === 1 ? convert.formatPhoneNumber(this.isProm.promptpay) : convert.formatIc(this.isProm.promptpay)
        let amount = this.priceTotal
        const payload = generatePayload(isPay, {amount}) //First parameter : mobileNumber || IDCardNumber
        const options = {
          type: 'svg',
          color: {
            dark: '#000',
            light: '#fff'
          },
          // image: document.getElementById('image'),
        }
        qrcode.toString(payload, options, (err, svg) => {
          if (err) return console.log(err)
          this.qr = svg
        })
      }
    },
    convertBranchSelect() {
      this.branch.name = this.branchSelect.organization.title + '(' + this.branchSelect.title + ')'
      this.branch.id = this.branchSelect.id

      GlobalEventEmitter.$emit('branchNum', this.branchSelect)
    },
    async getBranch() {
      this.dialog = true
      this.$axios.get("branch").then((res) => {
        this.branchList = res.data
      }).catch((e) => {
        console.log(e)
      })
    },

    onDiscountTotal() {
      if (this.discountSel.length === 0) return
      let _discountSel = this.discountSel[0]
      this.discountTotal = _discountSel.type_discount === 1 ? _discountSel.total : Math.round(this.priceTotal / 100 * _discountSel.total)
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

    async getData(_type = null) {
      this.$nuxt.$loading.start()
      await this.$axios.get("/posProduct", {
        params: {
          type: _type,
          branch: this.branch.id
        }
      }).then((res) => {
        this.cards = res.data
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        console.log(error);
      });
    },

    async getType() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/posProductType",{
        params:{
          branch: this.branch.id
        }
      }).then((res) => {
        this.tags = res.data;
        this.tags.data.sort((a, b) => b.product.length - a.product.length)
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        console.log(error);
      });
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
