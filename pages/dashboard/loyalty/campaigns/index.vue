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
            <!-- Active Campaigns -->
            <v-row class="mb-4">
              <v-col cols="12">
                <h6 style="color: #5b4840" class="mb-3">
                  <v-icon color="#4CAF50" class="mr-2">mdi-check-circle</v-icon>
                  แคมเปญที่เปิดใช้งาน ({{ activeCampaigns.length }})
                </h6>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="campaign in activeCampaigns"
                :key="campaign.id"
              >
                <v-card
                  class="pa-0"
                  style="
                  border-radius: 15px;
                  overflow: hidden;
                  border: 2px solid #4caf50;
                "
                >
                  <v-card-title
                    :style="`background: linear-gradient(135deg, ${campaign.color}, ${campaign.color}dd)`"
                    class="white--text py-3"
                  >
                    <v-icon dark class="mr-2">{{ campaign.icon }}</v-icon>
                    {{ campaign.name }}
                    <v-spacer/>
                    <v-chip small color="white" text-color="#4CAF50"
                    >กำลังใช้งาน
                    </v-chip
                    >
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <p class="m-0 mb-3" style="color: #5b4840">
                      {{ campaign.description }}
                    </p>
                    <v-row class="m-0 mb-2" style="font-size: 13px">
                      <v-icon small class="mr-2" color="#846537"
                      >mdi-calendar
                      </v-icon
                      >
                      <span style="color: #846537"
                      >{{ campaign.startDate }} - {{ campaign.endDate }}</span
                      >
                    </v-row>
                    <v-row class="m-0" style="font-size: 13px">
                      <v-icon small class="mr-2" color="#846537"
                      >mdi-account-multiple
                      </v-icon
                      >
                      <span style="color: #846537"
                      >ใช้ไปแล้ว {{ campaign.usageCount }} ครั้ง</span
                      >
                    </v-row>
                  </v-card-text>
                  <v-divider class="m-0"/>
                  <v-card-actions class="pa-2">
                    <v-btn text small color="#B27D41" @click="openItem(campaign)">
                      <v-icon small left>mdi-pen</v-icon>
                      แก้ไข
                    </v-btn>
                    <v-spacer/>
                    <v-btn
                      text
                      small
                      color="#F44336"
                      @click="toggleCampaign(campaign)"
                    >
                      <v-icon small left>mdi-stop</v-icon>
                      หยุด
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
              <v-col cols="12" v-if="activeCampaigns.length === 0">
                <v-alert type="info" dense style="border-radius: 10px">
                  ไม่มีแคมเปญที่เปิดใช้งาน
                </v-alert>
              </v-col>
            </v-row>

            <v-divider class="my-4"/>

            <!-- All Campaigns -->
            <v-row>
              <v-col cols="12">
                <h6 style="color: #5b4840" class="mb-3">
                  <v-icon color="#846537" class="mr-2">mdi-bullhorn</v-icon>
                  แคมเปญทั้งหมด
                </h6>
              </v-col>
              <v-col
                cols="12"
                sm="6"
                md="4"
                v-for="campaign in allCampaigns"
                :key="campaign.id"
              >
                <v-card
                  class="pa-0"
                  style="border-radius: 15px; overflow: hidden"
                  :class="{ 'opacity-60': campaign.status === 0 }"
                >
                  <v-card-title
                    :style="`background: linear-gradient(135deg, ${campaign.color}, ${campaign.color}dd)`"
                    class="white--text py-3"
                  >
                    <v-icon dark class="mr-2">{{ campaign.icon }}</v-icon>
                    {{ campaign.name }}
                    <v-spacer/>
                    <v-chip
                      small
                      :color="campaign.status === 1 ? '#4CAF50' : '#9E9E9E'"
                      dark
                    >
                      {{ campaign.status === 1 ? "เปิด" : "ปิด" }}
                    </v-chip>
                  </v-card-title>
                  <v-card-text class="pa-4">
                    <p class="m-0 mb-3" style="color: #5b4840">
                      {{ campaign.description }}
                    </p>

                    <v-chip
                      small
                      class="mr-1 mb-1"
                      outlined
                      :color="campaign.color"
                    >
                      {{ getCampaignTypeName(campaign.type) }}
                    </v-chip>
                    <v-chip small class="mb-1" outlined color="#846537">
                      {{
                        campaign.value
                      }}{{
                        campaign.type === "multiplier"
                          ? "x"
                          : campaign.type === "bonus"
                            ? " แต้ม"
                            : ""
                      }}
                    </v-chip>

                    <v-row class="m-0 mt-3" style="font-size: 13px">
                      <v-icon small class="mr-2" color="#846537"
                      >mdi-calendar
                      </v-icon
                      >
                      <span style="color: #846537"
                      >{{ campaign.startDate || "ไม่จำกัด" }} -
                      {{ campaign.endDate || "ไม่จำกัด" }}</span
                      >
                    </v-row>
                  </v-card-text>
                  <v-divider class="m-0"/>
                  <v-card-actions class="pa-2">
                    <v-btn text small color="#B27D41" @click="openItem(campaign)">
                      <v-icon small left>mdi-pen</v-icon>
                      แก้ไข
                    </v-btn>
                    <v-spacer/>
                    <v-btn
                      text
                      small
                      :color="campaign.status === 1 ? '#F44336' : '#4CAF50'"
                      @click="toggleCampaign(campaign)"
                    >
                      <v-icon small left>{{
                          campaign.status === 1 ? "mdi-eye-off" : "mdi-eye"
                        }}
                      </v-icon>
                      {{ campaign.status === 1 ? "ปิด" : "เปิด" }}
                    </v-btn>
                    <v-btn icon small @click="onDelete(campaign)">
                      <v-icon small>mdi-delete-outline</v-icon>
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-col>
            </v-row>

            <!-- Add/Edit Dialog -->
            <dialog-mid
              v-model="dialog"
              title="เพิ่ม/แก้ไขแคมเปญ"
              :callback="confirm"
              width="600"
            >
              <v-row class="m-0">
                <v-col class="pb-0 pt-3" md="12">
                  <v-text-field
                    v-model="item.name"
                    label="ชื่อแคมเปญ *"
                    outlined
                    dense
                    style="border-radius: 15px"
                    :rules="[rules.required]"
                    placeholder="เช่น แต้ม x2 วันศุกร์"
                  />
                </v-col>
                <v-col class="pb-0 pt-0" md="6">
                  <v-select
                    v-model="item.type"
                    :items="campaignTypes"
                    label="ประเภทแคมเปญ *"
                    outlined
                    dense
                    style="border-radius: 15px"
                    item-value="value"
                    item-text="text"
                  />
                </v-col>
                <v-col class="pb-0 pt-0" md="6">
                  <v-text-field
                    v-model="item.value"
                    :label="getValueLabel(item.type)"
                    outlined
                    dense
                    style="border-radius: 15px"
                    type="number"
                    :suffix="
                    item.type === 'multiplier'
                      ? 'x'
                      : item.type === 'bonus'
                      ? 'แต้ม'
                      : ''
                  "
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
                  />
                </v-col>
                <v-col class="pb-0 pt-0" md="6">
                  <v-select
                    v-model="item.icon"
                    :items="iconOptions"
                    label="ไอคอน"
                    outlined
                    dense
                    style="border-radius: 15px"
                  >
                    <template v-slot:item="{ item }">
                      <v-icon class="mr-2">{{ item }}</v-icon>
                      {{ item }}
                    </template>
                    <template v-slot:selection="{ item }">
                      <v-icon class="mr-2">{{ item }}</v-icon>
                      {{ item }}
                    </template>
                  </v-select>
                </v-col>
                <v-col class="pb-0 pt-0" md="6">
                  <v-select
                    v-model="item.color"
                    :items="colorOptions"
                    label="สี"
                    outlined
                    dense
                    style="border-radius: 15px"
                  >
                    <template v-slot:item="{ item }">
                      <v-avatar size="20" :color="item" class="mr-2"/>
                      {{ item }}
                    </template>
                    <template v-slot:selection="{ item }">
                      <v-avatar size="20" :color="item" class="mr-2"/>
                      {{ item }}
                    </template>
                  </v-select>
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
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #a57156;
}

.opacity-60 {
  opacity: 0.6;
}
</style>
<script src="./index.js"/>
