<template>
  <div id="app">
    <v-app>
      <v-row justify="center">
        <v-col sm="6">
          <v-container fill-height>
            <v-layout wrap align-center>
              <v-flex style="max-width: 700px">
                <p align="center" style="font-size: 30px">404 Not Found |<br/>ขออภัย!
                  ไม่พบหน้าที่คุณต้องการ</p>
                <p align="center">
                  <v-btn outlined color="#2096f3" @click="()=>this.$router.push('/')">กลับไปหน้าแรกของระบบจอง คลิกที่นี่</v-btn>
                </p>
              </v-flex>
            </v-layout>
          </v-container>
        </v-col>
      </v-row>
    </v-app>
  </div>
</template>
<script>
export default {
  layout: 'auth-layout'
}
</script>
