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
          <head-bar :title="headTitle" :callback="openItem"/>
          <v-col>
            <table style="width:100%">
              <thead>
              <tr>
                <th v-for="(item, i) in tableHead" :key="i" :class="item.text"
                    style="color: #846537" class="pl-3"
                    :width="item.width">{{ item.title }}
                </th>
                <th width="120px" style="background-color: #f3f1ed;">
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in desserts.data" :key="index">
                <td class="pr-0">
                  <div class="rounded-cell">{{ item.budget.name }}</div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">
                    {{ item.branch.title }}
                  </div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">
                    {{ item.employee.name }}
                  </div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">
                    {{ convert.money(item.total) }}
                  </div>
                </td>
                <td class="pl-0 pr-0" style="min-width: 150px">
                  <div class="rounded-cell-center">
                    {{ convert.datetime(item.created_at) }}
                  </div>
                </td>
                <td>
                  <div class="rounded-cell-right" align="right">
                    <v-btn fab small text @click="openItem(item)">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="3">รายการทั้งหมด {{ desserts.meta.to }}/{{ desserts.meta.total }} รายการ</td>
                <td colspan="3">
                  <div style="float: right;">
                    <v-pagination
                      v-model="page"
                      :length="desserts.meta.last_page"
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
            <div class="text-center">
              <v-dialog v-model="dialog" persistent width="786">
                <v-form ref="form" v-model="valid">
                  <v-card style="border-radius: 15px">
                    <v-card-title>
                      <h5 class="m-0" style="color: #5B4840">เพิ่ม / แก้ไขร้านค้า</h5>
                      <v-spacer/>
                      <v-btn icon @click="dialog = false">
                        <v-icon color="#5B4840">mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-card-text class="p-3" style="background: #F6F6F6" align="center">
                      <v-autocomplete
                        outlined
                        auto-select-first
                        :items="branch"
                        v-model="branchSelect"
                        hide-no-data
                        hide-selected
                        return-object
                        label="ชื่อร้าน"
                        dense
                        item-text="title"
                        item-value="id"
                        :rules="rules" required
                        style="border-radius: 15px"
                      ></v-autocomplete>
                      <v-autocomplete
                        outlined
                        auto-select-first
                        :items="instead"
                        v-model="insteadSelect"
                        hide-no-data
                        hide-selected
                        return-object
                        label="ชื่อรายการ"
                        dense
                        item-text="name"
                        item-value="id"
                        :rules="rules" required
                        style="border-radius: 15px"
                      ></v-autocomplete>
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
                        :rules="rules" required
                        style="border-radius: 15px"
                      ></v-autocomplete>
                      <v-btn-toggle rounded dense v-model="typeTotalSelect" style="width: 100%;" class="mb-3"
                                    color="#6E4C2E"
                                    background-color="#ECE6E0">
                        <v-btn style="width: 50%;">
                          รวมยอดแล้ว
                        </v-btn>
                        <v-btn style="width: 50%;">
                          ยังไม่รวมยอด
                        </v-btn>
                      </v-btn-toggle>
                      <v-card class="ml-0 mr-0 p-3" v-if="typeTotalSelect == 0" style="border-radius: 15px">
                        <v-text-field label="ยอด" v-model="total" outlined dense type="number"></v-text-field>
                      </v-card>
                      <v-row class="m-0" v-else>
                        <v-col cols="12" sm="12" class="p-0">
                          <v-card style="border-radius: 15px">
                            <v-row class="m-0">
                              <v-col cols="12" sm="6" class="pb-0">
                                <v-text-field prepend-icon="mdi-cash-multiple" outlined v-model="money.val1"
                                              label="แบงค์ 1,000 จำนวน" dense style="border-radius: 15px"
                                              type="number"
                                              counter="10"/>
                                <v-text-field outlined v-model="money.val2" label="แบงค์ 500 จำนวน" dense type="number"
                                              style="border-radius: 15px"
                                              color="#913FE2"/>
                                <v-text-field outlined v-model="money.val3" label="แบงค์ 100 จำนวน" dense type="number"
                                              style="border-radius: 15px"
                                />
                                <v-text-field outlined v-model="money.val4" label="แบงค์ 50 จำนวน" dense type="number"
                                              style="border-radius: 15px"
                                />
                                <v-text-field outlined v-model="money.val5" label="แบงค์ 20 จำนวน" dense type="number"
                                              style="border-radius: 15px"
                                />
                              </v-col>
                              <v-col cols="12" sm="6" class="pb-0">
                                <v-text-field outlined v-model="money.val6" label="เหรียญ 10 จำนวน" dense
                                              type="number" style="border-radius: 15px"/>
                                <v-text-field outlined v-model="money.val7" label="เหรียญ 5 จำนวน" dense type="number"
                                              style="border-radius: 15px"/>
                                <v-text-field outlined v-model="money.val8" label="เหรียญ 2 จำนวน" dense type="number"
                                              style="border-radius: 15px"/>
                                <v-text-field outlined v-model="money.val9" label="เหรียญ 1 จำนวน" dense type="number"
                                              style="border-radius: 15px"/>
                              </v-col>
                              <v-row class="p-0 m-0 ml-3 mb-3 align-items-center">
                                <strong class="m-0" style="font-size: 20px">รวม : </strong>
                                <h2 class="m-0"> {{ convert.money(calculat) }} บาท</h2>
                              </v-row>
                            </v-row>
                          </v-card>
                        </v-col>
                      </v-row>
                      <v-btn color="#B27D41" @click="confirm" dark rounded width="340" class="mb-2 mt-4">
                        ตกลง
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-form>
              </v-dialog>
            </div>
          </v-col>
          <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style src="../../pos/product/index.css"/>
<script src="./index.js"/>
