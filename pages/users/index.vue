<template>
  <div id="app">
    <v-main>
      <v-card elevation="0">
        <v-card-title style="margin: 12px; background-color: #EEF7F6;">
          <v-row style="padding: 12px">
            <h4 style="align-self: center; color: #2096f3; font-size: 20px">
              ผู้ใช้งาน
            </h4>
            <v-spacer/>
              <v-autocomplete
                outlined
                :items="typeStatus"
                v-model="typeStatusSelect"
                @change="getPending"
                label="สถานะ"
                dense
                hide-details
                style="max-width: 200px"
                class="pr-2"
              ></v-autocomplete>
            <v-text-field
              outlined label="ค้นหาหัวข้อ ชื่อผู้จอง" dense hide-details style="max-width: 400px"
              append-icon="mdi-magnify" v-model="search" @input="searchBooking"/>
          </v-row>
        </v-card-title>
        <v-row style="padding: 12px">
          <v-col>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
<!--                  <th style="padding-right: 0;padding-left: 8px;margin: 0">-->
<!--                    <v-tooltip top>-->
<!--                      <template v-slot:activator="{ on, attrs }">-->
<!--                        <span v-bind="attrs" v-on="on">-->
<!--                        <input type="checkbox" v-model="selectedAll">-->
<!--                      </span>-->
<!--                      </template>-->
<!--                      <span>เลือกหมด</span>-->
<!--                    </v-tooltip>-->
<!--                  </th>-->
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    ชื่อ
                  </th>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    อีเมล
                  </th>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    สถานะ
                  </th>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    หมายเหตุ
                  </th>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    สร้างเมื่อ
                  </th>
<!--                  <th style="max-width: 50px" class="text-center">-->
<!--                    <v-tooltip top>-->
<!--                      <template v-slot:activator="{ on, attrs }">-->
<!--                        <v-btn-->
<!--                          @click="delGroup" icon outlined color="red" v-show="delSelect"-->
<!--                          v-bind="attrs" v-on="on">-->
<!--                          <v-icon dark>-->
<!--                            mdi-trash-can-outline-->
<!--                          </v-icon>-->
<!--                        </v-btn>-->
<!--                      </template>-->
<!--                      <span>ลบที่เลือก</span>-->
<!--                    </v-tooltip>-->
<!--                  </th>-->
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.users" :key="index">
<!--                  <th width="30px" style="padding-right: 0;padding-left: 8px">-->
<!--                    <v-tooltip top>-->
<!--                      <template v-slot:activator="{ on, attrs }">-->
<!--                        <span v-bind="attrs" v-on="on">-->
<!--                          <input type="checkbox" v-model="selected" :value="item.id">-->
<!--                          &lt;!&ndash;                          <v-checkbox :value="item.id" multiple v-model="selected"></v-checkbox>&ndash;&gt;-->
<!--                        </span>-->
<!--                      </template>-->
<!--                      <span>เลือก</span>-->
<!--                    </v-tooltip>-->
<!--                  </th>-->
                  <td>{{ item.display_name }}</td>
                  <td>{{ item.email }}</td>
                  <td>{{ item.status }}</td>
                  <td>{{ item.pmi == 0?"ลงทะเบียนไม่สมบูรณ์":"ปกติ" }}</td>
                  <td>{{ convertDay(item.user_created_at) }}</td>
<!--                  <th class="text-center" width="8%">-->
<!--                    <v-tooltip top>-->
<!--                      <template v-slot:activator="{ on, attrs }">-->
<!--                        <v-icon-->
<!--                          color="#00D800" large @click="approve(item, true)"-->
<!--                          v-bind="attrs" v-on="on">mdi-checkbox-marked-circle-outline-->
<!--                        </v-icon>-->
<!--                      </template>-->
<!--                      <span>อนุมัติ</span>-->
<!--                    </v-tooltip>-->
<!--                    <v-tooltip top>-->
<!--                      <template v-slot:activator="{ on, attrs }">-->
<!--                        <v-icon-->
<!--                          color="red" large @click="delBooking(item)"-->
<!--                          v-bind="attrs"-->
<!--                          v-on="on">mdi-close-circle-outline-->
<!--                        </v-icon>-->
<!--                      </template>-->
<!--                      <span>ยกเลิก</span>-->
<!--                    </v-tooltip>-->
<!--                  </th>-->
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <v-row
              class="mt-2"
              align="center"
              justify="center"
              style="margin: 12px"
            >
              <span>แสดง {{ desserts.from }} ถึง {{ desserts.to }} จาก {{ desserts.total }} รายการ</span>
              <v-spacer></v-spacer>
              <v-menu offset-y>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined class="ml-2" v-bind="attrs" v-on="on">
                    {{ itemsPerPage }}
                    <v-icon>mdi-chevron-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item
                    v-for="(number, index) in itemsPerPageArray"
                    :key="index"
                    @click="updateItemsPerPage(number)">
                    <v-list-item-title>{{ number }}</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
              <v-pagination
                v-model="page"
                :length="desserts.last_page"
                :total-visible="7"
              ></v-pagination>
            </v-row>
          </v-col>
        </v-row>
      </v-card>
      <v-dialog v-model="dialog">
        <v-card>
          <v-card-title>
            <span class="text-h5">รายละเอียดอาคาร</span>
            <v-spacer></v-spacer>
            <v-icon @click="dialog=false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text>
            <v-container>
              <v-row>
                <v-col cols="12" sm="6">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.booking_by.name"
                    label="จองโดย"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.phone"
                    label="เบอร์"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    label="ชื่อหัวข้อ"
                    v-model="openItem.title"
                    readonly
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.detail"
                    label="รายละเอียด"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="11">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.building.name"
                    label="ชื่ออาคาร"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="1">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.building.number"
                    label="เลขอาคาร"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="8">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.room.name"
                    label="ชื่อห้อง"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.room.floor"
                    label="ชั้น"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6" md="2">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.room.total"
                    label="ความจุ"
                  ></v-text-field>
                </v-col>
                <v-col cols="12">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="filterName"
                    label="อุปกรณ์"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.start_date"
                    label="เริ่มเมื่อ"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" sm="6">
                  <v-text-field
                    dense
                    outlined
                    readonly
                    v-model="openItem.end_date"
                    label="ถึงเมื่อ"
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-container>
          </v-card-text>
        </v-card>
      </v-dialog>
      <v-dialog v-model="dialogDelete" max-width="500">
        <v-card>
          <v-card-title>
            <v-spacer></v-spacer>
            <v-icon @click="dialogDelete=false">mdi-close</v-icon>
          </v-card-title>
          <v-card-text class="text-h6 text-center" style="align-items: center; padding-bottom: 0px; ">
            คุณต้องการปฏิเสธใช่หรือไม่?
          </v-card-text>
          <v-card-actions align="center">
            <v-col>
              <v-btn outlined color="blue" small dark @click="deleteItemConfirm">
                <v-icon>mdi-checkbox-marked-circle</v-icon>
                ยืนยัน
              </v-btn>
            </v-col>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </div>
</template>
<style>
li {
  margin: 0;
}
</style>
<script src="./index.js"/>
