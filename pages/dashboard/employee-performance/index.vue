<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading..</v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar title="รายงานประสิทธิภาพพนักงาน">
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
                style="border-radius: 15px; align-self: anchor-center;"
                @change="changePeriod"
              >
                <v-btn small value="week">สัปดาห์นี้</v-btn>
                <v-btn small value="month">เดือนนี้</v-btn>
                <v-btn small value="year">ปีนี้</v-btn>
              </v-btn-toggle>
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
                        พนักงานทั้งหมด
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{ summary.totalEmployees }}</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        คน
                      </p>
                    </v-col>
                    <v-col cols="auto" class="p-0 align-self-center">
                      <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-account-group
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
                  background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                "
                >
                  <v-row class="m-0">
                    <v-col class="p-0">
                      <p class="m-0 white--text" style="font-size: 14px">
                        ออเดอร์รวม
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
                  background: linear-gradient(135deg, #43e97b 0%, #38f9d7 100%);
                "
                >
                  <v-row class="m-0">
                    <v-col class="p-0">
                      <p class="m-0 white--text" style="font-size: 14px">
                        เฉลี่ยต่อคน
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{
                            convert.money(summary.avgPerEmployee)
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
            </v-row>

            <!-- Top Employees Ranking -->
            <v-row class="mt-3">
              <v-col cols="12" md="5">
                <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                  <v-row class="m-0 mb-3 align-center">
                    <v-icon color="#FFD700" class="mr-2">mdi-trophy</v-icon>
                    <h4 style="color: #5b4840">🏆 Top 10 พนักงานยอดเยี่ยม</h4>
                  </v-row>

                  <v-list v-if="topEmployees.length > 0">
                    <v-list-item
                      v-for="(item, i) in topEmployees"
                      :key="i"
                      style="border-bottom: 1px solid #f0f0f0"
                      class="px-2"
                    >
                      <v-list-item-avatar>
                        <v-chip
                          :color="getRankColor(i)"
                          text-color="white"
                          style="font-weight: bold; font-size: 16px"
                        >
                          {{ i + 1 }}
                        </v-chip>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">
                          {{ item.name }}
                        </v-list-item-title>
                        <v-list-item-subtitle>
                          {{ item.totalOrders }} ออเดอร์ |
                          {{ convert.money(item.totalSales) }} บาท
                        </v-list-item-subtitle>
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-chip
                          small
                          :color="getPerformanceColor(item.performance)"
                          text-color="white"
                        >
                          <v-icon small left>{{
                              getPerformanceIcon(item.performance)
                            }}
                          </v-icon>
                          {{ item.performance }}
                        </v-chip>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  <v-alert v-else type="info" text dense>
                    ไม่มีข้อมูลพนักงาน
                  </v-alert>
                </v-card>
              </v-col>

              <v-col cols="12" md="7">
                <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                  <h4 style="color: #5b4840" class="mb-3">
                    เปรียบเทียบยอดขาย Top 10
                  </h4>
                  <client-only placeholder="Loading...">
                    <BarChart
                      v-if="topEmployeesChartData"
                      :chart-data="topEmployeesChartData"
                      :chart-options="barChartOptions"
                      :height="130"
                      :width="300"
                      chart-id="topEmployeesChart"
                    />
                  </client-only>
                </v-card>
              </v-col>
            </v-row>

            <!-- Charts Section -->
            <v-row class="mt-3">
              <v-col cols="12" md="6">
                <v-card class="pa-4" style="border-radius: 15px">
                  <h4 style="color: #5b4840" class="mb-3">
                    ยอดขายแยกตามพนักงาน (ทุกคน)
                  </h4>
                  <client-only placeholder="Loading...">
                    <DoughnutChart
                      v-if="employeesPieData"
                      :chart-data="employeesPieData"
                      :chart-options="pieChartOptions"
                      :height="100"
                      :width="100"
                      chart-id="employeesPieChart"
                    />
                  </client-only>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card class="pa-4" style="border-radius: 15px">
                  <h4 style="color: #5b4840" class="mb-3">
                    จำนวนออเดอร์ต่อวัน (เฉลี่ย)
                  </h4>
                  <client-only placeholder="Loading...">
                    <LineChart
                      v-if="dailyOrdersData"
                      :chart-data="dailyOrdersData"
                      :chart-options="lineChartOptions"
                      :height="100"
                      :width="300"
                      chart-id="dailyOrdersChart"
                    />
                  </client-only>
                </v-card>
              </v-col>
            </v-row>

            <!-- Employee Performance Table -->
            <v-row class="mt-3">
              <v-col>
                <v-card style="border-radius: 15px" class="pa-4">
                  <v-row class="m-0 mb-3">
                    <h4 style="color: #5b4840">รายละเอียดผลงานพนักงาน</h4>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      label="ค้นหาพนักงาน"
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
                      v-for="(item, index) in filteredEmployees"
                      :key="index"
                      class="rounded-cell-all"
                    >
                      <td class="pr-0">
                        <v-row class="m-0 align-center">
                          <v-avatar
                            size="40"
                            class="mr-3"
                            :color="getAvatarColor(index)"
                          >
                            <span class="white--text font-weight-bold">{{
                                getInitials(item.name)
                              }}</span>
                          </v-avatar>
                          {{ item.name }}
                        </v-row>
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        {{ item.totalOrders }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.totalSales) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.avgOrderValue) }}
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        {{ item.totalCustomers || "-" }}
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        <v-chip
                          small
                          :color="getPerformanceColor(item.performance)"
                          text-color="white"
                        >
                          {{ item.performance }}
                        </v-chip>
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        <v-progress-linear
                          :value="item.percentOfTotal"
                          :color="getPerformanceColor(item.performance)"
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
                      <td>
                        <strong
                        >รวมทั้งหมด {{ employeesData.length }} คน</strong
                        >
                      </td>
                      <td class="text-center">
                        <strong>{{ summary.totalOrders }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{ convert.money(summary.totalSales) }}</strong>
                      </td>
                      <td colspan="4"></td>
                    </tr>
                    </tfoot>
                  </table>
                </v-card>
              </v-col>
            </v-row>

            <!-- Performance Insights -->
            <v-row class="mt-3">
              <v-col cols="12" md="4">
                <v-card
                  style="border-radius: 15px; border-left: 4px solid #43e97b"
                  class="pa-4"
                >
                  <v-row class="m-0 mb-2 align-center">
                    <v-icon color="#43e97b" class="mr-2">mdi-star</v-icon>
                    <h5 style="color: #5b4840" class="m-0">
                      🌟 พนักงานยอดเยี่ยม
                    </h5>
                  </v-row>
                  <div v-if="topEmployees.length > 0">
                    <h3 style="color: #43e97b" class="mb-1">
                      {{ topEmployees[0].name }}
                    </h3>
                    <p class="mb-1" style="font-size: 14px">
                      ยอดขาย: {{ convert.money(topEmployees[0].totalSales) }}
                    </p>
                    <p class="mb-0" style="font-size: 14px">
                      จำนวน: {{ topEmployees[0].totalOrders }} ออเดอร์
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
                    >mdi-chart-areaspline
                    </v-icon
                    >
                    <h5 style="color: #5b4840" class="m-0">
                      📊 ยอดเฉลี่ยต่อออเดอร์
                    </h5>
                  </v-row>
                  <h3 style="color: #ffa726" class="mb-1">
                    {{ convert.money(summary.avgOrderValue) }}
                  </h3>
                  <p class="mb-0" style="font-size: 14px">
                    เฉลี่ยจากทุกคน {{ summary.totalOrders }} ออเดอร์
                  </p>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card
                  style="border-radius: 15px; border-left: 4px solid #4facfe"
                  class="pa-4"
                >
                  <v-row class="m-0 mb-2 align-center">
                    <v-icon color="#4facfe" class="mr-2"
                    >mdi-account-multiple
                    </v-icon
                    >
                    <h5 style="color: #5b4840" class="m-0">👥 พนักงานที่ทำงาน</h5>
                  </v-row>
                  <h3 style="color: #4facfe" class="mb-1">
                    {{ summary.activeEmployees }} / {{ summary.totalEmployees }}
                  </h3>
                  <p class="mb-0" style="font-size: 14px">
                    คน ({{
                      (
                        (summary.activeEmployees / summary.totalEmployees) *
                        100
                      ).toFixed(1)
                    }}%)
                  </p>
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
  min-height: 70px;
}
</style>

<script src="./index.js"/>
