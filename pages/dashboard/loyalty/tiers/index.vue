<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading..</v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar :title="headTitle" :callback="openItem" per="add.loyalty">
          </head-bar>
          <v-col>
            <v-row>
              <v-col cols="12" md="8">
                <!-- Tiers List -->
                <v-card class="pa-4" style="border-radius: 15px">
                  <h6 class="mb-4" style="color: #5b4840">ระดับสมาชิกทั้งหมด</h6>
                  <v-row>
                    <v-col cols="12" sm="6" v-for="tier in tiers" :key="tier.id">
                      <v-card
                        class="pa-4"
                        :style="`border-radius: 15px; border-left: 5px solid ${tier.color}`"
                      >
                        <v-row align="center" class="m-0 mb-2">
                          <v-avatar :color="tier.color" size="45" class="mr-3">
                            <v-icon dark>{{ tier.icon }}</v-icon>
                          </v-avatar>
                          <div>
                            <h5 class="m-0" :style="`color: ${tier.color}`">
                              {{ tier.name }}
                            </h5>
                            <small style="color: #846537"
                            >{{ tier.memberCount }} สมาชิก</small
                            >
                          </div>
                          <v-spacer/>
                          <v-btn icon small @click="openItem(tier)">
                            <v-icon>mdi-pen</v-icon>
                          </v-btn>
                        </v-row>
                        <v-divider class="my-2"/>
                        <v-row class="m-0 mb-1">
                          <v-icon small color="#846537" class="mr-2"
                          >mdi-star
                          </v-icon
                          >
                          <span style="font-size: 13px; color: #5b4840">
                          เงื่อนไข:
                          {{
                              tier.minPoints > 0
                                ? convert.money(tier.minPoints, 0) + " แต้มขึ้นไป"
                                : "เริ่มต้น"
                            }}
                        </span>
                        </v-row>
                        <v-row class="m-0 mb-1">
                          <v-icon small color="#846537" class="mr-2"
                          >mdi-percent
                          </v-icon
                          >
                          <span style="font-size: 13px; color: #5b4840">
                          ได้รับแต้ม: {{ tier.pointMultiplier }}x ({{
                              tier.pointsPerBaht
                            }}
                          แต้ม/10 บาท)
                        </span>
                        </v-row>
                        <v-row class="m-0" v-if="tier.discount > 0">
                          <v-icon small color="#846537" class="mr-2"
                          >mdi-tag
                          </v-icon
                          >
                          <span style="font-size: 13px; color: #5b4840">
                          ส่วนลดพิเศษ: {{ tier.discount }}%
                        </span>
                        </v-row>
                        <v-chip
                          v-for="perk in tier.perks"
                          :key="perk"
                          x-small
                          class="mt-2 mr-1"
                          :color="tier.color"
                          outlined
                        >
                          {{ perk }}
                        </v-chip>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <!-- Tier Distribution -->
                <v-card class="pa-4 mb-4" style="border-radius: 15px">
                  <h6 class="mb-3" style="color: #5b4840">สัดส่วนสมาชิก</h6>
                  <apexchart
                    type="donut"
                    height="250"
                    :options="chartOptions"
                    :series="chartSeries"
                  />
                </v-card>

                <!-- Quick Stats -->
                <v-card class="pa-4" style="border-radius: 15px">
                  <h6 class="mb-3" style="color: #5b4840">สถิติการเลื่อนระดับ</h6>
                  <v-simple-table dense>
                    <template v-slot:default>
                      <tbody>
                      <tr>
                        <td style="color: #846537">เลื่อนขั้นเดือนนี้</td>
                        <td
                          class="text-right"
                          style="color: #4caf50; font-weight: bold"
                        >
                          +{{ upgradeStats.thisMonth }}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #846537">ลดระดับเดือนนี้</td>
                        <td
                          class="text-right"
                          style="color: #f44336; font-weight: bold"
                        >
                          -{{ upgradeStats.downgradeThisMonth }}
                        </td>
                      </tr>
                      <tr>
                        <td style="color: #846537">รอเลื่อนขั้น</td>
                        <td
                          class="text-right"
                          style="color: #ff9800; font-weight: bold"
                        >
                          {{ upgradeStats.pendingUpgrade }}
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <!-- Edit Dialog -->
          <dialog-mid
            v-model="dialog"
            title="แก้ไขระดับสมาชิก"
            :callback="confirm"
            width="500"
          >
            <v-row class="m-0">
              <v-col class="pb-0 pt-3" md="12">
                <v-text-field
                  v-model="item.name"
                  label="ชื่อระดับ"
                  outlined
                  dense
                  style="border-radius: 15px"
                  disabled
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.minPoints"
                  label="แต้มขั้นต่ำ"
                  outlined
                  dense
                  style="border-radius: 15px"
                  type="number"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.pointMultiplier"
                  label="ตัวคูณแต้ม (x)"
                  outlined
                  dense
                  style="border-radius: 15px"
                  type="number"
                  step="0.1"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.pointsPerBaht"
                  label="แต้มต่อ 10 บาท"
                  outlined
                  dense
                  style="border-radius: 15px"
                  type="number"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.discount"
                  label="ส่วนลดพิเศษ (%)"
                  outlined
                  dense
                  style="border-radius: 15px"
                  type="number"
                  suffix="%"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="12">
                <v-combobox
                  v-model="item.perks"
                  label="สิทธิพิเศษ"
                  outlined
                  dense
                  style="border-radius: 15px"
                  multiple
                  chips
                  small-chips
                  deletable-chips
                  hint="พิมพ์แล้ว Enter เพื่อเพิ่ม"
                  persistent-hint
                />
              </v-col>
            </v-row>
          </dialog-mid>
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
