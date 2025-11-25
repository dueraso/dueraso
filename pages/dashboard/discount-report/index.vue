<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading.. </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar title="รายงานประสิทธิภาพส่วนลด/โปรโมชั่น">
            <v-row class="m-0" style="justify-content: right">
              <v-autocomplete
                outlined
                :items="branchList"
                v-model="branchSelect"
                hide-no-data
                hide-selected
                return-object
                label="เลือกสาขา"
                dense
                item-text="title"
                item-value="id"
                hide-details
                class="ml-2"
                style="border-radius: 15px; min-width: 250px; max-width: 300px"
                color="#A57156"
                @change="getData"
              ></v-autocomplete>

              <v-btn-toggle
                v-model="periodSelect"
                mandatory
                class="ml-2"
                color="#B27D41"
                style="border-radius: 15px"
                @change="changePeriod"
              >
                <v-btn small value="week">สัปดาห์นี้</v-btn>
                <v-btn small value="month">เดือนนี้</v-btn>
                <v-btn small value="year">ปีนี้</v-btn>
              </v-btn-toggle>
            </v-row>
          </head-bar>

          <!-- Summary Cards -->
          <v-row>
            <v-col cols="12" sm="6" md="3">
              <v-card
                class="pa-4"
                style="
                  border-radius: 15px;
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                "
              >
                <v-row class="m-0">
                  <v-col class="p-0">
                    <p class="m-0 white--text" style="font-size: 14px">
                      ส่วนลดทั้งหมด
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ summary.totalDiscounts }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      รายการ
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-tag-multiple</v-icon
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card
                class="pa-4"
                style="
                  border-radius: 15px;
                  background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                "
              >
                <v-row class="m-0">
                  <v-col class="p-0">
                    <p class="m-0 white--text" style="font-size: 14px">
                      ใช้ส่วนลดแล้ว
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ summary.totalUsed }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      ครั้ง
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-ticket-confirmation</v-icon
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card
                class="pa-4"
                style="
                  border-radius: 15px;
                  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                "
              >
                <v-row class="m-0">
                  <v-col class="p-0">
                    <p class="m-0 white--text" style="font-size: 14px">
                      ส่วนลดรวม
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{
                        convert.money(summary.totalDiscountAmount)
                      }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      บาท
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-cash-remove</v-icon
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>

            <v-col cols="12" sm="6" md="3">
              <v-card
                class="pa-4"
                style="
                  border-radius: 15px;
                  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                "
              >
                <v-row class="m-0">
                  <v-col class="p-0">
                    <p class="m-0 white--text" style="font-size: 14px">
                      Redemption Rate
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ summary.redemptionRate.toFixed(1) }}%</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      อัตราการใช้ส่วนลด
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-percent</v-icon
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- Top Discounts Performance -->
          <v-row class="mt-3">
            <v-col cols="12" md="7">
              <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                <h4 style="color: #5b4840" class="mb-3">
                  🏆 Top 10 ส่วนลดที่ใช้มากที่สุด
                </h4>
                <client-only placeholder="Loading...">
                  <BarChart
                    v-if="topDiscountsChartData"
                    :chart-data="topDiscountsChartData"
                    :chart-options="barChartOptions"
                    :height="130"
                    :width="300"
                    chart-id="topDiscountsChart"
                  />
                </client-only>
              </v-card>
            </v-col>

            <v-col cols="12" md="5">
              <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                <h4 style="color: #5b4840" class="mb-3">
                  สัดส่วนการใช้งานส่วนลด
                </h4>
                <client-only placeholder="Loading...">
                  <DoughnutChart
                    v-if="discountUsagePieData"
                    :chart-data="discountUsagePieData"
                    :chart-options="pieChartOptions"
                    :height="100"
                    :width="100"
                    chart-id="discountUsagePieChart"
                  />
                </client-only>
              </v-card>
            </v-col>
          </v-row>

          <!-- ROI and Trend Analysis -->
          <v-row class="mt-3">
            <v-col cols="12" md="6">
              <v-card class="pa-4" style="border-radius: 15px">
                <h4 style="color: #5b4840" class="mb-3">
                  📈 ROI ของส่วนลด (Return on Investment)
                </h4>
                <client-only placeholder="Loading...">
                  <BarChart
                    v-if="roiChartData"
                    :chart-data="roiChartData"
                    :chart-options="roiChartOptions"
                    :height="100"
                    :width="300"
                    chart-id="roiChart"
                  />
                </client-only>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="pa-4" style="border-radius: 15px">
                <h4 style="color: #5b4840" class="mb-3">
                  แนวโน้มการใช้ส่วนลด (7 วันล่าสุด)
                </h4>
                <client-only placeholder="Loading...">
                  <LineChart
                    v-if="trendChartData"
                    :chart-data="trendChartData"
                    :chart-options="lineChartOptions"
                    :height="100"
                    :width="300"
                    chart-id="trendChart"
                  />
                </client-only>
              </v-card>
            </v-col>
          </v-row>

          <!-- Discount Performance Table -->
          <v-row class="mt-3">
            <v-col>
              <v-card style="border-radius: 15px" class="pa-4">
                <v-row class="m-0 mb-3">
                  <h4 style="color: #5b4840">รายละเอียดส่วนลดทั้งหมด</h4>
                  <v-spacer></v-spacer>
                  <v-text-field
                    v-model="search"
                    label="ค้นหาส่วนลด"
                    dense
                    outlined
                    hide-details
                    prepend-inner-icon="mdi-magnify"
                    style="border-radius: 15px; max-width: 300px"
                    color="#A57156"
                  ></v-text-field>
                </v-row>

                <table style="width: 100%">
                  <thead>
                    <tr>
                      <th
                        v-for="(item, i) in tableHead"
                        :key="i"
                        :class="item.text"
                        style="color: #846537"
                        class="pl-3"
                        :width="item.width"
                      >
                        {{ item.title }}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in filteredDiscounts"
                      :key="index"
                      class="rounded-cell-all"
                    >
                      <td class="pr-0">
                        <v-row class="m-0 align-center">
                          <v-chip
                            small
                            :color="getDiscountTypeColor(item.type_discount)"
                            text-color="white"
                            class="mr-2"
                          >
                            {{ getDiscountTypeName(item.type_discount) }}
                          </v-chip>
                          <strong>{{ item.name }}</strong>
                        </v-row>
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        <span v-if="item.type_discount === 1">
                          {{ convert.money(item.total) }} ฿
                        </span>
                        <span v-else>{{ item.total }}%</span>
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        {{ item.usageCount || 0 }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.totalDiscountAmount || 0) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.totalSales || 0) }}
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        {{ item.roi ? item.roi.toFixed(2) + "x" : "-" }}
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        <v-chip
                          small
                          :color="getPerformanceColor(item.performance)"
                          text-color="white"
                        >
                          <v-icon small left>{{
                            getPerformanceIcon(item.performance)
                          }}</v-icon>
                          {{ item.performance }}
                        </v-chip>
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        <v-progress-linear
                          :value="item.usagePercent"
                          :color="getPerformanceColor(item.performance)"
                          height="20"
                          rounded
                        >
                          <small class="white--text"
                            >{{ item.usagePercent.toFixed(1) }}%</small
                          >
                        </v-progress-linear>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="2">
                        <strong
                          >รวมทั้งหมด {{ discountsData.length }} รายการ</strong
                        >
                      </td>
                      <td class="text-center">
                        <strong>{{ summary.totalUsed }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{
                          convert.money(summary.totalDiscountAmount)
                        }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{ convert.money(summary.totalSales) }}</strong>
                      </td>
                      <td colspan="3"></td>
                    </tr>
                  </tfoot>
                </table>
              </v-card>
            </v-col>
          </v-row>

          <!-- Insights Cards -->
          <v-row class="mt-3">
            <v-col cols="12" md="4">
              <v-card
                style="border-radius: 15px; border-left: 4px solid #43e97b"
                class="pa-4"
              >
                <v-row class="m-0 mb-2 align-center">
                  <v-icon color="#43e97b" class="mr-2">mdi-trophy</v-icon>
                  <h5 style="color: #5b4840" class="m-0">🎯 ส่วนลดยอดนิยม</h5>
                </v-row>
                <div v-if="topDiscounts.length > 0">
                  <h3 style="color: #43e97b" class="mb-1">
                    {{ topDiscounts[0].name }}
                  </h3>
                  <p class="mb-1" style="font-size: 14px">
                    ใช้ไป: {{ topDiscounts[0].usageCount }} ครั้ง
                  </p>
                  <p class="mb-0" style="font-size: 14px">
                    มูลค่า:
                    {{ convert.money(topDiscounts[0].totalDiscountAmount) }} บาท
                  </p>
                </div>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card
                style="border-radius: 15px; border-left: 4px solid #ffa726"
                class="pa-4"
              >
                <v-row class="m-0 mb-2 align-center">
                  <v-icon color="#ffa726" class="mr-2"
                    >mdi-chart-line-variant</v-icon
                  >
                  <h5 style="color: #5b4840" class="m-0">💰 ROI เฉลี่ย</h5>
                </v-row>
                <h3 style="color: #ffa726" class="mb-1">
                  {{ summary.avgROI.toFixed(2) }}x
                </h3>
                <p class="mb-0" style="font-size: 14px">
                  ส่วนลดสร้างยอดขายกลับมา {{ summary.avgROI.toFixed(1) }} เท่า
                </p>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card
                style="border-radius: 15px; border-left: 4px solid #4facfe"
                class="pa-4"
              >
                <v-row class="m-0 mb-2 align-center">
                  <v-icon color="#4facfe" class="mr-2">mdi-cash-refund</v-icon>
                  <h5 style="color: #5b4840" class="m-0">
                    💸 ส่วนลดเฉลี่ย/ออเดอร์
                  </h5>
                </v-row>
                <h3 style="color: #4facfe" class="mb-1">
                  {{ convert.money(summary.avgDiscountPerOrder) }}
                </h3>
                <p class="mb-0" style="font-size: 14px">
                  บาท ({{
                    (
                      (summary.avgDiscountPerOrder / summary.avgOrderValue) *
                      100
                    ).toFixed(1)
                  }}% ของยอดขาย)
                </p>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<style scoped src="../../pos/product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #a57156;
}

.rounded-cell-all td {
  padding: 12px 8px;
  border-bottom: 1px solid #f0f0f0;
}

.rounded-cell-all:hover {
  background-color: #f9f9f9;
}

table {
  border-collapse: collapse;
}

thead th {
  background-color: #f3f1ed;
  padding: 12px 8px;
  font-weight: 600;
  border-bottom: 2px solid #a57156;
}

tfoot td {
  background-color: #f3f1ed;
  padding: 12px 8px;
  font-weight: 500;
  border-top: 2px solid #a57156;
}
</style>

<script src="./index.js" />
