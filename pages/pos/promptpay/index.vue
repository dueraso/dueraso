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
          <head-bar title="จัดการพร้อมเพย์" :callback="openItem"/>
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
              <tr v-for="(item, index) in desserts.data" :key="index">
                <td class="pr-0">
                  <div class="rounded-cell">{{ item.name }}</div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">{{ typeProm(item.type_promptpay) }}</div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">
                    {{ covertTypeProm(item.promptpay) }}
                  </div>
                </td>
                <td align="center">
                  <div class="rounded-cell-center-img">
                    <v-img :src="item.image_promptpay != null ? JSON.parse(item.image_promptpay).fullPath:''"
                           height="40px" width="40px" style="border-radius: 10px"></v-img>
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

            <v-dialog v-model="dialog" persistent width="786">
              <v-form ref="form" v-model="valid">
                <v-card style="border-radius: 15px">
                  <v-card-title>
                    <h5 class="m-0" style="color: #5B4840">เพิ่ม / แก้ไขพร้อมเพย์</h5>
                    <v-spacer/>
                    <v-btn icon @click="dialog = false">
                      <v-icon color="#5B4840">mdi-close</v-icon>
                    </v-btn>
                  </v-card-title>

                  <v-card-text class="p-3" style="background: #F6F6F6" align="center">
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
                    <v-btn color="#B27D41" @click="confirm" dark rounded width="340" class="mb-2"
                           style="border-radius: 15px">
                      ตกลง
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-form>
            </v-dialog>
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
<style src="../product/index.css">
</style>
<script src="./index.js"/>
