<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar title="ภาพรวมรายงาน" class="text-right">
            <v-row class="m-0" style="justify-content: right;">
              <v-autocomplete
                outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data
                class="ml-2"
                hide-selected return-object label="เลือกร้าน" dense item-text="name" item-value="id" hide-details
                style="border-radius: 15px; min-width: 300px; max-width: 400px"
              ></v-autocomplete>
              <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="วันที่เริ่ม"
                    append-icon="mdi-calendar"
                    class="ml-2"
                    outlined
                    dense
                    style="border-radius: 15px; min-width: 200px; max-width: 200px"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#A57156"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="date" scrollable locale="th-TH" color="#A57156">
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="modal = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="#A57156" @click="$refs.dialog.save(date)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-dialog ref="dialog2" v-model="dialogDateEnd" :return-value.sync="dateEnd" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateEnd"
                    label="วันที่สิ้นสุด"
                    append-icon="mdi-calendar"
                    class="ml-2"
                    outlined
                    dense
                    style="border-radius: 15px; min-width: 200px; max-width: 200px"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#A57156"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateEnd" scrollable locale="th-TH" color="#A57156">
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="dialogDateEnd = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="#A57156" @click="$refs.dialog2.save(dateEnd)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-row>
          </head-bar>
          <v-col cols="12" md="12">
            <Summary v-model="summary"/>
          </v-col>
          <!--          <v-col>-->
          <!--            <v-row>-->
          <!--              <v-col>-->
          <!--                <v-chart :options="chartOptions">-->
          <!--                  <v-bar-->
          <!--                    v-for="item in chartData"-->
          <!--                    :key="item.label"-->
          <!--                    :value="item.value"-->
          <!--                    :label="item.label"-->
          <!--                  ></v-bar>-->
          <!--                </v-chart>-->
          <!--              </v-col>-->
          <!--            </v-row>-->
          <!--          </v-col>-->
          <v-col>
            <v-row>
              <v-col cols="12" sm="7">
                <!--                <v-card height="100%" class="card">-->
                <!--                  <v-card-title tag="h2">Bar Chart</v-card-title>-->
                <!--                  <v-card-subtitle>Data Projects</v-card-subtitle>-->
                <!--                  <v-card-text>-->
                <!--                    <div>-->
                <!--                      <client-only placeholder="Loading...">-->
                <!--                        <BarChart :chart-data="chartDatas" :chart-options="chartOptions" chart-id="lineChart" :height="90" :width="100"/>-->
                <!--                      </client-only>-->
                <!--                    </div>-->
                <!--                  </v-card-text>-->
                <!--                </v-card>-->
                <v-card height="100%" class="card" style="border-radius: 15px">
                  <v-card-title tag="h2">ยอดรายรับรายจ่าย</v-card-title>
                  <v-card-text>
                    <div>
                      <client-only placeholder="Loading...">
                        <BarChart
                          :chart-options="chartOptions"
                          :chart-data="chartDatas"
                          :height="100"
                          :width="300"
                          chart-id="lineChart"
                        />
                      </client-only>
                    </div>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col>
                <v-card class="m-0 ml-2 p-3" style="border-radius: 15px" height="85px">
                  <v-row style="height: 78px">
                    <v-col cols="8" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">ขายสินค้าไปทั้งหมด</h5>
                    </v-col>
                    <v-col cols="2" class="align-self-center">
                      <h2 class="m-0" style="color:#A57156;">
                        <strong>56</strong>
                      </h2>
                    </v-col>
                    <v-col class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">รายการ</h5>
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="m-0 ml-2 p-3 mt-3" style="border-radius: 15px" height="85px">
                  <v-row style="height: 78px">
                    <v-col cols="3" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">จ่ายเงินสด</h5>
                    </v-col>
                    <v-col class="align-self-center" style="text-align: -webkit-right;">
                      <h2 class="m-0" style="color:#21CEC7;">
                        <strong>
                          38 %
                        </strong>
                      </h2>
                    </v-col>
                    <v-divider vertical style="color: #A57156"></v-divider>
                    <v-col cols="3" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">จ่ายเงินสด</h5>
                    </v-col>
                    <v-col class="align-self-center" style="text-align: -webkit-right;">
                      <h2 class="m-0" style="color:#68CB11;">
                        <strong>
                          62 %
                        </strong>
                      </h2>
                    </v-col>
                  </v-row>
                </v-card>

                <v-card class="m-0 ml-2 p-3 mt-3" style="border-radius: 15px" height="150px">
                  <v-row>
                    <v-col cols="3" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">กำไรมากที่สุด</h5>
                    </v-col>
                    <v-col class="align-self-center" style="text-align: -webkit-right;">
                      <h5 class="m-0" style="color:#A57156;">6,500 บาท</h5>
                    </v-col>
                    <v-divider vertical style="color: #A57156"></v-divider>
                    <v-col cols="3" class="align-self-center">
                      <h5 class="m-0" style="color: #5B4840">กำไรน้อยที่สุด</h5>
                    </v-col>
                    <v-col class="align-self-center" style="text-align: -webkit-right;">
                      <h5 class="m-0" style="color:#A57156;">3,150 บาท</h5>
                    </v-col>
                  </v-row>
                  <v-row>
                    <v-col cols="6" class="align-self-center">
                      <h1 class="m-0" style="color: #A57156">
                        <strong>
                          กรุงเทพ กกท
                        </strong>
                      </h1>
                    </v-col>
                    <v-divider vertical style="color: #A57156"/>
                    <v-col cols="6" class="align-self-center">
                      <h1 class="m-0" style="color: #A57156">
                        <strong>
                          หลัง วค.
                        </strong>
                      </h1>
                    </v-col>
                  </v-row>
                </v-card>
              </v-col>
            </v-row>
            <v-row>
              <v-col cols="3">
                <h4 style="color: #5B4840">
                  รายรับ
                </h4>
                <GChart
                  :type="type"
                  :data="pieChartData"
                  :options="pieChartOptions"
                />
              </v-col>
              <v-col cols="3">
                <h4 style="color: #5B4840">
                  รายจ่าย
                </h4>
                <GChart
                  :type="type"
                  :data="pieChartData"
                  :options="pieChartOptions"
                />
              </v-col>
              <v-col>
                <h4 style="color: #5B4840" class="m-0">
                  สินค้ายอดนิยม
                </h4>
                <v-card style="border-radius: 15px" class="mt-3" v-for="(item, i) in emps" :key="i">
                  <v-row class="m-0">
                    <h3 class="m-0 align-self-center" style="padding: 12px">
                      <strong style="color: #E8AF14">{{ i + 1 }}</strong>
                    </h3>
                    <v-col class="m-0 align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        {{ item.employee.name }}
                      </p>
                    </v-col>
                    <v-col cols="3" class="text-right align-self-center">
                      <p class="m-0" style="color: #5B4840">
                        {{ convert.money(item.totalAmount) }}
                      </p>
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
<script src="./index.js"/>
<style scoped src="./index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
