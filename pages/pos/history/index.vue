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
          <head-bar :title="headTitle">

            <v-row class="m-0" style="justify-content: right;">
              <v-dialog ref="dialog" v-model="dialogStart" :return-value.sync="dateStart" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateStart"
                    label="เลือกวันที่"
                    append-icon="mdi-calendar"
                    class="ml-2"
                    outlined
                    dense
                    style="border-radius: 15px; min-width: 200px; max-width: 200px"
                    hide-details
                    readonly
                    v-bind="attrs"
                    v-on="on"
                    color="#A57156"
                  ></v-text-field>
                </template>
                <v-date-picker v-model="dateStart" scrollable locale="th-TH" color="#A57156">
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="dialogStart = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="#A57156" @click="()=>{$refs.dialog.save(dateStart); getData()}">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-row>
          </head-bar>
          <v-col>
            <table style="width:100%">
              <thead>
              <tr>
                <th v-for="(item, i) in tableHead" :key="i" :class="item.text"
                    style="color: #846537" class="pl-3"
                    :width="item.width">{{ item.title }}
                </th>
<!--                <th width="120px" style="background-color: #f3f1ed;">-->
<!--                </th>-->
              </tr>
              </thead>
              <tbody>
              <tr v-for="(item, index) in desserts" :key="index" class="rounded-cell-all" v-if="desserts.length > 0">
                <td class="pr-0">
                  <a @click="openItem(item)" style="color: #846537">
                    {{ item.branch.title }}
                  </a>
                </td>
                <!--                <td class="pl-0 pr-0">-->
                <!--                  {{ item.branch.title }}-->
                <!--                </td>-->
                <td class="pl-0 pr-0">
                  {{ item.items.length }}
                </td>
                <!--                <td class="pl-0 pr-0">-->
                <!--                  {{ item.discountTotal }}-->
                <!--                </td>-->
                <td class="pl-0 pr-0">
                  <!--                  555-->
                  {{ convert.money(item.price) }}
                </td>
<!--                <td align="right">-->
<!--                  <v-btn fab small text @click="onDelete(item)" v-role-or-permission="`super|delete.discount`">-->
<!--                    <v-icon>mdi-delete-outline</v-icon>-->
<!--                  </v-btn>-->
<!--                </td>-->
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
    </v-app>

    <v-dialog v-model="dialog" persistent width="786">
      <v-form ref="form" v-model="valid">
        <v-card style="border-radius: 15px">
          <v-card-title>
            <h5 class="m-0" style="color: #5B4840">ข้อมูล</h5>
            <v-spacer/>
            <v-btn icon @click="dialog = false">
              <v-icon color="#5B4840">mdi-close</v-icon>
            </v-btn>
          </v-card-title>

          <v-card-text class="p-3" style="background: #F6F6F6" align="center">

            <!--            <v-row class="m-0">-->
            <b-form inline>
              <label class="pt-0 pb-0">สาขา: {{ item.branch.title }}</label>
            </b-form>
            <b-form inline>
              <v-card-text class="pt-0 pb-0">ลดทั้งหมด: {{ item.summaryDis }}</v-card-text>
            </b-form>

            <table style="width:100%">
              <thead>
              <tr>
                <th v-for="(item, i) in itemHead" :key="i" :class="item.text"
                    style="color: #846537" class="pl-3"
                    :width="item.width">{{ item.title }}
                </th>
              </tr>
              </thead>
              <tbody>
              <tr v-for="(i, index) in item.items" :key="index" class="rounded-cell-all">
                <td class="pr-0">
                  {{ i.employee.name }}
                </td>
                <td class="pl-0 pr-0">
                  {{ i.product.length }}
                </td>
                <td class="pl-0 pr-0">
                  {{ i.discountTotal }}
                </td>
                <td class="pl-0 pr-0">
                  {{ convert.money(i.price) }}
                </td>
                <td class="pl-0 pr-0">
                  {{ i.createdAt }}
                </td>
              </tr>
              </tbody>
              <tfoot>
              <tr>
                <!--                    <td colspan="2">รายการทั้งหมด {{ desserts.to }}/{{ desserts.total }} รายการ</td>-->
                <!--                    <td colspan="3">-->
                <!--                      <div style="float: right;">-->
                <!--                        <v-pagination-->
                <!--                          v-model="page"-->
                <!--                          :length="desserts.last_page"-->
                <!--                          circle-->
                <!--                        ></v-pagination>-->
                <!--                      </div>-->
                <!--                    </td>-->
              </tr>
              </tfoot>
            </table>
            <!--            <v-text-field color="#A57156" style="border-radius: 15px" v-model="item.employee.name" label="ชื่อส่วนลด" outlined dense required :rules="rules"/>-->
            <!--              <v-text-field-->
            <!--                color="#A57156" style="border-radius: 15px"-->
            <!--                v-model="item.branch.title" label="จำนวน" outlined dense-->
            <!--                required :rules="rules"/>-->
            <!--            </v-row>-->
            <v-btn color="#B27D41" dark rounded width="340" class="mb-2">
              ตกลง
            </v-btn>
          </v-card-text>
        </v-card>
      </v-form>
    </v-dialog>
  </div>
</template>

<style scoped src="../product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>

<script src="./index.js"/>
