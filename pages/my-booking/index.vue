<template>
  <div id="app">
    <v-main>
      <v-card elevation="0">
        <v-card-title style="margin: 12px; background-color: #EEF7F6;">
          <v-row style="padding: 12px">
            <h4 style="align-self: center; color: #2096f3; font-size: 20px">
              รายการจองของฉัน
            </h4>
          </v-row>
        </v-card-title>
        <v-row style="padding: 12px">
          <v-col>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    หัวข้อ
                  </th>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    ขนาดห้อง
                  </th>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    เริ่ม
                  </th>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    ถึง
                  </th>
                  <th class="text-left" style="color: #2196f3; font-size: 16px">
                    สร้างเมื่อ
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.data" :key="index">
                  <td>{{ item.title }}</td>
                  <td>{{ item.id_room.size }}</td>
                  <td>{{ convertDay(item.start_date) }}</td>
                  <td>{{ convertDay(item.end_date) }}</td>
                  <td width="15%">{{ convertDay(item.createAt) }}</td>
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
              <v-btn
                fab
                color="#2096f3"
                class="mr-1"
                small
                @click="()=>{pageBooking(desserts.prev_page_url)}"
                :disabled="desserts.prev_page_url === null"
              >
                <v-icon color="white">mdi-chevron-left</v-icon>
              </v-btn>
              <span class="mr-4 ml-4">{{ desserts.current_page }} / {{ desserts.last_page }}
          </span>
              <v-btn
                fab
                color="#2096f3"
                class="ml-1"
                small
                @click="()=>{pageBooking(desserts.next_page_url)}"
                :disabled="desserts.next_page_url === null"
              >
                <v-icon color="white">mdi-chevron-right</v-icon>
              </v-btn>
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
    </v-main>
  </div>
</template>
<script src="./index.js">
</script>
