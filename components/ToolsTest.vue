<template>
  <v-app-bar :clipped-left="clipped" fixed app color="blue">
    <v-container style="padding-left: 0px; padding-right: 0px">
      <v-toolbar
        flat
        color="blue"
      >
        <img src="/logo.png" height="40px" width="40px" style="margin-right: 30px"/>
        <v-tabs dark light v-model="active_tab">
          <v-tab to="/">สถานที่</v-tab>
          <!--          <v-tab to="/type" v-show="roles === 1">type</v-tab>-->
          <!--          <v-tab to="/hot" v-show="roles === 1">hot</v-tab>-->
          <v-spacer/>
          <v-tab to="/manage" v-show="roles === 1">จัดการผู้ใช้งาน</v-tab>
          <v-divider
            inset
            vertical
            v-show="this.$auth.loggedIn">
            >
          </v-divider>
          <v-tab @click="profile" style="padding: 0px; width: 50px">
            <v-icon style="color: white;">{{
                icons.mdiAccountCircleOutline
              }}
            </v-icon>
          </v-tab>
        </v-tabs>
        <div class="text-center" v-show="this.$auth.loggedIn">
          <v-menu offset-y>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                v-bind="attrs"
                v-on="on"
                text
              >
                {{ name }}
              </v-btn>
            </template>
            <v-list>
              <!--              <v-list-item @click="()=>this.$router.push('/manage')" v-if="(roles === 1)">-->
              <!--                <v-list-item-title @click="()=>isSlider = true">-->
              <!--                  จัดการผู้ใช้งาน-->
              <!--                </v-list-item-title>-->
              <!--              </v-list-item>-->
              <!--              <v-list-item @click="()=>this.$router.push('/profile')">-->
              <!--                <v-list-item-title>-->
              <!--                  ข้อมูลส่วนตัว-->
              <!--                </v-list-item-title>-->
              <!--              </v-list-item>-->
              <v-list-item @click="()=>this.logout()">
                <v-list-item-title>
                  ออกจากระบบ
                </v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </div>
      </v-toolbar>
    </v-container>
  </v-app-bar>
</template>
<script>
import {mdiAccountCircleOutline} from "@mdi/js";
import axios from "axios";
import {mapState} from 'vuex'

export default {
  layout: 'default',
  data() {
    return {
      isSlider: false,
      active_tab: 3,
      icons: {
        mdiAccountCircleOutline
      },
      clipped: false,
      code: "",
      name: '',
      roles: '',
    };
  },
  async beforeMount() {
  },
  mounted() {
    this.name = this.$auth.user.name
    this.roles = this.$auth.user.roles
  },
  methods: {
    profile() {
      this.$router.push({
        path: '/manage/edit',
        query: {
          ref: this.$auth.user.id
        }
      })
    },
    EnableSlider() {
      this.isSlider = false
    },
    async logout() {
      await this.$auth.logout()
      await this.$router.push('/login')
    },
    async clickRow(num) {
      await this.$router.push(this.items[num].to);
    },
    test(n) {
      console.log(n)
      eval(n.click)
      this.$router.push(n.to)
    },
    test1(d) {
      console.log("d>" + d)
    },
  },
  computed: {
    ...mapState('auth', ['loggedIn']),
  },
};
</script>
