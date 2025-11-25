<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading..</v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar title="รายงานผลการขายสินค้า">
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
                        สินค้าทั้งหมด
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{ summary.totalProducts }}</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        รายการ
                      </p>
                    </v-col>
                    <v-col cols="auto" class="p-0 align-self-center">
                      <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-package-variant
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
                        สินค้าที่ขายได้
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{ summary.soldProducts }}</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        รายการ
                      </p>
                    </v-col>
                    <v-col cols="auto" class="p-0 align-self-center">
                      <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-trending-up
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
                        สินค้าที่ไม่ขาย
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{ summary.unsoldProducts }}</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        รายการ
                      </p>
                    </v-col>
                    <v-col cols="auto" class="p-0 align-self-center">
                      <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-trending-down
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
                        % สินค้าขายดี
                      </p>
                      <h2 class="m-0 white--text mt-2">
                        <strong>{{ summary.successRate }}%</strong>
                      </h2>
                      <p class="m-0 white--text mt-1" style="font-size: 12px">
                        อัตราความสำเร็จ
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

            <!-- Top Products Section -->
            <v-row class="mt-3">
              <v-col cols="12" md="6">
                <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                  <v-row class="m-0 mb-3 align-center">
                    <v-icon color="#43e97b" class="mr-2">mdi-trophy</v-icon>
                    <h4 style="color: #5b4840">🏆 สินค้าขายดี Top 10</h4>
                  </v-row>

                  <v-list v-if="topProducts.length > 0">
                    <v-list-item
                      v-for="(item, i) in topProducts"
                      :key="i"
                      style="border-bottom: 1px solid #f0f0f0"
                    >
                      <v-list-item-avatar>
                        <v-chip
                          small
                          :color="getRankColor(i)"
                          text-color="white"
                          style="font-weight: bold"
                        >
                          {{ i + 1 }}
                        </v-chip>
                      </v-list-item-avatar>
                      <v-list-item-avatar>
                        <v-img
                          :src="
                          item.imageUrl
                            ? JSON.parse(item.imageUrl).fullPath
                            : '/defaultimage.png'
                        "
                        ></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title class="font-weight-bold">{{
                            item.name
                          }}
                        </v-list-item-title>
                        <v-list-item-subtitle
                        >ขายได้ {{ item.quantity }} ชิ้น | ยอดขาย
                          {{
                            convert.money(item.totalSales)
                          }}
                        </v-list-item-subtitle
                        >
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-chip small color="green" text-color="white">
                          <v-icon small left>mdi-fire</v-icon>
                          ฮิต
                        </v-chip>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  <v-alert v-else type="info" text dense>
                    ไม่มีข้อมูลสินค้าขายดี
                  </v-alert>
                </v-card>
              </v-col>

              <v-col cols="12" md="6">
                <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                  <v-row class="m-0 mb-3 align-center">
                    <v-icon color="#f5576c" class="mr-2">mdi-alert-circle</v-icon>
                    <h4 style="color: #5b4840">⚠️ สินค้าที่ไม่มียอดขาย</h4>
                  </v-row>

                  <v-list v-if="unsoldProducts.length > 0">
                    <v-list-item
                      v-for="(item, i) in unsoldProducts.slice(0, 10)"
                      :key="i"
                      style="border-bottom: 1px solid #f0f0f0"
                    >
                      <v-list-item-avatar>
                        <v-img
                          :src="
                          item.imageUrl
                            ? JSON.parse(item.imageUrl).fullPath
                            : '/defaultimage.png'
                        "
                        ></v-img>
                      </v-list-item-avatar>
                      <v-list-item-content>
                        <v-list-item-title>{{ item.name }}</v-list-item-title>
                        <v-list-item-subtitle
                        >ประเภท:
                          {{
                            item.type ? item.type.name : "-"
                          }}
                        </v-list-item-subtitle
                        >
                      </v-list-item-content>
                      <v-list-item-action>
                        <v-chip small color="grey" text-color="white">
                          ไม่มียอด
                        </v-chip>
                      </v-list-item-action>
                    </v-list-item>
                  </v-list>
                  <v-alert v-else type="success" text dense>
                    ยอดเยี่ยม! สินค้าทุกรายการมียอดขาย
                  </v-alert>

                  <v-divider
                    v-if="unsoldProducts.length > 10"
                    class="mt-3 mb-2"
                  ></v-divider>
                  <p
                    v-if="unsoldProducts.length > 10"
                    class="text-center grey--text mb-0"
                  >
                    และอีก {{ unsoldProducts.length - 10 }} รายการ
                  </p>
                </v-card>
              </v-col>
            </v-row>

            <!-- Charts Section -->
            <v-row class="mt-3">
              <v-col cols="12" md="8">
                <v-card class="pa-4" style="border-radius: 15px">
                  <h4 style="color: #5b4840" class="mb-3">
                    เปรียบเทียบยอดขาย Top 10
                  </h4>
                  <client-only placeholder="Loading...">
                    <BarChart
                      v-if="topProductsChartData"
                      :chart-data="topProductsChartData"
                      :chart-options="barChartOptions"
                      :height="120"
                      :width="300"
                      chart-id="topProductsChart"
                    />
                  </client-only>
                </v-card>
              </v-col>

              <v-col cols="12" md="4">
                <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                  <h4 style="color: #5b4840" class="mb-3">
                    สัดส่วนยอดขายตามประเภท
                  </h4>
                  <client-only placeholder="Loading...">
                    <DoughnutChart
                      v-if="categoryPieData"
                      :chart-data="categoryPieData"
                      :chart-options="pieChartOptions"
                      :height="90"
                      :width="90"
                      chart-id="categoryPieChart"
                    />
                  </client-only>
                </v-card>
              </v-col>
            </v-row>

            <!-- Product Performance Table -->
            <v-row class="mt-3">
              <v-col>
                <v-card style="border-radius: 15px" class="pa-4">
                  <v-row class="m-0 mb-3">
                    <h4 style="color: #5b4840">รายละเอียดผลการขายสินค้า</h4>
                    <v-spacer></v-spacer>
                    <v-text-field
                      v-model="search"
                      label="ค้นหาสินค้า"
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
                      v-for="(item, index) in filteredProductsData"
                      :key="index"
                      class="rounded-cell-all"
                    >
                      <td class="pr-0">
                        <v-row class="m-0 align-center">
                          <v-avatar size="40" class="mr-3">
                            <v-img
                              :src="
                                item.imageUrl
                                  ? JSON.parse(item.imageUrl).fullPath
                                  : '/defaultimage.png'
                              "
                            ></v-img>
                          </v-avatar>
                          {{ item.name }}
                        </v-row>
                      </td>
                      <td class="pl-0 pr-0">
                        {{ item.type ? item.type.name : "-" }}
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        {{ item.quantity || 0 }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.totalSales) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.avgPrice) }}
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
                      <td colspan="2">
                        <strong
                        >รวมทั้งหมด
                          {{ allProductsData.length }} รายการ</strong
                        >
                      </td>
                      <td class="text-center">
                        <strong>{{ summary.totalQuantity }}</strong>
                      </td>
                      <td class="text-right">
                        <strong>{{
                            convert.money(summary.totalRevenue)
                          }}</strong>
                      </td>
                      <td colspan="3"></td>
                    </tr>
                    </tfoot>
                  </table>
                </v-card>
              </v-col>
            </v-row>

            <!-- Recommendations Section -->
            <v-row class="mt-3" v-if="unsoldProducts.length > 0">
              <v-col>
                <v-card
                  style="border-radius: 15px; border-left: 4px solid #ffa726"
                  class="pa-4"
                >
                  <v-row class="m-0 mb-3 align-center">
                    <v-icon color="#ffa726" class="mr-2">mdi-lightbulb-on</v-icon>
                    <h4 style="color: #ffa726">💡 คำแนะนำ</h4>
                  </v-row>

                  <v-row>
                    <v-col cols="12" md="4">
                      <v-card outlined class="pa-3" style="border-radius: 10px">
                        <v-icon color="#ffa726" large>mdi-sale</v-icon>
                        <h5 class="mt-2" style="color: #5b4840">
                          ลดราคาหรือโปรโมชั่น
                        </h5>
                        <p class="mb-0" style="font-size: 13px">
                          พิจารณาทำโปรโมชั่นสำหรับสินค้าที่ไม่มียอดขาย
                          {{ unsoldProducts.length }} รายการ
                        </p>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-card outlined class="pa-3" style="border-radius: 10px">
                        <v-icon color="#ffa726" large
                        >mdi-package-variant-closed
                        </v-icon
                        >
                        <h5 class="mt-2" style="color: #5b4840">จัดการสต๊อก</h5>
                        <p class="mb-0" style="font-size: 13px">
                          ลดปริมาณการสั่งสินค้าที่ขายไม่ดี เพื่อลดต้นทุนคงคลัง
                        </p>
                      </v-card>
                    </v-col>

                    <v-col cols="12" md="4">
                      <v-card outlined class="pa-3" style="border-radius: 10px">
                        <v-icon color="#ffa726" large>mdi-chart-box</v-icon>
                        <h5 class="mt-2" style="color: #5b4840">เพิ่มการตลาด</h5>
                        <p class="mb-0" style="font-size: 13px">
                          เพิ่มการโปรโมทสินค้าที่มีศักยภาพแต่ยังขายไม่ดี
                        </p>
                      </v-card>
                    </v-col>
                  </v-row>
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
