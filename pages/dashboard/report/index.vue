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
          <head-bar title="ภาพรวม" :callback="openItem"/>
<!--          <v-card elevation="0">-->
<!--            <v-card-title style="margin: 12px; background-color: #EEF7F6;">-->
<!--              <v-row style="padding: 12px">-->
<!--                <h4 style="align-self: center; color: #2096f3; font-size: 20px">-->
<!--                  รายงานผู้ใช้งาน-->
<!--                </h4>-->
<!--              </v-row>-->
<!--            </v-card-title>-->
<!--            <v-row style="padding: 12px">-->
<!--              <v-col cols="12" sm="4">-->
<!--                <v-autocomplete-->
<!--                  outlined-->
<!--                  auto-select-first-->
<!--                  :items="typeRoom"-->
<!--                  v-model="typeRoomSelect"-->
<!--                  @change="getLogStaff"-->
<!--                  return-object-->
<!--                  item-text="title"-->
<!--                  item-value="id"-->
<!--                  label="ชื่อประเภทห้อง"-->
<!--                  dense-->
<!--                  hide-details-->
<!--                ></v-autocomplete>-->
<!--              </v-col>-->
<!--              <v-col cols="12" sm="4" v-show="typeRoomSelect.id === 1">-->
<!--                <v-autocomplete-->
<!--                  outlined-->
<!--                  auto-select-first-->
<!--                  :items="typeChart"-->
<!--                  v-model="typeChartSelect"-->
<!--                  @change="changeType"-->
<!--                  return-object-->
<!--                  item-text="name"-->
<!--                  item-value="id"-->
<!--                  label="ประเภทผู้ใช้งาน"-->
<!--                  dense-->
<!--                  hide-details-->
<!--                ></v-autocomplete>-->
<!--              </v-col>-->
<!--              <v-col cols="12" sm="4">-->
<!--                <v-menu-->
<!--                  ref="menu"-->
<!--                  v-model="menuDate"-->
<!--                  :close-on-content-click="false"-->
<!--                  :return-value.sync="date"-->
<!--                  transition="scale-transition"-->
<!--                  offset-y-->
<!--                  max-width="290px"-->
<!--                  min-width="auto"-->
<!--                >-->
<!--                  <template v-slot:activator="{ on, attrs }">-->
<!--                    <v-text-field-->
<!--                      v-model="date"-->
<!--                      outlined-->
<!--                      dense-->
<!--                      label="เลือกเดือน/ปี"-->
<!--                      append-icon="mdi-calendar-outline"-->
<!--                      readonly-->
<!--                      v-bind="attrs"-->
<!--                      v-on="on"-->
<!--                      hide-details-->
<!--                    ></v-text-field>-->
<!--                  </template>-->
<!--                  <v-date-picker-->
<!--                    :allowed-dates="allowedDates"-->
<!--                    locale="th"-->
<!--                    v-model="date"-->
<!--                    type="month"-->
<!--                    no-title-->
<!--                    scrollable-->
<!--                  >-->
<!--                    <v-spacer></v-spacer>-->
<!--                    <v-btn text color="primary" @click="menuDate = false">-->
<!--                      ยกเลิก-->
<!--                    </v-btn>-->
<!--                    <v-btn text color="primary" @click="getRoom(date)">-->
<!--                      ตกลง-->
<!--                    </v-btn>-->
<!--                  </v-date-picker>-->
<!--                </v-menu>-->
<!--              </v-col>-->
<!--              <v-col cols="12">-->
<!--                <b-tabs align="left">-->
<!--                  <b-tab title="กราฟ" active @click="getLogStaff">-->
<!--                    <v-row>-->
<!--                      <v-col cols="12" sm="6">-->
<!--                        <GChart-->
<!--                          type="ColumnChart"-->
<!--                          :data="chartData"-->
<!--                          :options="chartOptions">-->
<!--                        </GChart>-->
<!--                      </v-col>-->
<!--                      <v-col cols="12" sm="6">-->
<!--                        <GChart-->
<!--                          :type="type"-->
<!--                          :data="pieChartData"-->
<!--                          :options="pieChartOptions"-->
<!--                        />-->
<!--                      </v-col>-->
<!--                      <v-col cols="12">-->
<!--                        <GChart type="BarChart" :data="data" :options="options"/>-->
<!--                      </v-col>-->
<!--                    </v-row>-->
<!--                  </b-tab>-->
<!--                  <b-tab title="ตาราง" @click="getLogStaff">-->
<!--                    <v-col style="background-color: #EEF7F6;" class="mt-3">-->
<!--                      <h6 class="mb-0" style="color: #2196f3">ตาราง{{ chartOptions.title }}</h6>-->
<!--                    </v-col>-->
<!--                    <v-simple-table>-->
<!--                      <template v-slot:default>-->
<!--                        <thead>-->
<!--                        <tr>-->
<!--                          <th class="text-left" style="color: #2196f3; font-size: 16px" v-for="(item, i) in headerTable"-->
<!--                              :key="i" :width="item.width">-->
<!--                            {{ item.name }}-->
<!--                          </th>-->
<!--                          <th class="text-left" style="color: #2196f3; font-size: 16px">-->
<!--                            จำนวน-->
<!--                          </th>-->
<!--                        </tr>-->
<!--                        </thead>-->
<!--                        <tbody>-->
<!--                        <tr v-for="(item, i) in desserts" :key="i">-->
<!--                          <td>{{ i + 1 }}</td>-->
<!--                          <td>{{ item.master_department_name }}</td>-->
<!--                          <td>{{ item.small }}</td>-->
<!--                          <td>{{ item.medium }}</td>-->
<!--                          <td>{{ item.big }}</td>-->
<!--                          <td>{{ Number(item.total.toFixed(1)).toLocaleString() }}</td>-->
<!--                        </tr>-->
<!--                        <tr>-->
<!--                          <td colspan="2">-->
<!--                            <h6>รวม</h6>-->
<!--                          </td>-->
<!--                          <td>-->
<!--                            <h6>-->
<!--                              {{-->
<!--                                desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {small}) => n + small, 0).toFixed(1)).toLocaleString()-->
<!--                              }}-->
<!--                            </h6>-->
<!--                          </td>-->
<!--                          <td>-->
<!--                            <h6>-->
<!--                              {{-->
<!--                                desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {medium}) => n + medium, 0).toFixed(1)).toLocaleString()-->
<!--                              }}-->
<!--                            </h6>-->
<!--                          </td>-->
<!--                          <td>-->
<!--                            <h6>-->
<!--                              {{-->
<!--                                desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {big}) => n + big, 0).toFixed(1)).toLocaleString()-->
<!--                              }}-->
<!--                            </h6>-->
<!--                          </td>-->
<!--                          <td>-->
<!--                            <h6>-->
<!--                              {{ Number(desserts.reduce((n, {total}) => n + total, 0).toFixed(1)).toLocaleString() }}-->
<!--                            </h6>-->
<!--                          </td>-->
<!--                        </tr>-->
<!--                        </tbody>-->
<!--                      </template>-->
<!--                    </v-simple-table>-->
<!--                  </b-tab>-->
<!--                </b-tabs>-->
<!--              </v-col>-->
<!--              &lt;!&ndash;          <v-col cols="12" sm="4">&ndash;&gt;-->
<!--              &lt;!&ndash;            <v-autocomplete&ndash;&gt;-->
<!--              &lt;!&ndash;              outlined&ndash;&gt;-->
<!--              &lt;!&ndash;              auto-select-first&ndash;&gt;-->
<!--              &lt;!&ndash;              :items="typeRoom"&ndash;&gt;-->
<!--              &lt;!&ndash;              v-model="typeRoomSelect"&ndash;&gt;-->
<!--              &lt;!&ndash;              @change="getLogStaff"&ndash;&gt;-->
<!--              &lt;!&ndash;              return-object&ndash;&gt;-->
<!--              &lt;!&ndash;              item-text="title"&ndash;&gt;-->
<!--              &lt;!&ndash;              item-value="id"&ndash;&gt;-->
<!--              &lt;!&ndash;              label="ชื่อประเภทห้อง"&ndash;&gt;-->
<!--              &lt;!&ndash;              dense&ndash;&gt;-->
<!--              &lt;!&ndash;              hide-details&ndash;&gt;-->
<!--              &lt;!&ndash;            ></v-autocomplete>&ndash;&gt;-->
<!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
<!--              &lt;!&ndash;          <v-col cols="12" sm="4" v-show="typeRoomSelect.id === 1">&ndash;&gt;-->
<!--              &lt;!&ndash;            <v-autocomplete&ndash;&gt;-->
<!--              &lt;!&ndash;              outlined&ndash;&gt;-->
<!--              &lt;!&ndash;              auto-select-first&ndash;&gt;-->
<!--              &lt;!&ndash;              :items="typeChart"&ndash;&gt;-->
<!--              &lt;!&ndash;              v-model="typeChartSelect"&ndash;&gt;-->
<!--              &lt;!&ndash;              @change="changeType"&ndash;&gt;-->
<!--              &lt;!&ndash;              return-object&ndash;&gt;-->
<!--              &lt;!&ndash;              item-text="name"&ndash;&gt;-->
<!--              &lt;!&ndash;              item-value="id"&ndash;&gt;-->
<!--              &lt;!&ndash;              label="ประเภทผู้ใช้งาน"&ndash;&gt;-->
<!--              &lt;!&ndash;              dense&ndash;&gt;-->
<!--              &lt;!&ndash;              hide-details&ndash;&gt;-->
<!--              &lt;!&ndash;            ></v-autocomplete>&ndash;&gt;-->
<!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
<!--              &lt;!&ndash;          <v-col cols="12" sm="4">&ndash;&gt;-->
<!--              &lt;!&ndash;            <v-menu&ndash;&gt;-->
<!--              &lt;!&ndash;              ref="menu"&ndash;&gt;-->
<!--              &lt;!&ndash;              v-model="menuDate"&ndash;&gt;-->
<!--              &lt;!&ndash;              :close-on-content-click="false"&ndash;&gt;-->
<!--              &lt;!&ndash;              :return-value.sync="date"&ndash;&gt;-->
<!--              &lt;!&ndash;              transition="scale-transition"&ndash;&gt;-->
<!--              &lt;!&ndash;              offset-y&ndash;&gt;-->
<!--              &lt;!&ndash;              max-width="290px"&ndash;&gt;-->
<!--              &lt;!&ndash;              min-width="auto"&ndash;&gt;-->
<!--              &lt;!&ndash;            >&ndash;&gt;-->
<!--              &lt;!&ndash;              <template v-slot:activator="{ on, attrs }">&ndash;&gt;-->
<!--              &lt;!&ndash;                <v-text-field&ndash;&gt;-->
<!--              &lt;!&ndash;                  v-model="date"&ndash;&gt;-->
<!--              &lt;!&ndash;                  outlined&ndash;&gt;-->
<!--              &lt;!&ndash;                  dense&ndash;&gt;-->
<!--              &lt;!&ndash;                  label="เลือกเดือน/ปี"&ndash;&gt;-->
<!--              &lt;!&ndash;                  append-icon="mdi-calendar-outline"&ndash;&gt;-->
<!--              &lt;!&ndash;                  readonly&ndash;&gt;-->
<!--              &lt;!&ndash;                  v-bind="attrs"&ndash;&gt;-->
<!--              &lt;!&ndash;                  v-on="on"&ndash;&gt;-->
<!--              &lt;!&ndash;                ></v-text-field>&ndash;&gt;-->
<!--              &lt;!&ndash;              </template>&ndash;&gt;-->
<!--              &lt;!&ndash;              <v-date-picker&ndash;&gt;-->
<!--              &lt;!&ndash;                :allowed-dates="allowedDates"&ndash;&gt;-->
<!--              &lt;!&ndash;                locale="th"&ndash;&gt;-->
<!--              &lt;!&ndash;                v-model="date"&ndash;&gt;-->
<!--              &lt;!&ndash;                type="month"&ndash;&gt;-->
<!--              &lt;!&ndash;                no-title&ndash;&gt;-->
<!--              &lt;!&ndash;                scrollable&ndash;&gt;-->
<!--              &lt;!&ndash;              >&ndash;&gt;-->
<!--              &lt;!&ndash;                <v-spacer></v-spacer>&ndash;&gt;-->
<!--              &lt;!&ndash;                <v-btn text color="primary" @click="menuDate = false">&ndash;&gt;-->
<!--              &lt;!&ndash;                  Cancel&ndash;&gt;-->
<!--              &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--              &lt;!&ndash;                <v-btn text color="primary" @click="getRoom(date)">&ndash;&gt;-->
<!--              &lt;!&ndash;                  OK&ndash;&gt;-->
<!--              &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--              &lt;!&ndash;              </v-date-picker>&ndash;&gt;-->
<!--              &lt;!&ndash;            </v-menu>&ndash;&gt;-->
<!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
<!--              &lt;!&ndash;          <v-col cols="12" sm="6">&ndash;&gt;-->
<!--              &lt;!&ndash;            <GChart&ndash;&gt;-->
<!--              &lt;!&ndash;              type="ColumnChart"&ndash;&gt;-->
<!--              &lt;!&ndash;              :data="chartData"&ndash;&gt;-->
<!--              &lt;!&ndash;              :options="chartOptions">&ndash;&gt;-->
<!--              &lt;!&ndash;            </GChart>&ndash;&gt;-->
<!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
<!--              &lt;!&ndash;          <v-col cols="12" sm="6">&ndash;&gt;-->
<!--              &lt;!&ndash;            <GChart&ndash;&gt;-->
<!--              &lt;!&ndash;              :type="type"&ndash;&gt;-->
<!--              &lt;!&ndash;              :data="pieChartData"&ndash;&gt;-->
<!--              &lt;!&ndash;              :options="pieChartOptions"&ndash;&gt;-->
<!--              &lt;!&ndash;            />&ndash;&gt;-->
<!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
<!--              &lt;!&ndash;          <v-col cols="12">&ndash;&gt;-->
<!--              &lt;!&ndash;            <GChart type="BarChart" :data="data" :options="options"/>&ndash;&gt;-->
<!--              &lt;!&ndash;          </v-col>&ndash;&gt;-->
<!--            </v-row>-->
<!--          </v-card>-->
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
<style src="./index.css"/>
