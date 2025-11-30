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
            <!-- Tabs -->
            <v-tabs v-model="tab" color="#B27D41" class="mb-4">
              <v-tab>
                <v-icon left>mdi-star-plus</v-icon>
                แต้มที่ได้รับ
              </v-tab>
              <v-tab>
                <v-icon left>mdi-gift</v-icon>
                แต้มที่ใช้ไป
              </v-tab>
              <v-tab>
                <v-icon left>mdi-clock-alert</v-icon>
                แต้มใกล้หมดอายุ
              </v-tab>
            </v-tabs>

            <!-- Filters -->
            <v-row class="mb-4">
              <v-col cols="12" sm="4" md="3">
                <v-text-field
                  v-model="search"
                  label="ค้นหาสมาชิก"
                  outlined
                  dense
                  prepend-inner-icon="mdi-magnify"
                  style="border-radius: 15px"
                  clearable
                  @input="onSearch"
                />
              </v-col>
              <v-col cols="12" sm="4" md="3">
                <v-menu
                  v-model="dateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="dateRangeText"
                      label="ช่วงวันที่"
                      outlined
                      dense
                      prepend-inner-icon="mdi-calendar"
                      style="border-radius: 15px"
                      readonly
                      clearable
                      v-bind="attrs"
                      v-on="on"
                      @click:clear="clearDateRange"
                    />
                  </template>
                  <v-date-picker
                    v-model="dateRange"
                    range
                    color="#B27D41"
                    @change="onDateChange"
                  />
                </v-menu>
              </v-col>
            </v-row>

            <!-- Stats -->
            <v-row class="mb-4">
              <v-col cols="6" sm="3">
                <v-card
                  class="pa-3 text-center"
                  style="border-radius: 15px; border-left: 4px solid #4caf50"
                >
                  <p class="m-0" style="color: #846537; font-size: 12px">
                    แต้มที่แจกไป
                  </p>
                  <h4 class="m-0" style="color: #4caf50">
                    +{{ convert.money(stats.totalEarned, 0) }}
                  </h4>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card
                  class="pa-3 text-center"
                  style="border-radius: 15px; border-left: 4px solid #f44336"
                >
                  <p class="m-0" style="color: #846537; font-size: 12px">
                    แต้มที่ใช้ไป
                  </p>
                  <h4 class="m-0" style="color: #f44336">
                    -{{ convert.money(stats.totalUsed, 0) }}
                  </h4>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card
                  class="pa-3 text-center"
                  style="border-radius: 15px; border-left: 4px solid #ff9800"
                >
                  <p class="m-0" style="color: #846537; font-size: 12px">
                    แต้มใกล้หมดอายุ
                  </p>
                  <h4 class="m-0" style="color: #ff9800">
                    {{ convert.money(stats.expiringSoon, 0) }}
                  </h4>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card
                  class="pa-3 text-center"
                  style="border-radius: 15px; border-left: 4px solid #b27d41"
                >
                  <p class="m-0" style="color: #846537; font-size: 12px">
                    แต้มคงเหลือทั้งหมด
                  </p>
                  <h4 class="m-0" style="color: #b27d41">
                    {{ convert.money(stats.totalBalance, 0) }}
                  </h4>
                </v-card>
              </v-col>
            </v-row>

            <v-tabs-items v-model="tab">
              <!-- Tab: แต้มที่ได้รับ -->
              <v-tab-item>
                <v-card class="pa-4" style="border-radius: 15px">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th style="color: #846537">วันที่</th>
                        <th style="color: #846537">สมาชิก</th>
                        <th style="color: #846537">รายการ</th>
                        <th style="color: #846537">Bill</th>
                        <th style="color: #846537" class="text-right">
                          ยอดซื้อ
                        </th>
                        <th style="color: #846537" class="text-right">
                          แต้มที่ได้
                        </th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in earnedPoints" :key="item.id">
                        <td>{{ convert.datetime(item.createdAt) }}</td>
                        <td>
                          <v-chip
                            small
                            :color="getTierColor(item.memberTier)"
                            dark
                            class="mr-2"
                          >
                            {{ item.memberTier }}
                          </v-chip>
                          {{ item.memberName }}
                        </td>
                        <td>{{ item.description }}</td>
                        <td>{{ item.billNumber || "-" }}</td>
                        <td class="text-right">
                          {{ convert.money(item.amount, 0) }}
                        </td>
                        <td
                          class="text-right"
                          style="color: #4caf50; font-weight: bold"
                        >
                          +{{ item.points }}
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-tab-item>

              <!-- Tab: แต้มที่ใช้ไป -->
              <v-tab-item>
                <v-card class="pa-4" style="border-radius: 15px">
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th style="color: #846537">วันที่</th>
                        <th style="color: #846537">สมาชิก</th>
                        <th style="color: #846537">รางวัลที่แลก</th>
                        <th style="color: #846537" class="text-right">
                          แต้มที่ใช้
                        </th>
                        <th style="color: #846537">สาขา</th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in usedPoints" :key="item.id">
                        <td>{{ convert.datetime(item.createdAt) }}</td>
                        <td>
                          <v-chip
                            small
                            :color="getTierColor(item.memberTier)"
                            dark
                            class="mr-2"
                          >
                            {{ item.memberTier }}
                          </v-chip>
                          {{ item.memberName }}
                        </td>
                        <td>{{ item.rewardName }}</td>
                        <td
                          class="text-right"
                          style="color: #f44336; font-weight: bold"
                        >
                          -{{ item.points }}
                        </td>
                        <td>{{ item.branch }}</td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-tab-item>

              <!-- Tab: แต้มใกล้หมดอายุ -->
              <v-tab-item>
                <v-card class="pa-4" style="border-radius: 15px">
                  <v-alert
                    type="warning"
                    dense
                    class="mb-4"
                    style="border-radius: 10px"
                  >
                    <v-row align="center" class="m-0">
                      <v-icon class="mr-2">mdi-alert</v-icon>
                      แต้มที่จะหมดอายุใน 30 วัน
                    </v-row>
                  </v-alert>
                  <v-simple-table>
                    <template v-slot:default>
                      <thead>
                      <tr>
                        <th style="color: #846537">สมาชิก</th>
                        <th style="color: #846537">เบอร์โทร</th>
                        <th style="color: #846537" class="text-right">
                          แต้มที่จะหมดอายุ
                        </th>
                        <th style="color: #846537">หมดอายุวันที่</th>
                        <th style="color: #846537">เหลืออีก</th>
                        <th style="color: #846537"></th>
                      </tr>
                      </thead>
                      <tbody>
                      <tr v-for="item in expiringPoints" :key="item.id">
                        <td>
                          <v-chip
                            small
                            :color="getTierColor(item.tier)"
                            dark
                            class="mr-2"
                          >
                            {{ item.tier }}
                          </v-chip>
                          {{ item.name }}
                        </td>
                        <td>{{ convert.formatPhoneNumber(item.phone) }}</td>
                        <td
                          class="text-right"
                          style="color: #ff9800; font-weight: bold"
                        >
                          {{ convert.money(item.expiringPoints, 0) }}
                        </td>
                        <td>{{ convert.datetime(item.expiryDate) }}</td>
                        <td>
                          <v-chip
                            small
                            :color="item.daysLeft <= 7 ? '#F44336' : '#FF9800'"
                            dark
                          >
                            {{ item.daysLeft }} วัน
                          </v-chip>
                        </td>
                        <td>
                          <v-btn
                            small
                            text
                            color="#B27D41"
                            @click="notifyMember(item)"
                          >
                            <v-icon small left>mdi-bell</v-icon>
                            แจ้งเตือน
                          </v-btn>
                        </td>
                      </tr>
                      </tbody>
                    </template>
                  </v-simple-table>
                </v-card>
              </v-tab-item>
            </v-tabs-items>

            <!-- Pagination -->
            <v-row class="mt-4" align="center">
              <v-col cols="12" class="text-center">
                <v-pagination
                  v-model="page"
                  :length="totalPages"
                  :total-visible="5"
                  color="#B27D41"
                  @input="getData"
                />
              </v-col>
            </v-row>
          </v-col>
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
