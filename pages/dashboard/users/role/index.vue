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
          <head-bar :title="headTitle" :callback="openItem" :back="true"/>
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
              <tr v-for="(item, index) in dessertsRole.data" :key="index">
                <td class="pr-0">
                  <div class="rounded-cell">
                    {{ item.name }}
                  </div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">
                    {{ item.detail ? item.detail : "-" }}
                  </div>
                </td>
                <td class="pl-0 pr-0" style="width: 200px">
                  <div class="rounded-cell-center" style="min-width: 150px">
                    {{ convert.datetime(item.updated_at) }}
                  </div>
                </td>
                <td class="pl-0 pr-0" style="width: 200px">
                  <div class="rounded-cell-center" style="min-width: 150px">
                    {{ convert.datetime(item.created_at) }}
                  </div>
                </td>
                <td>
                  <div class="rounded-cell-right" align="right">
                    <v-btn fab small text @click="openItem(item)">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </div>
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
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
            <dialog-mid v-model="dialog" title="จัดการสิทธิ์การใช้งาน" :callback="confirm">
              <table style="width:100%">
                <thead>
                <tr>
                  <th v-for="(item, i) in tableHead" :key="i" :class="item.text"
                      style="color: #846537" class="pl-3"
                      :width="item.width">{{ item.title }}
                  </th>
                </tr>
                </thead>
                <tbody v-for="(item, index) in desserts" :key="index">
                <tr>
                  <td class="pr-0">
                    <div class="rounded-cell">
                      {{ item.title }}
                    </div>
                  </td>
                  <td class="pl-0 pr-0">
                    <div class="rounded-cell-center">
                      {{ item.diractory ? item.diractory : "-" }}
                    </div>
                  </td>
                  <td class="pl-0 pr-0">
                    <div class="rounded-cell-center">
                      <v-switch
                        v-model="per.read"
                        @click="changeSwitch(item)"
                        :value="item.id"
                        inset color="success"
                        hide-details class="m-0 p-0"
                      ></v-switch>
                    </div>
                  </td>
                  <td class="pl-0 pr-0">
                    <div class="rounded-cell-center">
                      <v-switch
                        v-model="per.create"
                        inset
                        :value="item.id"
                        hide-details class="m-0 p-0" color="success"
                      ></v-switch>
                    </div>
                  </td>
                  <td class="pl-0 pr-0">
                    <div class="rounded-cell-center">
                      <v-switch
                        v-model="per.update"
                        inset
                        :value="item.id"
                        hide-details class="m-0 p-0" color="success"
                      ></v-switch>
                    </div>
                  </td>
                  <td>
                    <div class="rounded-cell-right" style="padding: 10px" align="right">
                      <v-switch
                        v-model="per.delete"
                        inset
                        :value="item.id" color="success"
                        hide-details class="m-0 p-0"
                      ></v-switch>
                    </div>
                  </td>
                </tr>

                <tr v-if="item.children" v-for="(i, index) in item.children" :key="index">
                  <td class="pr-0">
                    <div class="rounded-cell">
                      {{ i.title }}
                    </div>
                  </td>
                  <td class="pl-0 pr-0">
                    <div class="rounded-cell-center">
                      {{ i.diractory ? i.diractory : "-" }}
                    </div>
                  </td>
                  <td class="pl-0 pr-0">
                    <div class="rounded-cell-center">
                      <v-switch
                        v-model="per.read"
                        @click="changeSwitch(item)"
                        :value="item.id"
                        inset color="success"
                        hide-details class="m-0 p-0"
                      ></v-switch>
                    </div>
                  </td>
                  <td class="pl-0 pr-0">
                    <div class="rounded-cell-center">
                      <v-switch
                        v-model="per.create"
                        inset
                        :value="item.id"
                        hide-details class="m-0 p-0" color="success"
                      ></v-switch>
                    </div>
                  </td>
                  <td class="pl-0 pr-0">
                    <div class="rounded-cell-center">
                      <v-switch
                        v-model="per.update"
                        inset
                        :value="item.id"
                        hide-details class="m-0 p-0" color="success"
                      ></v-switch>
                    </div>
                  </td>
                  <td>
                    <div class="rounded-cell-right" style="padding: 10px" align="right">
                      <v-switch
                        v-model="per.delete"
                        inset
                        :value="item.id" color="success"
                        hide-details class="m-0 p-0"
                      ></v-switch>
                    </div>
                  </td>
                </tr>
                </tbody>
              </table>
            </dialog-mid>
          </v-col>
          <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style src="../../../pos/product/index.css"/>
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
