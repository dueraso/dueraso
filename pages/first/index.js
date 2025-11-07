import http from "@/con/config";
import Divider from "primevue/divider/Divider";
import convert from "../../plugins/convert";
import FileUpload from 'primevue/fileupload';
import serve from "@/con/server";
import Cookies from "js-cookie";

export default {
  layout: 'auth-layout',
  components: {
    Divider,
    FileUpload
  },
  data() {
    return {
      package: null,
      stepper: 1,
      packages: [
        {id: "basic", name: "Basic", price: 1000},
        {id: "standard", name: "Standard", price: 2000},
        {id: "premium", name: "Premium", price: 3000}
      ],
      selectedPackage: null,
      storeName: "",
      branchName: "",
      resImg: "",
      btnSave: true,
    };
  },
  watch: {
    btnSave(val) {
      return val
    },
  },
  computed: {
    packageList() {
      if (this.package == null) return {}
      return this.package.package_list
    },
    convert() {
      return convert
    },
    selectedPackageData() {
      console.log(this.packages)
      return this.packages.find(pkg => pkg.id === this.selectedPackage.id) || {};
    },
  },
  created() {
    switch (this.$auth.user.status) {
      case 3:
        this.stepper = 1
        console.log(">>"+1)
        break
      case 4:
        this.stepper = 2
        console.log(">>"+2)
        break
      case 5:
        this.stepper = 3
        console.log(">>"+3)
        break
      case 7:
        this.stepper = 4
        console.log(">>"+4)
        break
    }
    // this.stepper = this.$auth.user.status === 3 ? 1 : 2
    console.log(this.$auth.user)
  },
  mounted() {
    this.$nextTick(() => {
      this.getPk()
      this.getMypk()
    })
  },
  methods: {
    getUrl: () => serve.api + "/uploadImg",

    beforeUpload(request) {
      return request.xhr.setRequestHeader('Authorization', this.$auth.getToken('local'));
    },

    onUploaderResponse(val) {
      this.resImg = JSON.parse(val.xhr.response).data
      this.$toast.add({severity: 'success', summary: 'สำเร็จ', detail: 'อัพโหลดสำเร็จ', life: 3000});
      this.btnSave = false
    },

    onError(val) {
      this.$toast.add({severity: 'error', summary: 'เกิดข้อผิดพลาด', detail: val.xhr.response, life: 3000});
      console.log(val.xhr.response)
    },

    async getMypk() {
      // console.log(Cookies.get('auth_token'))
      await this.$axios.get("/package").then((res) => {
        this.package = res.data
      }).catch((e) => {
        console.log(e)
      })
    },

    async getPk() {
      await this.$axios.get("/package-list", {
        params: {
          per: "all"
        }
      }).then((res) => {
        this.packages = res.data;
      }).catch((e) => {
        console.log(e)
      })
    },

    async save() {
      await this.$axios.post("/package", {
        title: this.storeName,
        package_list: this.selectedPackage.id
      }).then((res) => {
        this.stepper = res.data.stepper
        this.getMypk()
      }).catch((e) => {
        console.log(e)
      })
    },

    async close() {
      await this.$axios.post("/complete").then(() => {
        this.$router.replace("/all-apps")
      }).catch((e) => {
        console.log(e)
      })
    }
  }
};
