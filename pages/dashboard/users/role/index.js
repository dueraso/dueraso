// import myFunction from "~/utils/myFunction";
import pkg from '~/package.json'
import isAdmin from "@/middleware/is-admin";
import dayjs from "dayjs";
import myUtils from "@/plugins/myUtils";
import convert from "@/plugins/convert";

export default {
  middleware: ['auth'],
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
          width: ""
        },
        {
          title: "รายละเอียด",
          width: ""
        },
        {
          title: "สร้างเมื่อ",
          width: "10%%"
        },
        {
          title: "แก้ไขเมื่อ",
          width: "10%"
        },
      ],
      dessertsRole: {
        meta:{}
      },
      tableHead: [
        {
          title: "ชื่อ",
          width: ""
        },
        {
          title: "path",
          width: ""
        },
        {
          title: "อ่าน",
          width: "5%"
        },
        {
          title: "เขียน",
          width: "5%"
        },
        {
          title: "แก้ไข",
          width: "5%"
        },
        {
          title: "ลบ",
          width: "5%"
        },
      ],
      desserts: {
      },
      per: {
        titleBar:[],
        create: [],
        read: [],
        update: [],
        delete: [],
      },
      item: {},
      switch1: false,
      dialogDelete: false,
      page:1
    };
  },
  computed: {
    convert() {
      return convert
    }
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  watch:{
    page(val) {
      this.getData()
    },
  },
  mounted() {
    this.getData()
    this.getModule()
  },
  methods: {
    myUtils,
    convertDay(val = "") {
      return dayjs().format("DD/MM/YYYY HH:mm")
    },
    async getModule() {
      await this.$axios.$get("/module",{
        params:{
          per:30
        }
      }).then((res) => {
        this.desserts = convert.groupChildren(res.data)
        // console.log(modules)
        // this.desserts = res.data.sort((a, b) => a.sort - b.sort)
      }).catch((e) => {
        console.log(e)
      })
    },
    async getData() {
      await this.$axios.$get("/role").then((res) => {
        this.dessertsRole = res
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
    changeSwitch(val) {
      // this.d.indexOf(val.title)
      console.log(val)
      let i = this.per.titleBar.indexOf(val)
      console.log(i)
      if (i !== -1) {
        this.per.titleBar.splice(i, 1)
      } else {
        this.per.titleBar.push(val)
      }
      // console.log(JSON.stringify(this.per) + "<<<"+JSON.stringify(val))
    },

    confirm() {
      console.log(this.per)
      // console.log(this.$auth.user)
      // console.log(JSON.parse(this.$auth.user.roles.policy))
      return;
      if(!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      this.per.titleBar.sort((a, b) => a.sort - b.sort)
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
      if(val.policy === null) return
      this.per = Object.assign({}, JSON.parse(this.item.policy))
    },

    async onUpdate() {
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

    onDelete(val){
      this.dialogDelete = true
      this.item = Object.assign({},val)
    },

    async confirmDel(){
      this.dialogDelete = false
      await this.$axios.delete("/role/"+this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
