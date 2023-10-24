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
          <head-bar title="ผู้ใช้งานทั้งหมด" :callback="openItem">
            <v-btn rounded @click="$router.push($route.fullPath+'/role')" class="ml-3" color="#B27D41" dark small>
              <v-icon small>mdi-lock</v-icon>
              จัดการสิทธิ์
            </v-btn>
          </head-bar>
          <v-col>
            <table style="width:100%">
              <thead>
              <tr>
                <th v-for="(item, i) in tableHead" :key="i" :class="item.text"
                    style="color: #846537" class="pl-3"
                    :width="item.width">{{ item.title }}
                </th>
                <th width="120px" style="background-color: #f3f1ed;">
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in desserts.data" :key="index">
                <td class="pr-0">
                  <div class="rounded-cell">
                    {{ item.name }}
                  </div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">
                    {{ item.email }}
                  </div>
                </td>
                <td class="pl-0 pr-0" style="width: 150px">
                  <div class="rounded-cell-center">
                    {{ convert.formatPhoneNumber(item.phone) }}
                  </div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">
                    {{ status(item.status) }}
                  </div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">
                    {{ item.roles.name }}
                  </div>
                </td>
                <td class="pl-0 pr-0" style="width: 200px">
                  <div class="rounded-cell-center" style="min-width: 150px">
                    {{ convert.datetime(item.created_at) }}
                  </div>
                </td>
                <td>
                  <div class="rounded-cell-right" align="right">
                    <v-btn fab small text @click="openItem(item)">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </v-col>
          <dialog-mid v-model="dialog" title="เพิ่ม/แก้ไขผู้ใช้งาน">
            <p class="p-3 m-0" style="font-weight: 500">ข้อมูลส่วนตัว</p>
            <v-row class="m-0">
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field v-model="item.title" label="ชื่อ-สกุล" outlined clearable dense
                              style="border-radius: 15px"
                              required
                              :rules="rules"/>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field v-model="item.phone" label="เบอร์" outlined clearable dense style="border-radius: 15px"
                              required
                              :rules="rules"/>
              </v-col>
            </v-row>
            <p class="p-3 m-0" style="font-weight: 500">ข้อมูลผู้ใช้งาน</p>
            <v-row class="m-0">
              <v-col class="pb-0 pt-0" md="12">
                <v-text-field v-model="item.email" label="อีเมล" type="email" outlined clearable dense
                              style="border-radius: 15px"
                              required
                              :rules="rules"/>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field v-model="item.password" label="รหัสผ่าน" outlined clearable dense
                              style="border-radius: 15px"
                              required
                              :rules="rules"/>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field v-model="item.passcode" label="รหัสผ่าน" outlined clearable dense
                              style="border-radius: 15px"
                              required
                              :rules="rules"/>
              </v-col>
            </v-row>
            <p class="p-3 m-0" style="font-weight: 500">ข้อมูลอื่นๆ</p>
            <v-row class="m-0">
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.salary_id"
                  label="เงินเดือน"
                  outlined
                  clearable
                  dense
                  type="number" style="border-radius: 15px"
                  required
                  :rules="rules"
                ></v-text-field>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-autocomplete
                  outlined
                  auto-select-first
                  :items="roles.data"
                  v-model="rolesSelect"
                  hide-no-data
                  hide-selected
                  return-object
                  label="สิทธิ์การใช้งาน"
                  dense
                  item-text="name"
                  item-value="id" style="border-radius: 15px"
                  required
                  :rules="rules"
                ></v-autocomplete>
              </v-col>
            </v-row>
            <v-row class="m-0 pl-4">
              <p class="m-0 mt-2 mr-4" style="font-weight: 500">สถานะการใช้งาน</p>
              <v-switch v-model="item.status" inset class="m-0 pt-1 pr-4" label="สถานะ" color="success"></v-switch>
            </v-row>
          </dialog-mid>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style src="../../pos/product/index.css"/>
<style>
.cut-text-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

iframe {
  width: 100%;
  max-height: 650px;
}
</style>
<script src="./index.js"/>
