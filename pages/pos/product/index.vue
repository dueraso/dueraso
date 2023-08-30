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
          <head-bar title="จัดการรายการ" :callback="openItem"/>
<!--          <v-row class="pa-3 mt-1" style="background: #eef7f6">-->
<!--            <h5 class="mb-0 ml-4" style="color: #00000080">-->
<!--              <v-icon x-large>mdi-clipboard-edit-outline</v-icon>-->
<!--              จัดการรายการ-->
<!--            </h5>-->
<!--            <v-spacer/>-->
<!--            <v-btn outlined @click="openItem({})" class="mr-3">-->
<!--              <v-icon>mdi-plus</v-icon>-->
<!--              เพิ่ม-->
<!--            </v-btn>-->
<!--          </v-row>-->
          <v-col>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                <tr>
                  <th v-for="(item, i) in tableHead" :key="i" :class="item.text" style="font-size: 14px"
                      :width="item.width">{{ item.title }}
                  </th>
                  <th width="120px">
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.data" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.type.name }}</td>
                  <td>{{ item.price }}</td>
                  <td align="center">
                    <v-img :src="item.imageUrl" height="40px" width="40px" style="border-radius: 10px"></v-img>
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
            <div class="text-center">
              <v-dialog v-model="dialog" persistent width="900">
                <v-form
                  ref="form"
                  v-model="valid"
                >
                  <v-card>
                    <v-card-title class="text-h5 mb-3" style="background: #54b6c8">
                      <p class="m-0" style="color: white">เพิ่ม / แก้ไขรายการ</p>
                      <v-spacer/>
                      <v-btn icon @click="dialog = false" dark>
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-card-text class="pb-0">
                      <v-text-field v-model="item.name" label="ชื่อรายการ" outlined dense required :rules="rules"/>
                      <v-textarea  v-model="item.detail" label="รายละเอียด" outlined dense required :rules="rules"/>
                      <v-autocomplete
                        outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data
                        hide-selected
                        return-object
                        label="ประเภท"
                        dense
                        item-text="name"
                        item-value="id"
                      ></v-autocomplete>
                      <v-text-field v-model="item.price" label="จำนวน" outlined dense type="number" required
                                    :rules="rules"/>
                      <v-text-field  v-model="item.url" label="ลิ้งค์รูป" outlined dense required :rules="rules"/>
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
            </div>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
