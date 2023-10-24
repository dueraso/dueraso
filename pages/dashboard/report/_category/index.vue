<template>
  <div id="app">
    <v-main>
      <v-card elevation="0">
        <v-card-title style="margin: 12px; background-color: #EEF7F6;">
          <v-row style="padding: 12px">
            <h4 style="align-self: center; color: #2096f3; font-size: 20px">
              รายงานผู้ใช้งาน
            </h4>
          </v-row>
        </v-card-title>
        <v-row style="padding: 12px">
          <v-col cols="12" sm="4">
            <v-autocomplete
              outlined
              auto-select-first
              :items="typeRoom"
              v-model="typeRoomSelect"
              @change="getLogStaff"
              return-object
              item-text="title"
              item-value="id"
              label="ชื่อประเภทห้อง"
              dense
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4" v-show="typeRoomSelect.id === 1">
            <v-autocomplete
              outlined
              auto-select-first
              :items="typeChart"
              v-model="typeChartSelect"
              @change="changeType"
              return-object
              item-text="name"
              item-value="id"
              label="ประเภทผู้ใช้งาน"
              dense
              hide-details
            ></v-autocomplete>
          </v-col>
          <v-col cols="12" sm="4">
            <v-menu
              ref="menu"
              v-model="menuDate"
              :close-on-content-click="false"
              :return-value.sync="date"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  v-model="date"
                  outlined
                  dense
                  label="เลือกเดือน/ปี"
                  append-icon="mdi-calendar-outline"
                  readonly
                  v-bind="attrs"
                  v-on="on"
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker
                :allowed-dates="allowedDates"
                locale="th"
                v-model="date"
                type="month"
                no-title
                scrollable
              >
                <v-spacer></v-spacer>
                <v-btn text color="primary" @click="menuDate = false">
                  ยกเลิก
                </v-btn>
                <v-btn text color="primary" @click="getRoom(date)">
                  ตกลง
                </v-btn>
              </v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12">
            <b-tabs align="left">
              <b-tab title="กราฟ" active @click="getLogStaff">
                <v-row>
                  <v-col cols="12" sm="6">
                    <GChart
                      type="ColumnChart"
                      :data="chartData"
                      :options="chartOptions">
                    </GChart>
                  </v-col>
                  <v-col cols="12" sm="6">
                    <GChart
                      :type="type"
                      :data="pieChartData"
                      :options="pieChartOptions"
                    />
                  </v-col>
                  <v-col cols="12">
                    <GChart type="BarChart" :data="data" :options="options"/>
                  </v-col>
                </v-row>
              </b-tab>
              <b-tab title="ตาราง" @click="getLogStaff">
                <v-col style="background-color: #EEF7F6;" class="mt-3">
                  <h6 class="mb-0" style="color: #2196f3">ตาราง{{ chartOptions.title }}</h6>
                </v-col>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th class="text-left" style="color: #2196f3; font-size: 16px" v-for="(item, i) in headerTable"
                          :key="i" :width="item.width">
                        {{ item.name }}
                      </th>
                      <th class="text-left" style="color: #2196f3; font-size: 16px">
                        จำนวน
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, i) in desserts" :key="i">
                      <td>{{ i + 1 }}</td>
                      <td>{{ item.master_department_name }}</td>
                      <td>{{ item.small }}</td>
                      <td>{{ item.medium }}</td>
                      <td>{{ item.big }}</td>
                      <td>{{ Number(item.total.toFixed(1)).toLocaleString() }}</td>
                    </tr>
                    <tr>
                      <td colspan="2">
                        <h6>รวม</h6>
                      </td>
                      <td>
                        <h6>
                          {{ desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {small}) => n + small, 0).toFixed(1)).toLocaleString() }}
                        </h6>
                      </td>
                      <td>
                        <h6>
                          {{
                            desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {medium}) => n + medium, 0).toFixed(1)).toLocaleString()
                          }}
                        </h6>
                      </td>
                      <td>
                        <h6>
                          {{
                            desserts.map(d => Object.keys(d).length).indexOf(2) > -1 ? "" : Number(desserts.reduce((n, {big}) => n + big, 0).toFixed(1)).toLocaleString()
                          }}
                        </h6>
                      </td>
                      <td>
                        <h6>
                          {{ Number(desserts.reduce((n, {total}) => n + total, 0).toFixed(1)).toLocaleString() }}
                        </h6>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </b-tab>
            </b-tabs>
          </v-col>
          <!--          <v-col cols="12" sm="4">-->
          <!--            <v-autocomplete-->
          <!--              outlined-->
          <!--              auto-select-first-->
          <!--              :items="typeRoom"-->
          <!--              v-model="typeRoomSelect"-->
          <!--              @change="getLogStaff"-->
          <!--              return-object-->
          <!--              item-text="title"-->
          <!--              item-value="id"-->
          <!--              label="ชื่อประเภทห้อง"-->
          <!--              dense-->
          <!--              hide-details-->
          <!--            ></v-autocomplete>-->
          <!--          </v-col>-->
          <!--          <v-col cols="12" sm="4" v-show="typeRoomSelect.id === 1">-->
          <!--            <v-autocomplete-->
          <!--              outlined-->
          <!--              auto-select-first-->
          <!--              :items="typeChart"-->
          <!--              v-model="typeChartSelect"-->
          <!--              @change="changeType"-->
          <!--              return-object-->
          <!--              item-text="name"-->
          <!--              item-value="id"-->
          <!--              label="ประเภทผู้ใช้งาน"-->
          <!--              dense-->
          <!--              hide-details-->
          <!--            ></v-autocomplete>-->
          <!--          </v-col>-->
          <!--          <v-col cols="12" sm="4">-->
          <!--            <v-menu-->
          <!--              ref="menu"-->
          <!--              v-model="menuDate"-->
          <!--              :close-on-content-click="false"-->
          <!--              :return-value.sync="date"-->
          <!--              transition="scale-transition"-->
          <!--              offset-y-->
          <!--              max-width="290px"-->
          <!--              min-width="auto"-->
          <!--            >-->
          <!--              <template v-slot:activator="{ on, attrs }">-->
          <!--                <v-text-field-->
          <!--                  v-model="date"-->
          <!--                  outlined-->
          <!--                  dense-->
          <!--                  label="เลือกเดือน/ปี"-->
          <!--                  append-icon="mdi-calendar-outline"-->
          <!--                  readonly-->
          <!--                  v-bind="attrs"-->
          <!--                  v-on="on"-->
          <!--                ></v-text-field>-->
          <!--              </template>-->
          <!--              <v-date-picker-->
          <!--                :allowed-dates="allowedDates"-->
          <!--                locale="th"-->
          <!--                v-model="date"-->
          <!--                type="month"-->
          <!--                no-title-->
          <!--                scrollable-->
          <!--              >-->
          <!--                <v-spacer></v-spacer>-->
          <!--                <v-btn text color="primary" @click="menuDate = false">-->
          <!--                  Cancel-->
          <!--                </v-btn>-->
          <!--                <v-btn text color="primary" @click="getRoom(date)">-->
          <!--                  OK-->
          <!--                </v-btn>-->
          <!--              </v-date-picker>-->
          <!--            </v-menu>-->
          <!--          </v-col>-->
          <!--          <v-col cols="12" sm="6">-->
          <!--            <GChart-->
          <!--              type="ColumnChart"-->
          <!--              :data="chartData"-->
          <!--              :options="chartOptions">-->
          <!--            </GChart>-->
          <!--          </v-col>-->
          <!--          <v-col cols="12" sm="6">-->
          <!--            <GChart-->
          <!--              :type="type"-->
          <!--              :data="pieChartData"-->
          <!--              :options="pieChartOptions"-->
          <!--            />-->
          <!--          </v-col>-->
          <!--          <v-col cols="12">-->
          <!--            <GChart type="BarChart" :data="data" :options="options"/>-->
          <!--          </v-col>-->
        </v-row>
      </v-card>
    </v-main>
  </div>
</template>
<script src="./index.js"/>
