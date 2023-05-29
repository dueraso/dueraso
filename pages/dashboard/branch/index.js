import dayjs from "dayjs";
import B from "@/utils/myFunction";

export default {
  // middleware: ['auth','isAdmin'],
  layout: "seller-layout",
  data() {
    return {
      loading: true,
      search: "",
      dialog: false,
      tableHead: [
        {
          title: "ชื่อ-สกุล",
          width: ""
        },
        {
          title: "ผู้ใช้งาน",
          width: "15%"
        },
        {
          title: "สร้างโดย",
          width: ""
        },
        {
          title: "สถานะ",
          width: "5%"
        },
        {
          title: "สิทธิ์",
          width: "10%"
        },
        {
          title: "สร้างเมื่อ",
          width: "10%"
        },
      ],
      desserts: {
        data: [
          {
            name: "super_admin",
            user: "super_admin",
            create_by: {
              name: "super_admin",
            },
            status: "1",
            permissions: "super_admin",
            created_at: "12:29:00 2023/12/23"
          },
          {
            name: "arthit dueraso",
            user: "dueraso",
            create_by: {
              name: "arthit dueraso",
            },
            status: "1",
            permissions: "admin",
            created_at: "12:29:00 2023/12/23"
          },
        ]
      },
      item: {},
    };
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  mounted() {
    console.log(">>"+this.$route.path)
  },
  computed:{
    dd(){
      return new B()
    },
  },
  methods: {
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },
    async getRoom() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/getLicensed").then((res) => {
        this.desserts = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
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
      console.log("val> "+val)
      this.dialog = true
      this.item = Object.assign({}, val)
    },

    async onUpdate(){
      this.dialog = false
      await this.$axios.put("/post/"+this.item.id,{
        title:this.item.title,
        detail:this.item.detail
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate(){
      this.dialog = false
      await this.$axios.post("/post",{
        title:this.item.title,
        detail:this.item.detail
      }).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },

    async onDelete(val){
      this.dialog = false
      await this.$axios.delete("/post/"+val.id).then((res) => {
        this.getData()
        console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
