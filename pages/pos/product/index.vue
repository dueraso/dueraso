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
          <head-bar :title="headTitle" :callback="openItem"/>
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
                  <div class="rounded-cell-center">{{ item.type.name }}</div>
                </td>
                <td class="pl-0 pr-0">
                  <div class="rounded-cell-center">{{ item.price }}</div>
                </td>
                <td align="center">
                  <div class="rounded-cell-center-img">
                    <v-img :src="item.imageUrl === null?null:JSON.parse(item.imageUrl).fullPath" height="40px"
                           width="40px" style="border-radius: 10px"></v-img>
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
                <td colspan="2">รายการทั้งหมด {{ desserts.meta.to }}/{{ desserts.meta.total }} รายการ</td>
                <td colspan="3">
                  <div style="float: right;">
                    <v-pagination
                      v-model="page"
                      :length="desserts.meta.last_page"
                      circle
                    ></v-pagination>
                  </div>
                </td>
              </tr>
              </tfoot>
            </table>
            <div class="text-center">
              <v-dialog v-model="dialog" persistent width="786px">
                <v-form ref="form" v-model="valid">
                  <v-card style="box-shadow: 5px 5px 10px rgba(119, 66, 26, 0.16); border-radius: 15px">
                    <v-card-title>
                      <h5 class="m-0" style="color: #5B4840">เพิ่ม / แก้ไขรายการ</h5>
                      <v-spacer/>
                      <v-btn icon @click="dialog = false" color="#5B4840">
                        <v-icon>mdi-close</v-icon>
                      </v-btn>
                    </v-card-title>

                    <v-card-text class="p-3" style="background-color: #F6F6F6" align="center">
                      <v-text-field v-model="item.name" label="ชื่อรายการ" outlined dense required
                                    style="border-radius: 15px" :rules="rules"/>
                      <v-textarea v-model="item.detail" label="รายละเอียด" outlined dense style="border-radius: 15px"/>
                      <v-row class="m-0">
                        <v-autocomplete
                          outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data
                          class="pr-4"
                          hide-selected return-object label="ประเภท" dense item-text="name" item-value="id"
                          style="border-radius: 15px"
                        ></v-autocomplete>
                        <v-text-field v-model="item.price" label="ราคา" outlined dense type="number" required
                                      style="border-radius: 15px"
                                      :rules="rules"/>
                      </v-row>
                      <!--                      <v-text-field v-model="item.url" label="ลิ้งค์รูป" outlined dense required :rules="rules"-->
                      <!--                                    style="border-radius: 15px"/>-->
                      <!--                      <div v-else>-->
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
                      <!--                      </div>-->
                      <v-btn color="#B27D41" dark @click="confirm" width="340" rounded class="mb-2">
                        ตกลง
                      </v-btn>
                    </v-card-text>
                  </v-card>
                </v-form>
              </v-dialog>
              ,
              <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
            </div>
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
<style scoped src="./index.css"/>
<script src="./index.js"/>
