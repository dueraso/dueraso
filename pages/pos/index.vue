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
            <v-col cols="12" md="8">
              <v-card class="p-3">
                <!--                tags-->
                <v-row class="mb-0">
                  <p class="m-2 pl-1 pt-1">รายการ</p>
                  <v-col cols="12" sm="10" md="8" class="m-0 p-0">
                    <v-sheet class="p-0 m-0">
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
                </v-row>
                <!--content-->
                <div style="height: 80vh; overflow-y: auto;">
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
                    <v-card height="50px" class="col text-center" @click="addDiscount(item)" :disabled="discountSel.length > 0">
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
                <p>รายการเลือก</p>
                <v-simple-table fixed-header height="350px">
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
                      <td>
                        {{item.total}}
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
                        {{item.name}}
                      </td>
<!--                      <td width="15%">-->
<!--                        {{item.total}}-->
<!--                      </td>-->
                      <td class="text-right" width="20%">
                        -{{discountTotal}}
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
                    <h4 class="m-0">{{convert.calculateArray(this.desserts)}}</h4>
                  </v-col>
                  <v-col class="text-right">
                    <h3 class="m-0">{{convert.money(priceTotal)}}</h3>
                  </v-col>
                  <v-btn color="primary" x-large block>
                    <v-icon>
                      mdi-cash-multiple
                    </v-icon>
                    ชำระ
                  </v-btn>
                </v-row>
              </v-card>
<!--              <v-card class="mt-3 p-3">-->
<!--                <v-row>-->
<!--                  <v-col md="3">-->
<!--                    <h4 class="m-0">รวม</h4>-->
<!--                  </v-col>-->
<!--                  <v-col>-->
<!--                    <h4 class="m-0">{{convert.calculateArray(this.desserts)}}</h4>-->
<!--                  </v-col>-->
<!--                  <v-col class="text-right">-->
<!--                    <h3 class="m-0">{{convert.money(priceTotal)}}</h3>-->
<!--                  </v-col>-->
<!--                  <v-btn color="primary" x-large block>-->
<!--                    <v-icon>-->
<!--                      mdi-cash-multiple-->
<!--                    </v-icon>-->
<!--                    ชำระ-->
<!--                  </v-btn>-->
<!--                </v-row>-->
<!--              </v-card>-->

<!--              <v-card class="mt-3 p-3">-->
<!--                <v-row>-->
<!--                  &lt;!&ndash;                  <v-col>&ndash;&gt;-->
<!--                  &lt;!&ndash;                    <v-btn @click="onConfirm()" text x-large>ล้าง</v-btn>&ndash;&gt;-->
<!--                  &lt;!&ndash;                  </v-col>&ndash;&gt;-->
<!--&lt;!&ndash;                  <v-col class="text-right">&ndash;&gt;-->
<!--                    <v-btn color="primary" x-large block>-->
<!--                      <v-icon>-->
<!--                        mdi-cash-multiple-->
<!--                      </v-icon>-->
<!--                      ชำระ-->
<!--                    </v-btn>-->
<!--&lt;!&ndash;                  </v-col>&ndash;&gt;-->
<!--                </v-row>-->
<!--              </v-card>-->
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
