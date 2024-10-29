import dayjs from "dayjs";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";
import convert from "@/plugins/convert";

export default {
  middleware: ['auth', isAdmin],
  layout: "seller-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการรายการรายรับ-จ่าย",
      money: {
        val1: 0,
        val2: 0,
        val3: 0,
        val4: 0,
        val5: 0,
        val6: 0,
        val7: 0,
        val8: 0,
        val9: 0,
      },
      loading: true,
      search: "",
      dialog: false,
      valid: false,
      isLoading: false,
      dialogDelete: false,
      instead: null,
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อรายการ",
          width: "",
          text: "text-left"
        },
        {
          title: "สาขา",
          width: "",
          text: "text-left"
        },
        {
          title: "ผู้ขาย",
          width: "",
          text: "text-left"
        },
        {
          title: "ราคา",
          width: "10%",
          text: "text-left"
        },
        {
          title: "ยอดของวันที่",
          width: "10%",
          text: "text-left"
        },
      ],
      typeTotal: ['รวมยอดแล้ว', 'ยังไม่รวมยอด'],
      desserts: {
        meta: {}
      },
      users: [],
      usersSelect: {},
      branch: [],
      branchSelect: {},
      item: {},
      typeTotalSelect: 0,
      total: 0,
      totalCash: 0,
      rules: [
        v => !!v || 'จำเป็น',
      ],
      page: 1,

      date: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),
      dateEnd: (new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10),

      modal: false,
      dialogDateEnd: false,
      enabled: false,

      provinceItems: [],
      provinceSelect: null,
      districtItems: [],
      districtSelect: null
    };
  },

  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.getData()
      this.getProvince()
      this.getBranch()
      this.getBudget()
      this.getUser()
    })
  },

  computed: {
    convert() {
      return convert
    },
    calculat() {
      this.total = this.sumMoney()
      return this.total
    },
  },

  watch: {
    page(val) {
      this.getData()
    },

    provinceSelect(val) {
      if(val == undefined) return
      this.getDistrict()
      return val
    },
    async search(val) {
      if (val == null) return
      if (val.length < 2) return
      if (this.isLoading) return
      this.isLoading = true
      await this.$axios.get(`findUsers`, {
        params: {
          q: val
        }
      }).then((res) => {
        // const {count, data} = res.data
        // this.count = count
        // this.entries = data
        // console.log(res)
      }).catch((e) => {
        console.log(e)
      }).finally(() => (this.isLoading = false))
    },
  },

  methods: {
    checkType() {
      if (this.branchSelect) {
        return this.branchSelect.type === 2
      }
      return false
    },

    async getProvince() {
      await this.$axios.get("/province").then((res) => {
        this.provinceItems = res.data
      }).catch((e) => {
        console.log(e);
      });
    },

    async getDistrict() {
      console.log(this.provinceSelect)
      await this.$axios.get("/district",{
        params:{
          "provinceNo": this.provinceSelect.no
        }
      }).then((res) => {
        this.districtItems = res.data
      }).catch((e) => {
        console.log(e);
      });
    },

    sumMoney() {
      if (Object.keys(this.money).length == 0) return 0
      const val = [];
      val.push(this.money.val1 * 1000)
      val.push(this.money.val2 * 500)
      val.push(this.money.val3 * 100)
      val.push(this.money.val4 * 50)
      val.push(this.money.val5 * 20)
      val.push(this.money.val6 * 10)
      val.push(this.money.val7 * 5)
      val.push(this.money.val8 * 2)
      val.push(parseInt(this.money.val9))
      return val.reduce((accumulator, currentValue) => accumulator + currentValue)
    },

    async getUser() {
      await this.$axios.get("/users").then((res) => {
        this.users = res.data.data
      }).catch((e) => {
        console.log(e);
      });
    },

    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/budgetList", {
        params: {
          page: this.page,
          per: 10,
          dateStart:this.date,
          dateEnd:this.dateEnd,
        }
      }).then((res) => {
        this.desserts = res.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
        this.$nuxt.$loading.finish()
      });
    },

    async getBranch() {
      await this.$axios.get("/branch").then((res) => {
        this.branch = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    async getBudget() {
      await this.$axios.get("/budget").then((res) => {
        this.instead = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
      this.enabled = false
    },

    openItem(val) {
      this.dialog = true
      this.item = Object.assign({}, val)
      this.branchSelect = val.branch
      this.districtSelect = val.district
      this.insteadSelect = this.item.budget
      // this.usersSelect = this.item.employee
      this.provinceSelect = this.item.province
      this.total = this.item.total

      // this.branchSelect = this.$auth.user.branch
      this.usersSelect = this.users.find((d) => d.id === this.$auth.user.id)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/budgetList/" + this.item.id, {
        branch: this.branchSelect.id,
        create_by: this.$auth.user.id,
        employee: this.usersSelect.id,
        budget: this.insteadSelect.id,
        total: this.total,
        province: this.checkType() ? this.provinceSelect.id : 0,
        district: this.checkType() ? this.districtSelect.id : 0,
        summary_at: this.enabled ? this.date + " " + dayjs().format("HH:mm:ss") : null,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/budgetList", {
        branch: this.branchSelect.id,
        create_by: this.$auth.user.id,
        employee: this.usersSelect.id,
        budget: this.insteadSelect.id,
        total: this.total,
        province: this.checkType() ? this.provinceSelect.id : 0,
        district: this.checkType() ? this.districtSelect.id : 0,
        summary_ref: 2,
        summary_at: this.enabled ? this.date + " " + dayjs().format("HH:mm:ss") : null,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    // async onDelete(val) {
    //   this.dialog = false
    //   await this.$axios.delete("/budgetList/" + val.id).then((res) => {
    //     this.getData()
    //   }).catch((e) => {
    //     console.log(e)
    //   })
    // },


    onDelete(val) {
      this.dialogDelete = true
      this.item = Object.assign({}, val)
    },

    async confirmDel() {
      this.dialogDelete = false
      await this.$axios.delete("/budgetList/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
