<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading.. </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar title="รายงานกระแสเงินสด (Cash Flow)">
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
                  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                "
              >
                <v-row class="m-0">
                  <v-col class="p-0">
                    <p class="m-0 white--text" style="font-size: 14px">
                      รายรับรวม
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ convert.money(summary.totalIncome) }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      บาท
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-cash-plus</v-icon
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
                      รายจ่าย (ส่วนลด)
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ convert.money(summary.totalExpense) }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      บาท
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-cash-minus</v-icon
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
                      กระแสเงินสุทธิ
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ convert.money(summary.netCashFlow) }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      บาท
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-cash</v-icon
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
                  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                "
              >
                <v-row class="m-0">
                  <v-col class="p-0">
                    <p class="m-0 white--text" style="font-size: 14px">
                      จำนวนธุรกรรม
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ summary.totalTransactions }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      รายการ
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-receipt-text</v-icon
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- Payment Method Distribution -->
          <v-row class="mt-3">
            <v-col cols="12" md="6">
              <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                <h4 style="color: #5b4840" class="mb-3">
                  💳 รายรับแยกตามช่องทางชำระเงิน
                </h4>
                <client-only placeholder="Loading...">
                  <BarChart
                    v-if="paymentMethodChartData"
                    :chart-data="paymentMethodChartData"
                    :chart-options="barChartOptions"
                    :height="100"
                    :width="300"
                    chart-id="paymentMethodChart"
                  />
                </client-only>
              </v-card>
            </v-col>

            <v-col cols="12" md="6">
              <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                <h4 style="color: #5b4840" class="mb-3">
                  สัดส่วนช่องทางชำระเงิน
                </h4>
                <client-only placeholder="Loading...">
                  <DoughnutChart
                    v-if="paymentMethodPieData"
                    :chart-data="paymentMethodPieData"
                    :chart-options="pieChartOptions"
                    :height="100"
                    :width="100"
                    chart-id="paymentMethodPieChart"
                  />
                </client-only>
              </v-card>
            </v-col>
          </v-row>

          <!-- Cash Flow Trend -->
          <v-row class="mt-3">
            <v-col cols="12">
              <v-card class="pa-4" style="border-radius: 15px">
                <h4 style="color: #5b4840" class="mb-3">
                  📈 แนวโน้มกระแสเงินสด (7 วันล่าสุด)
                </h4>
                <client-only placeholder="Loading...">
                  <LineChart
                    v-if="cashFlowTrendData"
                    :chart-data="cashFlowTrendData"
                    :chart-options="lineChartOptions"
                    :height="80"
                    :width="300"
                    chart-id="cashFlowTrendChart"
                  />
                </client-only>
              </v-card>
            </v-col>
          </v-row>

          <!-- Payment Method Details Table -->
          <v-row class="mt-3">
            <v-col>
              <v-card style="border-radius: 15px" class="pa-4">
                <v-row class="m-0 mb-3">
                  <h4 style="color: #5b4840">รายละเอียดช่องทางชำระเงิน</h4>
                  <v-spacer></v-spacer>
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
                      v-for="(item, index) in paymentMethodsData"
                      :key="index"
                      class="rounded-cell-all"
                    >
                      <td class="pr-0">
                        <v-row class="m-0 align-center">
                          <v-icon
                            :color="getPaymentIcon(item.method).color"
                            class="mr-2"
                          >
                            {{ getPaymentIcon(item.method).icon }}
                          </v-icon>
                          <strong>{{ item.method }}</strong>
                        </v-row>
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        {{ item.count }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.totalAmount) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.avgAmount) }}
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        {{ item.percentOfTotal.toFixed(1) }}%
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        <v-progress-linear
                          :value="item.percentOfTotal"
                          :color="getPaymentIcon(item.method).color"
                          height="20"
                          rounded
                        >
                          <small class="white--text"
                            >{{ item.percentOfTotal.toFixed(1) }}%</small
                          >
                        </v-progress-linear>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td><strong>รวมทั้งหมด</strong></td>
                      <td class="text-center">
                        <strong>{{ summary.totalTransactions }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{
                          convert.money(summary.totalIncome)
                        }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{
                          convert.money(summary.avgTransaction)
                        }}</strong>
                      </td>
                      <td colspan="2"></td>
                    </tr>
                  </tfoot>
                </table>
              </v-card>
            </v-col>
          </v-row>

          <!-- Daily Summary Table -->
          <v-row class="mt-3">
            <v-col>
              <v-card style="border-radius: 15px" class="pa-4">
                <h4 style="color: #5b4840" class="mb-3">
                  📅 สรุปรายวัน (7 วันล่าสุด)
                </h4>

                <table style="width: 100%">
                  <thead>
                    <tr>
                      <th style="color: #846537" class="pl-3 text-left">
                        วันที่
                      </th>
                      <th style="color: #846537" class="text-center">
                        ธุรกรรม
                      </th>
                      <th style="color: #846537" class="text-right">
                        รายรับ (฿)
                      </th>
                      <th style="color: #846537" class="text-right">
                        ส่วนลด (฿)
                      </th>
                      <th style="color: #846537" class="text-right">
                        สุทธิ (฿)
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in dailySummary"
                      :key="index"
                      class="rounded-cell-all"
                    >
                      <td class="pr-0">
                        <strong>{{ item.date }}</strong>
                        <span class="ml-2" style="color: #999">{{
                          item.dayName
                        }}</span>
                      </td>
                      <td class="pl-0 pr-0 text-center">{{ item.count }}</td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.income) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.discount) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        <strong
                          :style="{
                            color: item.net > 0 ? '#43e97b' : '#ef5350',
                          }"
                        >
                          {{ convert.money(item.net) }}
                        </strong>
                      </td>
                    </tr>
                  </tbody>
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
                  <h5 style="color: #5b4840" class="m-0">
                    💰 ช่องทางชำระยอดนิยม
                  </h5>
                </v-row>
                <div v-if="paymentMethodsData.length > 0">
                  <h3 style="color: #43e97b" class="mb-1">
                    {{ paymentMethodsData[0].method }}
                  </h3>
                  <p class="mb-1" style="font-size: 14px">
                    {{ paymentMethodsData[0].count }} รายการ
                  </p>
                  <p class="mb-0" style="font-size: 14px">
                    {{ convert.money(paymentMethodsData[0].totalAmount) }} บาท
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
                  <v-icon color="#ffa726" class="mr-2">mdi-calculator</v-icon>
                  <h5 style="color: #5b4840" class="m-0">
                    📊 ยอดเฉลี่ยต่อธุรกรรม
                  </h5>
                </v-row>
                <h3 style="color: #ffa726" class="mb-1">
                  {{ convert.money(summary.avgTransaction) }}
                </h3>
                <p class="mb-0" style="font-size: 14px">
                  จาก {{ summary.totalTransactions }} รายการ
                </p>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card
                style="border-radius: 15px; border-left: 4px solid #4facfe"
                class="pa-4"
              >
                <v-row class="m-0 mb-2 align-center">
                  <v-icon color="#4facfe" class="mr-2">mdi-percent</v-icon>
                  <h5 style="color: #5b4840" class="m-0">🎁 อัตราส่วนลด</h5>
                </v-row>
                <h3 style="color: #4facfe" class="mb-1">
                  {{ summary.discountRate.toFixed(1) }}%
                </h3>
                <p class="mb-0" style="font-size: 14px">
                  ส่วนลดเทียบกับรายรับทั้งหมด
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
