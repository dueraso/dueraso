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
    </v-app>

    <dialog-mid v-model="dialog" title="ข้อมูล">
      <Fieldset legend="รายละเอียด" style="padding-left: 12px; border-radius: 15px" class="text-left">
        <b-form inline v-if="item.branch.organization">
          <label class="pt-0 pb-0 text-left" style="color: #846537; font-weight: 500">ร้าน:&nbsp;</label>
          <label class="pt-0 pb-0 text-left">{{ item.branch.organization.title }}</label>
        </b-form>
        <b-form inline>
          <label class="pt-0 pb-0 text-left" style="color: #846537; font-weight: 500">สาขา:&nbsp;</label>
          <label class="pt-0 pb-0 text-left">{{ item.branch.title }}</label>
        </b-form>
        <b-form inline>
          <label class="pt-0 pb-0 text-left" style="color: #846537; font-weight: 500">ยอดทั้งหมด:&nbsp;</label>
          <label class="pt-0 pb-0 text-left">{{ convert.money(item.price) }}</label>
        </b-form>
        <b-form inline>
          <label class="pt-0 pb-0 text-left" style="color: #846537; font-weight: 500"> ลดทั้งหมด:&nbsp;</label>
          <label class="pt-0 pb-0 text-left"> {{ convert.money(item.summaryDis) }}</label>
        </b-form>
      </Fieldset>

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
          <td class="pl-0 pr-0 text-center">
            <v-chip
              color="green"
              text-color="white"
              @click="openOrder(i)">
              {{ i.total }}
            </v-chip>
          </td>
          <td class="pl-0 pr-0 text-center">
            {{ i.pay_type }}
          </td>
          <td class="pl-0 pr-0 text-center">
            {{ convert.money(i.discountTotal, 0) }}
          </td>
          <td class="pl-0 pr-0 text-center">
            {{ convert.money(i.price) }}
          </td>
          <td class="pl-0 pr-0">
            {{ i.createdAt }}
          </td>
        </tr>
        </tbody>
      </table>
      <dialog-mid title="ออเดอร์" v-model="dialogOrder" width="700">
        <table style="width:100%">
          <thead>
          <tr>
            <th
              v-for="(item, i) in orderHeads" :key="i" :class="item.text"
              style="color: #846537" class="pl-3"
              :width="item.width">
              {{ item.title }}
            </th>
          </tr>
          </thead>
          <tbody>
          <tr v-for="(item, index) in itemOrder.product" :key="index" class="rounded-cell-all">
            <td class="pr-0">
              {{ item.name }}
            </td>
            <td class="pl-0 pr-0">
              {{ item.total }}
            </td>
            <td class="pl-0 pr-0">
              {{ convert.money(item.price) }}
            </td>
          </tr>
          </tbody>
        </table>
      </dialog-mid>
    </dialog-mid>
  </div>
</template>

<style scoped src="../product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
<style>
.p-fieldset .p-fieldset-legend {
  border-radius: 10px;
  padding: 5px;
  border: unset;
  color: unset;
  background: unset;
  font-size: 16px;
  margin: 0;
}

.p-fieldset-legend > a, .p-fieldset-legend > span {
  align-items: unset;
  justify-content: unset;
}
</style>

<script src="./index.js"/>
