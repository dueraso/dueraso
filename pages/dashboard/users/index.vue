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
          <v-row class="pa-3 mt-1" style="background: #eef7f6">
            <h5 class="mb-0 ml-4" style="color: #00000080">
              <v-icon x-large>mdi-account-group-outline</v-icon>
              ผู้ใช้งานทั้งหมด
            </h5>
            <v-spacer/>
            <v-btn outlined @click="openItem({})" class="mr-3" v-show="myUtils('create', $route.fullPath)">
              <v-icon>mdi-plus</v-icon>
              เพิ่ม
            </v-btn>
            <v-btn outlined @click="$router.push($route.fullPath+'/role')" class="mr-3">
              <v-icon>mdi-lock</v-icon>
              จัดการสิทธิ์
            </v-btn>
          </v-row>
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
                  <td>{{ item.email }}</td>
                  <td>{{ item.phone }}</td>
                  <td>{{ status(item.status) }}</td>
                  <td>{{ item.roles.name }}</td>
                  <td>{{ convertDay(item.created_at) }}</td>
                  <td class="p-0 text-right">
                    <v-btn fab small text @click="openItem(item)" :disabled="item.roles.name === 'super_admin'"
                           v-show="myUtils('update', $route.fullPath)">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)" :disabled="item.roles.name === 'super_admin'"
                           v-show="myUtils('delete', $route.fullPath)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="text-center">
              <v-dialog v-model="dialog" persistent>
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2 mb-3">
                    <v-col class="p-0">
                      เพิ่ม/แก้ไขผู้ใช้งาน
                    </v-col>
                    <v-col align="right" style="align-items: center" class="p-0">
                      <v-icon @click="dialog = false">mdi-close</v-icon>
                    </v-col>
                  </v-card-title>
                  <v-card-text>
                    <v-card>
                      <p class="p-3 m-0">ข้อมูลส่วนตัว</p>
                      <v-row class="m-0">
                        <v-col class="pb-0 pt-0" md="6">
                          <v-text-field v-model="item.title" label="ชื่อ-สกุล" outlined clearable dense/>
                        </v-col>
                        <v-col class="pb-0 pt-0" md="6">
                          <v-text-field v-model="item.phone" label="เบอร์" outlined clearable dense/>
                        </v-col>
                        <v-divider class="m-0 ml-4 mr-4"/>
                      </v-row>
                      <p class="p-3 m-0">ข้อมูลผู้ใช้งาน</p>
                      <v-row class="m-0">
                        <v-col class="pb-0 pt-0" md="6">
                          <v-text-field v-model="item.email" label="อีเมล" type="email" outlined clearable dense/>
                        </v-col>
                        <v-col class="pb-0 pt-0" md="6">
                          <v-text-field v-model="item.password" label="รหัสผ่าน" outlined clearable dense/>
                        </v-col>
                        <v-divider class="m-0 ml-4 mr-4"/>
                      </v-row>
                      <p class="p-3 m-0">ข้อมูลอื่นๆ</p>
                      <v-row class="m-0">
                        <v-col class="pb-0 pt-0">
                          <v-text-field
                            v-model="item.salary_id"
                            label="เงินเดือน"
                            outlined
                            clearable
                            dense
                          ></v-text-field>
                        </v-col>
                        <v-col class="pb-0 pt-0">
                          <v-autocomplete
                            outlined
                            auto-select-first
                            :items="roles"
                            v-model="rolesSelect"
                            hide-no-data
                            hide-selected
                            return-object
                            label="ชื่อร้าน"
                            dense
                            item-text="name"
                            item-value="id"
                          ></v-autocomplete>
<!--                          <v-text-field-->
<!--                            v-model="item.roles_id"-->
<!--                            label="สิทธิ์"-->
<!--                            outlined-->
<!--                            clearable-->
<!--                            dense-->
<!--                          ></v-text-field>-->
                        </v-col>
                        <v-switch v-model="item.status" inset class="m-0 pt-1 pr-4" label="สถานะ"></v-switch>
                      </v-row>
                    </v-card>
                  </v-card-text>
                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn color="primary" outlined @click="confirm">
                      ตกลง
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
.cut-text-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

iframe {
  width: 100%;
  max-height: 650px;
}
</style>
<script src="./index.js"/>
