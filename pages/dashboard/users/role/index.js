// import myFunction from "~/utils/myFunction";
import pkg from '~/package.json'
import isAdmin from "@/middleware/is-admin";
import dayjs from "dayjs";

export default {
  middleware: ['auth'],
  layout: "seller-layout",
  name: "IndexPage",
  data() {
    return {
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
      dessertsRole: {},
      tableHead: [
        {
          title: "ชื่อ-สกุล",
          width: ""
        },
        {
          title: "ผู้ใช้งาน",
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
        // data: [
        //   {
        //     id: 0,
        //     name: 'หน้าแรก',
        //     route: '/'
        //   },
        //   {
        //     id: 1,
        //     name: 'รายงาน',
        //     route: `/dashboard`
        //   },
        //   {
        //     id: 2,
        //     name: 'จัดการร้าน',
        //     route: '/dashboard/outlets'
        //   },
        //   {
        //     id: 3,
        //     name: 'จัดการสาขา',
        //     route: '/dashboard/branch'
        //   },
        //   {
        //     id: 4,
        //     name: 'ประเภทรายการ',
        //     route: '/dashboard/type-budget'
        //   },
        //   {
        //     id: 5,
        //     name: 'รายรับ-รายจ่าย',
        //     route: '/dashboard/budget'
        //   },
        //   {
        //     id: 6,
        //     name: 'เพิ่มรายการ',
        //     route: '/dashboard/add-budget'
        //   },
        //   {
        //     id: 7,
        //     name: 'ผู้ใช้งาน',
        //     route: `/dashboard/users`
        //   },
        // ]
      },
      per: {
        create: [],
        read: [],
        update: [],
        delete: [],
      },
      item: {},
      switch1: false
    };
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  mounted() {
    this.getRoles()
  },
  methods: {
    convertDay(val = "") {
      return dayjs().format("DD/MM/YYYY HH:mm")
    },
    async getModule(){
      await this.$axios.$get("/module").then((res) => {
        this.desserts = res
        console.log(JSON.stringify(this.desserts))
      }).catch((e) => {
        console.log(e)
      })
    },
    async getRoles() {
      await this.$axios.$get("/role").then((res) => {
        this.dessertsRole = res
        // console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
    changeSwitch(val) {
      console.log(JSON.stringify(this.per) + "<<<"+JSON.stringify(val))
    },

    confirm() {
      // console.log(JSON.stringify(this.per))
      // console.log(JSON.stringify(this.item))
      if (this.item.id) {
        console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val) {
      this.getModule()
      console.log(val.policy+ "<<val> " + JSON.stringify(val))
      this.dialog = true
      this.per = {}
      this.item = {}
      if(val.policy === null) return
      console.log("fffff")
      // this.item = Object.assign({}, JSON.parse(val.policy))
      this.item = Object.assign({}, JSON.parse(val.policy))
      this.per = this.item
      console.log(this.item)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.patch("/role/" + this.item.id, {
        id:this.item.id,
        name: this.item.name,
        detail: this.item.detail,
        status: 0,
        policy: JSON.stringify(this.per),
      }).then((res) => {
        this.getRoles()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/post", {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val) {
      this.dialog = false
      await this.$axios.delete("/post/" + val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
