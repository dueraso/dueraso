<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading" style="background-color: #F3F1ED">
          <v-row class="m-0">
            <!--            list-->
            <v-col cols="12" md="8">
<!--                   class="d-none d-sm-flex">-->
              <!--              <div class="p-3">-->
              <!--                tags-->
              <v-row class="mt-0 pb-4">
                <img style="height: 50px" src="/line.png" alt="line">
                <v-col class="p-0" >
                  <h4 class="m-2 pl-1 pt-0 pb-1" style="color: #5B4840">ร้าน {{ branch.name }}</h4>
                </v-col>
                  <div style=" width: 200px">
                <v-text-field
                  label="ค้นหาชื่อ" dense hide-details outlined prepend-inner-icon="mdi-magnify"
                  class="m-0 p-0" style="border-radius: 15px;"/>
                  </div>
              </v-row>
              <v-row class="m-0">
                <div style="height: 80dvh; overflow-y: auto;">
                  <v-col md="12" class="m-0 p-0">
                    <v-sheet class="p-0 m-0 ml-3 mr-3 ml-lg-0 mr-lg-0 pb-2"
                             style="background-color: rgba(255,255,255,0)">
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
                  <v-row dense>
                    <v-col v-for="(card, i) in cards.data" :key="i" cols="6" md="3" sm="2" xl="2">
                      <v-card style="border-radius:10px">
                        <a @click="addOrder(card)">
                          <v-img
                            :src="card.imageUrl === null?null:JSON.parse(card.imageUrl).fullPath"
                            class="white--text align-end"
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            height="200px" style="border-radius:10px"
                          >
                            <h5 class="p-1 m-0">{{ card.name }}</h5>
                            <h6 class="p-1 m-0">
                              <v-icon dark>mdi-tag-outline</v-icon>
                              {{ card.price }} บาท
                            </h6>
                          </v-img>
                        </a>
                      </v-card>
                    </v-col>
                  </v-row>
                </div>
              </v-row>
            </v-col>
            <!--            order-->
            <v-col>
              <v-row class="m-0">
                <v-col md="3" cols="6" xl="2" v-for="(item, i) in discount.data" :key="i" class="mt-0 p-0 pb-2">
                  <v-card class="m-1 p-1 text-center" @click="addDiscount(item)" style="border-radius: 21px"
                          :disabled="discountSel.length > 0">
                    <v-icon>mdi-ticket-percent-outline
                    </v-icon>
                    {{ item.name }}
                  </v-card>
                </v-col>
              </v-row>
              <v-card class="p-3 mb-3" style="border-radius: 15px">
                <v-row class="mb-0">
                  <!--                  <h4 class="m-2 pl-1 pt-0 pb-1 truncate d-sm-none" style="color: #54b6c8">ร้าน {{ branch.name }}</h4>-->
                  <h4 class="m-2 pl-1 pb-1 d-none d-sm-flex" style="color: #846537">รายการที่เลือก</h4>
                  <v-spacer/>
                  <v-btn outlined class="m-2 d-sm-none align-self-center">เพิ่ม</v-btn>
                </v-row>
                <v-divider class="m-0"/>
                <v-simple-table fixed-header height="50dvh">
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
                <v-divider class="m-0"/>
                <p class="m-0">คูปองส่วนลด</p>
                <v-simple-table fixed-header>
                  <template v-slot:default>
                    <tbody>
                    <tr v-for="(item, i) in discountSel" :key="i">
                      <td colspan="2">
                        {{ item.name }}
                      </td>
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
                <v-divider class="mt-0"/>
                <v-row>
                  <v-col md="7">
                    <h4 class="m-0" style="color: #846537">
                      <u>สรุปยอดรวม</u>
                    </h4>
                  </v-col>
                  <v-col>
                    <h4 class="m-0" style="color: #846537">{{ convert.calculateArray(this.desserts) }}</h4>
                  </v-col>
                  <v-col class="text-right" style="color: #B27D41">
                    <h4 class="m-0">{{ convert.money(priceTotal) + "บาท" }}</h4>
                  </v-col>
                </v-row>
              </v-card>
              <v-btn color="#B27D41" rounded dark x-large block @click="pay" :disabled="priceTotal === 0.00"
                     style="font-size: 20px">
                ชำระเงิน
              </v-btn>
            </v-col>
          </v-row>
          <v-dialog v-model="dialog" width="600px" persistent>
            <v-card style="border-radius: 15px">
              <v-card-title style="font-size: 23px; color: #5B4840" class="lighten-2">
                ระบุสาขา
              </v-card-title>
              <v-card-text class="pt-6 pb-6" style="background-color: #F6F6F6" align="center">
                <v-form ref="form" v-model="valid" lazy-validation>
                  <v-autocomplete
                    v-model="branchSelect"
                    :items="branchList.data"
                    outlined
                    dense
                    label="เลือกสาขา"
                    return-object
                    item-value="id"
                    item-text="title"
                    :rules="[rules.required]"
                    @change="convertBranchSelect"
                    style="border-radius: 15px; mso-border-color-alt: #846537"
                    color="#846537"
                  ></v-autocomplete>
                </v-form>
                <v-btn color="#B27D41" dark rounded @click="close" width="340px">
                  ตกลง
                </v-btn>
              </v-card-text>
            </v-card>
          </v-dialog>
          <v-dialog v-model="dialogPay" width="800" transition="dialog-bottom-transition" persistent>
            <v-card style="border-radius: 15px; background-color: #F6F6F6">
              <v-toolbar>
                <h5 style="color: #5B4840" class="m-0">
                  ชำระเงิน
                </h5>
                <v-spacer></v-spacer>
                <v-btn icon @click="dialogCancelPay = true" color="#5B4840">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-toolbar>
              <v-row class="m-0">
                <v-col>
                  <v-row class="m-0 p-0">
                    <v-col align-self="center" class="p-0 mr-2 mb-2">
                      <v-card elevation="4" style="border-radius: 15px" class="pt-2 pb-2">
                        <h4 align="center" style="color: #846537">
                          <u>สรุปยอดรวม</u>
                        </h4>
                        <h1 align="center" class="m-0" style="color: #B27D41">
                          {{ convert.money(this.priceTotal) }}
                        </h1>
                      </v-card>
                    </v-col>
                    <v-col align-self="center" class="p-0 ml-2 mb-2">
                      <v-card elevation="4" style="border-radius: 15px" class="pt-2 pb-2">
                        <h4 align="center" style="color: #846537">
                          <u>เงินทอน</u>
                        </h4>
                        <h1 align="center" class="m-0" style="color: #B27D41">
                          {{ convert.money(changeMoney) }}
                        </h1>
                      </v-card>
                    </v-col>
                  </v-row>
                  <v-card elevation="4" class="row m-0 mb-4 mt-2 pb-1" align="center" v-if="check()" height="410px">
                    <div class="pt-6 pb-6" style="width: 340px;">
                      <v-img :src="qr" style="height: 350px; min-height: 140px"/>
                    </div>
                  </v-card>
                  <v-card elevation="4" class="row m-0 mb-4 mt-2 pb-1" align="center" v-else>
                    <v-col align="center" class="pb-0">
                      <v-img src="PromptPay.jpg" width="200" class="m-0"></v-img>
                    </v-col>
                    <v-col class="pt-0 pb-0" style="width: 340px">
                      <div v-html="qr"/>
                    </v-col>
                  </v-card>
                  <v-btn rounded block color="#B27D41" outlined @click="createOrder(2)">บันทึกพร้อมเพย์</v-btn>
                </v-col>
                <v-col>
                  <v-btn-toggle rounded dense v-model="t" style="width: 100%;" class="mb-3" color="#6E4C2E" background-color="#ECE6E0">
                    <v-btn style="width: 50%;">
                      เงินสด
                    </v-btn>
                    <v-btn style="width: 50%;">
                      อื่นๆ
                    </v-btn>
                  </v-btn-toggle>
                  <v-container fluid v-if="t === 0" class="p-0">
                    <v-card height="93" class="ml-2 mr-2" style="border-radius: 15px">
                      <v-row class="m-0 fill-height">
                        <v-icon x-large>mdi-currency-thb</v-icon>
                        <v-col class="m-0 p-0">
                          <p class="m-0 text-right mr-2" style="font-size: 60px;">{{ cash }}</p>
                        </v-col>
                      </v-row>
                    </v-card>
                    <v-row class="m-0">
                      <v-col v-for="(item, i) in price" :key="i" cols="4">
                        <v-btn block @click="getCash(item)" rounded class="shadow-box">
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
                        <v-btn block color="#B27D41" dark @click="createOrder(1)" rounded
                               :disabled="(!(changeMoney >= 0))">บันทึกเงินสด
                        </v-btn>
                      </v-col>
                    </v-row>
                  </v-container>
                  <!--                    </v-tab-item>-->
                  <!--                    <v-tab-item>dddd</v-tab-item>-->
                  <v-container fluid v-else>
                    ยังไม่พร้อมใช้งาน
                  </v-container>
                  <!--                  </v-tabs>-->
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
                    <v-btn dark small color="#6E4C2E" @click="confirmClose">
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

.shadow-box {
  box-shadow: 1px 1px 1px rgba(119, 66, 26, 16%); /* Horizontal offset, vertical offset, blur radius, and color */
}
</style>
<script src="./index.js"/>
