import dayjs from "dayjs";
import auth from "@/middleware/auth";
// import role from "@/middleware/role";

export default {
  middleware: auth,
  auth: {
    strategy: 'local1',
  },
  layout: "seller-layout",
  data(){
    return{

    }
  },
  computed: {},
  watch: {
  },

  created() {
    // this.getData();
  },

  mounted() {
    console.log(this.$auth.user)
    // console.log(this.$route)
  },

  methods: {
  },
};
