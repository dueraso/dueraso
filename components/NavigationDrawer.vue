<template>
  <!--  <v-card>-->
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant="miniVariant"
    :clipped="clipped"
    fixed
    app
    dark
    style="background: linear-gradient(rgba(86, 97, 177, 1), rgba(30, 197, 169, 1)), center center / cover no-repeat"
  >
    <v-list-item class="px-2">
      <v-list-item-avatar>
        <v-img src="https://randomuser.me/api/portraits/men/85.jpg"></v-img>
      </v-list-item-avatar>

      <v-list-item-title>John Leider</v-list-item-title>

      <v-btn
        icon
        @click.stop="mini = !mini"
      >
        <v-icon>mdi-chevron-left</v-icon>
      </v-btn>
    </v-list-item>

    <v-divider></v-divider>
    <v-list>
      <v-list-item>
        <v-list-item-icon>
          <v-icon>mdi-home</v-icon>
        </v-list-item-icon>

        <v-list-item-title>หน้าแรก</v-list-item-title>
      </v-list-item>
      <v-list-group
        prepend-icon="mdi-account-circle"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>จัดการ pos</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(item, i) in itemsPos"
          :key="i"
          link
          :to="item.to"
        >
          <v-list-item-title v-text="item.title"></v-list-item-title>

          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>

      <v-list-group
        prepend-icon="mdi-account-circle"
        no-action
      >
        <template v-slot:activator>
          <v-list-item-content>
            <v-list-item-title>จัดการหน้าบ้าน</v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          link
        >
          <v-list-item-title v-text="item.title"></v-list-item-title>

          <v-list-item-icon>
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
        </v-list-item>
      </v-list-group>
    </v-list>
  </v-navigation-drawer>
</template>
<style>
</style>
<script>
export default {
  computed: {
    drawer: {
      get() {
        return this.$store.state.drawer;
      },
      set(val) {
        return val;
      }
    }
  },
  data() {
    return {
      miniVariant: false,
      clipped: false,
      mini: false,
      itemsBar: [],
      items: [
        {
          icon: 'mdi-apps',
          title: 'Welcome',
          to: '/'
        },
        {
          icon: 'mdi-chart-bubble',
          title: 'Inspire',
          to: '/inspire'
        }
      ],
      result: null,
      itemsPos: [
        {
          title: "แคชเชียร์",
          to: "/pos",
        },
        {
          title: "จัดการรายการ",
          to: "/pos/product",
        },
        {
          title: "จัดการประเภท",
          to: "/pos/product-type",
        },
        {
          title: "จัดการส่วนลด",
          to: "/pos/discount",
        },

      ],
    }
  },
  mounted() {
    this.getModules()
    this.test()
  },
  methods: {
    getModules() {
      this.itemsBar = JSON.parse(localStorage.getItem("policy")).titleBar
      console.log(this.itemsBar)
    },
    test() {
      // this.result = this.itemsBar.reduce(function (r, a) {
      //   r[a.order] = "llll"[a.order] || [];
      //   // r[a.order].push(a);
      //   return r;
      // }, Object.create(null));
      // console.log(this.itemsBar);
    }
  }
}
</script>
