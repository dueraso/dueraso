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
          <head-bar title="ชื่อสาขา/ชื่ออีเว้นท์" :callback="openItem"/>
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
                  <div class="rounded-cell">{{ item.title }}</div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">{{ item.detail ? item.detail : '-' }}</div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">{{ item.address ? item.address : '-' }}</div>
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
              <tfoot>
              <tr>
                <td colspan="2">รายการทั้งหมด 8/22 รายการ</td>
                <td colspan="2">< 1 2 3 ></td>
              </tr>
              </tfoot>
            </table>
            <div class="text-center">
              <v-dialog v-model="dialog" persistent width="786">
                <v-card style="border-radius: 15px">
                  <v-card-title>
                    <h5>เพิ่ม/แก้ไขชื่อสาขา</h5>
                    <v-spacer/>
                    <v-btn icon @click="dialog = false">
                      <v-icon color="#5B4840">mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text class="p-3" style="background: #F6F6F6" align="center">
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
                      color="#A57156" style="border-radius: 15px; border-color: #A57156"
                    ></v-autocomplete>
                    <v-row>
                      <v-col>
                        <v-text-field
                          v-model="item.title"
                          label="ชื่อสาขา"
                          outlined
                          clearable
                          dense
                          color="#A57156" style="border-radius: 15px; border-color: #A57156"
                        ></v-text-field>
                      </v-col>
                      <v-col>
                        <v-autocomplete
                          outlined
                          auto-select-first
                          :items="promptItems"
                          v-model="promptSelect"
                          hide-no-data
                          hide-selected
                          return-object
                          label="พร้อมเพย์"
                          dense
                          item-text="name"
                          item-value="id"
                          color="#A57156" style="border-radius: 15px; border-color: #A57156"
                        ></v-autocomplete>
                      </v-col>
                    </v-row>
                    <v-textarea
                      v-model="item.detail"
                      label="รายละเอียด"
                      outlined
                      clearable
                      dense
                      color="#A57156" style="border-radius: 15px; border-color: #A57156"
                    ></v-textarea>
                    <v-textarea
                      v-model="item.address"
                      label="ที่อยู่"
                      outlined
                      clearable
                      dense
                      color="#A57156" style="border-radius: 15px; border-color: #A57156"
                    ></v-textarea>
                    <v-btn dark rounded width="340" class="mb-2" @click="confirm" color="#B27D41">
                      ตกลง
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
          <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style src="../../pos/product/index.css"/>
<script src="./index.js"/>
