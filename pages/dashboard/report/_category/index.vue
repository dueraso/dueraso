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
          <HeadBar :title="headTitle">
            <v-row class="m-0" style="justify-content: right;">
              <v-dialog ref="dialog" v-model="modal" :return-value.sync="date" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="date"
                    label="วันที่เริ่ม"
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
                <v-date-picker v-model="date" scrollable locale="th-TH" color="#A57156">
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="modal = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="#A57156" @click="$refs.dialog.save(date)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>

              <v-dialog ref="dialog2" v-model="dialogDateEnd" :return-value.sync="dateEnd" persistent width="290px">
                <template v-slot:activator="{ on, attrs }">
                  <v-text-field
                    v-model="dateEnd"
                    label="วันที่สิ้นสุด"
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
                <v-date-picker v-model="dateEnd" scrollable locale="th-TH" color="#A57156">
                  <v-spacer></v-spacer>
                  <v-btn text color="#A57156" @click="dialogDateEnd = false">
                    ยกเลิก
                  </v-btn>
                  <v-btn text color="#A57156" @click="$refs.dialog2.save(dateEnd)">
                    ตกลง
                  </v-btn>
                </v-date-picker>
              </v-dialog>
            </v-row>
          </HeadBar>
          <v-col>
            <highchart
              :options="chartOptions"
              :modules="['exporting']"
              :update="watchers"
              style="width:100%;"
            />
            <!--            <div ref="chart"></div>-->
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped src="../../../pos/product/index.css">
.v-text-field--outlined >>> fieldset {
  border-color: #A57156;
}
</style>
<script src="./index.js"/>
