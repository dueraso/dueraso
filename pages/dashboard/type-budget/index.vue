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
                    <v-btn fab small text @click="openItem(item)" v-role-or-permission="`super|edit.type-budget`">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`super|delete.type-budget`">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                </td>
              </tr>
              </tbody><tfoot>
            <tr>
              <td colspan="1">รายการทั้งหมด {{ desserts.meta.to }}/{{ desserts.meta.total }} รายการ</td>
              <td colspan="1">
                <div style="float: right;">
                  <v-pagination
                    v-model="page"
                    :length="desserts.meta.last_page"
                    circle
                  ></v-pagination>
                </div>
              </td>
            </tr>
            </tfoot>
            </table>
            <div class="text-center">
              <v-dialog v-model="dialog" persistent  width="786">
                <v-card style="box-shadow: 5px 5px 10px rgba(119, 66, 26, 0.16); border-radius: 15px">
                  <v-card-title>
                    <h5>เพิ่ม/แก้ไขประเภทรายการ</h5>
                    <v-spacer/>
                    <v-btn icon @click="dialog = false" color="#5B4840">
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text class="p-3" style="background: #F6F6F6" align="center">
                    <v-text-field
                      v-model="item.name"
                      label="ชื่อประเภท"
                      outlined
                      clearable
                      dense style="border-radius: 15px"
                    ></v-text-field>
                    <v-btn color="#B27D41" dark @click="confirm" width="340" rounded class="mb-2">
                      ตกลง
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-dialog>
            </div>
            <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
          </v-col>
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
