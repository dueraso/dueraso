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
          <head-bar :title="headTitle" per="add.add-budget"/>
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
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in desserts.data" :key="index" class="rounded-cell-all">
                <td class="pr-0">
                  <a @click="openItem">
                    {{ item.title }}
                  </a>
                  <v-icon color="red" small v-if="item.read == 0">mdi-new-box</v-icon>
                </td>
                <td class="pl-0 pr-0">
                  {{ item.detail }}
                </td>
                <td class="pl-0 pr-0">
                  {{ item.name }}
                </td>
                <td class="pl-0 pr-0">
                  {{ convert.datetime(item.created_at) }}
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
      <dialog-mid :title="headTitle" v-model="dialog">
        <v-text-field
          color="#A57156" style="border-radius: 15px" v-model="item.title" label="หัวข้อ" outlined
          dense required :rules="rules"/>
        <v-textarea
          color="#A57156" style="border-radius: 15px" v-model="item.detail_short" label="รายละเอียดแบบย่อ" outlined
          dense required :rules="rules"/>
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
