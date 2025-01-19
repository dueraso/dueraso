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
          <head-bar :title="headTitle" per="add.add-budget" :callback="openItem"/>
          <v-col>
            <table style="width:100%">
              <thead>
              <tr>
                <th
                  v-for="(item, i) in tableHead" :key="i" :class="item.text"
                  style="color: #846537" class="pl-3"
                  :width="item.width">
                  {{ item.title }}
                </th>
                <th width="140px" style="background-color: #f3f1ed;">
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in desserts.data" :key="index" class="rounded-cell-all">
                <td class="pr-0">
                  {{ item.title }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.detail_short }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.view }}
                </td>
                <td align="right">
                  <v-btn fab small text @click="openItem(item)">
                    <v-icon>mdi-pen</v-icon>
                  </v-btn>
                  <v-btn fab small text @click="onDelete(item)">
                    <v-icon>mdi-delete-outline</v-icon>
                  </v-btn>
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <td colspan="2">รายการทั้งหมด {{ desserts.to }}/{{ desserts.total }} รายการ</td>
                <td colspan="3">
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
          </v-col>
        </v-container>
      </v-main>
      <dialog-mid :title="headTitle" v-model="dialogOpen" :callback="confirm">
        <v-text-field
          color="#A57156" style="border-radius: 15px" v-model="item.title" label="หัวข้อ" outlined
          dense required :rules="rules"/>
        <v-row class="my-0">
          <v-text-field
            color="#A57156" style="border-radius: 15px" v-model="item.icon" label="icon" outlined
            dense required :rules="rules" class="px-3"/>
          <v-text-field
            color="#A57156" style="border-radius: 15px" v-model="item.icon" label="ราคา" outlined
            dense required :rules="rules" class="px-3"/>
          <v-text-field
            color="#A57156" style="border-radius: 15px" v-model="item.icon" label="ราคาโปรโมชั่น" outlined
            dense required :rules="rules" class="px-3"/>
        </v-row>
        <v-row class="my-0">
          <v-text-field
            color="#A57156" style="border-radius: 15px" v-model="item.product_total" label="จำนวนสินค้า" outlined
            dense required :rules="rules" class="px-3"/>
          <v-text-field
            color="#A57156" style="border-radius: 15px" v-model="item.branch_total" label="จำนวนสาขา" outlined
            dense required :rules="rules" class="px-3"/>
          <v-text-field
            color="#A57156" style="border-radius: 15px" v-model="item.user_total" label="จำนวนผู้ใช้งาน" outlined
            dense required :rules="rules" class="px-3"/>
        </v-row>
        <v-combobox
          color="#A57156" style="border-radius: 15px"
          label="แอพ"
          dense
          outlined
          v-model="item.apps"
          :items="appsItems"
          return-object
          item-text="name"
          item-value="id"
          multiple
        ></v-combobox>
        <v-row class="my-0">
          <v-combobox
            color="#A57156" style="border-radius: 15px"
            class="px-3" label="ประเภทวัน"
            dense
            outlined
            v-model="item.type_day"
            :items="typeDayItems"
            return-object
            item-text="name"
            item-value="id"
          ></v-combobox>
          <v-text-field
            color="#A57156" style="border-radius: 15px" v-model="item.day_total" label="จำนวน" outlined
            dense required :rules="rules" class="px-3"/>
        </v-row>
        <quill-editor
          style="border-radius: 15px" class="pb-4"
          v-model="content"
          :options="editorOptions"
        />
      </dialog-mid>
    </v-app>
  </div>
</template>
<style>
.ql-toolbar.ql-snow {
  border-top-left-radius: 15px;
  border-top-right-radius: 15px;
}

.ql-toolbar.ql-snow + .ql-container.ql-snow {
  border-bottom-left-radius: 15px;
  border-bottom-right-radius: 15px;
}

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
<script src="./index.js"/>
