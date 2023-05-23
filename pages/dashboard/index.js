
export default {
  layout:"seller-layout",
  name: "IndexPage",
  data() {
    return {
      loading: true,
      dialog: false,
      desserts: {},
      item: {},
    };
  },
  created() {
    this.$nextTick(()=>{
      this.loading = false
    })
    this.test()
    // this.getData()
  },
  mounted() {

  },
  methods: {
    test() {
      //var global
      //let
      //const ค่าคงที
      // const total = 10
      // for (let i = 0; i > 3; i++){
      //   console.log("arthit>> "+i)
      // }
      // total = 11
      console.log("=> ")
    },

    async getData() {
      await this.$axios.get("/post",{
        params:{
          page:20
        }
      }).then((res) => {
        console.log(res.data)
        this.desserts = res.data
      }).catch((e) => {
        console.log(e)
      })
    },

    confirm(){
      if(this.item.id){
        console.log("Update> "+this.item.id)
        this.onUpdate()
      }else {
        console.log("Create> "+this.item.id)
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
