<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading.. </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar title="รายงานสินค้าคงคลัง">
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
                style="border-radius: 15px; min-width: 300px; max-width: 400px"
                color="#A57156"
                @change="getData"
              ></v-autocomplete>

              <v-autocomplete
                outlined
                :items="productTypes"
                v-model="typeSelect"
                hide-no-data
                hide-selected
                return-object
                label="ประเภทสินค้า"
                dense
                item-text="name"
                item-value="id"
                hide-details
                clearable
                class="ml-2"
                style="border-radius: 15px; min-width: 250px; max-width: 300px"
                color="#A57156"
                @change="getData"
              ></v-autocomplete>
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
                      >mdi-package-variant</v-icon
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
                      สินค้าใกล้หมด
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ summary.lowStockProducts }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      รายการ
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-alert-circle-outline</v-icon
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
                      มูลค่าสินค้าคงคลัง
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ convert.money(summary.totalValue) }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      บาท
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-cash-multiple</v-icon
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
                      ประเภทสินค้า
                    </p>
                    <h2 class="m-0 white--text mt-2">
                      <strong>{{ summary.totalTypes }}</strong>
                    </h2>
                    <p class="m-0 white--text mt-1" style="font-size: 12px">
                      ประเภท
                    </p>
                  </v-col>
                  <v-col cols="auto" class="p-0 align-self-center">
                    <v-icon size="50" color="white" style="opacity: 0.3"
                      >mdi-shape-outline</v-icon
                    >
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>

          <!-- Charts Section -->
          <v-row class="mt-3">
            <v-col cols="12" md="8">
              <v-card class="pa-4" style="border-radius: 15px">
                <h4 style="color: #5b4840" class="mb-3">
                  มูลค่าสินค้าคงคลังแยกตามประเภท
                </h4>
                <client-only placeholder="Loading...">
                  <BarChart
                    v-if="inventoryChartData"
                    :chart-data="inventoryChartData"
                    :chart-options="barChartOptions"
                    :height="120"
                    :width="300"
                    chart-id="inventoryBarChart"
                  />
                </client-only>
              </v-card>
            </v-col>

            <v-col cols="12" md="4">
              <v-card class="pa-4" style="border-radius: 15px; height: 100%">
                <h4 style="color: #5b4840" class="mb-3">สัดส่วนประเภทสินค้า</h4>
                <client-only placeholder="Loading...">
                  <DoughnutChart
                    v-if="productTypePieData"
                    :chart-data="productTypePieData"
                    :chart-options="pieChartOptions"
                    :height="90"
                    :width="90"
                    chart-id="productTypePie"
                  />
                </client-only>
              </v-card>
            </v-col>
          </v-row>

          <!-- Products Table -->
          <v-row class="mt-3">
            <v-col>
              <v-card style="border-radius: 15px" class="pa-4">
                <v-row class="m-0 mb-3">
                  <h4 style="color: #5b4840">รายการสินค้าคงคลัง</h4>
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
                      v-for="(item, index) in filteredProducts"
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
                      <td class="pl-0 pr-0">
                        {{ item.branch ? item.branch.title : "-" }}
                      </td>
                      <td class="pl-0 pr-0 text-center">
                        <v-chip
                          small
                          :color="getStockColor(item.stock)"
                          text-color="white"
                        >
                          {{ item.stock || 0 }}
                        </v-chip>
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money(item.price) }}
                      </td>
                      <td class="pl-0 pr-0 text-right">
                        {{ convert.money((item.stock || 0) * item.price) }}
                      </td>
                      <td class="pl-0 pr-0">
                        <v-chip
                          small
                          :color="getStatusColor(item.stock)"
                          text-color="white"
                        >
                          {{ getStockStatus(item.stock) }}
                        </v-chip>
                      </td>
                    </tr>
                  </tbody>
                  <tfoot>
                    <tr>
                      <td colspan="4">
                        รายการทั้งหมด {{ products.length }} รายการ
                      </td>
                      <td colspan="3" class="text-right">
                        <strong style="color: #b27d41"
                          >รวม:
                          {{ convert.money(totalInventoryValue) }} บาท</strong
                        >
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </v-card>
            </v-col>
          </v-row>

          <!-- Low Stock Alert Section -->
          <v-row class="mt-3" v-if="lowStockItems.length > 0">
            <v-col>
              <v-card
                style="border-radius: 15px; border-left: 4px solid #f5576c"
                class="pa-4"
              >
                <v-row class="m-0 mb-3 align-center">
                  <v-icon color="#f5576c" class="mr-2">mdi-alert-circle</v-icon>
                  <h4 style="color: #f5576c">
                    สินค้าที่ใกล้หมด (จำนวนคงเหลือ ≤ จำนวนขั้นต่ำ)
                  </h4>
                </v-row>

                <v-row>
                  <v-col
                    v-for="(item, i) in lowStockItems"
                    :key="i"
                    cols="12"
                    sm="6"
                    md="4"
                    lg="3"
                  >
                    <v-card outlined style="border-radius: 10px">
                      <v-row class="m-0 pa-3 align-center">
                        <v-avatar size="50" class="mr-3">
                          <v-img
                            :src="
                              item.imageUrl
                                ? JSON.parse(item.imageUrl).fullPath
                                : '/defaultimage.png'
                            "
                          ></v-img>
                        </v-avatar>
                        <v-col class="p-0">
                          <p
                            class="m-0 font-weight-bold"
                            style="font-size: 14px"
                          >
                            {{ item.name }}
                          </p>
                          <p class="m-0" style="font-size: 12px; color: #666">
                            คงเหลือ:
                            <span style="color: #f5576c; font-weight: bold">{{
                              item.stock || 0
                            }}</span>
                          </p>
                        </v-col>
                      </v-row>
                    </v-card>
                  </v-col>
                </v-row>
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
