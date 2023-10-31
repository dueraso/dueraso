import dayjs from "dayjs";
import convert from "../../plugins/convert";
import myUtils from "@/plugins/myUtils";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";
// import {select} from "underscore";

export default {
  middleware: "auth",
  layout: "pos-layout",
  data: () => ({
    t:0,
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
    price: [
      1000, 500, 100
    ],
    changeMoney: 0.00,
    checkPayMoney:false,
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
    check(){
      if(this.isProm == null) return
      return this.isProm.type_promptpay === 3
    },
    close() {
      if(this.$refs.form.validate()){
        this.dialog = false
      }
    },

    async createOrder(val = 2){
      this.dialogPay = false
      this.$nuxt.$loading.start()
      await this.$axios.post("/posOrder",{
        discount:this.discountSel.length>0?this.discountSel[0].id:null,
        product:this.desserts,
        customer:null,
        branch:this.branch.id,
        pay_type:val,
        bill_number:this.branch.id+dayjs().format('YYMMDDHHmmss'),
      }).then((res)=>{
        this.desserts = []
        this.discountSel = []
        this.branch = {}
        this.$nuxt.$loading.finish()
      }).catch((e)=>{
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
    },
    pay() {
      this.dialogPay = true
      this.isProm = this.branchSelect.promptpay
      if(this.isProm.type_promptpay === 3){
        this.qr = JSON.parse(this.isProm.image_promptpay).fullPath
      }else {
        let isPay = this.isProm.type_promptpay === 1 ? convert.formatPhoneNumber(this.isProm.promptpay) : convert.formatIc(this.isProm.promptpay)
        let amount = this.priceTotal
        const payload = generatePayload(isPay, {amount}) //First parameter : mobileNumber || IDCardNumber
        const options = {type: 'svg', color: {dark: '#000', light: '#fff'}}
        qrcode.toString(payload, options, (err, svg) => {
          if (err) return console.log(err)
          this.qr = svg
        })
      }
    },
    convertBranchSelect() {
      this.branch.name = this.branchSelect.organization.title + '(' + this.branchSelect.title + ')'
      this.branch.id = this.branchSelect.id
    },
    async getBranch() {
      this.dialog = true
      this.$axios.get("branch").then((res) => {
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

    onConfirm() {
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
      // await this.$router.push("/update");
    },

    async editItem(item) {
      // await this.$router.push({
      //   path: "/update",
      //   query: {
      //     edite: Object.assign({}, item).id,
      //   },
      // });
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
