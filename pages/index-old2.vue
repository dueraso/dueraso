<template>
  <div id="app">
    <v-main>
      <v-card elevation="0">
        <v-card-title style="margin: 12px; background-color: #EEF7F6;">
          <v-row style="padding: 12px">
            <v-col cols="12" sm="3" style="padding: 0">
              <h4
                style="align-self: center; color: #2096f3;  font-size: 20px">
                หน้าแรก
              </h4>
            </v-col>
            <v-spacer/>
            <v-col cols="12" sm="9" align="right" style="padding: 0">
              <v-btn
                outlined color="#2096f3" @click="()=>this.$router.push('/add-booking')" class="me-lg-3"
                v-show="$auth.loggedIn">
                <v-icon>mdi-plus</v-icon>
                เพิ่มรายการ
              </v-btn>
              <v-btn outlined color="#2096f3" @click="()=>this.$router.push('/my-booking')" v-show="$auth.loggedIn">
                <v-icon>mdi-checkbox-multiple-marked-circle-outline</v-icon>
                การจองของฉัน
              </v-btn>
            </v-col>
          </v-row>
        </v-card-title>
        <v-row style="padding: 12px;" v-show="zoom">
          <v-col cols="12" sm="4">
            <v-card color="#ff9800" dark>
              <v-card-title class="text-h5">
                ห้องสำหรับ 300 อุปกรณ์
              </v-card-title>
              <v-spacer></v-spacer>
              <v-card-subtitle>วันนี้จองแล้ว {{ zoomLicense.small }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card color="#4caf50" dark>
              <v-card-title class="text-h5">
                ห้องสำหรับ 500 อุปกรณ์
              </v-card-title>
              <v-spacer></v-spacer>
              <v-card-subtitle>วันนี้จองแล้ว {{ zoomLicense.medium }}</v-card-subtitle>
            </v-card>
          </v-col>
          <v-col cols="12" sm="4">
            <v-card color="#2196f3" dark>
              <v-card-title class="text-h5">
                ห้องสำหรับ 1,000 อุปกรณ์
              </v-card-title>
              <v-spacer></v-spacer>
              <v-card-subtitle>วันนี้จองแล้ว {{ zoomLicense.big }}</v-card-subtitle>
            </v-card>
          </v-col>
        </v-row>
        <v-col style="padding-left: 0px; padding-right: 0px">
          <v-sheet height="64" v-if="!loading">
            <v-toolbar flat>
              <v-btn outlined class="mr-4" color="grey darken-2" @click="setToday">
                วันนี้
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left</v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right</v-icon>
              </v-btn>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn outlined color="grey darken-2" v-bind="attrs" v-on="on">
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down</v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'day'">
                    <v-list-item-title>วัน</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>สัปดาห์</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>เดือน</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <v-sheet height="600" style="padding: 12px;">
            <v-calendar
              locale="th"
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              category-show-all
              @click:event="showEvent"
              @click:more="viewDay"
              @click:date="viewDay"
              @change="updateRange"
            >
              <template v-slot:day-body="{ date, week }">
                <div
                  class="v-current-time"
                  :class="{ first: date === week[0].date }"
                  :style="{ top: nowY }"
                ></div>
              </template>
            </v-calendar>
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" max-width="450px" flat>
                <v-toolbar :color="selectedEvent.color" dark>

                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-toolbar-title v-html="selectedEvent.name" v-bind="attrs" v-on="on"></v-toolbar-title>
                    </template>
                    <span>{{ selectedEvent.name }}</span>
                  </v-tooltip>
                  <v-spacer></v-spacer>
                  <v-tooltip top>
                    <template v-slot:activator="{ on, attrs }">
                      <v-btn
                        icon v-show="ishide" @click="status = true"
                        v-bind="attrs"
                        v-on="on">
                        <v-icon>mdi-minus-circle</v-icon>
                      </v-btn>
                    </template>
                    <span>ยกเลิกการจอง</span>
                  </v-tooltip>
                </v-toolbar>
                <v-card-text>
                  ชื่อ-สกุล:
                  <span v-html="selectedEvent.bookingName"></span>
                  <v-spacer></v-spacer>
                  สังกัด:
                  <span v-html="selectedEvent.masterdepartmentname"></span>
                  <v-spacer></v-spacer>
                  Meeting ID:
                  <span v-html="selectedEvent.meeting_id"></span>
                  <v-spacer></v-spacer>
                  Passcode:
                  <span v-html="selectedEvent.password"></span>
                  <v-spacer></v-spacer>
                  เวลา:
                  <span v-html="selectedEvent.timer"></span>
                  <v-spacer></v-spacer>
                </v-card-text>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
      </v-card>
      <DialogCon
        :callback="close" :confirm="confirm" :status="status" textBtn="ยกเลิก"
        detail="คุณต้องการลบรายการนี้ใช่หรือไม่"/>
      <DialogCon :callback="close" :confirm="register" :status="statusUser" :detail="detailUser"/>
    </v-main>
  </div>
</template>
<style lang="scss" src="./index.scss"/>
<script src="./index.js"/>
