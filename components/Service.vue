<template>
  <v-row class="m-0">
    <v-col class="text-center" cols="12">
      <h2>Dueraso POS ระบบบริหารจัดการร้านค้า<br/>
        รวมทุกฟีเจอร์ที่จำเป็นไว้ในระบบเดียว</h2>
    </v-col>
    <v-col v-for="(item, i) in items" :key="i" class="text-center p-lg-5" cols="12" md="4">
      <v-icon x-large class="text-center">{{ item.icon }}</v-icon>
      <b-icon icon="arrow-up"></b-icon>
      <h5>{{ item.title }}</h5>
      <p>{{ item.detail }}</p>
    </v-col>
  </v-row>
</template>
<script>
export default {
  data() {
    return {
      items: [
        {
          icon: "mdi-desktop-classic",
          title: "จัดการง่ายทุกยอดขายและเมนู",
          detail: "ค้นหา และจัดการเมนูได้ไว\n" +
            "เปิดโต๊ะปิดบิล บันทึกยอดการขายรายวัน\n" +
            "ใช้งานสะดวกหน้าตาดูง่าย"
        },
        {
          icon: "mdi-desktop-classic",
          title: "จัดการง่ายทุกยอดขายและเมนู",
          detail: "ค้นหา และจัดการเมนูได้ไว\n" +
            "เปิดโต๊ะปิดบิล บันทึกยอดการขายรายวัน\n" +
            "ใช้งานสะดวกหน้าตาดูง่าย"
        },
        {
          icon: "mdi-desktop-classic",
          title: "จัดการง่ายทุกยอดขายและเมนู",
          detail: "ค้นหา และจัดการเมนูได้ไว\n" +
            "เปิดโต๊ะปิดบิล บันทึกยอดการขายรายวัน\n" +
            "ใช้งานสะดวกหน้าตาดูง่าย"
        },
        {
          icon: "mdi-desktop-classic",
          title: "จัดการง่ายทุกยอดขายและเมนู",
          detail: "ค้นหา และจัดการเมนูได้ไว\n" +
            "เปิดโต๊ะปิดบิล บันทึกยอดการขายรายวัน\n" +
            "ใช้งานสะดวกหน้าตาดูง่าย"
        },
        {
          icon: "mdi-desktop-classic",
          title: "จัดการง่ายทุกยอดขายและเมนู",
          detail: "ค้นหา และจัดการเมนูได้ไว\n" +
            "เปิดโต๊ะปิดบิล บันทึกยอดการขายรายวัน\n" +
            "ใช้งานสะดวกหน้าตาดูง่าย"
        },
      ]
    }
  }
}
</script>
