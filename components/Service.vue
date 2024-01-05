<template>
  <v-col style="background-color: #F3F1ED">
    <v-img src="./dueraso.png" style="left: 2%; bottom: 5%; position: absolute;"></v-img>
    <v-container>
      <v-row class="align-items-center m-0">
        <svg xmlns="http://www.w3.org/2000/svg" width="6" height="115" viewBox="0 0 6 115" fill="none">
          <path d="M6 0H0V115H6V0Z" fill="#B27D41"/>
        </svg>
        <v-col>
          <h2 class="pl-2" style="color: #B27D41; font-weight: 700;">Dueraso POS</h2>
          <p class="pl-2 m-0" style="font-weight: 400; font-size: 23px">
            ระบบบริหารจัดการร้านค้ารวมทุกฟีเจอร์ที่จำเป็นไว้ในระบบเดียว</p>
        </v-col>
      </v-row>
      <v-row class="m-0" style="padding-top: 70px;">
        <v-card style="width: 200px; border-radius: 15px" class="p-4 m-2">
          <v-card
            style="left: 25%; top: -20%; position: absolute; background: #6E4C2E; border-radius: 100%;" width="100px"
            class="p-3">
            <v-img width="70" class="m-1" src="./icon2.png" style="border-radius: unset"></v-img>
          </v-card>
          <h5 style="color: #A44E1C; font-weight: 500; padding-top: 40px" class="mb-5">
            จัดการง่าย<br>
            ทุกยอดขายและเมนู
          </h5>
          <p class="m-0" style="color: #686868; font-weight: 300;">
            ค้นหา และจัดการเมนูได้ไว<br>
            เปิดโต๊ะปิดบิล<br>
            บันทึกยอดการขายรายวัน<br>
            ใช้งานสะดวกหน้าตาดูง่าย
          </p>
        </v-card>
        <v-card style="width: 200px; border-radius: 15px" class="p-4 m-2">
          <v-card
            style="left: 25%; top: -20%; position: absolute; background: #6E4C2E; border-radius: 100%;" width="100px"
            class="p-3">
            <v-img width="70" class="m-1" src="./icon2.png" style="border-radius: unset"></v-img>
          </v-card>
          <h5 style="color: #A44E1C; font-weight: 500; padding-top: 40px" class="mb-5">
            จัดการง่าย<br>
            ทุกยอดขายและเมนู
          </h5>
          <p class="m-0" style="color: #686868; font-weight: 300;">
            ค้นหา และจัดการเมนูได้ไว<br>
            เปิดโต๊ะปิดบิล<br>
            บันทึกยอดการขายรายวัน<br>
            ใช้งานสะดวกหน้าตาดูง่าย
          </p>
        </v-card>
        <v-card style="width: 200px; border-radius: 15px" class="p-4 m-2">
          <v-card
            style="left: 25%; top: -20%; position: absolute; background: #6E4C2E; border-radius: 100%;" width="100px"
            class="p-3">
            <v-img width="70" class="m-1" src="./icon2.png" style="border-radius: unset"></v-img>
          </v-card>
          <h5 style="color: #A44E1C; font-weight: 500; padding-top: 40px" class="mb-5">
            จัดการง่าย<br>
            ทุกยอดขายและเมนู
          </h5>
          <p class="m-0" style="color: #686868; font-weight: 300;">
            ค้นหา และจัดการเมนูได้ไว<br>
            เปิดโต๊ะปิดบิล<br>
            บันทึกยอดการขายรายวัน<br>
            ใช้งานสะดวกหน้าตาดูง่าย
          </p>
        </v-card>
      </v-row>
    </v-container>
  </v-col>
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
        }
      ]
    }
  }
}
</script>
