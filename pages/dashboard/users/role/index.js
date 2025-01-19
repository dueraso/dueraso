// import myFunction from "~/utils/myFunction";
import pkg from '~/package.json'
import isAdmin from "@/middleware/is-admin";
import dayjs from "dayjs";
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
      headTitle: "จัดการสิทธิ์",
      loading: true,
      dialog: false,
      tableHeadRole: [
        {
          title: "ชื่อสิทธิการใช้",
          width: "",
          text: "text-left"
        },
        {
          title: "รายละเอียด",
          width: "",
          text: "text-left"
        },
        {
          title: "สร้างเมื่อ",
          width: "12%",
          text: "text-left"
        },
        {
          title: "แก้ไขเมื่อ",
          width: "12%",
          text: "text-left"
        },
      ],
      dessertsRole: {
        meta: {}
      },
      tableHead: [
        {
          title: "ชื่อ",
          width: "",
          text: "text-left"
        },
        {
          title: "path",
          width: "",
          text: "text-left"
        },
        {
          title: "อ่าน",
          width: "5%",
          text: "text-left"
        },
        {
          title: "เขียน",
          width: "5%",
          text: "text-left"
        },
        {
          title: "แก้ไข",
          width: "5%",
          text: "text-left"
        },
        {
          title: "ลบ",
          width: "5%",
          text: "text-left"
        },
      ],

      rules: [
        v => !!v || 'จำเป็น',
      ],
      desserts: {},
      per: {
        titleBar: [],
        permissions: [],
        create: [],
        read: [],
        update: [],
        delete: [],
      },
      item: {},
      switch1: false,
      dialogDelete: false,
      page: 1
    };
  },
  computed: {
    convert() {
      return convert
    }
  },
  watch: {
    page(val) {
      // this.getData()
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.loading = false
      this.getData()
      this.getModule()
    })
  },
  methods: {
    convertDay(val = "") {
      return dayjs().format("DD/MM/YYYY HH:mm")
    },
    async getModule() {
      await this.$axios.$get("/module", {
        params: {
          per: 30
        }
      }).then((res) => {
        this.desserts = JSON.parse(localStorage.getItem("modules"))
        console.log(this.desserts)
        console.log(res.data)
        // this.desserts = convert.groupChildren(res.data)
        // this.desserts = res.data.sort((a, b) => a.sort - b.sort)
      }).catch((e) => {
        console.log(e)
      })
    },
    async getData() {
      this.$nuxt.$loading.start();
      await this.$axios.$get("/role").then((res) => {
        this.dessertsRole = res
        // console.log(res)
        this.$nuxt.$loading.finish();
      }).catch((e) => {
        console.log(e)
        this.$nuxt.$loading.finish();
      })
    },
    changeSwitch(val) {
      let d = this.per.titleBar.find(item => item.id === val.id)
      if (d === undefined) {
        this.per.titleBar.push(val);
        this.addParent(val)
      } else {
        this.per.titleBar = this.per.titleBar.filter(item => item.id !== d.id);
        if (val.parent) {
          let f = this.per.titleBar.find(item => item.parent === val.parent)
          if (f === undefined) {
            let _parent = Object.assign({}, this.desserts.find(item => item.id === val.parent))
            this.per.titleBar = this.per.titleBar.filter(item => item.id !== _parent.id);
          }
        }
      }
    },

    addParent(val) {
      if (val) {
        let _parent = Object.assign({}, this.desserts.find(item => item.id === val.parent))
        delete _parent.children
        let _check = this.per.titleBar.find(item => item.id === _parent.id)
        if (_check === undefined) this.per.titleBar.push(_parent);
      }
    },

    changePer(_type, val) {
      let d = _type + "." + val.split("/")[val.split("/").length - 1]
      if (this.per.permissions === undefined) this.per.permissions = []
      if (this.per.permissions.indexOf(d) !== -1) {
        this.per.permissions.splice(d, 1)
      } else {
        this.per.permissions.push(d)
      }
    },

    confirm() {
      // if(!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      this.per.titleBar = this.per.titleBar.sort((a, b) => a.sort - b.sort)
      if (this.item.id) {
        this.onUpdate()
      } else {
        this.onCreate()
      }
    },

    openItem(val) {
      this.dialog = true
      // console.log(val.policy + "<<val> ")
      // this.per = {}
      // // this.item = {}
      this.item = Object.assign({}, val)
      this.per =
        {
          titleBar: [],
          permissions: [],
          create: [],
          read: [],
          update: [],
          delete: [],
        }
      if (Object.keys(this.item).length > 0) {
        // if (val.policy === null) return
        // console.log(val)
        // console.log(this.item)
        // this.per = Object.assign({}, JSON.parse(val))
        this.per = Object.assign({}, JSON.parse(this.item.policy))
      }
    },

    async onUpdate() {
      // console.log(JSON.stringify(this.per))
      // return
      this.dialog = false
      await this.$axios.patch("/role/" + this.item.id, {
        id: this.item.id,
        name: this.item.name,
        detail: this.item.detail,
        status: 0,
        policy: JSON.stringify(this.per),
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      // console.log("gg")
      // return
      this.dialog = false
      await this.$axios.post("/role", {
        id: this.item.id,
        name: this.item.name,
        detail: this.item.detail,
        status: 0,
        policy: JSON.stringify(this.per),
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    // async onDelete(val) {
    //   this.dialog = false
    //   await this.$axios.delete("/role/" + val.id).then((res) => {
    //     this.getBranch()
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
      await this.$axios.delete("/role/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
