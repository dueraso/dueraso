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
          <HeadBar :callback="openItem" :title="headTitle" per="add.organizations"/>
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
                  {{ nameCreate(item.create_by) }}
                </td>
                <td align="right">
                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`admin|edit.outlets`">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`admin|delete.outlets`">
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
              <dialog-mid v-model="dialog" title="เพิ่ม/แก้ไขชื่อร้าน" :callback="confirm">
                <v-text-field
                  v-model="item.title"
                  label="ชื่อร้าน/ชื่อแบรนด์"
                  :rules="rules" required
                  outlined
                  clearable
                  dense
                  color="#A57156" style="border-radius: 15px; border-color: #A57156"
                ></v-text-field>
                <v-text-field
                  v-model="item.detail"
                  label="รายละเอียด"
                  outlined
                  clearable
                  dense
                  color="#A57156" style="border-radius: 15px; border-color: #A57156"
                ></v-text-field>
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
