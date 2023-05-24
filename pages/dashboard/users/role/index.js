export default {
  layout: "seller-layout",
  name: "IndexPage",
  data() {
    return {
      loading: true,
      dialog: false,
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
        data: [
          {
            name: 'หน้าแรก',
            route: '/'
          },
          {
            name: 'รายงาน',
            route: `/dashboard/report`
          },
          {
            name: 'จัดการร้าน',
            route: '/dashboard/outlets'
          },
          {
            name: 'จัดการสาขา',
            route: '/dashboard/branch'
          },
          {
            name: 'รายรับ-รายจ่าย',
            route: '/dashboard/events'
          },
          {
            name: 'ผู้ใช้งาน',
            route: `/dashboard/users`
          },
        ]
      },
      item: {},
      switch1:false
    };
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  mounted() {
    // this.getData()
  },
  methods: {
    async getData() {
      await this.$axios.get("/post", {
        params: {
          page: 20
        }
      }).then((res) => {
        console.log(res.data)
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      })
    },

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
      console.log("val> " + val)
      this.dialog = true
      this.item = Object.assign({}, val)
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/post/" + this.item.id, {
        title: this.item.title,
        detail: this.item.detail
      }).then((res) => {
        this.getData()
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
