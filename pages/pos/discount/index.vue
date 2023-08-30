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
          <!--          <v-row class="pa-3 mt-1" style="background: #eef7f6">-->
          <!--            <h5 class="mb-0 ml-4" style="color: #00000080">-->
          <!--              <v-icon x-large>mdi-clipboard-edit-outline</v-icon>-->
          <!--              จัดการส่วนลด-->
          <!--            </h5>-->
          <!--            <v-spacer/>-->
          <!--            <v-btn outlined @click="openItem({})" class="mr-3">-->
          <!--              <v-icon>mdi-plus</v-icon>-->
          <!--              เพิ่ม-->
          <!--            </v-btn>-->
          <!--          </v-row>-->
          <head-bar title="จัดการส่วนลด" :callback="openItem"/>
          <v-col>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                <tr>
                  <th v-for="(item, i) in tableHead" :key="i" class="text-left" style="font-size: 14px"
                      :width="item.width">{{ item.title }}
                  </th>
                  <th width="120">
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.data" :key="index">
                  <td>{{ item.name }}</td>
                  <td>
                    <v-switch inset v-model="item.use == true?1:0" :value="item.use === '1'" @click="onUse(item)"
                    ></v-switch>
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
            <v-dialog v-model="dialog" persistent width="700">
              <v-form
                ref="form"
                v-model="valid"
              >
                <v-card>
                  <v-card-title class="text-h5 mb-3" style="background: #54b6c8">
                    <p class="m-0" style="color: white">เพิ่ม / แก้ไขส่วนลด</p>
                    <v-spacer/>
                    <v-btn icon @click="dialog = false" dark>
                      <v-icon>mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text class="pb-0">
                    <v-text-field v-model="item.name" label="ชื่อส่วนลด" outlined dense required :rules="rules"/>
                    <v-autocomplete
                      outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data
                      hide-selected
                      return-object
                      label="ประเภท"
                      dense
                      item-text="name"
                      item-value="id"
                    ></v-autocomplete>
                    <v-text-field v-model="item.total" label="จำนวน" outlined dense type="number" required
                                  :rules="rules"/>
                  </v-card-text>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" @click="confirm">
                      ตกลง
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-form>
            </v-dialog>
            <v-dialog v-model="dialogDelete" width="500">
              <v-card>
                <v-row align="right" class="m-0 pt-3 pr-3">
                  <v-spacer/>
                  <v-btn icon @click="dialogDelete = false">
                    <v-icon>mdi-close</v-icon>
                  </v-btn>
                </v-row>
                <v-col>
                  <h5 align="center" style="padding-bottom: 24px; padding-top: 12px">
                    คุณต้องการลบรายการใช่หรือไม่
                  </h5>
                  <v-row style="margin: 0">
                    <v-col
                      align="center" style="padding: 0" class="pb-2">
                      <v-btn dark small color="#54b6c8" @click="confirmDel">
                        ยืนยัน
                      </v-btn>
                    </v-col>
                  </v-row>
                </v-col>
              </v-card>
            </v-dialog>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
