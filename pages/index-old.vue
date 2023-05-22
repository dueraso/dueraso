<template>
  <div id="app">
    <v-main>
      <v-col cols="12">
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
                  v-show="checkPermission()">
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

          <v-col cols="12">
            <v-row>
              <v-col>
                <v-card color="#ff9800" dark>
                  <v-card-title class="text-h5">
                    ห้องสำหรับ 300 อุปกรณ์
                  </v-card-title>

                  <v-spacer></v-spacer>
                  <v-card-subtitle>วันนี้จองแล้ว {{ isCount[0] }}</v-card-subtitle>

                  <!-- <v-card-actions>
                    <v-btn text>
                      Listen Now
                    </v-btn>
                  </v-card-actions> -->
                </v-card>
              </v-col>
              <v-col>
                <v-card color="#4caf50" dark>
                  <v-card-title class="text-h5">
                    ห้องสำหรับ 500 อุปกรณ์
                  </v-card-title>

                  <v-spacer></v-spacer>
                  <v-card-subtitle>วันนี้จองแล้ว {{ isCount[1] }}</v-card-subtitle>

                  <!-- <v-card-actions>
                    <v-btn text>
                      Listen Now
                    </v-btn>
                  </v-card-actions> -->
                </v-card>
              </v-col>
              <v-col>
                <v-card color="#2196f3" dark>
                  <v-card-title class="text-h5">
                    ห้องสำหรับ 1,000 อุปกรณ์
                  </v-card-title>
                  <v-spacer></v-spacer>
                  <v-card-subtitle>วันนี้จองแล้ว {{ isCount[2] }}</v-card-subtitle>

                  <!-- <v-card-actions>
                    <v-btn text>
                      Listen Now
                    </v-btn>
                  </v-card-actions> -->
                </v-card>
              </v-col>
            </v-row>
          </v-col>
          <!-- <v-col v-for="(item, i) in items" :key="i" cols="12" ms="4">
          </v-col> -->
          <v-col>
            <v-sheet height="64">
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
            <v-sheet height="600">
              <v-calendar
                ref="calendar"
                v-model="focus"
                color="primary"
                :events="events"
                :event-color="getEventColor"
                :type="type"
                @click:event="showEvent"
                @click:more="viewDay"
                @click:date="viewDay"
                @change="updateRange"
                locale="th-th"
              ></v-calendar>
              <v-menu
                v-model="selectedOpen"
                :close-on-content-click="false"
                :activator="selectedElement"
                offset-x
              >
                <v-card color="grey lighten-4" min-width="350px" flat>
                  <v-toolbar :color="selectedEvent.color" dark>
                    <!-- <v-btn icon>
                      <v-icon>mdi-pencil</v-icon>
                    </v-btn> -->
                    <v-toolbar-title v-html="selectedEvent.name"></v-toolbar-title>
                    <v-spacer></v-spacer>
                    <!-- <v-btn icon>
                      <v-icon>mdi-heart</v-icon>
                    </v-btn> -->
                    <v-btn v-if="ishide" icon @click="cancelBooking()">
                      <v-icon>mdi-minus-circle</v-icon>
                    </v-btn>
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
                  <v-card-actions>
                    <!-- <v-btn text color="secondary" @click="selectedOpen = false">
                      Cancel
                    </v-btn> -->
                  </v-card-actions>
                </v-card>
              </v-menu>
            </v-sheet>
          </v-col>
        </v-card>
      </v-col>
      <v-dialog v-model="dialog" persistent max-width="600px">
        <v-card>
          <v-card-title>
            <span class="text-h5">{{ topic }}</span>
          </v-card-title>
          <hr/>
          <br/>
          <v-spacer></v-spacer>
          <v-card-text
          ><span class="text-h7">{{ detail }}</span>
          </v-card-text>
          <v-card-actions v-if="!isDel">
            <v-spacer></v-spacer>
            <v-btn v-show="check" color="blue darken-1" text @click="register()">
              ลงทะเบียน
            </v-btn>
            <v-btn
              v-show="!check"
              color="blue darken-1"
              text
              @click="checkActivate()"
            >
              เสร็จสิ้น
            </v-btn>
          </v-card-actions>
          <v-card-actions v-else>
            <v-spacer></v-spacer>
            <v-btn color="blue darken-1" text @click="deleteRoom()">
              ตกลง
            </v-btn>
            <v-btn color="blue darken-1" text @click="cancel()">
              ยกเลิก
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-main>
  </div>
</template>
<script>
import axios from "axios";
import dayjs from "dayjs";

let baseUrl = "https://api.zoom.yru.ac.th/";
// let baseUrl = "http://localhost:3030/";

export default {
  // component: inspire,
  data: () => ({
    isBooking: null,
    isNum: null,
    isCount: [],

    focus: "",
    type: "month",
    typeToLabel: {
      month: "เดือน",
      week: "สัปดาห์",
      day: "วัน"
    },
    selectedEvent: {},
    selectedElement: null,
    selectedOpen: false,
    events: [],
    colors: ["orange", "green", "blue"],
    dialog: false,
    isTemp: null,
    isEmail: null,
    topic: "ไม่พบบัญชี zoom ของท่าน",
    detail:
      "Email ของคุณยังไม่ได้ลงทะเบียน zoom ลงทะเบียนตอนนี กรุณากดลงทะเบียน",
    check: true,
    userInfo: "",
    profile: null,
    isDel: false,
    ishide: false
  }),
  async mounted() {
    // localStorage.clear()
    // this.checkUser();
    this.firstLoad();
  },
  methods: {
    checkPermission() {
      // console.log("dddd"+this.$auth.user.ngx_permissions.indexOf('booking.admin'))
      if (!this.$auth.loggedIn) return false
      if ((this.$auth.user.ngx_permissions.indexOf('booking.admin') > -1)
        || (this.$auth.user.ngx_permissions.indexOf('booking.super_admin') > -1)) {
        return true
      } else {
        return false
      }
    },
    async firstLoad() {
      this.$refs.calendar.checkChange();
      for (let i = 1; i <= 3; i++) {
        this.getCount(i);
      }
      // console.log(">>" + this.userInfo);
    },

    async cancelBooking() {
      this.isDel = true;
      this.dialog = true;
      this.topic = "แจ้งเตือน";
      this.detail = "คุณต้องการลบห้องและคืนลายเซ็น zoom ใช่หรือไม่";
    },
    async deleteRoom() {
      // console.log("++++" + this.selectedEvent.meeting_id);
      await axios.post(baseUrl + "deleteRoom", {
        meeting_id: this.selectedEvent.meeting_id
      });
      await new Promise(resolve => setTimeout(resolve, 100));
      await axios.post(baseUrl + "delRoom", {
        id: this.selectedEvent.id
      });
      window.location.reload();
      this.dialog = false;
    },
    async cancel() {
      this.dialog = false;
      await new Promise(resolve => setTimeout(resolve, 1000));
      this.isDel = false;
    },
    async getCount(i) {
      this.isTemp = await (
        await axios.post(baseUrl + "checkRoomFree", {
          id_room: i,
          start_date: `${dayjs().format("YYYY-MM-DD")} 00:00:00`,
          end_date: `${dayjs().format("YYYY-MM-DD")} 23:59:00`
        })
      ).data;
      this.isCount.push(this.isTemp.length);
      // if (i == 2) console.log(">>>>" + JSON.stringify(this.isTemp));
    },
    async getRoom(_start, _end) {
      let temp =
        this.profile.length > 0 && this.profile[0].id_permission > 1
          ? this.profile[0].id
          : "";

      await axios
        .post(baseUrl + "findBooking", {
          id: temp,
          start_date: _start.date,
          end_date: _end.date
        })
        .then(result => {
          // console.log("+++++++316>>" + JSON.stringify(result.data));
          this.isBooking = result.data;
          this.updateEvent();
        })
        .catch(err => {
          log.error(err);
        });
      this.isNum = this.isBooking.length;
    },
    viewDay({date}) {
      this.focus = date;
      this.type = "day";
    },
    getEventColor(event) {
      return event.color;
    },
    setToday() {
      this.focus = "";
    },
    prev() {
      this.$refs.calendar.prev();
    },
    next() {
      this.$refs.calendar.next();
    },
    async showEvent({nativeEvent, event}) {
      console.log("+++341");
      if (this.userInfo.email) {
        const open = () => {
          this.selectedEvent = event;
          this.selectedElement = nativeEvent.target;
          requestAnimationFrame(() =>
            requestAnimationFrame(() => (this.selectedOpen = true))
          );
        };

        if (this.selectedOpen) {
          // console.log("if +++");
          this.selectedOpen = false;
          requestAnimationFrame(() => requestAnimationFrame(() => open()));
        } else {
          // console.log("eles +++");
          open();
        }
        nativeEvent.stopPropagation();
        await new Promise(resolve => setTimeout(resolve, 100));
        this.checkTimeCancel();
      }
    },
    async updateRange({start, end}) {
      if (localStorage.getItem("authToken")) {
        await this.getUserInfo();
      }
      await this.checkUser({});
      if (start !== end) await this.getRoom(start, end);
    },
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },
    async updateEvent() {
      const events = [];

      this.isBooking.map(async d => {
        await axios
          .post(`${baseUrl}findId`, {
            id: d.id_user
          })
          .then(response => {
            let fullName =
              response.data[0].first_name + " " + response.data[0].last_name;
            events.push({
              id: d.id,
              name: d.title,
              meeting_id: d.meetings_id,
              password: d.meetings_password,
              timer:
                dayjs(d.start_date).format("HH:mm") +
                " - " +
                dayjs(d.end_date).format("HH:mm"),
              start: new Date(d.start_date),
              end: new Date(d.end_date),
              color: this.colors[d.id_room - 1],
              timed: true,
              bookingName: fullName,
              masterdepartmentname: response.data[0].masterdepartmentname
            });
          })
          .catch(response => {
            // console.log(response);
            dispatch(receiveError(response));
          });
      });
      this.events = [];
      this.events = events;
    },
    async checkTimeCancel() {
      this.ishide = new Date(this.selectedEvent.start).getTime() - dayjs() >= 3600000;
    },

    async checkEmail() {
      await axios.post(baseUrl + "checkMail", {
        email: this.userInfo.email
      }).then((response) => {
        // console.log(JSON.stringify(response.data))
        this.account = response.data;
        this.checkActivate();
        // if (response.data.code !== "1001" && response.data.code !== "1120") {
        //   console.log("415+++>" + JSON.stringify(temp.data))
        //   // await new Promise(resolve => setTimeout(resolve, 5000));
        // } else {
        //   console.log("419+++>" + temp.data)
        //   // this.warning = "ไม่พบข้อมูล กรุณาลงทะเบียน zoom ด้วย Email ของมหาลัย";
        // }
      }).catch((error) => {
        if (error.code === "1001") {
          this.dialog = true;
          this.account = {};
        } else {
          alert("เกิดขอผิดพลาด กรุณาลองใหม่อีกครั้ง ")
          // console.log(error)
          dispatch(receiveError(error));
        }
      });
      // let temp = await axios.post(baseUrl + "checkMail", {
      //   email: this.userInfo.email
      // });
    },

    async checkActivate() {
      // console.log(this.check+"<<+++----")

      this.check = localStorage.getItem("Pending") == null ? true : localStorage.getItem("Pending");
      let temp = "";
      await axios.post(baseUrl + "checkMail", {
        email: this.userInfo.email
      }).then((response) => {
        temp = response
        // console.log(JSON.stringify(response.data))
      }).catch((error) => {
        console.log(JSON.stringify(error))
      });


      // let temp = await axios.post(baseUrl + "checkMail", {
      //   email: this.userInfo.email
      // });
      // let checkPending = localStorage.getItem("Pending");
      // console.log(JSON.stringify(temp) + "<<" + temp.data.first_name);
      if (temp.data.first_name !== undefined && temp.data.first_name !== "") {
        this.account = temp.data;
        this.dialog = false;
        this.check = true;
        localStorage.setItem("Pending", this.check);
        this.checkUser(temp.data);
        // console.log("++++++++++++++++++")
        // this.checkUser({});
      } else {
        this.detail =
          "กรุณายื่นยันการลงทะเบียน zoom ใน Email ของท่านภายใน 30 วัน";
        this.dialog = true;
        this.account = {};
        // console.log(this.check+"<<+++")
        // window.location.reload();
      }
    },
    async register() {
      this.check = false;
      this.detail =
        "กรุณายื่นยันการลงทะเบียน zoom ใน Email ของท่านภายใน 30 วัน";
      let temp = await axios.post(baseUrl + "createUser", {
        email: this.userInfo.email
      });
      localStorage.setItem("Pending", this.check);
    },
    async addUser(temp) {
      await axios.post(baseUrl + "addUser", {
        id_zoom: temp.id_zoom,
        first_name: temp.first_name,
        last_name: temp.last_name,
        email: temp.email,
        masterdepartmentname: this.userInfo.staff.masterdepartmentname,
        // first_name: userInfo.first_name,
        // last_name: userInfo.last_name,
        // email: userInfo.email,
        id_permission: "2"
      });
    },
    async getUserInfo() {
      let isToken = localStorage.getItem("authToken");
      this.userInfo = await (
        await axios
          .post(`${baseUrl}getInfo`, {
            token: isToken
          })
          .catch(error => console.log(error))
      ).data.data;
      localStorage.setItem("mail", this.userInfo.email);
      localStorage.setItem("fullName", this.userInfo.name);
      this.checkEmail();
    },
    async checkUser(temp) {
      // console.log(JSON.stringify(this.profile[0].id_permission) + "<<userInfo");
      await axios
        .post(`${baseUrl}checkUser`, {
          email: this.userInfo.email
        })
        .then(response => {
          // console.log(JSON.stringify(temp) + "<<checkUser11");
          this.profile = response.data;
          if (response.data.length === 0 && Object.keys(temp).length > 0) {
            let tempProfile = {
              id_zoom: temp.id,
              first_name: temp.first_name,
              last_name: temp.last_name,
              email: temp.email,
              masterdepartmentname: temp.masterdepartmentname
            };
            // console.log(JSON.stringify(tempProfile) + "<<>>checkUser22");
            this.addUser(tempProfile);
          }
        })
        .catch(error => console.log(error));

      // this.profile = await (
      //   await axios
      //     .post(`${baseUrl}checkUser`, {
      //       email: this.userInfo.email
      //     })
      //     .catch(error => console.log(error))
      // ).data;
      // console.log(JSON.stringify(temp) + "<<");
      // if (this.profile.length == 0 && Object.keys(temp).length > 0) {
      //   let tempProfile = {
      //     id_zoom: temp.id,
      //     first_name: temp.first_name,
      //     last_name: temp.last_name,
      //     email: temp.email,
      //     masterdepartmentname: temp.masterdepartmentname
      //   };
      //   console.log(JSON.stringify(tempProfile) + "<<>>checkUser");
      //   this.addUser(tempProfile);
      // }
    }
  }
};
</script>
