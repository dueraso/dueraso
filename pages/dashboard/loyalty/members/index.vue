<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading..</v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar :title="headTitle" :callback="openItem" per="add.loyalty">
            <v-btn
              rounded
              @click="exportData"
              class="ml-3"
              color="#4CAF50"
              dark
              small
            >
              <v-icon small>mdi-file-excel</v-icon>
              Export
            </v-btn>
          </head-bar>
          <v-col>
            <!-- Filters -->
            <v-row class="mb-4">
              <v-col cols="12" sm="4" md="3">
                <v-text-field
                  v-model="search"
                  label="ค้นหาชื่อ/เบอร์โทร"
                  outlined
                  dense
                  prepend-inner-icon="mdi-magnify"
                  style="border-radius: 15px"
                  clearable
                  @input="onSearch"
                />
              </v-col>
              <v-col cols="12" sm="4" md="2">
                <v-select
                  v-model="filterTier"
                  :items="tierOptions"
                  label="ระดับสมาชิก"
                  outlined
                  item-text="name"
                  item-value="id"
                  dense
                  style="border-radius: 15px"
                  clearable
                  @change="getData"
                />
              </v-col>
              <v-col cols="12" sm="4" md="2">
                <v-select
                  v-model="filterStatus"
                  :items="statusOptions"
                  label="สถานะ"
                  outlined
                  dense
                  style="border-radius: 15px"
                  clearable
                  @change="getData"
                />
              </v-col>
            </v-row>

            <!-- Stats Cards -->
            <v-row class="mb-4">
              <v-col cols="6" sm="">
                <v-card class="pa-3 text-center" style="border-radius: 15px">
                  <p class="m-0" style="color: #846537; font-size: 12px">
                    ทั้งหมด
                  </p>
                  <h4 class="m-0" style="color: #5b4840">
                    {{ convert.money(totalCount, 0) }}
                  </h4>
                </v-card>
              </v-col>

              <v-col cols="6" sm="" v-for="(tier,i) in tierOptions" :key="i">
                <v-card class="pa-3 text-center" style="border-radius: 15px">
                  <p class="m-0" :style="{color: tier.color}" style="font-size: 12px">
                    {{ tier.name }}
                  </p>
                  <h4 class="m-0" :style="{color: tier.color}">
                    {{ convert.money(tier.members_count, 0) }}
                  </h4>
                </v-card>
              </v-col>
<!--              <v-col cols="6" sm="3">-->
<!--                <v-card class="pa-3 text-center" style="border-radius: 15px">-->
<!--                  <p class="m-0" style="color: #cd7f32; font-size: 12px">-->
<!--                    Bronze-->
<!--                  </p>-->
<!--                  <h4 class="m-0" style="color: #cd7f32">-->
<!--                    {{ convert.money(tierCounts.bronze, 0) }}-->
<!--                  </h4>-->
<!--                </v-card>-->
<!--              </v-col>-->
<!--              <v-col cols="6" sm="3">-->
<!--                <v-card class="pa-3 text-center" style="border-radius: 15px">-->
<!--                  <p class="m-0" style="color: #9e9e9e; font-size: 12px">-->
<!--                    Silver-->
<!--                  </p>-->
<!--                  <h4 class="m-0" style="color: #9e9e9e">-->
<!--                    {{ convert.money(tierCounts.silver, 0) }}-->
<!--                  </h4>-->
<!--                </v-card>-->
<!--              </v-col>-->
<!--              <v-col cols="6" sm="3">-->
<!--                <v-card class="pa-3 text-center" style="border-radius: 15px">-->
<!--                  <p class="m-0" style="color: #ffd700; font-size: 12px">Gold</p>-->
<!--                  <h4 class="m-0" style="color: #ffd700">-->
<!--                    {{ convert.money(tierCounts.gold, 0) }}-->
<!--                  </h4>-->
<!--                </v-card>-->
<!--              </v-col>-->
            </v-row>

          </v-col>
          <!-- Table -->
          <v-col>
            <div style="overflow-x: auto">
              <table style="width: 100%">
                <thead>
                <tr>
                  <th
                    v-for="(item, i) in tableHead"
                    :key="i"
                    :class="item.text"
                    style="color: #846537"
                    class="pl-3"
                  >
                    {{ item.title }}
                  </th>
                  <th width="150px" style="background-color: #f3f1ed"></th>
                </tr>
                </thead>
                <tbody>
                <tr
                  v-for="(item, index) in desserts.data"
                  :key="index"
                  class="rounded-cell-all"
                >
                  <td class="pr-0" style="min-width: 50px">
                    {{ index + 1 }}
                  </td>
                  <td class="pr-0" style="min-width: 150px">
                    {{ item.name }}
                  </td>
                  <td class="pr-0" style="min-width: 120px">
                    {{ convert.formatPhoneNumber(item.phone) }}
                  </td>
                  <td class="pr-0" style="min-width: 150px">
                    {{ item.email || "-" }}
                  </td>
                  <td class="pr-0 text-center" style="min-width: 80px">
                    <v-chip small :color="getTierColor(item.tier)" dark>
                      {{ item.tier }}
                    </v-chip>
                  </td>
                  <td
                    class="pr-0 text-right"
                    style="
                        min-width: 100px;
                        color: #b27d41;
                        font-weight: bold;
                      "
                  >
                    {{ convert.money(item.points, 0) }}
                  </td>
                  <td class="pr-0 text-center" style="min-width: 100px">
                    {{ convert.money(item.totalSpent, 0) }}
                  </td>
                  <td class="pr-0 text-center" style="min-width: 80px">
                    <v-chip
                      small
                      :color="item.status === 1 ? '#4CAF50' : '#F44336'"
                      dark
                    >
                      {{ item.status === 1 ? "ปกติ" : "ระงับ" }}
                    </v-chip>
                  </td>
                  <td class="pr-0" style="min-width: 130px">
                    {{ convert.datetime(item.createdAt) }}
                  </td>
                  <td align="right" style="min-width: 190px">
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          small
                          text
                          @click="openPointDialog(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-star-plus</v-icon>
                        </v-btn>
                      </template>
                      <span>ปรับแต้ม</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          small
                          text
                          @click="viewHistory(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-history</v-icon>
                        </v-btn>
                      </template>
                      <span>ดูประวัติ</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          small
                          text
                          @click="openItem(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-pen</v-icon>
                        </v-btn>
                      </template>
                      <span>แก้ไข</span>
                    </v-tooltip>
                    <v-tooltip top>
                      <template v-slot:activator="{ on, attrs }">
                        <v-btn
                          fab
                          small
                          text
                          @click="onDelete(item)"
                          v-bind="attrs"
                          v-on="on"
                        >
                          <v-icon>mdi-delete-outline</v-icon>
                        </v-btn>
                      </template>
                      <span>ลบ</span>
                    </v-tooltip>
                  </td>
                </tr>
                </tbody>

                <tfoot>
                <tr>
                  <td colspan="3">รายการทั้งหมด {{ desserts.data.length }}/{{ totalCount }} รายการ</td>
                  <td colspan="7">
                    <div style="float: right;">
                      <v-pagination
                        v-model="page"
                        :length="totalPages"
                        circle
                        color="#A57156"
                      ></v-pagination>
                    </div>
                  </td>
                </tr>
                </tfoot>
              </table>
            </div>
          </v-col>
          <!-- Add/Edit Dialog -->
          <dialog-mid
            v-model="dialog"
            title="เพิ่ม/แก้ไขสมาชิก"
            :callback="confirm"
          >
            <v-row class="m-0">
              <v-col class="pb-0 pt-3" md="12">
                <p class="m-0 mb-2" style="font-weight: 500; color: #5b4840">
                  ข้อมูลส่วนตัว
                </p>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.name"
                  label="ชื่อ-สกุล *"
                  outlined
                  dense
                  style="border-radius: 15px"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.phone"
                  label="เบอร์โทรศัพท์ *"
                  outlined
                  dense
                  style="border-radius: 15px"
                  :rules="[rules.required, rules.phone]"
                  maxlength="10"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.email"
                  label="อีเมล"
                  outlined
                  dense
                  style="border-radius: 15px"
                  type="email"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-menu
                  v-model="birthdayMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.birthday"
                      label="วันเกิด"
                      outlined
                      dense
                      style="border-radius: 15px"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="item.birthday"
                    @input="birthdayMenu = false"
                    color="#B27D41"
                  />
                </v-menu>
              </v-col>
              <v-col class="pb-0 pt-0" md="6" v-if="item.id">
                <v-select
                  v-model="item.tier"
                  :items="tierOptions"
                  label="ระดับสมาชิก"
                  outlined
                  item-text="name"
                  item-value="id"
                  dense
                  style="border-radius: 15px"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6" v-if="item.id">
                <v-select
                  v-model="item.status"
                  :items="statusOptions"
                  label="สถานะ"
                  outlined
                  dense
                  style="border-radius: 15px"
                  item-value="value"
                  item-text="text"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="12">
                <v-textarea
                  v-model="item.note"
                  label="หมายเหตุ"
                  outlined
                  dense
                  style="border-radius: 15px"
                  rows="2"
                />
              </v-col>
            </v-row>
          </dialog-mid>

          <!-- Adjust Points Dialog -->
          <v-dialog v-model="pointDialog" width="500" persistent>
            <v-card style="border-radius: 15px">
              <v-card-title style="color: #5b4840">
                ปรับแต้มสมาชิก
                <v-spacer/>
                <v-btn icon @click="pointDialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text style="background-color: #f6f6f6">
                <v-card class="pa-3 mb-4" style="border-radius: 15px">
                  <v-row align="center" class="m-0">
                    <v-avatar color="#ECE6E0" size="50" class="mr-3">
                      <v-icon color="#B27D41">mdi-account</v-icon>
                    </v-avatar>
                    <div>
                      <h6 class="m-0" style="color: #5b4840">
                        {{ selectedMember.name }}
                      </h6>
                      <p class="m-0" style="color: #846537; font-size: 14px">
                        แต้มปัจจุบัน:
                        <strong style="color: #b27d41">{{
                            convert.money(selectedMember.points, 0)
                          }}</strong>
                      </p>
                    </div>
                  </v-row>
                </v-card>

                <v-btn-toggle
                  v-model="pointAction"
                  mandatory
                  class="mb-4"
                  style="width: 100%"
                >
                  <v-btn value="add" style="width: 50%" color="#4CAF50" dark>
                    <v-icon left>mdi-plus</v-icon>
                    เพิ่มแต้ม
                  </v-btn>
                  <v-btn
                    value="subtract"
                    style="width: 50%"
                    color="#F44336"
                    dark
                  >
                    <v-icon left>mdi-minus</v-icon>
                    หักแต้ม
                  </v-btn>
                </v-btn-toggle>

                <v-text-field
                  v-model="pointAmount"
                  label="จำนวนแต้ม"
                  outlined
                  dense
                  type="number"
                  style="border-radius: 15px"
                  :rules="[rules.required]"
                />

                <v-text-field
                  v-model="pointReason"
                  label="เหตุผล"
                  outlined
                  dense
                  style="border-radius: 15px"
                  placeholder="เช่น แก้ไขข้อผิดพลาด, โบนัสพิเศษ"
                />

                <v-card
                  class="pa-3"
                  style="border-radius: 15px; background-color: #ece6e0"
                >
                  <v-row class="m-0">
                    <v-col class="p-0">
                      <p class="m-0" style="font-size: 14px; color: #846537">
                        แต้มหลังปรับ
                      </p>
                    </v-col>
                    <v-col class="p-0 text-right">
                      <h5
                        class="m-0"
                        :style="`color: ${
                          pointAction === 'add' ? '#4CAF50' : '#F44336'
                        }`"
                      >
                        {{ convert.money(calculatedPoints, 0) }}
                      </h5>
                    </v-col>
                  </v-row>
                </v-card>
              </v-card-text>
              <v-card-actions class="pa-4">
                <v-btn
                  rounded
                  outlined
                  color="#6E4C2E"
                  @click="pointDialog = false"
                >
                  ยกเลิก
                </v-btn>
                <v-spacer/>
                <v-btn
                  rounded
                  dark
                  color="#B27D41"
                  @click="confirmAdjustPoints"
                  :disabled="!pointAmount"
                >
                  ยืนยัน
                </v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>

          <!-- History Dialog -->
          <v-dialog v-model="historyDialog" width="700" persistent>
            <v-card style="border-radius: 15px">
              <v-card-title style="color: #5b4840">
                ประวัติแต้มสะสม - {{ selectedMember.name }}
                <v-spacer/>
                <v-btn icon @click="historyDialog = false">
                  <v-icon>mdi-close</v-icon>
                </v-btn>
              </v-card-title>
              <v-card-text style="background-color: #f6f6f6">
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                    <tr>
                      <th style="color: #846537">วันที่</th>
                      <th style="color: #846537">รายการ</th>
                      <th style="color: #846537" class="text-right">แต้ม</th>
                      <th style="color: #846537" class="text-right">
                        คงเหลือ
                      </th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr v-for="history in pointHistory" :key="history.id">
                      <td>{{ convert.datetime(history.createdAt) }}</td>
                      <td>{{ history.description }}</td>
                      <td
                        class="text-right"
                        :style="`color: ${
                            history.points > 0 ? '#4CAF50' : '#F44336'
                          }`"
                      >
                        {{
                          history.points > 0 ? "+" : ""
                        }}{{ history.points }}
                      </td>
                      <td class="text-right" style="font-weight: bold">
                        {{ convert.money(history.balance, 0) }}
                      </td>
                    </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card-text>
            </v-card>
          </v-dialog>

          <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #a57156;
}
</style>
<script src="./index.js"/>
