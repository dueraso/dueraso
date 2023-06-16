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
          <v-row class="pa-3 mt-1" style="background: #eef7f6">
            <h5 class="mb-0 ml-4" style="color: #00000080">
              <v-icon x-large>mdi-clipboard-edit-outline</v-icon>
              รายรับ-รายจ่าย
            </h5>
            <v-spacer/>
            <v-btn outlined @click="openItem({})" class="mr-3" v-show="myUtils('create', $route.fullPath)">
              <v-icon>mdi-plus</v-icon>
              เพิ่ม
            </v-btn>
          </v-row>
          <v-col>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                <tr>
                  <th v-for="(item, i) in tableHead" :key="i" class="text-left" style="font-size: 14px"
                      :width="item.width">{{ item.title }}
                  </th>
                  <th width="120">
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.data" :key="index">
                  <td>{{ item.title }}</td>
                  <td>{{ item.detail }}</td>
                  <td>{{ item.address }}</td>
                  <td class="p-0 text-right">
                    <v-btn fab small text @click="openItem(item)" v-show="myUtils('update', $route.fullPath)">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)" v-show="myUtils('delete', $route.fullPath)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="text-center">
              <v-dialog v-model="dialog" persistent>
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2 mb-3">
                    Privacy Policy
                  </v-card-title>

                  <v-card-text class="row">
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        outlined
                        auto-select-first
                        :items="instead"
                        v-model="insteadSelect"
                        hide-no-data
                        hide-selected
                        return-object
                        label="ชื่อร้าน"
                        dense
                        item-text="name"
                        item-value="id"
                      ></v-autocomplete>
                    </v-col>
                    <v-col cols="12" sm="6">
                      <v-autocomplete
                        outlined
                        auto-select-first
                        :items="users"
                        v-model="usersSelect"
                        hide-no-data
                        hide-selected
                        return-object
                        label="ชื่อผู้ขาย"
                        dense
                        item-text="name"
                        item-value="id"
                      ></v-autocomplete>
                    </v-col>
                    <div class="col-12 m-0 p-0">
                      <v-divider/>
                    </div>
                    <v-col cols="12" sm="6">
                      <v-row>
                        <v-col cols="12" sm="6">
                          <v-text-field outlined v-model="money.val1" label="แบงค์ 1,000 จำนวน" dense type="number" hide-details/>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field outlined v-model="money.val2" label="แบงค์ 500 จำนวน" dense type="number" hide-details/>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field outlined v-model="money.val3" label="แบงค์ 100 จำนวน" dense type="number" hide-details/>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field outlined v-model="money.val4" label="แบงค์ 50 จำนวน" dense type="number" hide-details/>
                        </v-col>
                        <v-col cols="12" sm="6">
                          <v-text-field outlined v-model="money.val5" label="แบงค์ 20 จำนวน" dense type="number" hide-details/>
                        </v-col>
                      </v-row>
                    </v-col>
                    <v-divider vertical/>
                    <v-col cols="12" sm="6">
                      <v-row>
                        <v-col cols="12" sm="3">
                          <v-text-field outlined v-model="money.val6" label="เหรียญ 10 จำนวน" dense type="number" hide-details/>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field outlined v-model="money.val7" label="เหรียญ 5 จำนวน" dense type="number" hide-details/>
                        </v-col>
                        <v-col cols="12" sm="3">
                          <v-text-field outlined v-model="money.val8" label="เหรียญ 1 จำนวน" dense type="number" hide-details/>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-card-text>

                  <v-divider></v-divider>
                  <p>รวม : {{calculat}}</p>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="confirm">
                      ok
                    </v-btn>
                    <v-btn color="primary" text @click="dialog = false">
                      cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
