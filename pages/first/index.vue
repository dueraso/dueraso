<template>
  <div id="app" style="">
    <v-app>
      <v-container fill-height class="justify-content-center">
        <v-card class="p-4" elevation="0" width="800px">
          <v-card-title class="justify-content-center">
            <h2 style="color: #5B4840">
              ยินดีต้อนรับสู่ <strong>DUERASO</strong>
            </h2>
          </v-card-title>

          <v-stepper v-model="stepper" style="border-radius: 15px;">
            <v-stepper-header style="border-radius: 15px 15px 0 0;">
              <v-stepper-step :complete="stepper > 1" step="1" color="#B27D41">
                เลือกแพ็คเกจ
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepper >= 2" step="2" color="#B27D41">
                ชำระเงิน
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepper >= 3" step="3" color="#B27D41">
                รอตรวจ
              </v-stepper-step>

              <v-divider></v-divider>

              <v-stepper-step :complete="stepper >= 4" step="4" color="#B27D41">
                เสร็จสิ้น
              </v-stepper-step>
            </v-stepper-header>

            <v-stepper-items>
              <v-stepper-content step="1">

                <v-text-field
                  v-model="storeName" label="ชื่อร้าน" class="relative z-10"
                  outlined style="border-radius: 15px;"
                  dense/>

                <v-select
                  v-model="selectedPackage"
                  :items="packages"
                  item-value="id"
                  item-text="title"
                  label="เลือกแพ็คเกจ"
                  class="relative z-10"
                  return-object
                  outlined style="border-radius: 15px;"
                  dense
                ></v-select>
                <!--                <v-row>-->

                <Divider align="left" type="solid">
                  <b>สรุปยอดแพ็คเกจ</b>
                </Divider>
                <!--                </v-row>-->

                <div v-if="selectedPackage">
                  <!--                  <v-card-text>-->
                  <p>
                    <strong>
                      แพ็คเกจ:
                    </strong>
                    {{ selectedPackageData.title }}
                  </p>
                  <p class="m-0">
                    <strong>
                      รายละเอียด:
                    </strong>
                    {{ selectedPackageData.detail }}
                  </p>
                  <ul>
                    <li v-for="(item, i) in selectedPackageData.package_item" :key="i">
                      {{ item.name }}
                    </li>
                  </ul>
                  <p class="">
                    <strong>
                      ราคา:
                    </strong>
                    {{ convert.money(selectedPackageData.price) }} บาท
                  </p>
                  <!--                  </v-card-text>-->
                </div>

                <v-row class="m-2">
                  <v-spacer/>
                  <v-btn style="border-radius: 15px" color="#B27D41" @click="save" dark>
                    บันทึก
                  </v-btn>
                </v-row>

              </v-stepper-content>

              <v-stepper-content step="2">
                <v-row class="m-0" v-if="packageList">
                  <v-col>
                    <p>
                      <strong>
                        แพ็คเกจ:
                      </strong>
                      {{ packageList.title }}
                    </p>
                    <p class="m-0">
                      <strong>
                        รายละเอียด:
                      </strong>
                      {{ packageList.detail }}
                    </p>
                    <ul>
                      <li v-for="(item, i) in packageList.package_item" :key="i">
                        {{ item.name }}
                      </li>
                    </ul>
                    <v-row class="m-0 align-items-center">
                      <strong>
                        ราคา:
                      </strong>
                      <p style="font-size: 18px" class="m-0 px-1">
                        {{ convert.money(packageList.promotion_price) }} บาท
                      </p>
                      <s style="font-size: 12px">
                        {{ convert.money(packageList.price) }} บาท
                      </s>
                    </v-row>
                  </v-col>

                  <Divider align="center" type="solid" layout="vertical">
                    or
                  </Divider>

                  <v-col>
                    <h6>ขั้นตอนการชำระเงินโดยการโอนผ่านธนาคาร</h6>
                    <p>1. โอนยอดเงินทั้งหมดผ่านทาง Internet Banking</p>
                    <v-card class="py-2 mb-3" style="border-radius: 15px;">
                      <h6 class="text-center">อาทิตย์ ดือราโซ <br/>
                        ธนาคารไทยพาณิชย์ สาขาเดอะมอลล์ บางกะปิ<br/>
                        เลขที่บัญชี 160-407595-8
                      </h6>
                    </v-card>
                    <p>
                      2. อัพโหลดหลักฐานการชำระเงิน
                    </p>
                    <p>
                      3. รอตรวจสอบภายใน 8 ชม. และไม่เกิน 24 ชม.
                    </p>
                    <v-file-input outlined label="แนบสลิป" dense hide-details style="border-radius: 15px;"/>
                  </v-col>
                </v-row>
                <v-row class="m-2">
                  <v-spacer/>
                  <v-btn text dark color="#B27D41">
                    กลับ
                  </v-btn>
                  <v-btn style="border-radius: 15px;" dark color="#B27D41">
                    บันทึก
                  </v-btn>
                </v-row>
              </v-stepper-content>
              <v-stepper-content step="3">
              </v-stepper-content>
              <v-stepper-content step="4">
                <v-col class="m-0" style="justify-items: center;">
                  <v-icon x-large color="green" style="font-size: 90px">
                    mdi-check-circle
                  </v-icon>
                  <p style="font-size: 18px">
                    <strong style="color: #5B4840">
                      พร้อมใช้งาน
                    </strong>
                  </p>
                </v-col>

                <v-row class="m-2">
                  <v-spacer/>
                  <v-btn style="border-radius: 15px" color="#B27D41" @click="close" dark>
                    ปิด
                  </v-btn>
                </v-row>
              </v-stepper-content>
            </v-stepper-items>
          </v-stepper>

        </v-card>
      </v-container>
    </v-app>
  </div>
</template>

<script src="./index.js"/>
