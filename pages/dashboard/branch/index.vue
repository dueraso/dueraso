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
          <head-bar :title="headTitle" :callback="openItem" per="add.branch"/>
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
                  {{ item.title }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.detail ? item.detail : '-' }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.address ? item.address : '-' }}
                </td>
                <td align="right">
                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`admin|edit.branch`">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`admin|delete.branch`">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="2">รายการทั้งหมด {{ desserts.meta.to }}/{{ desserts.meta.total }} รายการ</td>
                <td colspan="2">
                  <div style="float: right;">
                    <v-pagination
                      v-model="page"
                      :length="desserts.meta.last_page"
                      color="#A57156"
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
            <div class="text-center">
              <dialog-mid v-model="dialog" title="เพิ่ม/แก้ไขชื่อสาขา" :callback="confirm">
                <v-row>
                  <v-col class="pb-0">
                    <v-autocomplete
                      outlined
                      auto-select-first
                      :items="branchItems"
                      v-model="branchSelect"
                      required
                      :rules="rules"
                      hide-no-data
                      hide-selected
                      return-object
                      label="ชื่อร้าน"
                      dense
                      item-text="title"
                      item-value="id"
                      color="#A57156" style="border-radius: 15px; border-color: #A57156"
                    ></v-autocomplete>
                  </v-col>
                  <v-col class="pb-0">
                    <v-text-field
                      v-model="item.title"
                      label="ชื่อสาขา/ออกงาน/ไลฟ์สด"
                      required
                      :rules="rules"
                      outlined
                      clearable
                      dense
                      color="#A57156" style="border-radius: 15px; border-color: #A57156"
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col class="pt-0">
                    <v-autocomplete
                      outlined
                      auto-select-first
                      :items="promptItems"
                      v-model="promptSelect"
                      required
                      :rules="rules"
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
                  <v-col class="pt-0">
                    <v-combobox
                      v-model="typeSelect"
                      :items="typeItems"
                      required
                      :rules="rules"
                      label="ประเภทร้าน"
                      outlined
                      dense
                      style="border-radius: 15px"
                      return-object
                      item-text="name"
                      item-value="id"
                    ></v-combobox>
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
              </dialog-mid>
            </div>
          </v-col>
          <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped src="../../pos/product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
<script src="./index.js"/>
