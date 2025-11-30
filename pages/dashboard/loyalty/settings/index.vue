<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading..</v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar :title="headTitle" :hideBtn="true"></head-bar>
          <v-col>
            <v-row>
              <v-col cols="12" md="8">
                <!-- General Settings -->
                <v-card class="pa-4 mb-4" style="border-radius: 15px">
                  <h6 class="mb-4" style="color: #5b4840">
                    <v-icon color="#B27D41" class="mr-2">mdi-cog</v-icon>
                    ตั้งค่าทั่วไป
                  </h6>
                  <v-row>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="settings.pointsPerBaht"
                        label="อัตราการได้แต้ม (บาท / 1 แต้ม)"
                        outlined
                        dense
                        style="border-radius: 15px"
                        type="number"
                        hint="ทุกกี่บาทได้ 1 แต้ม (เช่น 10 = ทุก 10 บาทได้ 1 แต้ม)"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="settings.pointExpireDays"
                        label="อายุแต้ม (วัน)"
                        outlined
                        dense
                        style="border-radius: 15px"
                        type="number"
                        hint="แต้มจะหมดอายุหลังจากกี่วัน (0 = ไม่หมดอายุ)"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="settings.minPurchaseForPoints"
                        label="ยอดซื้อขั้นต่ำที่ได้แต้ม (บาท)"
                        outlined
                        dense
                        style="border-radius: 15px"
                        type="number"
                        hint="ยอดซื้อขั้นต่ำต่อบิลที่จะได้รับแต้ม"
                        persistent-hint
                      />
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-text-field
                        v-model="settings.maxPointsPerTransaction"
                        label="แต้มสูงสุดต่อบิล"
                        outlined
                        dense
                        style="border-radius: 15px"
                        type="number"
                        hint="จำกัดแต้มสูงสุดที่ได้รับต่อ 1 บิล (0 = ไม่จำกัด)"
                        persistent-hint
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Point Rules -->
                <v-card class="pa-4 mb-4" style="border-radius: 15px">
                  <h6 class="mb-4" style="color: #5b4840">
                    <v-icon color="#B27D41" class="mr-2"
                    >mdi-star-settings
                    </v-icon
                    >
                    กฎการให้แต้ม
                  </h6>
                  <v-row>
                    <v-col cols="12">
                      <v-switch
                        v-model="settings.enableRounding"
                        label="ปัดเศษแต้ม (เศษ 0.5 ขึ้นไปปัดขึ้น)"
                        color="#B27D41"
                        inset
                        hide-details
                        class="mb-3"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-model="settings.enableBirthdayBonus"
                        label="เปิดโบนัสวันเกิด"
                        color="#B27D41"
                        inset
                        hide-details
                        class="mb-3"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" v-if="settings.enableBirthdayBonus">
                      <v-text-field
                        v-model="settings.birthdayBonusPoints"
                        label="แต้มโบนัสวันเกิด"
                        outlined
                        dense
                        style="border-radius: 15px"
                        type="number"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-model="settings.enableReferral"
                        label="เปิดระบบแนะนำเพื่อน"
                        color="#B27D41"
                        inset
                        hide-details
                        class="mb-3"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" v-if="settings.enableReferral">
                      <v-text-field
                        v-model="settings.referralPoints"
                        label="แต้มที่ได้รับเมื่อแนะนำเพื่อน"
                        outlined
                        dense
                        style="border-radius: 15px"
                        type="number"
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Notification Settings -->
                <v-card class="pa-4 mb-4" style="border-radius: 15px">
                  <h6 class="mb-4" style="color: #5b4840">
                    <v-icon color="#B27D41" class="mr-2">mdi-bell</v-icon>
                    ตั้งค่าการแจ้งเตือน
                  </h6>
                  <v-row>
                    <v-col cols="12">
                      <v-switch
                        v-model="settings.notifyPointsEarned"
                        label="แจ้งเตือนเมื่อได้รับแต้ม"
                        color="#B27D41"
                        inset
                        hide-details
                        class="mb-3"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-model="settings.notifyPointsExpiring"
                        label="แจ้งเตือนแต้มใกล้หมดอายุ"
                        color="#B27D41"
                        inset
                        hide-details
                        class="mb-3"
                      />
                    </v-col>
                    <v-col cols="12" sm="6" v-if="settings.notifyPointsExpiring">
                      <v-text-field
                        v-model="settings.expiryNotifyDays"
                        label="แจ้งเตือนก่อนหมดอายุ (วัน)"
                        outlined
                        dense
                        style="border-radius: 15px"
                        type="number"
                      />
                    </v-col>
                    <v-col cols="12">
                      <v-switch
                        v-model="settings.notifyTierUpgrade"
                        label="แจ้งเตือนเมื่อเลื่อนระดับ"
                        color="#B27D41"
                        inset
                        hide-details
                        class="mb-3"
                      />
                    </v-col>
                  </v-row>
                </v-card>

                <!-- Save Button -->
                <v-btn
                  block
                  rounded
                  x-large
                  color="#B27D41"
                  dark
                  @click="saveSettings"
                  :loading="saving"
                >
                  <v-icon left>mdi-content-save</v-icon>
                  บันทึกการตั้งค่า
                </v-btn>
              </v-col>

              <v-col cols="12" md="4">
                <!-- Status -->
                <v-card class="pa-4 mb-4" style="border-radius: 15px">
                  <h6 class="mb-3" style="color: #5b4840">
                    <v-icon color="#B27D41" class="mr-2">mdi-power</v-icon>
                    สถานะระบบ
                  </h6>
                  <v-switch
                    v-model="settings.systemEnabled"
                    :label="
                    settings.systemEnabled ? 'ระบบเปิดใช้งาน' : 'ระบบปิดใช้งาน'
                  "
                    :color="settings.systemEnabled ? '#4CAF50' : '#F44336'"
                    inset
                  />
                  <v-alert
                    v-if="!settings.systemEnabled"
                    type="warning"
                    dense
                    style="border-radius: 10px"
                  >
                    ระบบสะสมแต้มถูกปิดใช้งาน ลูกค้าจะไม่ได้รับแต้มจากการซื้อสินค้า
                  </v-alert>
                </v-card>

                <!-- Quick Info -->
                <v-card class="pa-4 mb-4" style="border-radius: 15px">
                  <h6 class="mb-3" style="color: #5b4840">
                    <v-icon color="#B27D41" class="mr-2">mdi-information</v-icon>
                    ข้อมูลสรุป
                  </h6>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <tbody>
                      <tr>
                        <td style="color: #846537">อัตราแต้ม</td>
                        <td class="text-right" style="font-weight: bold">
                          {{ settings.pointsPerBaht }} บาท = 1 แต้ม
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #846537">อายุแต้ม</td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            settings.pointExpireDays > 0
                              ? settings.pointExpireDays + " วัน"
                              : "ไม่หมดอายุ"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #846537">โบนัสวันเกิด</td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            settings.enableBirthdayBonus
                              ? settings.birthdayBonusPoints + " แต้ม"
                              : "ปิด"
                          }}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #846537">แนะนำเพื่อน</td>
                        <td class="text-right" style="font-weight: bold">
                          {{
                            settings.enableReferral
                              ? settings.referralPoints + " แต้ม"
                              : "ปิด"
                          }}
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>

                <!-- Danger Zone -->
                <v-card
                  class="pa-4"
                  style="border-radius: 15px; border: 1px solid #f44336"
                >
                  <h6 class="mb-3" style="color: #f44336">
                    <v-icon color="#F44336" class="mr-2">mdi-alert</v-icon>
                    Danger Zone
                  </h6>
                  <v-btn
                    block
                    outlined
                    color="#F44336"
                    class="mb-2"
                    @click="confirmResetPoints"
                  >
                    <v-icon left>mdi-refresh</v-icon>
                    รีเซ็ตแต้มทั้งหมด
                  </v-btn>
                  <v-btn
                    block
                    outlined
                    color="#F44336"
                    @click="confirmDeleteAllMembers"
                  >
                    <v-icon left>mdi-delete-forever</v-icon>
                    ลบสมาชิกทั้งหมด
                  </v-btn>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <!-- Confirm Dialog -->
          <v-dialog v-model="confirmDialog" width="400" persistent>
            <v-card style="border-radius: 15px">
              <v-card-title style="color: #f44336">
                <v-icon color="#F44336" class="mr-2">mdi-alert</v-icon>
                ยืนยันการดำเนินการ
              </v-card-title>
              <v-card-text>
                <p class="m-0">{{ confirmMessage }}</p>
                <v-text-field
                  v-model="confirmInput"
                  :label="`พิมพ์ '${confirmText}' เพื่อยืนยัน`"
                  outlined
                  dense
                  style="border-radius: 15px"
                  class="mt-4"
                />
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-btn
                  rounded
                  outlined
                  color="#846537"
                  @click="confirmDialog = false"
                >
                  ยกเลิก
                </v-btn>
                <v-spacer/>
                <v-btn
                  rounded
                  dark
                  color="#F44336"
                  @click="executeConfirm"
                  :disabled="confirmInput !== confirmText"
                >
                  ยืนยัน
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #a57156;
}
</style>
<script src="./index.js"/>
