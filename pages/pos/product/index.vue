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
          <v-row class="pa-3 mt-1" style="background: #eef7f6">
            <h5 class="mb-0 ml-4" style="color: #00000080">
              <v-icon x-large>mdi-clipboard-edit-outline</v-icon>
              จัดการรายการ
            </h5>
            <v-spacer/>
            <v-btn outlined @click="openItem({})" class="mr-3">
              <v-icon>mdi-plus</v-icon>
              เพิ่ม
            </v-btn>
          </v-row>
          <v-col>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                <tr>
                  <th v-for="(item, i) in tableHead" :key="i" class="text-left" style="font-size: 14px"
                      :width="item.width">{{ item.title }}
                  </th>
                  <th width="120px">
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.data" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.type.name }}</td>
                  <td>{{ item.price }}</td>
                  <td>
                    <v-img :src="item.imageUrl" height="40px" width="40px" style="border-radius: 10px"></v-img>
                  </td>
                  <td class="p-0 text-right">
                    <v-btn fab small text @click="openItem(item)">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="text-center">
              <v-dialog v-model="dialog" persistent>
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2 mb-3">
                    เพิ่ม/แก้ไขชื่อสาขา
                  </v-card-title>

                  <v-card-text>
                    <v-autocomplete
                      outlined
                      auto-select-first
                      :items="instead"
                      v-model="insteadSelect"
                      hide-no-data
                      hide-selected
                      return-object
                      label="ชื่อร้าน"
                      dense
                      item-text="title"
                      item-value="id"
                    ></v-autocomplete>
                    <v-text-field
                      v-model="item.title"
                      label="ชื่อสาขา"
                      outlined
                      clearable
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="item.detail"
                      label="รายละเอียด"
                      outlined
                      clearable
                      dense
                    ></v-text-field>
                    <v-textarea
                      v-model="item.address"
                      label="ที่อยู่"
                      outlined
                      clearable
                      dense
                    ></v-textarea>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" text @click="confirm">
                      ตกลง
                    </v-btn>
                    <v-btn color="primary" text @click="dialog = false">
                      ยกเลิก
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
