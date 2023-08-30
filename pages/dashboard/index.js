import dayjs from "dayjs";

export default {
  middleware: "auth",
  layout: "seller-layout",
  data: () => ({
    items: [
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
      },
      {
        src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
      },
    ],
  }),
  computed: {
  },
  watch: {
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    // this.getData();
  },

  mounted() {},

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
