<template>
  <div id="app">
    <v-app>
      <v-row justify="center">
        <v-col sm="6">
          <v-container fill-height>
            <v-layout wrap align-center>
<!--              <v-flex style="max-width: 700px">-->
                <v-col class="text-center" style="max-width: 700px">
                <p align="center" style="font-size: 30px">403 | ขออภัย!
                  ขณะนี้ระบบรองรับเฉพาะบุคลากรเท่านั้น หรือ ยังไม่มีสิทธิ์ในการใช้งาน</p>
                <v-btn outlined color="#2096f3" @click="logout" class="text-center">ออกจากระบบ</v-btn>
                </v-col>
<!--              </v-flex>-->
            </v-layout>
          </v-container>
        </v-col>
      </v-row>
    </v-app>
  </div>
</template>
<script>
import serve from "~/api/server";

export default {
  layout: 'auth-layout',
  methods:{
    async logout() {
      window.location.assign(
        `https://passport.yru.ac.th/auth/client-logout?redirect_uri=${serve.redirectUri}?logout`
      );
      await this.$auth.logout()
      // ${serve.redirectUri}
    },
  }
}
</script>
