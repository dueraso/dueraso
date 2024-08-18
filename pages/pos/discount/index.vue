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
          <head-bar :title="headTitle" :callback="openItem" per="add.discount"/>
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
                <td class="pl-0 pr-0">
                  <v-switch inset v-model="item.use?1:0" :value="item.use === '1'" @click="onUse(item)"
                            class="m-0 p-0" hide-details color="success" v-role-or-permission="`admin|edit.discount`"
                  ></v-switch>
                </td>
                <td align="right">
                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`admin|edit.discount`">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`admin|delete.discount`">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="2">รายการทั้งหมด {{ desserts.meta.to }}/{{ desserts.meta.total }} รายการ</td>
                <td colspan="3">
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

            <dialog-mid v-model="dialog" title="เพิ่ม / แก้ไขส่วนลด" :callback="confirm">
              <v-text-field color="#A57156" style="border-radius: 15px" v-model="item.name" label="ชื่อส่วนลด" outlined
                            dense required :rules="rules"/>
              <v-row class="m-0">
                <v-autocomplete
                  outlined required style="border-radius: 15px" :rules="rules" :items="instead" v-model="insteadSelect"
                  hide-no-data
                  hide-selected
                  return-object
                  label="ประเภท"
                  dense
                  item-text="name"
                  item-value="id" class="pr-4"
                  color="#A57156"
                ></v-autocomplete>
                <v-text-field color="#A57156" style="border-radius: 15px" v-model="item.total" label="จำนวน" outlined
                              dense type="number" required :rules="rules"/>
              </v-row>
            </dialog-mid>
            <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped src="../product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
<script src="./index.js"/>
