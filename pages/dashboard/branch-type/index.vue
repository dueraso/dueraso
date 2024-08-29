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
          <head-bar :title="headTitle" :callback="openItem" per="add.type-budget"/>
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
              <tr v-for="(item, index) in desserts.data" :key="index" class="rounded-cell-all">
                <td class="pr-0">
                  {{ item.name }}
                </td>
                <td align="right">
                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`admin|edit.type-budget`">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`admin|delete.type-budget`">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="1">รายการทั้งหมด {{ desserts.to }}/{{ desserts.total }} รายการ</td>
                <td colspan="1">
                  <div style="float: right;">
                    <v-pagination
                      v-model="page"
                      :length="desserts.last_page"
                      color="#A57156"
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
            <div class="text-center">
              <dialog-mid v-model="dialog" title="เพิ่ม/แก้ไขประเภทรายการ" :callback="confirm">
                <v-text-field
                  v-model="item.name"
                  label="ชื่อประเภท"
                  outlined
                  :rules="rules" required
                  clearable
                  dense style="border-radius: 15px"
                ></v-text-field>
              </dialog-mid>
            </div>
            <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped src="../../pos/product/index.css"/>
<script src="./index.js"/>
