<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading" style="max-width: 1200px">
          <head-bar :title="headTitle">
          </head-bar>
          <Fieldset legend="รายละเอียด" style="border-radius: 15px" class="text-left mx-0">
            <b-form inline>
              <v-text-field style="border-radius: 15px" outlined dense label="ชื่อร้าน" class="p-2"/>
              <v-text-field style="border-radius: 15px" outlined dense label="ชื่อรสาขา" class="p-2"/>
            </b-form>
            <b-form inline>
              <label class="pt-0 pb-0 text-left" style="color: #846537; font-weight: 500">สาขา:&nbsp;</label>
            </b-form>
            <b-form inline>
              <label class="pt-0 pb-0 text-left" style="color: #846537; font-weight: 500">ยอดทั้งหมด:&nbsp;</label>
            </b-form>
            <b-form inline>
              <label class="pt-0 pb-0 text-left" style="color: #846537; font-weight: 500"> ลดทั้งหมด:&nbsp;</label>
            </b-form>
          </Fieldset>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
.p-fieldset .p-fieldset-legend {
  border-radius: 10px;
  padding: 5px;
  border: unset;
  color: unset;
  background: unset;
  font-size: 16px;
  width: auto;
  margin: 0;
}

.p-fieldset-legend > a, .p-fieldset-legend > span {
  align-items: unset;
  justify-content: unset;
}
</style>
<script src="./index.js"/>
