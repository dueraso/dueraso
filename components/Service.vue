<template>
    <div>
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
        <v-col cols="12" md="2" class="p-2 mt-12" v-for="(item,i) in 7" :key="i">
<!--          <v-card style="border-radius: 15px" class="p-4 my-2">-->
<!--            <v-card-->
<!--              style="left: 30%; top: -20%; position: absolute; background: #6E4C2E; border-radius: 100%;" width="100px"-->
<!--              class="p-3">-->
<!--              <v-img width="70" class="m-1" src="./icon2.png" style="border-radius: unset"></v-img>-->
<!--            </v-card>-->
<!--            <v-card-title style="color: #A44E1C; padding-top: 40px" class="px-0">-->
<!--              จัดการง่าย <br>-->
<!--              ทุกยอดขายและเมนู-->
<!--            </v-card-title>-->
<!--            <v-card-text style="color: #686868;" class="px-0">-->
<!--              ค้นหา และจัดการเมนูได้ไว<br>-->
<!--              เปิดโต๊ะปิดบิล<br>-->
<!--              บันทึกยอดการขายรายวัน<br>-->
<!--              ใช้งานสะดวกหน้าตาดูง่าย-->
<!--            </v-card-text>-->
<!--          </v-card>-->


          <v-card style="border-radius: 15px; height: 100%;" class="p-3">
            <v-card color="#70B183" style="border-radius: 100px; justify-self: center;" class="icon">
<!--              <v-icon size="50" dark class="m-5">mdi-storefront-outline</v-icon>-->
              <v-img max-width="50" class="m-1" src="./icon2.png" style="border-radius: unset"></v-img>
            </v-card>

            <v-card-title style="color: #A44E1C; padding-top: 40px" class="px-0">
              จัดการง่าย ทุกยอดขายและเมนู
            </v-card-title>
            <v-card-text style="color: #686868;" class="px-0">
              ค้นหา และจัดการเมนูได้ไว<br>
              เปิดโต๊ะปิดบิล<br>
              บันทึกยอดการขายรายวัน<br>
              ใช้งานสะดวกหน้าตาดูง่าย
            </v-card-text>
<!--            <p style="font-size: 24px; color: #70B183; font-weight: 700; padding-top: 35px" class="mb-3 text-center">-->
<!--              แพ็คเกจระดับทดลองใช้-->
<!--            </p>-->
<!--            <h5 style="color: #686868; font-weight: 400;">-->
<!--              เหมาะสำหรับร้านค้าเดี่ยว และ-->
<!--            </h5>-->
<!--            <h5 style="color: #686868; font-weight: 400;" class="mb-7">-->
<!--              ผู้ที่พึ่งเริ่มใช้งานระบบ-->
<!--            </h5>-->
<!--            <h2 class="text-left" style="color: #846537; font-weight: 700;">-->
<!--              <s style="color: gray; font-size: 20px">฿199.-</s>-->
<!--              ฿99.- -->
<!--            </h2>-->
          </v-card>
        </v-col>
      </v-row>
    </div>
<!--  </div>-->
</template>
<style>
.icon {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>

<script>
import convert from "@/plugins/convert";

export default {
  computed: {
    convert() {
      return convert
    }
  },
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
