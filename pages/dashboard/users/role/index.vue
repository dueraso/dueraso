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
<!--              <v-icon x-large>mdi-lock</v-icon>-->
<!--              จัดการสิทธิ์-->
<!--            </h5>-->
<!--            <v-spacer/>-->
<!--            <v-btn outlined @click="openItem({})" class="mr-3" v-show="myUtils('create', '/dashboard/users')">-->
<!--              <v-icon>mdi-plus</v-icon>-->
<!--              เพิ่ม-->
<!--            </v-btn>-->
<!--          </v-row>-->
          <head-bar title="จัดการสิทธิ์" :callback="openItem"/>
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
                    {{ item.detail?item.detail:"-" }}
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
            </table>

<!--            <v-simple-table fixed-header>-->
<!--              <template v-slot:default>-->
<!--                <thead>-->
<!--                <tr>-->
<!--                  <th v-for="(item, i) in tableHeadRole" :key="i" class="text-left" style="font-size: 14px"-->
<!--                      :width="item.width">{{ item.title }}-->
<!--                  </th>-->
<!--                  <th width="150px" class="p-0"></th>-->
<!--                </tr>-->
<!--                </thead>-->
<!--                <tbody>-->
<!--                <tr v-for="(item, index) in dessertsRole.data" :key="index">-->
<!--                  <td>{{ item.name }}</td>-->
<!--                  <td>{{ item.detail }}</td>-->
<!--                  <td>{{ convertDay(item.created_at) }}</td>-->
<!--                  <td>{{ convertDay(item.updated_at) }}</td>-->
<!--                  <td>-->
<!--&lt;!&ndash;                    <v-btn fab text @click="openItem(item)">&ndash;&gt;-->
<!--                      <v-icon @click="openItem(item)" class="p-1">-->
<!--                        mdi-shield-lock-outline-->
<!--                      </v-icon>-->
<!--&lt;!&ndash;                    </v-btn>&ndash;&gt;-->
<!--&lt;!&ndash;                    <v-btn fab text @click="openItem(item)">&ndash;&gt;-->
<!--                      <v-icon class="p-1">-->
<!--                        mdi-pen-->
<!--                      </v-icon>-->
<!--&lt;!&ndash;                    </v-btn>&ndash;&gt;-->
<!--&lt;!&ndash;                    <v-btn fab text>&ndash;&gt;-->
<!--                      <v-icon class="p-1">-->
<!--                        mdi-delete-->
<!--                      </v-icon>-->
<!--&lt;!&ndash;                    </v-btn>&ndash;&gt;-->
<!--                  </td>-->
<!--                </tr>-->
<!--                </tbody>-->
<!--              </template>-->
<!--            </v-simple-table>-->
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
    <tbody>
    <tr v-for="(item, index) in desserts.data" :key="index">
      <td class="pr-0">
        <div class="rounded-cell">
          {{ item.title }}
        </div>
      </td>
      <td class="pl-0 pr-0">
        <div class="rounded-cell-center">
          {{ item.diractory }}
        </div>
      </td>
      <td class="pl-0 pr-0">
        <div class="rounded-cell-center">
          <v-switch
            v-model="per.read"
            @click="changeSwitch(item)"
            :value="item.diractory"
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
            :value="item.diractory"
            hide-details class="m-0 p-0" color="success"
          ></v-switch>
        </div>
      </td>
      <td class="pl-0 pr-0">
        <div class="rounded-cell-center">
          <v-switch
            v-model="per.update"
            inset
            :value="item.diractory"
            hide-details class="m-0 p-0" color="success"
          ></v-switch>
        </div>
      </td>
      <td>
        <div class="rounded-cell-right" style="padding: 10px" align="right">
          <v-switch
            v-model="per.delete"
            inset
            :value="item.diractory" color="success"
            hide-details class="m-0 p-0"
          ></v-switch>
        </div>
      </td>
    </tr>
    </tbody>
  </table>
</dialog-mid>


<!--            <div class="text-center">-->
<!--              <v-dialog v-model="dialog" persistent>-->
<!--                <v-card>-->
<!--                  <v-card-title class="text-h5 grey lighten-2 mb-3">-->
<!--                    จัดการสิทธิ์การใช้งาน-->
<!--                  </v-card-title>-->

<!--                  <v-card-text class="pb-0">-->
<!--                    <v-simple-table fixed-header>-->
<!--                      <template v-slot:default>-->
<!--                        <thead>-->
<!--                        <tr>-->
<!--                          <th v-for="(item, i) in tableHead" :key="i" class="text-left" style="font-size: 14px"-->
<!--                              :width="item.width">{{ item.title }}-->
<!--                          </th>-->
<!--                        </tr>-->
<!--                        </thead>-->
<!--                        <tbody>-->
<!--                        <tr v-for="(item, index) in desserts.data" :key="index">-->
<!--                          <td>{{ item.title }}</td>-->
<!--                          <td>{{ item.diractory }}</td>-->
<!--                          <td>-->
<!--                            <v-switch-->
<!--                              v-model="per.read"-->
<!--                              @click="changeSwitch(item)"-->
<!--                              :value="item.diractory"-->
<!--                              inset-->
<!--                            ></v-switch>-->
<!--                          </td>-->
<!--                          <td>-->
<!--                            <v-switch-->
<!--                              v-model="per.create"-->
<!--                              inset-->
<!--                              :value="item.diractory"-->
<!--                            ></v-switch>-->
<!--                          </td>-->
<!--                          <td>-->
<!--                            <v-switch-->
<!--                              v-model="per.update"-->
<!--                              inset-->
<!--                              :value="item.diractory"-->
<!--                            ></v-switch>-->
<!--                          </td>-->
<!--                          <td>-->
<!--                            <v-switch-->
<!--                              v-model="per.delete"-->
<!--                              inset-->
<!--                              :value="item.diractory"-->
<!--                            ></v-switch>-->
<!--                          </td>-->
<!--                        </tr>-->
<!--                        </tbody>-->
<!--                      </template>-->
<!--                    </v-simple-table>-->
<!--                  </v-card-text>-->
<!--                  <v-divider></v-divider>-->

<!--                  <v-card-actions>-->
<!--                    <v-spacer></v-spacer>-->
<!--                    <v-btn-->
<!--                      color="primary"-->
<!--                      text-->
<!--                      @click="confirm"-->
<!--                    >-->
<!--                      ok-->
<!--                    </v-btn>-->
<!--                    <v-btn-->
<!--                      color="primary"-->
<!--                      text-->
<!--                      @click="dialog = false"-->
<!--                    >-->
<!--                      cancel-->
<!--                    </v-btn>-->
<!--                  </v-card-actions>-->
<!--                </v-card>-->
<!--              </v-dialog>-->
<!--            </div>-->
          </v-col>
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
