import dayjs from "dayjs";
import convert from "../../plugins/convert";
import myUtils from "@/plugins/myUtils";

export default {
  // middleware: "auth",
  layout: "pos-layout",
  data: () => ({
    loading: false,
    cards: [
      {
        title: 'Pre-fab homes',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WY/AR/QZ/119153245/girls-top-1000x1000.jpg',
        price: 89,
        flex: 3,
      },
      {
        title: 'Favorite road trips',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/MA/IW/DY/119153245/rf-06-01-1000x1000.jpg',
        price: 99,
        flex: 3
      },
      {
        title: 'Best airlines',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 89,
        flex: 3
      },
      {
        title: 'Pre-fab homes1',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WS/HB/WP/119153245/rf-01-jpg-1000x1000.jpg',
        price: 69,
        flex: 3
      },
      {
        title: 'Favorite road trips2',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GQ/KG/ZG/119153245/rf-03-01-1000x1000.jpg',
        price: 299,
        flex: 3
      },
      {
        title: 'Best airlines3',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 100,
        flex: 3
      },
      {
        title: 'Pre-fab homes',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WY/AR/QZ/119153245/girls-top-1000x1000.jpg',
        price: 89,
        flex: 3,
      },
      {
        title: 'Favorite road trips',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/MA/IW/DY/119153245/rf-06-01-1000x1000.jpg',
        price: 99,
        flex: 3
      },
      {
        title: 'Best airlines',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 89,
        flex: 3
      },
      {
        title: 'Pre-fab homes1',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WS/HB/WP/119153245/rf-01-jpg-1000x1000.jpg',
        price: 69,
        flex: 3
      },
      {
        title: 'Favorite road trips2',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GQ/KG/ZG/119153245/rf-03-01-1000x1000.jpg',
        price: 299,
        flex: 3
      },
      {
        title: 'Best airlines3',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 100,
        flex: 3
      },
      {
        title: 'Pre-fab homes',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WY/AR/QZ/119153245/girls-top-1000x1000.jpg',
        price: 89,
        flex: 3,
      },
      {
        title: 'Favorite road trips',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/MA/IW/DY/119153245/rf-06-01-1000x1000.jpg',
        price: 99,
        flex: 3
      },
      {
        title: 'Best airlines',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 89,
        flex: 3
      },
      {
        title: 'Pre-fab homes1',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WS/HB/WP/119153245/rf-01-jpg-1000x1000.jpg',
        price: 69,
        flex: 3
      },
      {
        title: 'Favorite road trips2',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GQ/KG/ZG/119153245/rf-03-01-1000x1000.jpg',
        price: 299,
        flex: 3
      },
      {
        title: 'Best airlines3',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 100,
        flex: 3
      },
      {
        title: 'Pre-fab homes',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WY/AR/QZ/119153245/girls-top-1000x1000.jpg',
        price: 89,
        flex: 3,
      },
      {
        title: 'Favorite road trips',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/MA/IW/DY/119153245/rf-06-01-1000x1000.jpg',
        price: 99,
        flex: 3
      },
      {
        title: 'Best airlines',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 89,
        flex: 3
      },
      {
        title: 'Pre-fab homes1',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WS/HB/WP/119153245/rf-01-jpg-1000x1000.jpg',
        price: 69,
        flex: 3
      },
      {
        title: 'Favorite road trips2',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GQ/KG/ZG/119153245/rf-03-01-1000x1000.jpg',
        price: 299,
        flex: 3
      },
      {
        title: 'Best airlines3',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 100,
        flex: 3
      },
      {
        title: 'Pre-fab homes',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WY/AR/QZ/119153245/girls-top-1000x1000.jpg',
        price: 89,
        flex: 3,
      },
      {
        title: 'Favorite road trips',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/MA/IW/DY/119153245/rf-06-01-1000x1000.jpg',
        price: 99,
        flex: 3
      },
      {
        title: 'Best airlines',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 89,
        flex: 3
      },
      {
        title: 'Pre-fab homes1',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/WS/HB/WP/119153245/rf-01-jpg-1000x1000.jpg',
        price: 69,
        flex: 3
      },
      {
        title: 'Favorite road trips2',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GQ/KG/ZG/119153245/rf-03-01-1000x1000.jpg',
        price: 299,
        flex: 3
      },
      {
        title: 'Best airlines3',
        src: 'https://5.imimg.com/data5/SELLER/Default/2020/12/GH/ME/WN/119153245/rf-07-01-1000x1000.jpg',
        price: 100,
        flex: 3
      },
    ],
    calories: '',
    tableHead: [
      {
        title: "ชื่อรายการ",
        width: "",
        text: "text-left"
      },
      {
        title: "จำนวน",
        width: "15%",
        text: "text-center"
      },
      {
        title: "ราคา",
        width: "20%",
        text: "text-right"
      },
    ],
    desserts: [
      {
        name:"เสื้อ 89",
        total:1,
        price:89
      },
      {
        name:"เสื้อ 2 ตัว 100",
        total:2,
        price:100
      },
      {
        name:"เสื้อเดรส 299",
        total:1,
        price:299
      },
      {
        name:"กางเกง 89",
        total:1,
        price:89
      },
    ],
  }),
  computed: {
    convert() {
      return convert
    },
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
    this.$nextTick(() => {
      this.loading = false
    })
  },

  mounted() {
  },

  methods: {
    onClick(val){
      console.log("click>"+val.price)
    },
    onConfirm(){
      console.log("")
    },
    myUtils,
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
