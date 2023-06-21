import dayjs from "dayjs";
import isAdmin from "@/middleware/is-admin";
import myUtils from "@/plugins/myUtils";
import convert from "@/plugins/convert";

export default {
  middleware: ['auth', isAdmin],
  layout: "seller-layout",
  data() {
    return {
      money: {
        val1:0,
        val2:0,
        val3:0,
        val4:0,
        val5:0,
        val6:0,
        val7:0,
        val8:0,
      },
      loading: true,
      search: "",
      dialog: false,
      isLoading: false,
      instead: null,
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อรายการ",
          width: ""
        },
        {
          title: "สาขา",
          width: ""
        },
        {
          title: "ผู้ขาย",
          width: ""
        },
        {
          title: "ราคา",
          width: "10%"
        },
        {
          title: "สร้างเมื่อ",
          width: "10%"
        },
      ],
      typeTotal: ['รวมยอดแล้ว','ยังไม่รวมยอด'],
      desserts: {},
      users: [],
      usersSelect: {},
      branch: [],
      branchSelect: {},
      item: {},
      typeTotalSelect: 0,
      total:0
    };
  },

  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },

  mounted() {
    this.$nextTick(() => {
      this.$nuxt.$loading.start()
    })
    this.getBudgetList()
    this.getBranch()
    this.getBudget()
    this.getUser()
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
    async search(val) {
      console.log(val)
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
        console.log(res)
      }).catch((e) => {
        console.log(e)
      }).finally(() => (this.isLoading = false))
    },
  },

  methods: {
    myUtils,
    onChangeType(d) {
      this.total = 0
      this.typeTotalSelect = d
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
      val.push(parseInt(this.money.val8))
      return val.reduce((accumulator, currentValue) => accumulator + currentValue)
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },

    async getUser() {
      await this.$axios.get("/users").then((res) => {
        this.users = res.data.data
      }).catch((e) => {
        console.log(e);
      });
    },

    async getBudgetList() {
      await this.$axios.get("/budgetList").then((res) => {
        this.desserts = res.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
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

    // async getBranch() {
    //   await this.$axios.get("/branch").then((res) => {
    //     // this.desserts = res
    //     this.desserts = Object.assign({}, res.data)
    //     console.log(this.desserts.data)
    //     this.$nuxt.$loading.finish()
    //   }).catch((e) => {
    //     console.log(e);
    //   });
    // },

    confirm() {
      if (this.item.id) {
        console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val) {
      console.log("val> " + JSON.stringify(val))
      this.dialog = true
      // this.item = Object.assign({}, val)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/budgetList/" + this.item.id, {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getBudgetList()
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
        total: this.total
      }).then((res) => {
        this.getBudgetList()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val) {
      this.dialog = false
      await this.$axios.delete("/budgetList/" + val.id).then((res) => {
        this.getBudgetList()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
