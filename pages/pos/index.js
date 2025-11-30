import dayjs from "dayjs";
import convert from "../../plugins/convert";
import generatePayload from "promptpay-qr";
import qrcode from "qrcode";
import isPos from "~/middleware/is-pos";
import isAdmin from "~/middleware/is-admin";
import { GlobalEventEmitter } from "@/utils/GlobalEventEmitter";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

export default {
  middleware: ["auth", isAdmin],
  layout: "pos-layout",
  head() {
    return {
      title: this.headTitle,
    };
  },
  data: () => ({
    headTitle: "แคชเชียร์",

    // POS Mode: 'unit' = ขายเป็นชิ้น, 'weight' = ขายเป็นกรัม (มาล่า)
    posMode: "unit",

    t: 0,
    loading: false,
    cards: {},
    calories: "",
    tableHead: [
      {
        title: "ชื่อรายการ",
        width: "",
        text: "text-left",
      },
      {
        title: "จำนวน",
        width: "15%",
        text: "text-center",
      },
      {
        title: "ราคา",
        width: "20%",
        text: "text-right",
      },
    ],
    desserts: [],
    discount: [],
    discountSel: [],
    tags: {},
    total: 1,
    rules: {
      required: (value) => !!value || "จำเป็น.",
      min: (value) => value >= 1,
      max: (value) => value <= 99,
    },
    branch: {},
    branchList: [],
    branchSelect: null,
    priceTotal: 0.0,
    discountTotal: 0.0,
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
    price: [1000, 500, 100],
    changeMoney: 0.0,
    checkPayMoney: false,
    checkbox: false,
    customDiscount: false,
    search: "",

    provinceItems: [],
    provinceSelect: null,
    districtItems: [],
    districtSelect: null,
    targetElement: null,

    // Weight mode (มาล่า) data
    weightDialog: false,
    selectedProduct: null,
    weightGrams: 0,
    calculatedPrice: 0.0,

    // Loyalty (สะสมแต้ม) data
    loyaltyDialog: false,
    loyaltyTab: 0,
    memberSearch: "",
    memberSearching: false,
    memberSearchResults: [],
    memberNotFound: false,
    selectedMember: null,
    memberRegistering: false,
    birthdayMenu: false,
    newMember: {
      name: "",
      phone: "",
      email: "",
      birthday: null,
    },
    // ตัวอย่างรางวัลที่แลกได้
    rewardList: [
      {
        id: 1,
        name: "ส่วนลด 20 บาท",
        description: "ใช้เป็นส่วนลดในบิลนี้",
        points: 100,
        icon: "mdi-ticket-percent",
        value: 20,
        type: "discount",
      },
      {
        id: 2,
        name: "ส่วนลด 50 บาท",
        description: "ใช้เป็นส่วนลดในบิลนี้",
        points: 200,
        icon: "mdi-ticket-percent",
        value: 50,
        type: "discount",
      },
      {
        id: 3,
        name: "ฟรี เครื่องดื่ม 1 แก้ว",
        description: "เลือกเครื่องดื่มฟรี 1 แก้ว",
        points: 150,
        icon: "mdi-cup",
        value: 0,
        type: "free_item",
      },
      {
        id: 4,
        name: "ส่วนลด 10%",
        description: "ลดราคา 10% ทั้งบิล",
        points: 300,
        icon: "mdi-percent",
        value: 10,
        type: "percent",
      },
    ],
  }),
  computed: {
    convert() {
      return convert;
    },
    roles() {
      return this.$auth.user.roles <= 2;
    },
    // Weight mode: คำนวณจำนวนรายการ
    totalItems() {
      return this.desserts.reduce((sum, item) => {
        return sum + (item.weightGrams ? 1 : item.total || 1);
      }, 0);
    },
    // Weight mode: คำนวณยอดรวมจาก desserts
    calculatedTotal() {
      return this.desserts.reduce((sum, item) => {
        return sum + parseFloat(item.price || 0);
      }, 0);
    },
    // ตรวจสอบว่าเป็น weight mode หรือไม่
    isWeightMode() {
      return this.posMode === "weight";
    },
  },
  watch: {
    provinceSelect(val) {
      this.getDistrict();
      return val;
    },
    search(val) {
      if (val.length >= 3) {
        this.searchPro();
      }
      if (val.length === 0) {
        this.getData();
      }
    },
    changeMoney(val) {
      this.checkPayMoney = val >= 0;
      return val;
    },
    branch(val) {
      return val;
    },
    extra(val) {
      this.extra = parseInt(val);
    },
    discountSel(val) {
      this.onDiscountTotal();
      return val;
    },
    desserts(val) {
      // ใช้ calculatedTotal สำหรับ weight mode, convert.calculateArray สำหรับ unit mode
      if (this.posMode === "weight") {
        this.priceTotal = this.calculatedTotal;
      } else {
        this.priceTotal = convert.calculateArray(val, true);
      }
      this.onDiscountTotal();
      return val;
    },
    countOrder(val) {
      return "1";
    },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  mounted() {
    this.$nextTick(() => {
      this.loading = false;
      if (this.$auth.user.branch) {
        this.getData();
        this.getType();
        if (this.$auth.user.branch.type === 2) {
          this.dialog = true;
          this.branchSelect = this.$auth.user.branch;
        }
        //dialog
      }
      this.getDiscount();
      this.getProvince();
    });
    if (!this.$auth.loggedIn) {
      this.branchSelect = "";
      return;
    }
    if (this.$auth.user.branch == null) {
      this.getBranch();
    } else {
      this.branchSelect = this.$auth.user.branch;
      this.convertBranchSelect();
    }

    // ตรวจสอบ query parameter สำหรับ mode
    if (
      this.$route.query.mode === "weight" ||
      this.$route.query.type === "mala"
    ) {
      this.posMode = "weight";
    }
  },
  methods: {
    async lockScroll() {
      await new Promise((resolve) => setTimeout(resolve, 0));

      this.targetElement = await this.$refs.modalContent;
      disableBodyScroll(this.targetElement);
    },
    unLockScroll() {
      this.targetElement = this.$refs.modalContent;
      enableBodyScroll(this.targetElement);
    },
    async getDistrict() {
      await this.$axios
        .get("/district", {
          params: {
            provinceNo: this.provinceSelect.no,
          },
        })
        .then((res) => {
          this.districtItems = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    async getProvince() {
      await this.$axios
        .get("/province")
        .then((res) => {
          this.provinceItems = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },
    checkType() {
      if (this.branchSelect) {
        return this.branchSelect.type === 2;
      }
      return false;
    },
    confirmExtra() {
      this.extraSelect = {
        id: 1,
        name: this.extra + " บาท",
        type_discount: 1,
        total: this.extra,
      };
      this.addDiscount(this.extraSelect);
      this.extra = 0;
      this.customDiscount = false;
    },
    async searchPro() {
      this.$nuxt.$loading.start();
      await this.$axios
        .get("searchPro", {
          params: {
            s: this.search,
          },
        })
        .then((res) => {
          this.cards = res.data;
          this.$nuxt.$loading.finish();
        })
        .catch((e) => {
          console.log(e);
          alert(e.response.data.message);
          this.$nuxt.$loading.finish();
        });
    },
    check() {
      if (this.isProm == null) return;
      return this.isProm.type_promptpay === 3;
    },
    close() {
      if (this.$refs.form.validate()) {
        this.getData();
        this.getType();
        this.dialog = false;
      }
    },

    async createOrder(val = 2) {
      this.dialogPay = false;
      this.unLockScroll();
      this.$nuxt.$loading.start();
      await this.$axios
        .post("/posOrder", {
          discount: this.discountSel.length > 0 ? this.discountSel[0].id : null,
          product: this.desserts,
          customer: null,
          branch: this.branch.id,
          pay_type: val,
          bill_number: this.branch.id + dayjs().format("YYMMDDHHmmss"),
          price: this.priceTotal,
          total:
            this.posMode === "weight"
              ? this.totalItems
              : convert.calculateArray(this.desserts),
          discountTotal: this.discountTotal,
          province: this.provinceSelect ? this.provinceSelect.id : null,
          district: this.districtSelect ? this.districtSelect.id : null,
          posMode: this.posMode, // เพิ่ม mode เพื่อ track ว่าเป็นออเดอร์แบบไหน
        })
        .then((res) => {
          this.desserts = [];
          this.discountSel = [];
          this.cash = 0;
          this.changeMoney = 0.0;
          this.discountTotal = 0.0;
          this.$nuxt.$loading.finish();
        })
        .catch((e) => {
          this.$nuxt.$loading.finish();
          console.log(e);
        });
    },
    getCash(val, isSum = true) {
      if (isSum) {
        this.cash = parseFloat(this.cash) + parseFloat(val);
        this.changeMoney = parseFloat(this.cash - this.priceTotal);
      } else {
        this.cash = val;
        this.changeMoney = this.cash;
      }
    },
    sumChange(val, isDel = false) {
      if (isDel) {
        let _del = this.cash
          .toString()
          .substring(0, this.cash.toString().length - 1);
        this.cash = _del === "" ? 0 : _del;
      } else {
        if (this.cash.toString().indexOf(".") > -1) {
          if (
            this.cash
              .toString()
              .substring(
                this.cash.toString().indexOf(".") + 1,
                this.cash.toString().length
              ).length < 2
          ) {
            if (val === ".") return;
            this.cash =
              val === "."
                ? this.cash.toString() + val
                : parseFloat(this.cash.toString() + val);
          }
          // return
        } else {
          this.cash =
            val === "."
              ? this.cash.toString() + val
              : parseFloat(this.cash.toString() + val);
        }
      }
      this.changeMoney = this.cash - this.priceTotal;
    },
    confirmClose() {
      this.dialogCancelPay = false;
      this.dialogPay = false;
      this.unLockScroll();
    },
    pay() {
      this.dialogPay = true;
      this.lockScroll();
      this.isProm = this.branchSelect.promptpay;
      if (this.isProm.type_promptpay === 3) {
        this.qr = JSON.parse(this.isProm.image_promptpay).fullPath;
      } else {
        let isPay =
          this.isProm.type_promptpay === 1
            ? convert.formatPhoneNumber(this.isProm.promptpay)
            : convert.formatIc(this.isProm.promptpay);
        let amount = this.priceTotal;
        const payload = generatePayload(isPay, { amount }); //First parameter : mobileNumber || IDCardNumber
        const options = {
          type: "svg",
          color: {
            dark: "#000",
            light: "#fff",
          },
          // image: document.getElementById('image'),
        };
        qrcode.toString(payload, options, (err, svg) => {
          if (err) return console.log(err);
          this.qr = svg;
        });
      }
    },
    convertBranchSelect() {
      this.branch.name =
        this.branchSelect.organization.title +
        "(" +
        this.branchSelect.title +
        ")";
      this.branch.id = this.branchSelect.id;

      GlobalEventEmitter.$emit("branchNum", this.branchSelect);
    },
    async getBranch() {
      this.dialog = true;
      this.$axios
        .get("branch")
        .then((res) => {
          this.branchList = res.data;
        })
        .catch((e) => {
          console.log(e);
        });
    },

    onDiscountTotal() {
      const baseTotal =
        this.posMode === "weight"
          ? this.calculatedTotal
          : convert.calculateArray(this.desserts, true);
      if (this.discountSel.length === 0) {
        this.priceTotal = baseTotal;
        this.discountTotal = 0.0;
        return;
      }
      let _discountSel = this.discountSel[0];
      this.discountTotal =
        _discountSel.type_discount === 1
          ? _discountSel.total
          : Math.round((baseTotal / 100) * _discountSel.total);
      this.priceTotal = baseTotal - this.discountTotal;
    },
    addDiscount(val) {
      this.discountSel.push(val);
    },
    removeDiscount(val) {
      this.discountSel.splice(this.discountSel.indexOf(val), 1);
      const baseTotal =
        this.posMode === "weight"
          ? this.calculatedTotal
          : convert.calculateArray(this.desserts, true);
      this.priceTotal = baseTotal;
      this.discountTotal = 0.0;
    },

    // เพิ่มสินค้าแบบ unit (ขายเป็นชิ้น)
    addOrder(val) {
      val.total = 1;
      let s = this.desserts;
      s.push(val);
      this.desserts = convert.countObjectArray(s);
    },

    // Weight mode methods (มาล่า)
    openWeightDialog(product) {
      this.selectedProduct = Object.assign({}, product);
      this.weightGrams = 0;
      this.calculatedPrice = 0.0;
      this.weightDialog = true;
    },

    closeWeightDialog() {
      this.weightDialog = false;
      this.selectedProduct = null;
      this.weightGrams = 0;
      this.calculatedPrice = 0.0;
    },

    calculateWeightPrice() {
      if (this.weightGrams && this.selectedProduct) {
        this.calculatedPrice = parseFloat(
          (this.selectedProduct.price * this.weightGrams).toFixed(2)
        );
      } else {
        this.calculatedPrice = 0.0;
      }
    },

    confirmAddWeightOrder() {
      if (this.selectedProduct && this.weightGrams > 0) {
        const orderItem = {
          id: this.selectedProduct.id,
          name: `${this.selectedProduct.name} (${this.weightGrams}ขีด)`,
          price: this.calculatedPrice,
          total: 1,
          weightGrams: parseFloat(this.weightGrams),
          originalPrice: this.selectedProduct.price,
          imageUrl: this.selectedProduct.imageUrl,
          type: this.selectedProduct.type,
          branch: this.selectedProduct.branch,
        };

        this.desserts.push(orderItem);
        this.closeWeightDialog();
      }
    },

    // Handle click บนสินค้า - เลือกตาม mode
    handleProductClick(card) {
      if (this.posMode === "weight") {
        this.openWeightDialog(card);
      } else {
        this.addOrder(card);
      }
    },

    removeOrder(val) {
      this.desserts.splice(this.desserts.indexOf(val), 1);
    },

    convertDay(day) {
      return dayjs(day).format("DD-MM-YYYY HH:mm:ss");
    },

    async getDiscount() {
      await this.$axios
        .get("/getDiscountForUse")
        .then((res) => {
          this.discount = res.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getData(_type = null) {
      this.$nuxt.$loading.start();
      await this.$axios
        .get("/posProduct", {
          params: {
            type: _type,
            branch: this.branch.id,
          },
        })
        .then((res) => {
          this.cards = res.data;
          this.$nuxt.$loading.finish();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getType() {
      this.$nuxt.$loading.start();
      await this.$axios
        .get("/posProductType", {
          params: {
            branch: this.branch.id,
          },
        })
        .then((res) => {
          this.tags = res.data;
          this.tags.data.sort((a, b) => b.product.length - a.product.length);
          this.$nuxt.$loading.finish();
        })
        .catch((error) => {
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

    // Loyalty (สะสมแต้ม) methods
    async searchMember() {
      if (!this.memberSearch) return;

      this.memberSearching = true;
      this.memberNotFound = false;
      this.memberSearchResults = [];

      try {
        // TODO: เปลี่ยนเป็น API จริง
        // const res = await this.$axios.get('/loyalty/search', { params: { q: this.memberSearch } });
        // this.memberSearchResults = res.data;

        // ตัวอย่างข้อมูล Mock
        await new Promise((resolve) => setTimeout(resolve, 500));
        const mockMembers = [
          {
            id: 1,
            name: "สมชาย ใจดี",
            phone: "0812345678",
            points: 350,
            tier: "Gold",
          },
          {
            id: 2,
            name: "สมหญิง รักเรียน",
            phone: "0823456789",
            points: 120,
            tier: "Silver",
          },
          {
            id: 3,
            name: "สมศรี มั่งมี",
            phone: "0834567890",
            points: 580,
            tier: "Platinum",
          },
        ];

        this.memberSearchResults = mockMembers.filter(
          (m) =>
            m.phone.includes(this.memberSearch) ||
            m.name.toLowerCase().includes(this.memberSearch.toLowerCase())
        );

        if (this.memberSearchResults.length === 0) {
          this.memberNotFound = true;
        }
      } catch (e) {
        console.log(e);
        this.memberNotFound = true;
      } finally {
        this.memberSearching = false;
      }
    },

    selectMember(member) {
      this.selectedMember = member;
      this.loyaltyDialog = false;
      this.memberSearch = "";
      this.memberSearchResults = [];
    },

    clearMember() {
      this.selectedMember = null;
    },

    async registerMember() {
      if (!this.$refs.newMemberForm.validate()) return;

      this.memberRegistering = true;

      try {
        // TODO: เปลี่ยนเป็น API จริง
        // const res = await this.$axios.post('/loyalty/register', this.newMember);

        // ตัวอย่าง Mock
        await new Promise((resolve) => setTimeout(resolve, 500));
        const newMemberData = {
          id: Date.now(),
          name: this.newMember.name,
          phone: this.newMember.phone,
          email: this.newMember.email,
          birthday: this.newMember.birthday,
          points: 0,
          tier: "Bronze",
        };

        this.selectedMember = newMemberData;
        this.loyaltyDialog = false;

        // Reset form
        this.newMember = { name: "", phone: "", email: "", birthday: null };

        alert("สมัครสมาชิกสำเร็จ!");
      } catch (e) {
        console.log(e);
        alert("เกิดข้อผิดพลาด กรุณาลองใหม่");
      } finally {
        this.memberRegistering = false;
      }
    },

    redeemReward(reward) {
      if (!this.selectedMember || this.selectedMember.points < reward.points)
        return;

      if (
        confirm(
          `ต้องการแลก "${reward.name}" (${reward.points} แต้ม) ใช่หรือไม่?`
        )
      ) {
        // TODO: เรียก API แลกแต้ม
        this.selectedMember.points -= reward.points;

        // เพิ่มส่วนลดตาม reward type
        if (reward.type === "discount") {
          this.addDiscount({
            id: `reward_${reward.id}`,
            name: `แลกแต้ม: ${reward.name}`,
            type_discount: 1,
            total: reward.value,
          });
        } else if (reward.type === "percent") {
          this.addDiscount({
            id: `reward_${reward.id}`,
            name: `แลกแต้ม: ${reward.name}`,
            type_discount: 2,
            total: reward.value,
          });
        }

        this.loyaltyDialog = false;
        alert("แลกรางวัลสำเร็จ!");
      }
    },
  },
};
