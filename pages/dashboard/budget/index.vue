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
          <head-bar title="รายรับ/รายจ่าย" :callback="openItem"/>
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
                  <div class="rounded-cell">{{ item.name }}</div>
                </td>
                <td class="pr-0">
                  <div class="rounded-cell-center">{{ item.budget_type.name }}</div>
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
            <div class="text-center">
              <v-dialog v-model="dialog" persistent width="786">
                <v-form ref="form" v-model="valid">
                  <v-card style="border-radius: 15px">
                    <v-card-title>
                      <h5 class="m-0" style="color: #5B4840">เพิ่ม/แก้ไขรายรับ รายจ่าย</h5>
                      <v-spacer/>
                      <v-btn icon @click="dialog = false">
                        <v-icon color="#5B4840">mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-card-text class="p-3" style="background: #F6F6F6" align="center">
                      <v-text-field
                        v-model="item.name"
                        label="ชื่อรายการ"
                        outlined
                        clearable
                        dense
                        :rules="rules" required
                      ></v-text-field>
                      <v-autocomplete
                        outlined
                        auto-select-first
                        :items="instead"
                        v-model="insteadSelect"
                        hide-no-data
                        hide-selected
                        return-object
                        label="ประเภทรายการ"
                        dense
                        item-text="name"
                        item-value="id"
                        :rules="rules" required
                      ></v-autocomplete>
                      <v-btn color="#B27D41" @click="confirm" dark rounded width="340" class="mb-2">
                        ตกลง
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-form>
              </v-dialog>
            </div>
            <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style src="../../pos/product/index.css"/>
<script src="./index.js"/>
