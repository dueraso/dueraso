<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #eef7f6; height: 100px">
      <v-container>
        <v-row>
          <h4 style="align-self: center; color: #5561b0">
            รายชื่อข้อมูลสถานที่
          </h4>
          <v-spacer/>
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
            outlined
            dense
            v-model="search"
            color="#54B6C8"
            style="max-width: 336px"
            @keydown.enter="searchPlaces"
          ></v-text-field>
          <v-btn
            to="/update"
            style="align-self: center; margin-left: 12px"
            color="#54B6C8"
            dark
          >
            เพิ่มสถานที่
          </v-btn>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
      <v-container style="padding: 0">
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left" style="color: #38857d; font-size: 16px">
                ชื่อสถานที่
              </th>
              <th class="text-left" style="color: #38857d; font-size: 16px">
                พิกัด
              </th>
              <th class="text-left" style="color: #38857d; font-size: 16px">
                ระดับสถานที่
              </th>
              <th class="text-left" style="color: #38857d; font-size: 16px">
                การแก้ไขล่าสุด
              </th>
              <th style="max-width: 50px"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.topic }}</td>
              <td>{{ item.latitude + "," + item.longitude }}</td>
              <td width="11%">{{ item.priority }}</td>
              <td width="20%">{{ convertDay(item.updated_at) }}</td>
              <th class="text-left" width="8%">
                <v-icon color="#38857D" @click="editItem(item)"
                >mdi-pencil-outline
                </v-icon
                >
                <v-icon color="#38857D" v-if="roles" @click="deleteItem(item)"
                >mdi-delete-outline
                </v-icon
                >
              </th>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card-text>
    <v-dialog v-model="dialog" width="535" style="height: 215px">
      <v-card>
        <v-card-text style="padding: 24px">
          <h3 style="font-size: 20px; padding-bottom: 12px" class="text-center">
            ยืนยันการลบข้อมูล
          </h3>

          <v-col align="center">
            <v-btn
              color="#54B6C8"
              dark
              style="padding-right: 35px; padding-left: 35px"
              @click="dialog = false"
            >
              ยกเลิก
            </v-btn>
            <v-btn
              color="#54B6C8"
              dark
              style="margin-left: 24px; padding-right: 35px; padding-left: 35px"
              @click="deleteItemConfirm"
            >
              ยืนยัน
            </v-btn>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>

<!--    <LandingPage v-slot:status>'Hello!'</LandingPage>-->
  </v-card>
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
