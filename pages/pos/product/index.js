import dayjs from "dayjs";
import isAdmin from "@/middleware/is-admin";
import DialogMid from "~/components/DialogMid.vue";
import Checkbox from 'primevue/checkbox';

export default {
  middleware: ['auth', isAdmin],
  layout: "seller-layout",
  components: {
    DialogMid,
    Checkbox
  },
  head() {
    return {
      title: this.headTitle,
    }
  },
  data() {
    return {
      headTitle: "จัดการสินค้า",
      rules: [
        v => !!v || 'จำเป็น',
      ],
      items: ['foo', 'bar', 'fizz', 'buzz'],
      value: ['foo', 'bar', 'fizz', 'buzz'],
      selectedFile: null,
      file: null,
      loading: true,
      search: "",
      dialog: false,
      dialogCopy: false,
      dialogDelete: false,
      valid: false,
      isLoading: false,
      instead: null,
      insteadSelect: null,
      tableHead: [
        {
          title: "ชื่อ",
          width: "",
          text: "text-left"
        },
        {
          title: "ประเภท",
          width: "",
          text: "text-left"
        },
        {
          title: "สาขา",
          width: "",
          text: "text-left"
        },
        {
          title: "ราคา",
          width: "",
          text: "text-left"
        },
        {
          title: "รูป",
          width: "5%",
          text: "text-center"
        },
      ],
      desserts: {
        meta: {}
      },
      item: {},
      page: 1,
      branch: null,
      itemsBranch: [],
      selectBranch: null,
      branchId: null,
      filterSelectBranch: null,
      copy: [],
      itemSelect: null,
      selectedValues: []
    };
  },
created() {
  this.search = this.$route.query.q?this.$route.query.q:""
  // this.branchId = this.$route.query.branch?this.$route.query.branch:""
},
  mounted() {
    this.$nextTick(() => {
      this.getData()
      this.getBranch()
      this.getProductType()

      // this.search = this.$route.query.q?this.$route.query.q:"";
      this.loading = false
    })
  },

  computed: {
    validateCheckbox() {
      return [this.copy.length > 0 || ""]
    }
  },

  watch: {
    page(val) {
      this.getData()
    },
    filterSelectBranch(val) {
      if (val == null) return
      this.filterSelectBranch = val
      this.branchId = val.id
      this.getData()
    },
    async search(val) {
      if (val == "") {
        this.search = val
        this.getData()
        return
      }
      if (val.length < 3) return
      if (this.isLoading) return
      this.isLoading = true
      this.search = val
      this.getData()
      // this.$nuxt.$loading.start()
      // await this.$axios.get("/posProduct", {
      //   params: {
      //     page: this.page,
      //     per: 10,
      //     q: val,
      //   }
      // }).then((res) => {
      //   this.$router.push({
      //     path: this.$route.path,
      //     query: {
      //       q: val
      //     }
      //   })
      //   this.desserts = Object.assign({}, res.data)
      //   this.$nuxt.$loading.finish()
      // }).catch((e) => {
      //   console.log(e);
      // }).finally(() => this.isLoading = false);
    },
  },

  methods: {
    check(val) {
      if (this.itemSelect === null) return
      return this.itemSelect.branch.id === val
    },
    async confirmCopy() {
      await this.$axios.post(`copyProduct`, {
        branch: this.copy,
        product: this.itemSelect
      }).then((res) => {
        this.dialogCopy = false
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
      // console.log(this.itemSelect)
      // console.log(this.copy)
    },
    openCopy(val) {
      // if (val) {
      //   console.log(val)
      this.itemSelect = val
      // let d = Object.assign({},val)
      // let d = val
      // d.branch = this.itemSelect.branch.id
      // console.log(d)
      // console.log(this.branch)
      this.dialogCopy = true
      // }
    },

    async getBranch() {
      await this.$axios.get("branch").then((res) => {
        this.branch = res.data.data
        this.itemsBranch = [
          {
            id: "",
            title: "ทั้งหมด"
          }, ...this.branch]
        // let ddd = this.itemsBranch.find(async d => await (d.id == this.branchId))
        // console.log(this.selectBranch)
        // console.log(ddd)
      }).catch((e) => {
        console.log(e)
      })
    },

    async uploadImage() {
      if (this.selectedFile) {
        const formData = new FormData();
        formData.append('image', this.selectedFile);

        try {
          // Use Axios or your preferred HTTP client to send the image to the server
          await this.$axios.post('/uploadImage', formData).then((res) => {
            this.file = res.data
          }).catch((e) => {
            console.log(e)
          });

          // Handle the response or any further actions
        } catch (error) {
          console.error('Image upload failed:', error);
        }
      }
    },

    onDeleteImage() {
      let img = this.file == null ? JSON.parse(this.item.image_url) : this.file
      this.$axios.post("destroyImage", {
        id: Object.keys(this.item).length === 0 ? 0 : this.item.id,
        image_url: img.newName
      }).then((res) => {
        this.selectedFile = null
        this.file = null
      }).catch((e) => {
        console.log(e)
      })
    },

    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },

    async getProductType() {
      await this.$axios.get("/posProductType").then((res) => {
        this.instead = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    async getData() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/posProduct", {
        params: {
          page: this.page,
          per: 10,
          q: this.search,
          branch: this.branchId ? this.branchId : null,
        }
      }).then((res) => {
        this.$router.push({
          path: this.$route.path,
          query: {
            q: this.search,
            branch: this.branchId ? this.branchId : null,
          }
        })
        this.desserts = Object.assign({}, res.data)
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },

    confirm() {
      // if (!this.$refs.form.validate()) return;
      this.$nuxt.$loading.start()
      if (this.item.id) {
        // console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        // console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

    openItem(val) {
      this.dialog = true
      this.item = Object.assign({}, val)
      this.insteadSelect = this.item.type
      this.file = this.item.imageUrl != null ? JSON.parse(this.item.imageUrl) : null
    },

    async onUpdate() {
      this.dialog = false
      await this.$axios.put("/posProduct/" + this.item.id, {
        name: this.item.name,
        detail: this.item.detail,
        type: this.insteadSelect.id,
        price: this.item.price,
        image_url: this.file ? JSON.stringify(this.file) : null
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    async onCreate() {
      this.dialog = false
      await this.$axios.post("/posProduct", {
        name: this.item.name,
        detail: this.item.detail,
        type: this.insteadSelect.id,
        price: this.item.price,
        image_url: this.file ? JSON.stringify(this.file) : null,
        branch: this.selectBranch,
      }).then((res) => {
        this.$nuxt.$loading.finish()
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },

    onDelete(val) {
      this.dialogDelete = true
      this.item = Object.assign({}, val)
    },

    async confirmDel() {
      this.dialogDelete = false
      await this.$axios.delete("/posProduct/" + this.item.id).then((res) => {
        this.getData()
      }).catch((e) => {
        console.log(e)
      })
    },
  }
};
