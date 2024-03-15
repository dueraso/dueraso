<template>
  <v-row class="m-4" style="max-width: 1200px;">
    <v-col class="text-left">
      <h3>
        DUERASO
      </h3>
      <p>
        ระบบบริหารจัดการร้านค้า<br>
        รวมทุกฟีเจอร์ที่จำเป็นไว้ในระบบเดียว
      </p>
    </v-col>
    <v-col cols="2" class="text-left">
      <h5>
        เกี่ยวกับเรา
      </h5>
      <a>
        แพ็คเกจ
      </a>
      <br>
      <a>
        บทความ
      </a>
      <br>
      <a>
        คำถามที่พบบ่อย
      </a>
      <br>
      <a @click="$router.push('/policy')">
        นโยบายความเป็นส่วนตัว
      </a>
      <br>
      <a>
        ข้อตกลงและเงื่อนไข
      </a>
    </v-col>
    <v-col>
      <h5>
        ติดต่อเรา
      </h5>
    </v-col>
  </v-row>
</template>

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
