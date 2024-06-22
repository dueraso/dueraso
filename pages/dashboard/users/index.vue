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
          <head-bar :title="headTitle" :callback="openItem" per="add.users">
                                      <v-btn rounded @click="$router.push(`/dashboard/users/role`)" class="ml-3" color="#B27D41" dark small>
              <v-icon small>mdi-lock</v-icon>
              จัดการสิทธิ์
            </v-btn>
          </head-bar>
          <v-col>
            <div style=" overflow-x:auto;">
            <table style="width:100%">
              <thead>
              <tr>
                <th v-for="(item, i) in tableHead" :key="i" :class="item.text"
                    style="color: #846537" class="pl-3"
                    >{{ item.title }}
                </th>
                <th width="150px" style="background-color: #f3f1ed;">
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in desserts.data" :key="index" class="rounded-cell-all">
                <td class="pr-0" style="min-width: 150px">
                  {{ item.name }}
                </td>
                <td class="pr-0" style="min-width: 90px">
                  {{ item.email }}
                </td>
                <td class="pr-0" style="min-width: 130px">
                  {{ convert.formatPhoneNumber(item.phone) }}
                </td>
                <td class="pr-0">
                  {{ status(item.status) }}
                </td>
                <td class="pr-0">
                  {{ item.roles.name }}
                </td>
                <td class="pr-0" style="min-width: 130px">
                  {{ convert.datetime(item.created_at) }}
                </td>
                <td align="right" style="min-width: 140px">
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn fab small text @click="openItem(item)" :disabled="item.roles.id === 1"
                             v-role-or-permission="`super|edit.users`"
                             v-bind="attrs"
                             v-on="on">
                        <v-icon>mdi-shield-key-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>รีเซ็ตรหัสผ่าน</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn fab small text @click="openItem(item)" :disabled="item.roles.id === 1"
                             v-role-or-permission="`super|edit.users`"
                             v-bind="attrs"
                             v-on="on">
                        <v-icon>mdi-pen</v-icon>
                      </v-btn>
                    </template>
                    <span>แก้ไขข้อมูล</span>
                  </v-tooltip>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn fab small text @click="onDelete(item)" :disabled="item.roles.id === 1"
                             v-role-or-permission="`super|edit.users`"
                             v-bind="attrs"
                             v-on="on">
                        <v-icon>mdi-delete-outline</v-icon>
                      </v-btn>
                    </template>
                    <span>ลบข้อมูล</span>
                  </v-tooltip>
                </td>
              </tr>
              </tbody>
            </table>
            </div>
          </v-col>
          <dialog-mid v-model="dialog" title="เพิ่ม/แก้ไขผู้ใช้งาน" :callback="confirm">
            <p class="p-3 m-0" style="font-weight: 500">ข้อมูลส่วนตัว</p>
            <v-row class="m-0">
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.name" label="ชื่อ-สกุล" outlined clearable dense
                  style="border-radius: 15px"
                  required
                  :rules="[rules.required]"/>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-text-field
                  v-model="item.phone" label="เบอร์" outlined clearable dense style="border-radius: 15px"
                  required
                  :rules="[rules.required,rules.counter,rules.number]"
                  maxlength="10"
                />
              </v-col>
            </v-row>
            <p class="p-3 m-0" style="font-weight: 500">ข้อมูลผู้ใช้งาน</p>
            <v-row class="m-0">
              <v-col class="pb-0 pt-0" md="12">
                <v-text-field
                  v-model="item.email" label="อีเมล" type="email" outlined clearable dense
                  style="border-radius: 15px"
                  required
                  :rules="[rulesEmail.required, rulesEmail.emailMatch]"
                  :error-messages="emailErrorMessages"
                  :error="emailError"
                />
              </v-col>
              <v-col class="pb-0 pt-0" md="6" v-if="hidePass">
                <v-text-field
                  v-model="item.password" label="รหัสผ่าน" outlined dense
                  style="border-radius: 15px"
                  required
                  :rules="[rules.required]"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPass ? 'text' : 'password'"
                  @click:append="showPass = !showPass"/>
              </v-col>
              <v-col class="pb-0 pt-0" md="6" v-if="hidePass">
                <v-text-field
                  v-model="item.password" label="รหัสผ่าน" outlined dense
                  style="border-radius: 15px"
                  required
                  :rules="[rules.required]"
                  :append-icon="showPass ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="showPass ? 'text' : 'password'"
                  @click:append="showPass = !showPass"/>
              </v-col>
              <!--              <v-col class="pb-0 pt-0" :md="hidePass?6:12">-->
              <!--                <v-text-field-->
              <!--                  v-model="item.pin" label="passcode" outlined clearable dense-->
              <!--                  style="border-radius: 15px"-->
              <!--                  required-->
              <!--                  :rules="rules"/>-->
              <!--              </v-col>-->
            </v-row>
            <p class="p-3 m-0" style="font-weight: 500">ข้อมูลอื่นๆ</p>
            <v-row class="m-0">
<!--              <v-col class="pb-0 pt-0" md="6">-->
<!--                <v-text-field-->
<!--                  v-model="item.salary_id"-->
<!--                  label="เงินเดือน"-->
<!--                  outlined-->
<!--                  clearable-->
<!--                  dense-->
<!--                  type="number" style="border-radius: 15px"-->
<!--                  required-->
<!--                  :rules="rules"-->
<!--                ></v-text-field>-->
<!--              </v-col>-->
              <v-col class="pb-0 pt-0" md="6">
                <v-autocomplete
                  outlined
                  auto-select-first
                  :items="roles.data"
                  v-model="rolesSelect"
                  hide-no-data
                  hide-selected
                  return-object
                  label="สิทธิ์การใช้งาน"
                  dense
                  item-text="name"
                  item-value="id" style="border-radius: 15px"
                  required
                  :rules="[rules.required]"
                ></v-autocomplete>
              </v-col>
              <v-col class="pb-0 pt-0" md="6" v-if="checkAdmin()">
                <v-autocomplete
                  outlined
                  auto-select-first
                  :items="branch.data"
                  v-model="branchSelect"
                  hide-no-data
                  hide-selected
                  return-object
                  label="สาขา"
                  dense
                  item-text="title"
                  item-value="id" style="border-radius: 15px"
                  required
                  :rules="[rules.required]"
                ></v-autocomplete>
              </v-col>
              <v-col class="pb-0 pt-0" md="6">
                <v-row class="m-0 pl-4" v-if="!hidePass">
                  <p class="m-0 mt-2 mr-4" style="font-weight: 500">สถานะการใช้งาน</p>
                  <v-switch v-model="item.status" inset class="m-0 pt-1 pr-4" label="สถานะ" color="success"></v-switch>
                </v-row>
              </v-col>
            </v-row>
          </dialog-mid>
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
