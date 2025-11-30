<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading..</v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar :title="headTitle" :callback="openItem" per="add.loyalty">
          </head-bar>
          <v-col>
            <!-- Stats -->
            <v-row class="mb-4">
              <v-col cols="6" sm="3">
                <v-card class="pa-3 text-center" style="border-radius: 15px">
                  <p class="m-0" style="color: #846537; font-size: 12px">
                    รางวัลทั้งหมด
                  </p>
                  <h4 class="m-0" style="color: #5b4840">{{ rewards.length }}</h4>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card class="pa-3 text-center" style="border-radius: 15px">
                  <p class="m-0" style="color: #4caf50; font-size: 12px">
                    เปิดใช้งาน
                  </p>
                  <h4 class="m-0" style="color: #4caf50">
                    {{ rewards.filter((r) => r.status === 1).length }}
                  </h4>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card class="pa-3 text-center" style="border-radius: 15px">
                  <p class="m-0" style="color: #f44336; font-size: 12px">
                    ปิดใช้งาน
                  </p>
                  <h4 class="m-0" style="color: #f44336">
                    {{ rewards.filter((r) => r.status === 0).length }}
                  </h4>
                </v-card>
              </v-col>
              <v-col cols="6" sm="3">
                <v-card class="pa-3 text-center" style="border-radius: 15px">
                  <p class="m-0" style="color: #ff9800; font-size: 12px">
                    ถูกแลกไปแล้ว
                  </p>
                  <h4 class="m-0" style="color: #ff9800">
                    {{ convert.money(totalRedemptions, 0) }}
                  </h4>
                </v-card>
              </v-col>
            </v-row>

            <!-- Rewards Grid -->
            <v-row>
              <v-col
                cols="12"
                sm="6"
                md="4"
                lg="3"
                v-for="reward in rewards"
                :key="reward.id"
              >
                <v-card
                  class="pa-0"
                  style="border-radius: 15px; overflow: hidden"
                >
                  <v-img
                    :src="reward.image || '/defaultimage.png'"
                    height="150"
                    class="white--text align-end"
                    gradient="to bottom, rgba(0,0,0,.1), rgba(0,0,0,.6)"
                  >
                    <v-chip
                      small
                      :color="reward.status === 1 ? '#4CAF50' : '#F44336'"
                      dark
                      class="ma-2"
                      style="position: absolute; top: 0; right: 0"
                    >
                      {{ reward.status === 1 ? "เปิด" : "ปิด" }}
                    </v-chip>
                    <h6 class="pa-3 m-0">{{ reward.name }}</h6>
                  </v-img>
                  <v-card-text class="pa-3">
                    <v-row align="center" class="m-0 mb-2">
                      <v-icon small color="#B27D41" class="mr-1">mdi-star</v-icon>
                      <strong style="color: #b27d41"
                      >{{ convert.money(reward.points, 0) }} แต้ม</strong
                      >
                      <v-spacer/>
                      <v-chip x-small :color="getTypeColor(reward.type)" dark>
                        {{ getTypeName(reward.type) }}
                      </v-chip>
                    </v-row>
                    <p class="m-0 mb-2" style="font-size: 13px; color: #846537">
                      {{ reward.description }}
                    </p>
                    <v-row class="m-0" style="font-size: 12px; color: #9e9e9e">
                      <v-icon x-small class="mr-1">mdi-swap-horizontal</v-icon>
                      ถูกแลกไป {{ reward.redemptionCount }} ครั้ง
                      <v-spacer/>
                      <span v-if="reward.stock !== null">
                      <v-icon x-small class="mr-1">mdi-package-variant</v-icon>
                      คงเหลือ {{ reward.stock }}
                    </span>
                    </v-row>
                  </v-card-text>
                  <v-divider class="m-0"/>
                  <v-card-actions class="pa-2">
                    <v-btn text small color="#B27D41" @click="openItem(reward)">
                      <v-icon small left>mdi-pen</v-icon>
                      แก้ไข
                    </v-btn>
                    <v-spacer/>
                    <v-btn
                      text
                      small
                      :color="reward.status === 1 ? '#F44336' : '#4CAF50'"
                      @click="toggleStatus(reward)"
                    >
                      <v-icon small left>{{
                          reward.status === 1 ? "mdi-eye-off" : "mdi-eye"
                        }}
                      </v-icon>
                      {{ reward.status === 1 ? "ปิด" : "เปิด" }}
                    </v-btn>
                    <v-btn icon small @click="onDelete(reward)">
                      <v-icon small>mdi-delete-outline</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <!-- Add/Edit Dialog -->
          <dialog-mid
            v-model="dialog"
            title="เพิ่ม/แก้ไขรางวัล"
            :callback="confirm"
            width="600"
          >
            <v-row class="m-0">
              <v-col class="pb-0 pt-3" md="12">
                <p class="m-0 mb-2" style="font-weight: 500; color: #5b4840">
                  ข้อมูลรางวัล
                </p>
              </v-col>
              <v-col class="pb-0 pt-0" md="12">
                <v-text-field
                  v-model="item.name"
                  label="ชื่อรางวัล *"
                  outlined
                  dense
                  style="border-radius: 15px"
                  :rules="[rules.required]"
                  placeholder="เช่น ส่วนลด 50 บาท"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.points"
                  label="แต้มที่ใช้แลก *"
                  outlined
                  dense
                  style="border-radius: 15px"
                  type="number"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-select
                  v-model="item.type"
                  :items="rewardTypes"
                  label="ประเภทรางวัล *"
                  outlined
                  dense
                  style="border-radius: 15px"
                  item-value="value"
                  item-text="text"
                  :rules="[rules.required]"
                />
              </v-col>
              <v-col
                class="pb-0 pt-0"
                md="6"
                v-if="item.type === 'discount' || item.type === 'percent'"
              >
                <v-text-field
                  v-model="item.value"
                  :label="
                    item.type === 'percent'
                      ? 'เปอร์เซ็นต์ส่วนลด *'
                      : 'จำนวนเงินส่วนลด *'
                  "
                  outlined
                  dense
                  style="border-radius: 15px"
                  type="number"
                  :suffix="item.type === 'percent' ? '%' : 'บาท'"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.stock"
                  label="จำนวนจำกัด (ว่างไว้ = ไม่จำกัด)"
                  outlined
                  dense
                  style="border-radius: 15px"
                  type="number"
                  placeholder="ไม่จำกัด"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="12">
                <v-textarea
                  v-model="item.description"
                  label="รายละเอียด"
                  outlined
                  dense
                  style="border-radius: 15px"
                  rows="2"
                  placeholder="รายละเอียดเพิ่มเติมเกี่ยวกับรางวัล"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="12">
                <p class="m-0 mb-2" style="font-weight: 500; color: #5b4840">
                  ช่วงเวลาที่ใช้ได้
                </p>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-menu
                  v-model="startDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.startDate"
                      label="วันที่เริ่มต้น"
                      outlined
                      dense
                      style="border-radius: 15px"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      clearable
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="item.startDate"
                    @input="startDateMenu = false"
                    color="#B27D41"
                  />
                </v-menu>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-menu
                  v-model="endDateMenu"
                  :close-on-content-click="false"
                  transition="scale-transition"
                  offset-y
                  min-width="auto"
                >
                  <template v-slot:activator="{ on, attrs }">
                    <v-text-field
                      v-model="item.endDate"
                      label="วันที่สิ้นสุด"
                      outlined
                      dense
                      style="border-radius: 15px"
                      prepend-inner-icon="mdi-calendar"
                      readonly
                      clearable
                      v-bind="attrs"
                      v-on="on"
                    />
                  </template>
                  <v-date-picker
                    v-model="item.endDate"
                    @input="endDateMenu = false"
                    color="#B27D41"
                  />
                </v-menu>
              </v-col>
              <v-col class="pb-0 pt-0" md="12">
                <v-switch
                  v-model="item.status"
                  label="เปิดใช้งาน"
                  color="#4CAF50"
                  inset
                  :true-value="1"
                  :false-value="0"
                />
              </v-col>
            </v-row>
          </dialog-mid>

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
