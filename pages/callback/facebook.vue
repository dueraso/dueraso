<template>
  <v-overlay :value="overlay">
    <v-progress-circular
      :size="100"
      color="primary"
      indeterminate
    ></v-progress-circular>
  </v-overlay>
</template>
<script>
import error from "@/layouts/error.vue";
import convert from "@/plugins/convert";

export default {
  data(){
    return{
      overlay:true,
    }
  },
  mounted() {
    this.$auth.loginWith("local3", {
      data: this.$route.query
    }).then((res) => {
      this.saveLocal();
      this.setManu();
      this.$router.push({ path: `/config` });
    })
  },
  methods:{
    saveLocal() {
      localStorage.setItem("policy", this.$auth.user.roles.policy);
      let per = JSON.parse(localStorage.getItem("policy"));
      if (per) {
        this.$gates.setPermissions(per.permissions);
      }
      this.$gates.setRoles([this.$auth.user.roles.group]);
    },

    setManu() {
      let _item;
      if (this.$auth.user.roles.group === "admin"/* || this.$auth.user.roles.group === "*"*/) {
        _item = this.$auth.user.title;
      } else if (this.$auth.user.roles.policy) {
        console.log("error1")
        _item = JSON.parse(localStorage.getItem("policy")).titleBar;
        // _item = _item.sort((a, b) => a.sort - b.sort)
      } else {
        console.log("error2")
        error(
          {
            statusCode: 403,
            message: 'ACCESS DENIED'
          }
        )
      }
      localStorage.setItem(
        "modules",
        JSON.stringify(convert.groupChildren(_item))
      );
    },
  }
}
</script>
