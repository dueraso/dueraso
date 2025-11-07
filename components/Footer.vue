<template>
  <v-container style="max-width: 1200px;">
    <v-row class="m-0">
      <v-col class="text-left">
        <h3 style="color: #846537">
          DUERASO
        </h3>
        <p>
          ระบบบริหารจัดการร้านค้า<br>
          รวมทุกฟีเจอร์ที่จำเป็นไว้ในระบบเดียว
        </p>
      </v-col>
      <v-col class="text-left">
        <h5 style="color: #B27D41">
          เกี่ยวกับเรา
        </h5>
        <a href="/package">
          แพ็คเกจ
        </a>
        <br>
        <a href="/blog">
          บทความ
        </a>
        <br>
        <a href="/faq">
          คำถามที่พบบ่อย
        </a>
        <br>
        <a @click="$router.push('/policy')">
          นโยบายความเป็นส่วนตัว
        </a>
        <br>
        <a href="/policy">
          ข้อตกลงและเงื่อนไข
        </a>
      </v-col>
      <v-col class="text-left">
        <h5 style="color: #B27D41">
          ติดต่อเรา
        </h5>
        <v-row class="m-0 py-1">
          <v-icon class="mr-1">mdi-phone-outline</v-icon>
          <h6 class="m-0">-</h6>
        </v-row>
        <v-row class="m-0 py-1">
          <img src="/line-icon.svg" class="mr-1"/>
          <h6 class="m-0">-</h6>
        </v-row>

        <v-row class="m-0 py-1">
          <v-icon class="mr-1">mdi-email-outline</v-icon>
          <h6 class="m-0">info@dueraso.com</h6>
        </v-row>

        <v-row class="m-0 py-1">
          <v-icon class="mr-1">mdi-clock-time-three-outline</v-icon>
          <h6 class="m-0">08:00 - 18:00 น.</h6>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>
<style scoped>
a {
  text-decoration: none;
  color: black;
}
</style>
<script>
import dayjs from "dayjs";

export default {
  methods: {dayjs},
  data() {
    return {
      icons: [
        'mdi-facebook',
        'mdi-twitter',
        'mdi-linkedin',
        'mdi-instagram',
      ],
    }
  }
}

</script>
