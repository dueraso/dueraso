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
          <head-bar :title="headTitle" per="add.add-budget" :callback="openItem">
          </head-bar>
          <v-col>
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
              <tr v-for="(item, index) in desserts.data" :key="index" class="rounded-cell-all">
                <td class="pr-0">
                  <a @click="openItem(item)" style="color: #846537">
                    {{ item.title }}
                  </a>
                </td>
                <td class="pl-0 pr-0">
                  {{ item.detail }}
                </td>
                <td style="justify-items: center;">
                  <v-switch
                    inset v-model="item.status?1:0" :value="item.use === '1'" @click="onUse(item)"
                    class="m-0 p-0" hide-details color="success"
                  ></v-switch>
                  <!--                  <v-btn fab small text @click="openCopy(item)" v-role-or-permission="`admin|edit.product`">-->
                  <!--                    <v-icon>mdi-content-copy</v-icon>-->
                  <!--                  </v-btn>-->
                  <!--                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`admin|edit.product`">-->
                  <!--                    <v-icon>mdi-pen</v-icon>-->
                  <!--                  </v-btn>-->
                  <!--                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`admin|delete.product`">-->
                  <!--                    <v-icon>mdi-delete-outline</v-icon>-->
                  <!--                  </v-btn>-->
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="2">รายการทั้งหมด {{ desserts.to }}/{{ desserts.total }} รายการ</td>
                <td colspan="4">
                  <div style="float: right;">
                    <v-pagination
                      v-model="page"
                      :length="desserts.last_page"
                      color="#A57156"
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
            <!--            <div class="text-center">-->
            <dialog-mid v-model="dialog" title="เพิ่ม / แก้ไขรายการ" :callback="confirm">
              <v-text-field
                v-model="item.title" label="ชื่อรายการ" outlined dense required
                style="border-radius: 15px" :rules="rules"/>
              <v-textarea v-model="item.detail" label="รายละเอียด" outlined dense style="border-radius: 15px"/>
              <!--                <v-row class="m-0">-->
              <!--                  <v-autocomplete-->
              <!--                    outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data-->
              <!--                    class="pr-4"-->
              <!--                    hide-selected return-object label="ประเภท" dense item-text="name" item-value="id"-->
              <!--                    style="border-radius: 15px"-->
              <!--                  ></v-autocomplete>-->
              <!--                  <v-text-field-->
              <!--                    v-model="item.price" label="ราคา" outlined dense type="number" required-->
              <!--                    style="border-radius: 15px"-->
              <!--                    :rules="rules"/>-->
              <!--                </v-row>-->

              <!--                <v-autocomplete-->
              <!--                  outlined required :rules="rules" :items="branch" v-model="selectBranch" hide-no-data-->
              <!--                  v-if="item.id != ''"-->
              <!--                  hide-selected return-object label="สาขา" dense item-text="title" item-value="id"-->
              <!--                  style="border-radius: 15px" multiple chips clearable deletable-chips small-chips-->
              <!--                ></v-autocomplete>-->

              <!--                <v-file-input-->
              <!--                  v-model="selectedFile"-->
              <!--                  accept="image/*"-->
              <!--                  label="เลือกรูปภาพ"-->
              <!--                  prepend-icon="mdi-image-multiple-outline"-->
              <!--                  outlined-->
              <!--                  @change="uploadImage"-->
              <!--                  style="border-radius: 15px"-->
              <!--                  dense-->
              <!--                  required hide-details-->
              <!--                  :rules="rules"-->
              <!--                  v-if="file == null"-->
              <!--                ></v-file-input>-->

              <!--                       Display the currently selected image -->'
              <!--                <v-col class="container mb-3 pt-0">-->
              <!--                  <v-img :src="file!= null?file.fullPath:''" alt="prom" class="image" style="width:200px">-->
              <!--                  </v-img>-->
              <!--                  <div class="middle" v-show="file">-->
              <!--                    <v-btn style="border-radius: 15px" color="red" dark @click="onDeleteImage">-->
              <!--                      <v-icon>-->
              <!--                        mdi-delete-outline-->
              <!--                      </v-icon>-->
              <!--                      ลบ-->
              <!--                    </v-btn>-->
              <!--                  </div>-->
              <!--                </v-col>-->
            </dialog-mid>
            <!--              <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>-->
            <!--            </div>-->
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped src="../../pos/product/index.css"/>
<script src="./index.js"/>
