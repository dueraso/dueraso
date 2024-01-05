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
          <head-bar :title="headTitle" :callback="openItem" per="add.modules"/>
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
                    {{ item.diractory?item.diractory:'-' }}
                </td>
                <td class="pl-0 pr-0">
                    {{ item.icon?item.icon:'-' }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.parent?item.parent:'-'  }}
                </td>
                <td class="pl-0 pr-0">
                    {{ item.sort }}
                </td>
                <td class="pl-0 pr-0">
                    {{ item.status }}
                </td>
                <td align="right">
                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`super|edit.modules`">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`super|delete.modules`">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="4">รายการทั้งหมด {{ desserts.meta.to }}/{{ desserts.meta.total }} รายการ</td>
                <td colspan="3">
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
              <v-dialog v-model="dialog" persistent width="786px">
                <v-form ref="form" v-model="valid">
                  <v-card style="box-shadow: 5px 5px 10px rgba(119, 66, 26, 0.16); border-radius: 15px">
                    <v-card-title>
                      <h5 class="m-0" style="color: #5B4840">เพิ่ม / แก้ไขรายการ</h5>
                      <v-spacer/>
                      <v-btn icon @click="dialog = false" color="#5B4840">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-card-text class="p-3" style="background-color: #F6F6F6" align="center">
                      <v-text-field
                        v-model="item.name" label="ชื่อรายการ" outlined dense required
                        style="border-radius: 15px" :rules="rules"/>

                      <v-textarea v-model="item.detail" label="รายละเอียด" outlined dense style="border-radius: 15px"/>

                      <v-row class="m-0">
                        <v-autocomplete
                          outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data
                          class="pr-4"
                          hide-selected return-object label="ประเภท" dense item-text="name" item-value="id"
                          style="border-radius: 15px"
                        ></v-autocomplete>
                        <v-text-field
                          v-model="item.price" label="ราคา" outlined dense type="number" required
                          style="border-radius: 15px"
                          :rules="rules"/>
                      </v-row>
                      <!--                      </div>-->
                      <v-btn color="#B27D41" dark @click="confirm" width="340" rounded class="mb-2">
                        ตกลง
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-form>
              </v-dialog>
              ,
              <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
            </div>
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
