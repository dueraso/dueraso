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
            <v-col cols="12" md="8" style="height: 900px" class="mx-auto">
              <v-card class="p-3">
                <p>รายการทั้งหมด</p>
                <div style="max-height: 900px; overflow-y: auto;">
                  <v-row dense>
                    <v-col v-for="(card, i) in cards" :key="i" :cols="6" :md="card.flex" sm="2" xl="2">
                      <v-card>
                        <a @click="onClick(card)">
                          <v-img
                            :src="card.src"
                            class="white--text align-end"
                            gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.5)"
                            height="200px"
                          >
                            <h5 class="p-1 m-0">{{ card.title }}</h5>
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
                <v-row>
                  <v-col md="2">
                    <v-card height="50px" class="col text-center">
                      <v-icon>mdi-ticket-percent-outline
                      </v-icon>
                      ลด 10%
                    </v-card>
                  </v-col>
                  <v-col md="2">
                    <v-card height="50px" class="col text-center">
                      <v-icon>mdi-ticket-percent-outline
                      </v-icon>
                      ลด 20%
                    </v-card>
                  </v-col>
                  <v-col md="2">
                    <v-card height="50px" class="col text-center">
                      <v-icon>mdi-ticket-percent-outline
                      </v-icon>
                      ระบุจำนวนเอง
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
            <v-col>
              <v-card class="p-3">
                <p>รายการเลือก</p>
                <v-simple-table fixed-header>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th v-for="(item, i) in tableHead" :key="i" :class="item.text" style="font-size: 14px"
                          :width="item.width">{{ item.title }}
                      </th>
                      <th width="20">
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="(item, index) in desserts" :key="index">
                      <td>{{ item.name }}</td>
                      <td>{{ item.total }}</td>
                      <td class="text-right">{{ convert.money(item.price) }}</td>
                      <td class="p-0 text-right">
                        <v-btn fab small text>
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
                    <tr>
                      <td>
                        ส่วนลด 10%
                      </td>
                      <td width="15%">
                        1
                      </td>
                      <td class="text-right" width="20%">
                        -199
                      </td>
                      <td width="20px">
                        <v-icon>mdi-close</v-icon>
                      </td>
                    </tr>
                    <tr>
                      <td class="pt-5">
                        ส่วนลด 20%
                      </td>
                      <td class="pt-5">
                        1
                      </td>
                      <td class="text-right pt-5">
                        -299
                      </td>
                      <td class="pt-5">
                        <v-icon>mdi-close</v-icon>
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
              <v-card class="mt-3 p-3">
                <v-row>
                  <v-col md="2">
                    <h4 class="m-0">รวม</h4>
                  </v-col>
                  <v-col class="text-right">
                    <h3 class="m-0">3,000.00</h3>
                  </v-col>
                </v-row>
              </v-card>

              <v-card class="mt-3 p-3">
                <v-row>
                  <v-col>
                    <v-btn @click="onConfirm()" text x-large>ล้าง</v-btn>
                  </v-col>
                  <v-col class="text-right">
                    <v-btn color="primary" x-large>
                      <v-icon>
                        mdi-cash-multiple
                      </v-icon>
                      ชำระ
                    </v-btn>
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
<style>
.truncate {
  max-width: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<script src="./index.js"/>
