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
          <head-bar :title="headTitle" :callback="openItem" :back="true" per="add.role"/>
          <v-col>
            <table style="width:100%">
              <thead>
              <tr>
                <th v-for="(item, i) in tableHeadRole" :key="i" :class="item.text"
                    style="color: #846537" class="pl-3"
                    :width="item.width">{{ item.title }}
                </th>
                <th width="120px" style="background-color: #f3f1ed;">
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in dessertsRole.data" :key="index" class="rounded-cell-all">
                <td class="pr-0">
                    {{ item.name }}
                </td>
                <td class="pl-0 pr-0">
                    {{ item.detail ? item.detail : "-" }}
                </td>
                <td class="pl-0 pr-0" style="width: 200px">
                    {{ convert.datetime(item.updated_at) }}
                </td>
                <td class="pl-0 pr-0" style="width: 200px">
                    {{ convert.datetime(item.created_at) }}
                </td>
                <td align="right">
                    <v-btn fab small text @click="openItem(item)" :disabled="item.group === 'admin'" v-role-or-permission="`admin|edit.role`">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)" :disabled="item.group === 'admin'" v-role-or-permission="`admin|edit.role`">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="3">รายการทั้งหมด {{ dessertsRole.meta.to }}/{{ dessertsRole.meta.total }} รายการ</td>
                <td colspan="2">
                  <div style="float: right;">
                    <v-pagination
                      v-model="page"
                      :length="dessertsRole.meta.last_page"
                      color="#A57156"
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
          </v-col>
          <dialog-mid v-model="dialog" title="จัดการสิทธิ์การใช้งาน" :callback="confirm">
            <v-text-field v-model="item.name" label="ชื่อสิทธิ์การใช้งาน" outlined dense
                          style="border-radius: 15px"
                          required
                          :rules="rules"/>
            <v-textarea  v-model="item.detail" label="รายละเอียด" outlined dense
                         style="border-radius: 15px"/>
            <table style="width:100%">
              <thead>
              <tr>
                <th v-for="(item, i) in tableHead" :key="i" :class="item.text"
                    style="color: #846537" class="pl-3"
                    :width="item.width">{{ item.title }}
                </th>
              </tr>
              </thead>
              <tbody v-for="(item, index) in desserts" :key="index" class="rounded-cell-all">
              <tr>
                <td class="pr-0">
                    {{ item.title }}
                </td>
                <td class="pl-0 pr-0">
                    {{ item.diractory ? item.diractory : "-" }}
                </td>
                <td class="pl-0 pr-0">
                    <v-switch
                      v-model="per.read"
                      @change="changeSwitch(item)"
                      :value="item.id"
                      inset color="success"
                      hide-details class="m-0 p-0"
                      :disabled="!item.diractory"
                    ></v-switch>
                </td>
                <td class="pl-0 pr-0">
                    <v-switch
                      v-model="per.create"
                      inset
                      @change="changePer('add',item.diractory)"
                      :value="item.id"
                      hide-details class="m-0 p-0" color="success"
                      :disabled="!item.diractory"
                    ></v-switch>
                </td>
                <td class="pl-0 pr-0">
                    <v-switch
                      v-model="per.update"
                      inset
                      :value="item.id"
                      @change="changePer('edit',item.diractory)"
                      hide-details class="m-0 p-0" color="success"
                      :disabled="!item.diractory"
                    ></v-switch>
                </td>
                <td>
                    <v-switch
                      v-model="per.delete"
                      inset
                      @change="changePer('delete',item.diractory)"
                      :value="item.id" color="success"
                      hide-details class="m-0 p-0"
                      :disabled="!item.diractory"
                    ></v-switch>
                </td>
              </tr>

              <tr v-if="item.children" v-for="(i, index) in item.children" :key="index" class="rounded-cell-all">
                <td class="pr-0">
                    {{ i.title }}
                </td>
                <td class="pl-0 pr-0">
                    {{ i.diractory ? i.diractory : "-" }}
                </td>
                <td class="pl-0 pr-0">
                    <v-switch
                      v-model="per.read"
                      @change="changeSwitch(i)"
                      :value="i.id"
                      inset color="success"
                      hide-details class="m-0 p-0"
                    ></v-switch>
                </td>
                <td class="pl-0 pr-0">
                    <v-switch
                      v-model="per.create"
                      inset
                      @change="changePer('add',i.diractory)"
                      :value="i.id"
                      hide-details class="m-0 p-0" color="success"
                    ></v-switch>
                </td>
                <td class="pl-0 pr-0">
                    <v-switch
                      v-model="per.update"
                      inset
                      @change="changePer('edit',i.diractory)"
                      :value="i.id"
                      hide-details class="m-0 p-0" color="success"
                    ></v-switch>
                </td>
                <td>
                    <v-switch
                      v-model="per.delete"
                      inset
                      @change="changePer('delete',i.diractory)"
                      :value="i.id" color="success"
                      hide-details class="m-0 p-0"
                    ></v-switch>
                </td>
              </tr>
              </tbody>
            </table>
          </dialog-mid>
          <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped src="../../../pos/product/index.css">
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
