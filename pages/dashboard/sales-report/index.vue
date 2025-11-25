<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading..</v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar title="รายงานสรุปยอดขาย">
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
                <v-btn small value="day">วันนี้</v-btn>
                <v-btn small value="week">สัปดาห์นี้</v-btn>
                <v-btn small value="month">เดือนนี้</v-btn>
                <v-btn small value="year">ปีนี้</v-btn>
                <v-btn small value="custom">กำหนดเอง</v-btn>
              </v-btn-toggle>

              <v-dialog
                v-if="periodSelect === 'custom'"
                ref="dialogStart"
                v-model="dialogStart"
                :return-value.sync="dateStart"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateStart"
                    label="วันที่เริ่ม"
                    append-icon="mdi-calendar"
                    class="ml-2"
                    outlined
                    dense
                    style="
                      border-radius: 15px;
                      min-width: 180px;
                      max-width: 200px;
                    "
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#A57156"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dateStart"
                  scrollable
                  locale="th-TH"
                  color="#A57156"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="dialogStart = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn
                    text
                    color="#A57156"
                    @click="
                      () => {
                        $refs.dialogStart.save(dateStart);
                        getData();
                      }
                    "
                  >
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-dialog
                v-if="periodSelect === 'custom'"
                ref="dialogEnd"
                v-model="dialogEnd"
                :return-value.sync="dateEnd"
                persistent
                width="290px"
              >
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateEnd"
                    label="วันที่สิ้นสุด"
                    append-icon="mdi-calendar"
                    class="ml-2"
                    outlined
                    dense
                    style="
                      border-radius: 15px;
                      min-width: 180px;
                      max-width: 200px;
                    "
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#A57156"
                  ></v-text-field>
                </template>
                <v-date-picker
                  v-model="dateEnd"
                  scrollable
                  locale="th-TH"
                  color="#A57156"
                >
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="dialogEnd = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn
                    text
                    color="#A57156"
                    @click="
                      () => {
                        $refs.dialogEnd.save(dateEnd);
                        getData();
                      }
                    "
                  >
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-row>
          </head-bar>

          <v-col>
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
                        ยอดขายรวม
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{ convert.money(summary.totalSales) }}</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        บาท
                      </p>
                    </v-col>
                    <v-col cols="auto" class="p-0 align-self-center">
                      <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-cash-multiple
                      </v-icon
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
                        จำนวนออเดอร์
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{ summary.totalOrders }}</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        ออเดอร์
                      </p>
                    </v-col>
                    <v-col cols="auto" class="p-0 align-self-center">
                      <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-cart-outline
                      </v-icon
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
                        ยอดเฉลี่ยต่อออเดอร์
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{
                            convert.money(summary.avgOrderValue)
                          }}</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        บาท
                      </p>
                    </v-col>
                    <v-col cols="auto" class="p-0 align-self-center">
                      <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-chart-line
                      </v-icon
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
                        ส่วนลดทั้งหมด
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{
                            convert.money(summary.totalDiscount)
                          }}</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        บาท
                      </p>
                    </v-col>
                    <v-col cols="auto" class="p-0 align-self-center">
                      <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-ticket-percent-outline
                      </v-icon
                      >
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>

            <!-- Charts Section -->
            <v-row class="mt-3">
              <v-col cols="12">
                <v-card class="pa-4" style="border-radius: 15px">
                  <h4 style="color: #5b4840" class="mb-3">กราฟแนวโน้มยอดขาย</h4>
                  <client-only placeholder="Loading...">
                    <LineChart
                      v-if="salesTrendData"
                      :chart-data="salesTrendData"
                      :chart-options="lineChartOptions"
                      :height="100"
                      :width="300"
                      chart-id="salesTrendChart"
                    />
                  </client-only>
                </v-card>
              </v-col>
            </v-row>

            <v-row class="mt-3">
              <v-col cols="12" md="8">
                <v-card class="pa-4" style="border-radius: 15px">
                  <h4 style="color: #5b4840" class="mb-3">
                    เปรียบเทียบยอดขายตามช่องทางการชำระเงิน
                  </h4>
                  <client-only placeholder="Loading...">
                    <BarChart
                      v-if="paymentMethodData"
                      :chart-data="paymentMethodData"
                      :chart-options="barChartOptions"
                      :height="120"
                      :width="300"
                      chart-id="paymentMethodChart"
                    />
                  </client-only>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                  <h4 style="color: #5b4840" class="mb-3">
                    สัดส่วนช่องทางชำระเงิน
                  </h4>
                  <client-only placeholder="Loading...">
                    <DoughnutChart
                      v-if="paymentPieData"
                      :chart-data="paymentPieData"
                      :chart-options="pieChartOptions"
                      :height="90"
                      :width="90"
                      chart-id="paymentPieChart"
                    />
                  </client-only>
                </v-card>
              </v-col>
            </v-row>

            <!-- Top Products Section -->
            <v-row class="mt-3">
              <v-col cols="12" md="6">
                <v-card class="pa-4" style="border-radius: 15px">
                  <h4 style="color: #5b4840" class="mb-3">สินค้าขายดี Top 10</h4>
                  <v-list>
                    <v-list-item
                      v-for="(item, i) in topProducts"
                      :key="i"
                      style="border-bottom: 1px solid #f0f0f0"
                    >
                      <v-list-item-avatar>
                        <v-chip
                          small
                          :color="i < 3 ? '#B27D41' : '#A57156'"
                          text-color="white"
                        >
                          {{ i + 1 }}
                        </v-chip>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle
                        >ขายได้ {{ item.quantity }} รายการ
                        </v-list-item-subtitle
                        >
                      </v-list-item-content>
                      <v-list-item-action>
                        <p class="m-0 font-weight-bold" style="color: #b27d41">
                          {{ convert.money(item.totalSales) }}
                        </p>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card class="pa-4" style="border-radius: 15px">
                  <h4 style="color: #5b4840" class="mb-3">ยอดขายตามช่วงเวลา</h4>
                  <client-only placeholder="Loading...">
                    <BarChart
                      v-if="hourlyData"
                      :chart-data="hourlyData"
                      :chart-options="hourlyChartOptions"
                      :height="120"
                      :width="300"
                      chart-id="hourlyChart"
                    />
                  </client-only>
                </v-card>
              </v-col>
            </v-row>

            <!-- Daily Sales Table -->
            <v-row class="mt-3">
              <v-col>
                <v-card style="border-radius: 15px" class="pa-4">
                  <v-row class="m-0 mb-3">
                    <h4 style="color: #5b4840">รายละเอียดยอดขาย</h4>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="#B27D41"
                      outlined
                      rounded
                      small
                      @click="exportReport"
                    >
                      <v-icon left small>mdi-file-export</v-icon>
                      Export
                    </v-btn>
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
                      v-for="(item, index) in salesData"
                      :key="index"
                      class="rounded-cell-all"
                    >
                      <td class="pr-0">{{ formatDate(item.date) }}</td>
                      <td class="pl-0 pr-0 text-center">
                        {{ item.totalOrders }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.totalSales) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.totalDiscount) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.netSales) }}
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        <v-chip
                          small
                          :color="getGrowthColor(item.growth)"
                          text-color="white"
                        >
                          <v-icon small left>{{
                              item.growth >= 0 ? "mdi-arrow-up" : "mdi-arrow-down"
                            }}
                          </v-icon>
                          {{ Math.abs(item.growth) }}%
                        </v-chip>
                      </td>
                    </tr>
                    </tbody>
                    <tfoot>
                    <tr>
                      <td><strong>รวมทั้งหมด</strong></td>
                      <td class="text-center">
                        <strong>{{ summary.totalOrders }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{ convert.money(summary.totalSales) }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{
                            convert.money(summary.totalDiscount)
                          }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{ convert.money(summary.netSales) }}</strong>
                      </td>
                      <td></td>
                    </tr>
                    </tfoot>
                  </table>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
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

.v-list-item {
  min-height: 60px;
}
</style>

<script src="./index.js"/>
