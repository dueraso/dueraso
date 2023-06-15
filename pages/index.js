import dayjs from "dayjs";

export default {
  middleware: "auth",
  data: () => ({
    config: {},
    dialog: false,
    landing: true,
    isDisabled: false,
    slide_show: false,
    search: "",
    dialogDelete: false,
    desserts: [],
    place_type: [],
    type_select: "",
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
  }),
  computed: {
    roles() {
      return this.$auth.user.roles <= 2;
    },
  },
  watch: {
    // dialog(val) {
    //   val || this.close()
    // },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    // this.getData();
  },

  mounted() {},

  methods: {
    convertDay(day) {
      return dayjs(day).format("DD-MM-YYYY HH:mm:ss");
    },

    async getData() {
      await this.$axios
        .get("/full_places")
        .then((response) => {
          this.desserts = response.data;
          // console.log(JSON.stringify(this.desserts))
          // this.desserts = this.$auth.user.id === 1 ? response.data:
          //   response.data.filter((d)=>d.create_by === this.$auth.user.id);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async deleteItemConfirm() {
      console.log(JSON.stringify(this.editedItem));
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
      console.log("สสส");
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
      await this.$router.push("/update");
    },

    async editItem(item) {
      await this.$router.push({
        path: "/update",
        query: {
          edite: Object.assign({}, item).id,
        },
      });
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
