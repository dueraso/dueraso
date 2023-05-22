<template>
  <div id="app">
    <v-main>
      <v-card elevation="0">
        <v-card-title style="margin: 12px; background-color: #EEF7F6;">
          <v-row style="padding: 12px">
            <h4 style="align-self: center; color: #2096f3; font-size: 20px">
              จองห้อง/สร้างห้อง
            </h4>
          </v-row>
        </v-card-title>
        <v-row style="padding: 12px">
          <!--        <v-col cols="12">-->
          <!--          <v-date-picker-->
          <!--            :landscape="landscape"-->
          <!--            v-model="date"-->
          <!--            :allowed-dates="allowedDates"-->
          <!--            full-width-->
          <!--            class="mt-4"-->
          <!--            locale="th"-->
          <!--            @change="ChangeDate()"-->
          <!--          ></v-date-picker>-->
          <!--        </v-col>-->

          <v-col cols="12" sm="4">
            <v-menu
              ref="menuDate"
              v-model="menuDate"
              :close-on-content-click="false"
              transition="scale-transition"
              offset-y
              max-width="290px"
              min-width="auto"
              hide-details
            >
              <template v-slot:activator="{ on, attrs }">
                <v-text-field
                  outlined
                  dense
                  v-model="dateFormatted"
                  label="วันที่"
                  append-icon="mdi-calendar-outline"
                  persistent-hint
                  v-bind="attrs"
                  @blur="date = parseDate(dateFormatted)"
                  v-on="on"
                  hide-details
                ></v-text-field>
              </template>
              <v-date-picker
                :allowed-dates="allowedDates"
                locale="th"
                v-model="date"
                @input="menuDate = false"
                @change="getRoom"
              ></v-date-picker>
            </v-menu>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              label="เริ่ม"
              :items="itemStart"
              v-model="timeStart"
              @change="startTimeChange()"
              dense
              outlined
              required
              hide-details
              append-icon="mdi-clock-time-four-outline"
            ></v-select>
          </v-col>
          <v-col cols="12" sm="4">
            <v-select
              :items="itemEnd"
              v-model="timeEnd"
              @click="endTime"
              @change="checkRoomFree"
              label="ถึง"
              dense
              outlined
              hide-details
              required
              append-icon="mdi-clock-time-four-outline"
            ></v-select>
          </v-col>
        </v-row>
        <v-col cols="12" style="padding: 0px">
          <v-item-group mandatory>
            <!--            <v-container>-->
            <!--              <v-row>-->
            <!--                <v-col v-for="n in 3" :key="n" md="4">-->
            <!--                  <v-item v-slot="{ active, toggle }" @change="onChangeItem(n)">-->
            <!--                    <v-card-->
            <!--                      class="d-flex align-center"-->
            <!--                      height="200"-->
            <!--                      @click="toggle"-->
            <!--                      :color="active ? 'primary' : ''"-->
            <!--                      :disabled="checkRoomDes(n)"-->
            <!--                    >-->
            <v-row style="padding: 12px;">
              <v-col cols="12" sm="4" v-for="(room, index) in roomSizeList" :key="index">
                <v-item v-slot="{ active, toggle }" @change="onChangeItem(index)">
                  <v-hover v-slot="{ hover }">
                    <v-scroll-y-transition>
                      <v-card
                        outlined
                        :elevation="hover ? 10 : 0"
                        :class="{ 'on-hover': hover }"
                        class="mx-auto"
                        @click="toggle"
                        :color="active ? '#2096f3' : ''"
                        :dark="active" :disabled="checkRoomDes(index+1)">
                        <v-card-title class="text-h5">
                          <v-row style="padding: 12px">
                            <v-icon x-large class="pr-2">mdi-account-group-outline</v-icon>
                            {{ room.name }}
                            <v-spacer/>
                            <p style="margin: 0px; font-size: 15px;">
                              {{ checkRoomDes(index + 1) ? "ไม่พร้อมใช้งาน" : "พร้อมใช้งาน" }}
                            </p>
                          </v-row>
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-card-subtitle>
                          <v-row style=" padding: 12px">
                            <p style="margin-top: 6px">
                              ขนาดห้อง {{ room.size }}
                            </p>
                            <v-spacer/>
                            กดเพื่อเลือกห้อง
                          </v-row>
                        </v-card-subtitle>
                      </v-card>
                    </v-scroll-y-transition>
                  </v-hover>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-col>
        <v-card-title style="margin: 12px; background-color: #EEF7F6;">
          <v-row style="padding: 12px">
            <h6 style="align-self: center; color: #2096f3;  font-size: 18px">
              เลือกห้อง
            </h6>
          </v-row>
        </v-card-title>


        <v-col cols="12" style="padding: 0">
          <v-item-group>
            <v-row style="padding: 12px;">
              <v-col cols="12" sm="2" v-for="room in roomsTotal" :key="room">
                <v-item v-slot="{ active, toggle }" @change="roomsSelect = room">
                  <v-hover v-slot="{ hover }">
                    <v-scroll-y-transition>
                      <v-card
                        outlined
                        :elevation="hover ? 10 : 0"
                        :class="{ 'on-hover': hover }"
                        class="mx-auto"
                        @click="toggle"
                        :color="active ? '#2096f3' : ''"
                        :dark="active" :disabled="allowRoom(room)">
                        <v-card-title class="text-h5 pb-0">
                          <v-row style="padding: 12px">
<!--                            <v-icon x-large class="pr-2">mdi-account-group-outline</v-icon>-->
                            ห้องที่ {{ room }}
                            <v-spacer/>
                            <p style="margin: 0px; font-size: 15px;">
                              กดเพื่อเลือกห้อง
                            </p>
                          </v-row>
                        </v-card-title>
                        <v-spacer></v-spacer>
                        <v-card-subtitle class="pb-0 pt-0">
                          <v-row class="p-0 m-0">
                            <v-spacer/>
                            <p style="margin-top: 6px">
                              {{ allowRoom(room)?"ไม่ว่าง":"ว่าง"}}
                            </p>
<!--                            กดเพื่อเลือกห้อง-->
                          </v-row>
                        </v-card-subtitle>
                      </v-card>
                    </v-scroll-y-transition>
                  </v-hover>
                </v-item>
              </v-col>
            </v-row>
          </v-item-group>
        </v-col>
<!--        <v-col cols="11">-->
<!--          <v-radio-group v-model="roomNumber" row style="padding: 0px">-->
<!--            <v-radio-->
<!--              v-for="num in radioRoom"-->
<!--              :key="num"-->
<!--              :label="`ห้อง ${num}`"-->
<!--              :value="num"-->
<!--              :disabled="allowRoom(num)"-->
<!--              style="min-width: 150px"-->
<!--              required-->
<!--            ></v-radio>-->
<!--          </v-radio-group>-->
<!--        </v-col>-->


        <v-row class="m-0">
          <v-col cols="12" sm="10">
            <v-text-field
              label="หัวข้อการประชุม"
              :rules="[rules.required]"
              hide-details="auto"
              outlined
              dense
              v-model="title"
              required
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="2">
            <v-text-field
              :rules="[rules.required]"
              hide-details="auto"
              outlined
              dense
              label="จำนวนคนเข้าร่วม"
              required
              type="number"
              v-model="participants"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="12">
            <v-text-field
              label="ชื่อ-สกุล"
              hide-details="auto"
              outlined
              dense
              required
              :value="this.$auth.user.name"
              readonly
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              hide-details="auto"
              outlined
              dense
              required
              readonly
              label="สังกัด"
              :value="$auth.user.staff.masterdepartmentname"
            ></v-text-field>
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              label="ตำแหน่ง"
              hide-details="auto"
              outlined
              dense
              required
              readonly
              :value="$auth.user.staff.staffpositionname"
            ></v-text-field>
          </v-col>
<!--          <v-col cols="12" sm="12">-->
<!--            <v-row>-->
<!--              &lt;!&ndash;            <p style="margin-top: 20px"></p>&ndash;&gt;-->
<!--              -->
<!--              &lt;!&ndash;            <p style="margin-top: 20px">ระบุจำนวนคน</p>&ndash;&gt;-->
<!--              &lt;!&ndash;            <v-col cols="1">&ndash;&gt;-->
<!--              &lt;!&ndash;              <v-text-field&ndash;&gt;-->
<!--              &lt;!&ndash;                :rules="rules"&ndash;&gt;-->
<!--              &lt;!&ndash;                hide-details="auto"&ndash;&gt;-->
<!--              &lt;!&ndash;                outlined&ndash;&gt;-->
<!--              &lt;!&ndash;                dense&ndash;&gt;-->
<!--              &lt;!&ndash;                required&ndash;&gt;-->
<!--              &lt;!&ndash;                v-model="participants"&ndash;&gt;-->
<!--              &lt;!&ndash;              ></v-text-field>&ndash;&gt;-->
<!--              &lt;!&ndash;            </v-col>&ndash;&gt;-->
<!--            </v-row>-->
<!--          </v-col>-->
        </v-row>
        <!-- <v-checkbox
          v-model="delegateCheck"
          hide-details
          class="shrink mr-2 mt-0"
        ></v-checkbox>
        <v-text-field
          :disabled="!delegateCheck"
          label="I only work if you check the box"
        ></v-text-field> -->
        <v-row class="ml-0 mr-0">
          <v-checkbox
            v-show="delegatePer()"
            style="padding: 12px; margin: 0px"
            v-model="delegateCheck"
            hide-details
            label="จองแทน"
          ></v-checkbox>
          <v-autocomplete
            v-show="delegatePer()"
            :disabled="!delegateCheck"
            outlined
            auto-select-first
            chips
            clearable
            deletable-chips
            small-chips
            :items="instead"
            v-model="insteadSelect"
            :loading="isLoading"
            hide-no-data
            hide-selected
            :search-input.sync="search"
            return-object
            item-text="special.title_1"
            item-value="id"
            label="กรุณากรอกชื่อ (สำหรับบุคลากรเท่านั้น)"
            dense hide-details
            style="padding-right: 12px"
          ></v-autocomplete>

          <v-col cols="12">
            <v-item-group mandatory>
              <v-row>
                <v-col v-for="(data,index) in dup" :key="index">
                  <v-item v-slot="{ active, toggle }" @change="onChangeDup(data)">
                    <v-scroll-y-transition>
                      <v-card
                        @click="toggle"
                        :color="active ? '#2096f3' : ''"
                        :dark="active">
                        <v-card-title style="font-size: 16px">
                          {{ data }}
                        </v-card-title>
                      </v-card>
                    </v-scroll-y-transition>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-col>
          <v-col cols="12" v-show="dup.indexOf(this.dupSelect) === 1">
            <v-card-title style="background-color: #EEF7F6;">
              <v-row style="padding: 12px">
                <h6 style="align-self: center; color: #2096f3;  font-size: 16px">
                  เลือกรายการจองซ้ำ
                </h6>
              </v-row>
            </v-card-title>
          </v-col>
          <v-col cols="12" v-show="dup.indexOf(this.dupSelect) === 1">
            <v-item-group mandatory>
              <v-row>
                <v-col v-for="(data,index) in dupType" :key="index" cols="12" sm="3">
                  <v-item v-slot="{ active, toggle }" @change="onChangeDupType(data)">
                    <v-scroll-y-transition>
                      <v-card
                        @click="toggle"
                        :color="active ? '#2096f3' : ''"
                        :dark="active">
                        <v-card-title class="text-center" style="font-size: 16px">
                          {{ data.name }}
                        </v-card-title>
                      </v-card>
                    </v-scroll-y-transition>
                  </v-item>
                </v-col>
              </v-row>
            </v-item-group>
          </v-col>
          <v-col cols="3" v-show="dup.indexOf(this.dupSelect) === 1">
            <v-text-field
              type="number"
              outlined
              dense
              label="ทำซ้ำทั้งหมด"
              v-model="total"
              @input="changeTotal">
            </v-text-field>
          </v-col>
          <v-col cols="9" v-show="dup.indexOf(this.dupSelect) === 1">
            <v-text-field
              outlined
              dense
              v-model="endBook"
              readonly
              label="สิ้นสุดเมื่อ">
            </v-text-field>
          </v-col>


<!--        <v-col cols="12">-->
<!--          <v-row>-->
<!--            <v-checkbox-->
<!--              label="จองซ้ำ"-->
<!--              v-model="duplicate"-->
<!--              style="margin-right: 30px;"-->
<!--              @change="checkDuplicate()"-->
<!--            ></v-checkbox>-->
<!--            <v-radio-group-->
<!--              v-model="radioDuplicate"-->
<!--              @change="checkDuplicateDate()"-->
<!--              row-->
<!--            >-->
<!--              <v-radio-->
<!--                key="duplicate1"-->
<!--                label="รายสัปดาห์"-->
<!--                style="min-width: 150px"-->
<!--                :disabled="!duplicate"-->
<!--                required-->
<!--              ></v-radio>-->
<!--              <v-radio-->
<!--                key="duplicate2"-->
<!--                label="รายเดือน"-->
<!--                :disabled="!duplicate"-->
<!--                style="min-width: 150px"-->
<!--                required-->
<!--              ></v-radio>-->
<!--            </v-radio-group>-->
<!--            <v-col cols="2">-->
<!--              <p class="text-right" style="margin-top: 10px">-->
<!--                สิ้นสุดการทำจองซ้ำ-->
<!--              </p>-->
<!--            </v-col>-->
<!--            <v-col>-->
<!--              <v-select-->
<!--                :items="endDuplicate"-->
<!--                v-model="endDuplicateDate"-->
<!--                :disabled="!duplicate"-->
<!--                dense-->
<!--                outlined-->
<!--                required-->
<!--              ></v-select>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--        </v-col>-->
        </v-row>
        <v-row class="ml-2 mr-0">
<!--        <v-checkbox-->
<!--          v-model="delegateCheck"-->
<!--          label="จองแทน"-->
<!--          v-if="$auth.user.ngx_permissions.indexOf('zoom.admin') !== -1"-->
<!--        ></v-checkbox>-->
<!--        <v-col v-if="$auth.user.ngx_permissions.indexOf('zoom.admin') !== -1">-->
<!--          <v-text-field-->
<!--            v-model="delegateMail"-->
<!--            hide-details="auto"-->
<!--            outlined-->
<!--            dense-->
<!--            placeholder="กรุณากรอก Email"-->
<!--            :disabled="!delegateCheck"-->
<!--          ></v-text-field>-->
<!--        </v-col>-->
        </v-row>
        <v-row class="m-3">
            <v-spacer/>
              <v-btn color="primary" @click="submit()" outlined>
                <v-icon>mdi-checkbox-marked-circle</v-icon>
                บันทึก
              </v-btn>
        </v-row>
        <v-dialog v-model="dialog" persistent max-width="600px">
          <v-card>
            <v-card-title>
              <span class="text-h5">แจ้งเตือน</span>
            </v-card-title>
            <hr/>
            <br/>
            <v-spacer></v-spacer>
            <v-card-title>
              <span class="text-h8 text-center">{{ detail }}</span>
            </v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="dialog = false">
                ตกลง
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <!--        </v-row>-->
      </v-card>
    </v-main>
  </div>
</template>
<script src="./index.js"/>
<!--<script>-->
<!--import axios from "axios";-->
<!--import dayjs from "dayjs";-->
<!--require('dayjs/locale/th')-->
<!--const weekday = require('dayjs/plugin/weekday')-->
<!--dayjs.extend(weekday)-->
<!--const moment = require('moment-business-days');-->

<!--let baseUrl = "https://api.zoom.yru.ac.th/";-->
<!--// let baseUrl = "http://localhost:3030/";-->
<!--export default {-->
<!--  data(vm) {-->
<!--    return {-->
<!--      menuDate: false,-->
<!--      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),-->
<!--      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000)-->
<!--        .toISOString()-->
<!--        .substr(0, 10),-->
<!--      landscape: true,-->
<!--      menu: false,-->
<!--      detail: "",-->
<!--      //radio menu-->
<!--      radioRoom: 0,-->
<!--      radioDuplicate: 0,-->
<!--      //dropdown-->
<!--      items: ["จอง", "ยกเลิก"],-->
<!--      bookingAll: null,-->
<!--      itemsTime: [],-->
<!--      itemsTimeStart: [],-->
<!--      itemsTimeEnd: [],-->
<!--      endDuplicate: [],-->
<!--      endDuplicateDate: null,-->
<!--      dup: ['จองปกติ', 'จองซ้ำ'],-->
<!--      textRoomSize: [-->
<!--        {-->
<!--          name: "ห้องขนาดเล็ก",-->
<!--          icon: "mdi-size-s",-->
<!--          size: "300 device"-->
<!--        },-->
<!--        {-->
<!--          name: "ห้องขนาดกลาง",-->
<!--          icon: "mdi-size-m",-->
<!--          size: "500 device"-->
<!--        },-->
<!--        {-->
<!--          name: "ห้องขนาดใหญ่",-->
<!--          icon: "mdi-size-l",-->
<!--          size: "1,000 device"-->
<!--        }-->
<!--      ],-->
<!--      device: 0,-->
<!--      isEmail: null,-->
<!--      permission: null,-->
<!--      account: null,-->
<!--      participants_total: null,-->
<!--      delegateCheck: false,-->
<!--      delegateMail: null,-->
<!--      duplicate: false,-->
<!--      participants: null,-->
<!--      guest: null,-->

<!--      profile: null,-->
<!--      title: "",-->
<!--      isRoom: null,-->
<!--      roomNumber: null,-->
<!--      isStatus: 1,-->
<!--      start_date: null,-->
<!--      startTime: null,-->
<!--      endTime: null,-->
<!--      end_date: null,-->
<!--      checkRoom: null,-->
<!--      test: false,-->
<!--      disNum: 0,-->
<!--      dialog: false,-->
<!--      roomFree: "",-->
<!--      dupSelect: 0,-->
<!--      dupType: [-->
<!--        {-->
<!--          type: 'day',-->
<!--          name: 'รายวัน'-->
<!--        },-->
<!--        {-->
<!--          type: 'weekday',-->
<!--          name: 'รายวันไม่รวม ส-อ'-->
<!--        },-->
<!--        {-->
<!--          type: 'week',-->
<!--          name: 'รายสัปดาห์'-->
<!--        },-->
<!--        {-->
<!--          type: 'month',-->
<!--          name: 'รายเดือน'-->
<!--        }-->
<!--      ],-->
<!--      dupTypeSelect: {},-->
<!--      total: 0,-->
<!--      disabled: 0,-->
<!--      endBook: '',-->
<!--      entries: [],-->
<!--      insteadSelect: null,-->
<!--      isLoading: false,-->
<!--      search: null,-->
<!--      rules: [value => !!value || "จำเป็นต้องกรอก."]-->
<!--    };-->
<!--  },-->
<!--  computed:{-->
<!--    instead() {-->
<!--      return this.entries-->
<!--    },-->
<!--  },-->
<!--  watch:{-->
<!--    date(val) {-->
<!--      this.dateFormatted = this.formatDate(this.date)-->
<!--    },-->
<!--    async search(val) {-->
<!--      if (val.length < 2) return-->
<!--      if (this.isLoading) return-->
<!--      this.isLoading = true-->
<!--      await axios.get(`https://api2.yru.ac.th/hr/v1/staffs`, {-->
<!--        params: {-->
<!--          q: val-->
<!--        }-->
<!--      }).then((res) => {-->
<!--        const {count, data} = res.data-->
<!--        this.count = count-->
<!--        this.entries = data-->
<!--      }).catch((e) => {-->
<!--        console.log(e)-->
<!--      }).finally(() => (this.isLoading = false))-->
<!--    },-->
<!--  },-->
<!--  async mounted() {-->
<!--    console.log(this.$auth.user)-->
<!--    this.startTimeChange()-->

<!--    this.onChangeItem(1);-->
<!--    let temp = null;-->
<!--    for (let i = 0; i <= 23; i++) {-->
<!--      for (let j = 0; j <= 1; j++) {-->
<!--        temp = j === 1 ? "30" : "00";-->
<!--        this.itemsTime.push(i + ":" + temp);-->
<!--      }-->
<!--    }-->
<!--    //-->
<!--    this.ShiftTime();-->
<!--    this.check();-->
<!--  },-->

<!--  methods: {-->
<!--    async addUser() {-->
<!--      if(this.insteadSelect == null) return-->
<!--      let staff_type_name = this.insteadSelect.special.title_4.split('(')[1].replace(")","")-->
<!--      await this.$axios.post(`user`, {-->
<!--        'name': this.insteadSelect.special.title_1,-->
<!--        'first_name': this.insteadSelect.first_name,-->
<!--        'last_name': this.insteadSelect.last_name,-->
<!--        'email': this.insteadSelect.email,-->
<!--        'type': 'staff',-->
<!--        'staff': this.insteadSelect.id,-->
<!--        'staff_position_name': this.insteadSelect.position_name,-->
<!--        'staff_type_name': staff_type_name,-->
<!--        'master_department_name': this.insteadSelect.department_name,-->
<!--        'student': null,-->
<!--        'student_code': null,-->
<!--        'faculty_name': null,-->
<!--        'program_name': null,-->
<!--      }).then((res) => {-->
<!--        // console.log('ok')-->
<!--      })-->
<!--        .catch((error) => {-->
<!--          console.log(error)-->
<!--        })-->
<!--    },-->
<!--    delegatePer() {-->
<!--      return (this.$auth.user.ngx_permissions.indexOf('zoom.admin') !== -1)-->
<!--    },-->
<!--    changeTotal() {-->
<!--      console.log(">>"+this.date + " " + this.endTime)-->
<!--      if (this.dupTypeSelect.type === 'weekday') {-->
<!--        this.endBook = dayjs(moment(this.date + " " + this.endTime, 'YYYY-MM-DD').businessAdd(this.total)._d)-->
<!--          .locale('th').format('dddd, DD MMMM YYYY')-->
<!--      } else {-->
<!--        this.endBook = dayjs(this.date + " " + this.endTime).locale('th')-->
<!--          .add(this.total, this.dupTypeSelect.type).format('dddd, DD MMMM YYYY')-->
<!--      }-->
<!--    },-->
<!--    onChangeDupType(d) {-->
<!--      this.dupTypeSelect = d-->
<!--      this.endBook = ''-->
<!--      this.total = 0-->
<!--    },-->
<!--    onChangeDup(d) {-->
<!--      this.dupSelect = d-->
<!--    },-->
<!--    formatDate(date) {-->
<!--      if (!date) return null-->

<!--      const [year, month, day] = date.split('-')-->
<!--      return `${day}/${month}/${year}`-->
<!--    },-->

<!--    parseDate(date) {-->
<!--      if (!date) return null-->

<!--      const [day, month, year] = date.split('/')-->
<!--      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;-->
<!--    },-->

<!--    checkRoomDes(val) {-->
<!--      return (val === 2) && dayjs('2022-09-30') < dayjs(this.date)-->
<!--    },-->
<!--    ShiftTime() {-->
<!--      console.log(this.startTime+"<<&#45;&#45;")-->
<!--      this.itemsTimeStart = [];-->
<!--      let current = dayjs().add(60, "minute");-->
<!--      for (let i = 0; i < this.itemsTime.length; i++) {-->
<!--        let allTime = new Date(-->
<!--          this.date + " " + this.itemsTime[i]-->
<!--        );-->
<!--        if (current < allTime.getTime()) {-->
<!--          this.itemsTimeStart.push(this.itemsTime[i]);-->
<!--        }-->
<!--      }-->
<!--    },-->
<!--    allowRoom(num) {-->
<!--      return this.roomFree.find(r => r.room_number == num) != undefined-->
<!--        ? true-->
<!--        : false;-->
<!--    },-->

<!--    checkDuplicate() {-->
<!--      if (this.duplicate) this.checkDuplicateDate();-->
<!--    },-->
<!--    checkDuplicateDate() {-->
<!--      // console.log(">>" + (this.radioDuplicate + 1));-->
<!--      this.endDuplicate = [];-->
<!--      this.endDuplicateDate = null;-->
<!--      let temp = this.radioDuplicate === 0 ? 26 : 12;-->
<!--      for (let i = 1; i <= temp; i++) {-->
<!--        this.endDuplicate.push(-->
<!--          this.radioDuplicate === 0-->
<!--            ? i +-->
<!--            " สัปดาห์ (" +-->
<!--            dayjs(this.date)-->
<!--              .add(i, "week")-->
<!--              .format("YYYY-MM-DD") +-->
<!--            ")"-->
<!--            : i +-->
<!--            " เดือน (" +-->
<!--            dayjs(this.date)-->
<!--              .add(i, "month")-->
<!--              .format("YYYY-MM-DD") +-->
<!--            ")"-->
<!--        );-->
<!--      }-->
<!--    },-->

<!--    startTimeChange() {-->
<!--      console.log(this.startTime+"<<++")-->
<!--      // this.itemsTimeEnd = [];-->
<!--      // for (let i = 0; i < this.itemsTime.length; i++) {-->
<!--      //   if (-->
<!--      //     dayjs(this.date + " " + this.itemsTime[i]).format(-->
<!--      //       "HH:mm"-->
<!--      //     ) >-->
<!--      //     dayjs(this.date + " " + this.startTime).format(-->
<!--      //       "HH:mm"-->
<!--      //     )-->
<!--      //   ) {-->
<!--      //     this.itemsTimeEnd.push(this.itemsTime[i]);-->
<!--      //   }-->
<!--      // }-->

<!--      this.itemsTimeEnd = []-->
<!--      let mod = Math.abs((dayjs().format("mm") % 30) - 30)-->
<!--      let sum = parseInt(dayjs().format("mm")) + mod-->
<!--      let _count = (24 - dayjs().hour() - (dayjs().hour() >= this.limit ? 0 : this.limit))-->
<!--      let _check = (dayjs().format("YYYY-MM-D") === this.date ? _count : (24 - this.limit)) * 4-->
<!--      let _hour = dayjs().hour() >= this.limit ? dayjs().hour() : this.limit-->
<!--      let _minute = dayjs().hour() >= this.limit ? sum : 0-->
<!--      for (let i = 0; i < _check - (sum / 30); i++) {-->
<!--        let time = ''-->
<!--        if (dayjs().format("YYYY-MM-D") === this.date) {-->
<!--          time = dayjs().hour(_hour).minute(_minute).add(30 * i, "minute").format("HH:mm")-->
<!--        } else {-->
<!--          time = dayjs().hour(this.limit).minute(0).add(30 * i, "minute").format("HH:mm")-->
<!--        }-->
<!--        this.itemsTimeEnd.push(time)-->
<!--      }-->
<!--      if (this.startTime != null && this.endTime != null) {-->
<!--        this.checkRoomFree();-->
<!--      }-->
<!--    },-->
<!--    endTimeChange() {-->
<!--      if (this.startTime != null && this.endTime != null) {-->
<!--        this.checkRoomFree();-->
<!--      }-->
<!--    },-->
<!--    async checkRoomFree() {-->
<!--        console.log(this.startTime+"<<")-->
<!--      this.radioRoom = 0;-->
<!--      this.roomFree = await (-->
<!--        await axios-->
<!--          .post(baseUrl + "checkRoomFree", {-->
<!--            id_room: this.isRoom,-->
<!--            start_date: this.date + " " + this.startTime,-->
<!--            end_date: this.date + " " + this.endTime-->
<!--          })-->
<!--          .catch(error => console.log(error))-->
<!--      ).data;-->

<!--      switch (this.isRoom) {-->
<!--        case 1: {-->
<!--          this.radioRoom = 25;-->
<!--          break;-->
<!--        }-->
<!--        case 2: {-->
<!--          this.radioRoom = 5;-->
<!--          break;-->
<!--        }-->
<!--        default:-->
<!--          this.radioRoom = 1;-->
<!--          break;-->
<!--      }-->
<!--    },-->

<!--    allowedDates(val) {-->
<!--      this.permission = this.profile != null ? this.profile.id_permission : 2;-->
<!--      let start = val < dayjs().format("YYYY-MM-DD");-->
<!--      let end = val > dayjs().add(1, "month").format("YYYY-MM-DD");-->
<!--      return !(start || (end && this.$auth.user.ngx_permissions.indexOf('zoom.admin') === -1));-->
<!--    },-->

<!--    // async checkTime() {-->
<!--    //   if (this.test) return;-->
<!--    //   let isDay = dayjs().format("YYYY-MM-DD HH:mm");-->
<!--    //   let temp = await axios.post(baseUrl + "countdownTime", {-->
<!--    //     start_date: isDay-->
<!--    //   });-->
<!--    //   this.test = true;-->
<!--    //   temp.data.map(s => {-->
<!--    //     this.addLicense(s, false);-->
<!--    //   });-->
<!--    // },-->

<!--    async get() {-->
<!--      this.bookingAll = await (-->
<!--        await axios-->
<!--          .get(baseUrl + "getBooking")-->
<!--          .catch(error => console.log(error))-->
<!--      ).data;-->
<!--    },-->
<!--    async check() {-->
<!--      let temp = await (-->
<!--        await axios.post(baseUrl + "checkUser", {-->
<!--          email: localStorage.getItem("mail")-->
<!--        })-->
<!--      ).data;-->
<!--      this.profile = temp[0];-->
<!--      // console.log(JSON.stringify(this.profile));-->
<!--    },-->
<!--    async addBooking(data) {-->
<!--      console.log("addBooking++" + JSON.stringify(data));-->
<!--      await axios-->
<!--        .post(baseUrl + "addBooking", data)-->
<!--        .catch(error => console.log(error));-->
<!--      this.back();-->
<!--    },-->
<!--    back() {-->
<!--      window.history.back();-->
<!--    },-->

<!--    //******************* api zoom **********************//-->
<!--    // async addLicense(isValue, _type) {-->
<!--    //   let temp = await axios.post(baseUrl + "addLicense", {-->
<!--    //     id: isValue.id_zoom,-->
<!--    //     type: _type ? "2" : "1"-->
<!--    //   });-->
<!--    //   if (isValue.size !== "300") await this.addCapacity(isValue);-->
<!--    //   // console.log(temp);-->
<!--    // },-->
<!--    // async addCapacity(isValue) {-->
<!--    //   let temp = await axios.post(baseUrl + "addCapacity", {-->
<!--    //     id: isValue.id_zoom,-->
<!--    //     type: _type ? "2" : "1"-->
<!--    //   });-->
<!--    //   // console.log(temp);-->
<!--    // },-->

<!--    async getRoom() {-->
<!--      this.startTimeChange()-->
<!--      if (this.desserts.building.length > 0) {-->
<!--        this.onChangeItem(this.desserts.building[0])-->
<!--      }-->
<!--      // let temp = await axios.post(baseUrl + "getRoom", {-->
<!--      //   title: this.title,-->
<!--      //   start_date: this.date + " " + this.startTime,-->
<!--      //   end_date: this.date + " " + this.endTime-->
<!--      // });-->
<!--    },-->

<!--    async createRoom() {-->
<!--      let max = new Date(this.date + " " + this.endTime);-->
<!--      let min = new Date(this.date + " " + this.startTime);-->
<!--      let _duration = (max.getTime() - min.getTime()) / 1000 / 60;-->
<!--      let _duplicateDate = this.duplicate-->
<!--        ? this.endDuplicateDate-->
<!--          .split("(")-->
<!--          [this.endDuplicateDate.split().length].replace(")", "") +-->
<!--        " " +-->
<!--        this.endTime-->
<!--        : "";-->
<!--      let convertFormat = dayjs(_duplicateDate, "DD-MM-YYYY HH:mm").format(-->
<!--        "YYYY-MM-DD HH:mm"-->
<!--      );-->

<!--      let _start =-->
<!--        this.date + "T" + this.startTime+ ":00UTC + 7";-->
<!--      // console.log("***" + this.delegateCheck + "++" + this.profile.id_zoom);-->

<!--      await this.$axios.post("/createMeetings",{-->
<!--        title: this.title,-->
<!--        start_date: _start,-->
<!--        duration: _duration,-->
<!--        id_zoom: this.guest.id_zoom,-->
<!--        id_room: this.isRoom,-->
<!--        room_number: this.roomNumber,-->
<!--      }).then(()=>{-->
<!--        this.back();-->
<!--      }).catch((e)=>{-->
<!--        alert("เกิดข้อผิดพลาด กรุณาลองใหม่")-->
<!--        console.log(e)-->
<!--      })-->
<!--      // await axios-->
<!--      //   .post(`${baseUrl}createRoom`, {-->
<!--      //     title: this.title,-->
<!--      //     start_date: _start,-->
<!--      //     duration: _duration,-->
<!--      //     id_zoom: this.delegateCheck-->
<!--      //       ? this.guest.id_zoom-->
<!--      //       : this.profile.id_zoom-->
<!--      //   })-->
<!--      //   .then(response => {-->
<!--      //     let booking = {-->
<!--      //       title: this.title,-->
<!--      //       meetings_id: response.data.pmi,-->
<!--      //       meetings_password: response.data.password,-->
<!--      //       id_user: this.delegateCheck ? this.guest.id : this.profile.id,-->
<!--      //       id_room: this.isRoom,-->
<!--      //       room_number: this.roomNumber,-->
<!--      //       id_status: "2",-->
<!--      //       duplicate: this.duplicate ? this.radioDuplicate + 1 : 0,-->
<!--      //       duplicate_date: convertFormat,-->
<!--      //       participants: this.participants,-->
<!--      //       start_date: this.date + " " + this.startTime.replace(" น.", ""),-->
<!--      //       end_date: this.date + " " + this.endTime.replace(" น.", "")-->
<!--      //     };-->
<!--      //     this.addBooking(booking);-->
<!--      //   })-->
<!--      //   .catch(response => {-->
<!--      //     // dispatch(receiveError(response));-->
<!--      //     alert("เกิดข้อผิดพลาด กรุณาลองใหม่");-->
<!--      //   });-->
<!--    },-->
<!--    //*********************** end *************************//-->

<!--    async onChangeItem(n) {-->
<!--      // this.isRoom = n;-->
<!--      // this.ChangeDate();-->
<!--      // if (this.startTime != null && this.endTime != null) {-->
<!--      //   await this.checkRoomFree();-->
<!--      // }-->
<!--      if (this.startTime === null || this.endTime === null) return-->
<!--      this.$nextTick(() => {-->
<!--        this.$nuxt.$loading.start()-->
<!--      })-->
<!--      await this.$axios.get(`building/${n.building.id}`, {-->
<!--        params: {-->
<!--          type_room: this.$route.params.name,-->
<!--        }-->
<!--      }).then((res) => {-->
<!--        this.$nuxt.$loading.finish()-->
<!--        this.getBooking(res.data)-->
<!--      }).catch((error) => {-->
<!--        this.$nuxt.$loading.finish()-->
<!--        console.log(error)-->
<!--      })-->
<!--    },-->
<!--    async submit() {-->
<!--      if (this.checkNull()) {-->
<!--        this.delegateCheck ? await this.checkUser() : await this.createRoom();-->
<!--      } else {-->
<!--        this.detail = "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนทำรายการ";-->
<!--        this.dialog = true;-->
<!--      }-->
<!--    },-->

<!--    checkNull() {-->
<!--      let temp =-->
<!--        !this.duplicate ||-->
<!--        (this.duplicate &&-->
<!--          this.endDuplicateDate != null &&-->
<!--          this.endDuplicateDate !== "");-->
<!--      let checkMailGuest =-->
<!--        !this.delegateCheck ||-->
<!--        (this.delegateCheck &&-->
<!--          this.delegateMail != null &&-->
<!--          this.delegateMail !== "");-->
<!--      return this.roomNumber != null &&-->
<!--        this.title !== "" &&-->
<!--        this.startTime != null &&-->
<!--        this.endTime != null &&-->
<!--        this.participants != null &&-->
<!--        temp &&-->
<!--        checkMailGuest;-->
<!--    },-->
<!--    async ChangeDate() {-->
<!--      this.checkRoom = await (-->
<!--        await axios.post(baseUrl + "checkRoom", {-->
<!--          id_room: this.isRoom,-->
<!--          start_date: `${this.date} 08:00:00`,-->
<!--          end_date: `${this.date} 18:00:00`-->
<!--        })-->
<!--      ).data;-->
<!--      this.ShiftTime();-->
<!--    },-->

<!--    async checkUser() {-->
<!--      await axios-->
<!--        .post(`${baseUrl}checkUser`, {-->
<!--          email: this.delegateMail-->
<!--        })-->
<!--        .then(response => {-->
<!--          // console.log("checkUser>>>" + JSON.stringify(response.data));-->
<!--          if (response.data.length > 0) {-->
<!--            this.guest = response.data[0];-->
<!--            this.createRoom();-->
<!--          } else {-->
<!--            this.detail =-->
<!--              "Email นี้ยังไม่ได้ลงทะเบียนผ่านระบบ zoom.yru.ac.th กรุณาลงทะเบียนก่อนทำรายการ";-->
<!--            this.dialog = true;-->
<!--          }-->
<!--        })-->
<!--        .catch(error => console.log(error));-->
<!--    }-->
<!--  }-->
<!--};-->
<!--</script>-->
