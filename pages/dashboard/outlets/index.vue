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
          <HeadBar :callback="openItem" :title="headTitle" per="add.outlets"/>
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
                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`super|edit.outlets`">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`super|delete.outlets`">
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
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
            <div class="text-center">
              <v-dialog v-model="dialog" persistent width="786">
                <v-card style="border-radius: 15px">
                  <v-card-title>
                    <h5>
                      เพิ่ม/แก้ไขชื่อร้าน
                    </h5>
                    <v-spacer/>
                    <v-btn icon @click="dialog = false">
                      <v-icon color="#5B4840">mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text class="p-3" style="background: #F6F6F6" align="center">
                    <v-text-field
                      v-model="item.title"
                      label="ชื่อร้าน/ชื่อแบรนด์"
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
<style scoped src="../../pos/product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
<script src="./index.js"/>
