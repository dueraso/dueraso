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
          <head-bar :title="headTitle" :callback="openItem" per="add.add-budget"/>
          <v-col>
            <div style=" overflow-x:auto;">
              <table style="width:100%">
                <thead>
                <tr>
                  <th v-for="(item, i) in tableHead" :key="i"
                      style="color: #846537;" class="pl-3"
                      :width="item.width">{{ item.title }}
                  </th>
                  <th width="120px" style="background-color: #f3f1ed;">
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.data" :key="index" class="rounded-cell-all">
                  <td class="pr-0" style="min-width: 150px">
                    {{ item.budget.name }}
                  </td>
                  <td class="pl-0 pr-0" style="min-width: 100px">
                    {{ item.branch.title }}
                  </td>
                  <td class="pl-0 pr-0" style="min-width: 80px">
                    {{ item.employee.name }}
                  </td>
                  <td class="pl-0 pr-0" style="min-width: 100px">
                    {{ convert.money(item.total) }}
                  </td>
                  <td class="pl-0 pr-0" style="min-width: 150px">
                    {{ convert.datetime(item.summary_at) }}
                  </td>
                  <td align="right" style="min-width: 100px">
                    <v-btn fab small text @click="openItem(item)" v-role-or-permission="`super|edit.add-budget`">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`super|delete.add-budget`">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
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
            </div>
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
                      <v-row>
                        <v-col>
                          <v-autocomplete
                            outlined auto-select-first :items="branch" v-model="branchSelect"
                            hide-no-data hide-selected return-object label="ชื่อสาขา/ออกงาน/ไลฟ์สด" dense
                            item-text="title"
                            item-value="id" :rules="rules" required style="border-radius: 15px"
                            :disabled="!$gates.hasAnyRole('admin|super')"
                          ></v-autocomplete>
                        </v-col>
                        <v-col v-if="checkType()">
                          <v-autocomplete
                            outlined
                            auto-select-first
                            :items="provinceItems"
                            v-model="provinceSelect"
                            hide-no-data
                            hide-selected
                            return-object
                            label="จังหวัดที่ออกงาน"
                            dense
                            item-text="name"
                            item-value="id"
                            :rules="rules" required
                            style="border-radius: 15px"
                          ></v-autocomplete>
                        </v-col>
                      </v-row>
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
                        outlined auto-select-first :items="users" v-model="usersSelect" hide-no-data
                        hide-selected return-object label="ชื่อผู้ขาย" dense item-text="name"
                        item-value="id" :rules="rules" required style="border-radius: 15px"
                        :disabled="!$gates.hasAnyRole('admin|super')"
                      ></v-autocomplete>

                      <v-row class="m-0" v-if="Object.keys(item).length === 0"
                             v-show="$gates.hasAnyRole('admin|super')">
                        <v-checkbox v-model="enabled" hide-details class="mr-2 mt-0" label="บันทึกย้อนหลัง">
                        </v-checkbox>
                        <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                          <template v-slot:activator="{ on, attrs }">
                            <v-text-field
                              v-model="date" label="วันที่" append-icon="mdi-calendar" readonly
                              v-bind="attrs" v-on="on" color="#b27d41" outlined
                              dense :disabled="!enabled" style="border-radius: 15px"/>
                          </template>
                          <v-date-picker v-model="date" scrollable locale="th-th" color="#b27d41">
                            <v-spacer></v-spacer>
                            <v-btn text color="#b27d41" @click="modal = false">
                              Cancel
                            </v-btn>
                            <v-btn text color="#b27d41" @click="$refs.dialog.save(date)">
                              OK
                            </v-btn>
                          </v-date-picker>
                        </v-dialog>
                      </v-row>
                      <v-btn-toggle
                        rounded dense v-model="typeTotalSelect" style="width: 100%;" class="mb-3"
                        color="#6E4C2E" background-color="#ECE6E0">
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
                              <v-col cols="12" sm="6" class="p-4 pb-0">
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" x-large>mdi-cash-multiple</v-icon>
                                  <v-text-field
                                    outlined v-model="money.val1"
                                    hide-details
                                    label="แบงค์ 1,000 จำนวน" dense style="border-radius: 15px"
                                    type="number"/>
                                </v-row>
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" color="#913FE2" x-large>mdi-cash-multiple</v-icon>
                                  <v-text-field
                                    outlined v-model="money.val2" label="แบงค์ 500 จำนวน" dense type="number"
                                    style="border-radius: 15px"
                                    hide-details
                                    color="#913FE2"/>
                                </v-row>
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" color="#DC5A5A" x-large>mdi-cash-multiple</v-icon>
                                  <v-text-field
                                    outlined v-model="money.val3" label="แบงค์ 100 จำนวน" dense type="number"
                                    style="border-radius: 15px" hide-details
                                  />
                                </v-row>
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" color="#6199EE" x-large>mdi-cash-multiple</v-icon>
                                  <v-text-field
                                    outlined v-model="money.val4" label="แบงค์ 50 จำนวน" dense type="number"
                                    style="border-radius: 15px" hide-details
                                  />
                                </v-row>
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" color="#5FC84B" x-large>mdi-cash-multiple</v-icon>
                                  <v-text-field
                                    outlined v-model="money.val5" label="แบงค์ 20 จำนวน" dense type="number"
                                    style="border-radius: 15px" hide-details
                                  />
                                </v-row>
                              </v-col>
                              <v-col cols="12" sm="6" class="p-4 pb-0">
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" color="#FFC043" x-large>mdi-bitcoin</v-icon>
                                  <v-text-field
                                    hide-details outlined v-model="money.val6" label="เหรียญ 10 จำนวน" dense
                                    type="number" style="border-radius: 15px"/>
                                </v-row>
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" color="#959595" x-large>mdi-bitcoin</v-icon>
                                  <v-text-field
                                    hide-details outlined v-model="money.val7" label="เหรียญ 5 จำนวน" dense
                                    type="number"
                                    style="border-radius: 15px"/>
                                </v-row>
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" color="#CFBB6A" x-large>mdi-bitcoin</v-icon>
                                  <v-text-field
                                    hide-details outlined v-model="money.val8" label="เหรียญ 2 จำนวน" dense
                                    type="number"
                                    style="border-radius: 15px"/>
                                </v-row>
                                <v-row class="m-0 pb-7">
                                  <v-icon class="pr-3" color="#535353" x-large>mdi-bitcoin</v-icon>
                                  <v-text-field
                                    hide-details outlined v-model="money.val9" label="เหรียญ 1 จำนวน" dense
                                    type="number"
                                    style="border-radius: 15px"/>
                                </v-row>
                              </v-col>
                              <v-row class="p-0 m-0 ml-7 mb-3 align-items-center">
                                <p class="m-0" style="font-size: 20px; font-weight: 600; color: #5B4840">รวมยอด : </p>
                                <h2 class="m-0 pl-4" style="color: #5B4840"> {{ convert.money(calculat) }} บาท</h2>
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
<style scoped src="../../pos/product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
<style>
.v-input--hide-details > .v-input__control > .v-input__slot {
  margin-bottom: 0;
}
</style>
<script src="./index.js"/>
