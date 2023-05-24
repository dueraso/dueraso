<template>
  <v-app-bar :clipped-left="clipped" fixed app color="success">
    <v-btn icon @click="$router.push('/')">
      <img src="/logo.png" height="30px" width="30px"/>
    </v-btn>
    <v-toolbar-title v-for="(item, i) in items" :key='i'>
      <v-btn
        plain
        @click="clickRow(i)"
        color="white"
        class="text-capitalize"
      >{{item.title}}</v-btn>
    </v-toolbar-title>
    <v-spacer/>
    <v-icon style="color: white; margin-right: 10px;">{{
        icons.mdiAccountCircleOutline
      }}
    </v-icon>
    <v-toolbar-title v-text="name" style="color: white"/>
    <v-menu left bottom>
      <template v-slot:activator="{ on, attrs }">
        <v-btn icon v-bind="attrs" v-on="on">
          <v-icon style="color: white">mdi-dots-vertical</v-icon>
        </v-btn>
      </template>
      <v-list>
        <v-list-item v-for="n in 1" :key="n" @click="logout()">
          <v-list-item-title>ออกจากระบบ</v-list-item-title>
        </v-list-item>
      </v-list>
    </v-menu>
  </v-app-bar>
</template>

<style type="text/css">
a {
  text-decoration: none;
}

a:hover {
  text-decoration: none;
  /* text-decoration: underline; */
}
</style>

<script>
import {mdiAccountCircleOutline} from "@mdi/js";
import axios from "axios";
import {mapState} from 'vuex'

export default {
  data() {
    return {
      icons: {
        mdiAccountCircleOutline
      },
      clipped: false,
      code: "",
      name: '',
      items: [
        {
          title: 'place',
          to: '/',
        },
        {
          title: 'type',
          to: '/type',
        },{
          title: 'hot',
          to: '/hot',
        },
      ],
    };
  },
  async beforeMount() {
  },
  mounted() {
    this.name = this.$auth.user.name
  },
  methods: {
    async logout() {
      await this.$auth.logout()
      await this.$router.push('/login')
    },
    async clickRow(num){
      await this.$router.push(this.items[num].to);
    },
  },
  computed: {
    ...mapState('auth', ['loggedIn']),
  },
};
</script>
