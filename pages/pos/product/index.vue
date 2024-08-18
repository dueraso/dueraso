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
          <!--          <button v-role="'product.writer'">Add Article</button>-->
          <!--          <button v-role="'add-budget.writer'">Add-Article</button>-->
          <!--          <p v-role:unless="'super_super'">You are not an Super Admin!</p>-->
          <head-bar :title="headTitle" :callback="openItem" per="add.product">
            <!--            <v-row class="m-0 text-right">-->
            <!--              <v-text-field outlined dense style="border-radius: 15px" hide-details></v-text-field>-->
            <!--            </v-row>-->

          </head-bar>
          <v-col>
            <table style="width:100%">
              <thead>
              <tr>
                <th v-for="(item, i) in tableHead" :key="i" :class="item.text"
                    style="color: #846537" class="pl-3"
                    :width="item.width">{{ item.title }}
                </th>
                <th width="140px" style="background-color: #f3f1ed;">
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in desserts.data" :key="index" class="rounded-cell-all">
                <td class="pr-0">
                  {{ item.name }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.type.name }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.branch.title }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.price }}
                </td>
                <td align="center">
                  <v-img :src="item.imageUrl === null?'/defaultimage.png':JSON.parse(item.imageUrl).fullPath"
                         height="40px"
                         width="40px" style="border-radius: 10px"></v-img>
                </td>
                <td align="right">
                  <v-btn fab small text @click="openCopy(item)" v-role-or-permission="`admin|edit.product`">
                    <v-icon>mdi-content-copy</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="openItem(item)" v-role-or-permission="`admin|edit.product`">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`admin|delete.product`">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="2">รายการทั้งหมด {{ desserts.meta.to }}/{{ desserts.meta.total }} รายการ</td>
                <td colspan="4">
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
            <div class="text-center">
              <dialog-mid v-model="dialog" title="เพิ่ม / แก้ไขรายการ" :callback="confirm">
                <v-text-field
                  v-model="item.name" label="ชื่อรายการ" outlined dense required
                  style="border-radius: 15px" :rules="rules"/>
                <v-textarea v-model="item.detail" label="รายละเอียด" outlined dense style="border-radius: 15px"/>
                <v-row class="m-0">
                  <v-autocomplete
                    outlined required :rules="rules" :items="instead" v-model="insteadSelect" hide-no-data
                    class="pr-4"
                    hide-selected return-object label="ประเภท" dense item-text="name" item-value="id"
                    style="border-radius: 15px"
                  ></v-autocomplete>
                  <v-text-field
                    v-model="item.price" label="ราคา" outlined dense type="number" required
                    style="border-radius: 15px"
                    :rules="rules"/>
                </v-row>
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
                <v-col class="container mb-3 pt-0">
                  <v-img :src="file!= null?file.fullPath:''" alt="prom" class="image" style="width:200px">
                  </v-img>
                  <div class="middle" v-show="file">
                    <v-btn style="border-radius: 15px" color="red" dark @click="onDeleteImage">
                      <v-icon>
                        mdi-delete-outline
                      </v-icon>
                      ลบ
                    </v-btn>
                  </div>
                </v-col>
              </dialog-mid>
              <dialog-delete v-model="dialogDelete" :confirm="confirmDel"/>
            </div>
          </v-col>
        </v-container>
      </v-main>
      <dialog-mid v-if="dialogCopy" v-model="dialogCopy" :callback="confirmCopy" title="เลือกสาขาที่ต้องการคัดลอก">
        <p style="font-size: 16px">ชื่อสินค้า: {{ itemSelect.name }}</p>
        <v-row class="m-0">
          <div
            class="m-1 col-auto p-2 pb-0 pt-0" style="background-color: #ECE6E0; border-radius: 15px"
            v-for="(item, i) in branch.data" :key="i">
            <v-checkbox
              v-model="copy"
              :label="item.title"
              :disabled="check(item.id)"
              :value="item"
              :rules="validateCheckbox"
              hide-details
              class="m-0"
              color="#B27D41"
            ></v-checkbox>
          </div>
        </v-row>
      </dialog-mid>
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
  border-radius: 15px;
}

.middle {
  transition: .5s ease;
  opacity: 0;
  position: absolute;
  top: 50%;
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
<style scoped src="./index.css">
</style>
<script src="./index.js"/>
