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
          <head-bar :title="headTitle" :callback="openItem" per="add.promptpay"/>
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
                  {{ item.name }}
                </td>
                <td class="pl-0 pr-0">
                  {{ typeProm(item.type_promptpay) }}
                </td>
                <td class="pl-0 pr-0">
                  {{ covertTypeProm(item.promptpay) }}
                </td>
                <td align="center">
                  <v-img :src="item.image_promptpay != null ? JSON.parse(item.image_promptpay).fullPath:''"
                         height="40px" width="40px" style="border-radius: 10px"></v-img>
                </td>
                <td align="right">
                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`admin|edit.promptpay`">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`admin|delete.promptpay`">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="2">รายการทั้งหมด {{ desserts.meta.to }}/{{ desserts.meta.total }} รายการ</td>
                <td colspan="3">
                  <div style="float: right;">
                    <v-pagination
                      v-model="page"
                      :length="desserts.meta.last_page"
                      color="#A57156"
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>

            <dialog-mid v-model="dialog" title="เพิ่ม / แก้ไขพร้อมเพย์" :callback="confirm">
              <v-row class="m-0">
                <v-text-field color="#A57156" style="border-radius: 15px" v-model="item.name" label="ชื่อ"
                              outlined dense required :rules="rules" class="pr-4"/>
                <v-select
                  outlined required style="border-radius: 15px" :rules="rules" :items="instead"
                  v-model="insteadSelect" hide-no-data
                  hide-selected
                  return-object
                  label="ประเภทพร้อมเพย์"
                  dense
                  item-text="name"
                  item-value="id"
                  color="#A57156"
                ></v-select>
              </v-row>
              <v-text-field color="#A57156" style="border-radius: 15px" v-model="item.promptpay"
                            :label="insteadSelect.name"
                            outlined dense type="number" required
                            :rules="rules" v-if="insteadSelect.id != 3"/>
              <div v-else>
                <v-file-input
                  v-model="selectedFile"
                  accept="image/*"
                  label="เลือกรูปภาพ"
                  prepend-icon="mdi-image-multiple-outline"
                  outlined
                  @change="uploadImage"
                  style="border-radius: 15px"
                  dense
                  required hide-details
                  :rules="rules"
                  v-if="file == null"
                ></v-file-input>

                <!--                       Display the currently selected image -->'
                <div class="container mb-3">
                  <v-img :src="file!= null?file.fullPath:''" alt="prom" class="image" style="width:200px"/>
                  <div class="middle" v-show="file">
                    <v-btn style="border-radius: 15px" color="red" dark @click="onDeleteImage">
                      <v-icon>
                        mdi-delete-outline
                      </v-icon>
                      ลบ
                    </v-btn>
                  </div>
                </div>
              </div>
            </dialog-mid>
            <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>

.image {
  opacity: 1;
  display: block;
  width: 100%;
  height: auto;
  transition: .5s ease;
  backface-visibility: hidden;
}

.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 63%;
  left: 50%;
  transform: translate(-50%, -50%);
  -ms-transform: translate(-50%, -50%);
  text-align: center;
}

.container:hover .image {
  opacity: 0.3;
}

.container:hover .middle {
  opacity: 1;
}
</style>
<style scoped src="../product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
<script src="./index.js"/>
