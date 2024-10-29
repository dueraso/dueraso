import dayjs from "dayjs";
import partner from "@/components/Partner.vue";

export default {
  // middleware: "auth",
  layout:"home-layout",
  head() {
    return {
      title: this.headTitle,
    }
  },
  components:{
    partner
  },
  data: () => ({
    loading: true,
    headTitle: "หน้าแรก",
    items: [
      {
        src: './firs-regis.gif',
        target:"",
        route:"/login"
      },
      {
        src: './banner-01@2x.png',
        target:"",
        route:""
      },
      {
        src: './arin.png',
        target:"_blank",
        route:"https://www.instagram.com/a.rinofficial_"
      }
    ],
  }),
  computed: {
    height () {
      if(this.$vuetify) {
        return this.$vuetify.breakpoint.name
      }
      return ""
    }
  },
  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    // console.log(this.$vuetify.breakpoint)
    // this.getData();
  },

  mounted() {
    this.$nextTick(()=>{
      this.loading = false
    })
  },

  methods: {
    async getData() {
      await this.$axios
        .get("/full_places")
        .then((response) => {
          this.desserts = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async deleteItemConfirm() {
      await this.$axios
        .delete(`/places/${this.editedItem.id}`)
        .then(() => {
          this.getData();
          this.closeDelete();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getType() {
      await this.$axios
        .get("/place_type")
        .then((response) => {
          this.place_type = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async searchPlaces() {
      await this.$axios
        .get(`/filter_places`, {
          params: {
            search: this.search,
          },
        })
        .then((response) => {
          this.desserts = response.data;
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    },

    async createItem() {
      await this.getPlaceList();
      this.$store.commit("setReadOnly", false);
      // await this.$router.push("/update");
    },

    async editItem(item) {
      // await this.$router.push({
      //   path: "/update",
      //   query: {
      //     edite: Object.assign({}, item).id,
      //   },
      // });
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    closeDelete() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
