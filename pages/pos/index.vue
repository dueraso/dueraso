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
          <v-row class="m-0">
            <!--            list-->
            <v-col cols="12" md="8" class="d-none d-sm-flex">
              <v-card class="p-3">
                <!--                tags-->
                <v-row class="mb-0">
                  <h4 class="m-2 pl-1 pt-0 pb-1 truncate1" style="color: #54b6c8">ร้าน {{ branch }}</h4>
                  <v-col cols="12" sm="10" md="6" class="m-0  p-0">
                    <v-sheet class="p-0 m-0 ml-3 mr-3 ml-lg-0 mr-lg-0">
                      <v-chip-group mandatory active-class="primary--text">
                        <v-chip @click="getData()">
                          ทั้งหมด
                        </v-chip>
                        <v-chip v-for="(tag,i) in tags.data" :key="i" @click="getData(tag.id)">
                          {{ tag.name }}
                        </v-chip>
                      </v-chip-group>
                    </v-sheet>
                  </v-col>
                  <v-text-field
                    label="ค้นหาชื่อ" dense hide-details outlined append-icon="mdi-magnify"
                    class="mr-3 ml-3 ml-lg-0 mb-3 mb-lg-0"/>
                </v-row>
                <!--content-->
                <div style="height: 80dvh; overflow-y: auto;">
                  <v-row dense>
                    <v-col v-for="(card, i) in cards.data" :key="i" cols="6" md="3" sm="2" xl="2">
                      <v-card style="border-radius:10px">
                        <a @click="addOrder(card)">
                          <v-img
                            :src="card.imageUrl"
                            class="white--text align-end"
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            height="200px" style="border-radius:10px"
                          >
                            <h5 class="p-1 m-0">{{ card.name }}</h5>
                            <h6 class="p-1 m-0">
                              <v-icon dark>mdi-tag-outline</v-icon>
                              {{ card.price }} บ.
                            </h6>
                          </v-img>
                        </a>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
                <!--                discount-->
                <v-row class="mt-2">
                  <v-col md="3" cols="6" xl="2" v-for="(item, i) in discount.data" :key="i">
                    <v-card height="50px" class="col text-center" @click="addDiscount(item)"
                            :disabled="discountSel.length > 0">
                      <v-icon>mdi-ticket-percent-outline
                      </v-icon>
                      {{ item.name }}
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <!--            order-->
            <v-col>
              <v-card class="p-3">
                <v-row class="mb-0">
                  <h4 class="m-2 pl-1 pt-0 pb-1 truncate d-sm-none" style="color: #54b6c8">ร้าน {{ branch }}</h4>
                  <p class="m-2 pl-1 pt-1 pb-1 d-none d-sm-flex">รายการที่เลือก</p>
                  <v-spacer/>
                  <v-btn outlined class="m-2 d-sm-none align-self-center">เพิ่ม</v-btn>
                </v-row>
                <v-simple-table fixed-header height="60dvh">
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th v-for="(item, i) in tableHead" :key="i" :class="item.text" style="font-size: 14px"
                          :width="item.width">
                        {{ item.title }}
                      </th>
                      <th width="20">
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in desserts" :key="index">
                      <td>{{ item.name }}</td>
                      <td>
                        {{ item.total }}
                      </td>
                      <td class="text-right">{{ convert.money(item.price) }}</td>
                      <td class="p-0 text-right">
                        <v-btn fab small text @click="removeOrder(item)">
                          <v-icon>mdi-close</v-icon>
                        </v-btn>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>

              <v-card class="mt-3 p-3">
                <p class="m-0">คูปองส่วนลด</p>
                <v-simple-table fixed-header>
                  <template v-slot:default>
                    <tbody>
                    <tr v-for="(item, i) in discountSel" :key="i">
                      <td colspan="2">
                        {{ item.name }}
                      </td>
                      <!--                      <td width="15%">-->
                      <!--                        {{item.total}}-->
                      <!--                      </td>-->
                      <td class="text-right" width="20%">
                        -{{ discountTotal }}
                      </td>
                      <td width="20px">
                        <v-icon @click="removeDiscount(item)">mdi-close</v-icon>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
                <v-divider></v-divider>

                <p class="m-0">สรุปยอด</p>
                <v-row>
                  <v-col md="3">
                    <h4 class="m-0">รวม</h4>
                  </v-col>
                  <v-col>
                    <h4 class="m-0">{{ convert.calculateArray(this.desserts) }}</h4>
                  </v-col>
                  <v-col class="text-right">
                    <h3 class="m-0">{{ convert.money(priceTotal) }}</h3>
                  </v-col>
                  <v-btn color="primary" x-large block @click="pay" :disabled="priceTotal === 0.00">
                    <v-icon>
                      mdi-cash-multiple
                    </v-icon>
                    ชำระ
                  </v-btn>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          <v-dialog v-model="dialog" width="500">
            <v-card>
              <v-card-title class="text-h5 grey lighten-2">
                กรุณาเลือกสาขาที่ต้องการ
              </v-card-title>

              <v-card-text class="pt-6 pb-0">
                <v-autocomplete
                  v-model="branchSelect"
                  :items="branchList.data"
                  outlined
                  dense
                  label="เลือกสาขา"
                  return-object
                  item-value="id"
                  item-text="title"
                  @change="convertBranchSelect"
                ></v-autocomplete>
              </v-card-text>

              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" text @click="dialog = false">
                  ตกลง
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogPay" width="800" transition="dialog-bottom-transition" persistent>
            <v-card>
              <v-toolbar dark color="#54b6c8">
                <v-spacer></v-spacer>
                <v-btn icon dark @click="dialogCancelPay = true">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
                <!--                <v-toolbar-title>ชำระ</v-toolbar-title>-->
<!--                <v-btn outlined @click="dialog = false">-->
<!--                  <v-icon>mdi-content-save-all-outline</v-icon>-->
<!--                  บันทึก-->
<!--                </v-btn>-->
              </v-toolbar>
              <v-row class="m-0">
                <v-col>
                  <v-card elevation="4" class="mb-3">
                    <v-row class="m-0">
                      <v-col>
                        <v-col align-self="center">
                          <h5 align="center">ยอดรวม</h5>
                          <h3 align="center">{{ convert.money(this.priceTotal) }}</h3>
                        </v-col>
                      </v-col>
                      <v-divider vertical/>
                      <v-col align-self="center">
                        <h5 align="center">เงินทอน</h5>
                        <h1 align="center" style="color: #38857d">{{ convert.money(changeMoney) }}</h1>
                      </v-col>
                    </v-row>
                  </v-card>
                  <v-card elevation="4" class="row m-0 align-content-center">
                    <v-col align="center" class="pb-0">
                      <v-img src="PromptPay.jpg" width="200" class="m-0"></v-img>
                    </v-col>
                    <v-col class="pt-0 pb-0">
                      <div v-html="qr"/>
                    </v-col>

                    <v-col class="pt-0">
                      <v-btn block color="primary" x-large>บันทึกพร้อมเพย์</v-btn>
                    </v-col>
                  </v-card>
                </v-col>
                <v-col>
                  <v-card elevation="4">
                    <v-tabs color="deep-purple" fixed-tabs slider-color="#54b6c8">
                      <v-tab style="color: #54b6c8">เงินสด</v-tab>
                      <!--                      <v-tab>พร้อมเพร์</v-tab>-->
                      <v-tab-item>
                        <v-container fluid>
                          <v-card height="100" class="ml-2 mr-2">
                            <v-row class="m-0 fill-height">
                              <v-icon x-large>mdi-currency-thb</v-icon>
                              <v-col class="m-0 p-0">
                                <p class="m-0 text-right mr-2" style="font-size: 60px;">{{ cash }}</p>
                              </v-col>
                            </v-row>
                          </v-card>
                          <!--                          <v-text-field outlined hide-details hide-spin-buttons prepend-inner-icon="mdi-currency-thb"-->
                          <!--                                        class="pl-3 pr-3 my-large-input-field px-15" v-model="cash" label="รับมา" height="100"/>-->
                          <v-row class="m-0">
                            <v-col v-for="(item, i) in price" :key="i" cols="4">
                              <v-btn outlined block x-large @click="getCash(item)">
                                {{ item }}
                              </v-btn>
                            </v-col>
                          </v-row>
                          <v-row class="m-0">
                            <v-col cols="8">
                              <v-row>
                                <v-col cols="4" v-for="(item, i) in 9" :key="i">
                                  <v-btn block height="60" x-large @click="sumChange(item)">
                                    <h2>{{ item }}</h2>
                                  </v-btn>
                                </v-col>
                                <v-col cols="4">
                                  <v-btn block height="60" x-large width="66.6" @click="sumChange('00')">
                                    <h2>00</h2>
                                  </v-btn>
                                </v-col>
                                <v-col cols="4">
                                  <v-btn block height="60" x-large @click="sumChange('0')">
                                    <h2>0</h2>
                                  </v-btn>
                                </v-col>
                                <v-col cols="4">
                                  <v-btn block height="60" x-large width="66.6" @click="sumChange('.')">
                                    <h2>.</h2>
                                  </v-btn>
                                </v-col>
                              </v-row>
                            </v-col>

                            <v-col>
                              <v-row class="m-0">
                                <v-btn block height="200px" @click="sumChange('',true)">
                                  <v-icon x-large>
                                    mdi-backspace-outline
                                  </v-icon>
                                </v-btn>
                                <v-btn block height="100px" class="mt-4" x-large @click="getCash(0, false)">
                                  <h1>C</h1>
                                </v-btn>
                              </v-row>
                            </v-col>

                            <v-col class="pt-0 pb-0">
                              <v-btn block color="primary" x-large>บันทึกเงินสด</v-btn>
                            </v-col>
                          </v-row>
                        </v-container>
                      </v-tab-item>
                    </v-tabs>
                  </v-card>
                </v-col>
              </v-row>
            </v-card>
          </v-dialog>

          <v-dialog v-model="dialogCancelPay" width="500">
            <v-card>
              <v-row align="right" class="m-0 pt-3 pr-3">
                <v-spacer/>
                <v-btn icon @click="dialogCancelPay = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-row>
              <v-col>
                <h5 align="center" style="padding-bottom: 24px; padding-top: 12px">
                  คุณต้องการยกเลิกการชำระใช่หรือไม่
                </h5>
                <v-row style="margin: 0">
                  <v-col
                    align="center" style="padding: 0" class="pb-2">
                    <v-btn dark small color="#54b6c8" @click="confirmClose">
                      ยืนยัน
                    </v-btn>
                  </v-col>
                </v-row>
              </v-col>
            </v-card>
          </v-dialog>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
.truncate {
  max-width: 70%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.truncate1 {
  max-width: 25%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.my-large-input-field {
  font-size: 3em;
}
</style>
<script src="./index.js"/>
