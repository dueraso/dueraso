import axios from "~/api/config";
import dayjs from "dayjs";

// import VueMask from 'v-mask'
// import {VueMaskDirective} from 'v-mask'
import Vue from "vue";
// Vue.use(VueMask);
// Vue.directive('mask', VueMaskDirective);
import DialogCon from "../../components/DialogCon";


require('dayjs/locale/th')
const weekday = require('dayjs/plugin/weekday')
dayjs.extend(weekday)
const moment = require('moment-business-days');

export default {
  // head(){
  //   return {
  //     title: this.desserts.title
  //   }
  // },
  components: {DialogCon},
  middleware: ['auth', 'isUser'],
  data(vm) {
    return {
      outsider: 0,
      status: false,
      warning: false,
      menu2: false,
      timeStartStat: false,
      timeStart: null,
      timeEndStat: false,
      timeEnd: null,
      isLoading: false,
      search: null,
      menuDate: false,
      date: new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().substr(0, 10),
      dateFormatted: vm.formatDate((new Date(Date.now() - (new Date()).getTimezoneOffset() * 60000)).toISOString().substr(0, 10)),
      landscape: true,
      menu: false,
      message: "",
      detail: "",
      phone: "",
      //radio menu
      radioDuplicate: 0,
      //dropdown
      desserts: {},
      regular: ['ห้องปกติ(ผู้ดูแลต้องอนุมัติ)', 'ห้องประจำ(ผู้ดูแลไม่ต้องอนุมัติ)'],
      regularSelect: 0,
      outsiders: ['บุคคลภายใน', 'บุคคลภายนอก'],
      dup: ['จองปกติ', 'จองซ้ำ'],
      itemStart: [],
      itemEnd: [],
      dupType: [
        // {
        //   type: 'day',
        //   name: 'รายวัน'
        // },
        // {
        //   type: 'weekday',
        //   name: 'รายวันไม่รวม ส-อ'
        // },
        {
          type: 'week',
          name: 'รายสัปดาห์'
        },
        {
          type: 'month',
          name: 'รายเดือน'
        }
      ],
      rooms: [],
      bookings: [],
      endDuplicate: [],
      endDuplicateDate: null,
      permission: null,
      account: null,
      participants_total: null,
      delegateCheck: false,
      delegateMail: null,
      roomNumber: null,
      insteadSelect: null,
      entries: [],
      duplicate: false,
      dupSelect: "จองปกติ",
      dupTypeSelect: {},
      total: 0,
      participants: 0,
      endBook: null,
      dialog: false,
      dialogBooking: false,
      valid: true,
      rules: {
        required: value => !!value || "Required.",
        min: v => (v && v.length >= 8) || "Min 8 characters",
        phone: value => {
          const usernameRegex = /^[-0-9_.]+$/
          return (usernameRegex.test(value) && value.length >= 12) || 'หมายเลขต้องครบ 10 ตัว'
        },
      },
      roomFree: "",
      openItem: {
        building: {
          name: '',
          number: '',
        }
      },
      booking: {
        title: '',
        detail: '',
      },
      disabled: 0,
      hoursStart: 0,
      setMinute: 30,
      limit: 0,
      bookTotal: 0,
      typeBook: [
        {
          name: 'ว่าง',
          color: "#e0e0e0"
        },
        {
          name: 'ไม่ว่าง',
          color: "orange"
        },
        {
          name: 'ไม่พร้อมใช้งาน',
          color: "red"
        }
      ],
      roomSizeList: [
        {
          id: 0,
          name: "ห้องขนาดเล็ก",
          icon: "mdi-size-s",
          size: "300 device"
        },
        {
          id: 1,
          name: "ห้องขนาดกลาง",
          icon: "mdi-size-m",
          size: "500 device"
        },
        {
          id: 2,
          name: "ห้องขนาดใหญ่",
          icon: "mdi-size-l",
          size: "1,000 device"
        }
      ],
      roomSizeSelect: 0,
      roomsList: [25, 5, 1,],
      roomsTotal: 0,
      roomsSelect: 0,
      radioRoom: 0,
      isRoom: null,
      title: ""
    };
  },
  mounted() {
    // this.dupTypeSelect = this.dupType[0]
    // this.roomsTotal = this.roomsList[0]
    // this.getTypeRoom()
    this.startTimeChange()
    // this.getCountMyBooking()
    // this.status = true
    // console.log(this.$auth)
  },
  watch: {
    date(val) {
      this.dateFormatted = this.formatDate(this.date)
    },
    async search(val) {
      if (val.length < 2) return
      if (this.isLoading) return
      this.isLoading = true
      await axios.get(`https://api2.yru.ac.th/hr/v1/staffs`, {
        params: {
          q: val
        }
      }).then((res) => {
        const {count, data} = res.data
        this.count = count
        this.entries = data
      }).catch((e) => {
        console.log(e)
      }).finally(() => (this.isLoading = false))
    },
  },
  computed: {
    instead() {
      return this.entries
    },
    filterName() {
      if (this.openItem.equipment === undefined) return
      return JSON.parse(this.openItem.equipment).map((s) => s.name).toString()
    },
  },
  methods: {
    checkRoomDes(val) {
      return (val === 2) && dayjs('2022-09-30') < dayjs(this.date)
    },
    allowRoom(num) {
      return this.roomFree.find(r => r.room_number == num) != undefined;
    },
    async checkRoomFree() {
      this.$nuxt.$loading.start()
      this.roomsTotal = 0
      this.$axios.get("/getBookings", {
        params: {
          roomId: this.roomSizeSelect + 1,
          startDate: this.date + " " + this.timeStart,
          endDate: this.date + " " + this.timeEnd
        }
      }).then(r => {
        this.roomFree = r.data
        this.roomsTotal = this.roomsList[this.roomSizeSelect]
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e)
      })
    },
    async addUser() {
      if (this.insteadSelect == null) return
      let staff_type_name = this.insteadSelect.special.title_4.split('(')[1].replace(")", "")
      await this.$axios.post(`user`, {
        'name': this.insteadSelect.special.title_1,
        'first_name': this.insteadSelect.first_name,
        'last_name': this.insteadSelect.last_name,
        'email': this.insteadSelect.email,
        'type': 'staff',
        'staff': this.insteadSelect.id,
        'staff_position_name': this.insteadSelect.position_name,
        'staff_type_name': staff_type_name,
        'master_department_name': this.insteadSelect.department_name,
        'student': null,
        'student_code': null,
        'faculty_name': null,
        'program_name': null,
      }).then((res) => {
        // console.log('ok')
      })
        .catch((error) => {
          console.log(error)
        })
    },
    startTimeChange() {
      this.itemStart = []
      let mod = Math.abs((dayjs().format("mm") % this.setMinute) - this.setMinute)
      let sum = parseInt(dayjs().format("mm")) + mod
      let _count = (24 - dayjs().hour() - (dayjs().hour() >= this.limit ? 0 : this.limit))
      let _check = (dayjs().format("YYYY-MM-DD") === this.date ? _count : (24 - this.limit)) * 2
      let _hour = dayjs().hour() >= this.limit ? dayjs().hour() : this.limit
      let _minute = dayjs().hour() >= this.limit ? sum : 0
      for (let i = _check == 48 ? 0 : 1; i < _check - (sum / this.setMinute); i++) {
        let time = ''
        if (dayjs().format("YYYY-MM-DD") === this.date) {
          time = dayjs().hour(_hour).minute(_minute).add(30 * i, "minute").format("HH:mm")
        } else {
          time = dayjs().hour(this.limit).minute(0).add(30 * i, "minute").format("HH:mm")
        }
        this.itemStart.push(time)
      }
      this.endTime()
    },
    endTime() {
      this.itemEnd = []
      let _limit = 0
      let _date = dayjs(this.date + " " + this.timeStart)
      let _minute = _date.minute() / 30
      for (let i = 1; i <= (_limit === 0 || (24 - _date.hour() <= 3) ? ((24 - _date.hour()) * 2) - _minute - 1 : (_limit * 2)); i++) {
        let time = dayjs(_date).add(30 * i, "minute").format("HH:mm");
        this.itemEnd.push(time)
      }
      if (this.timeStart != null && this.timeEnd != null) {
        this.checkRoomFree();
      }
    },
    close() {
      if (this.status) {
        this.$router.back()
        return
      }
      this.warning = false
      this.status = false
    },
    delegatePer() {
      return (this.$auth.user.ngx_permissions.indexOf('zoom.admin') !== -1)
    },
    delegateLibrary() {
      return (this.$auth.user.ngx_permissions.indexOf('booking.library') !== -1)
    },

    changeTotal() {
      if (this.dupTypeSelect.type === 'weekday') {
        this.endBook = dayjs(moment(this.date + " " + this.timeEnd, 'YYYY-MM-DD').businessAdd(this.total)._d)
          .locale('th').format('dddd, DD MMMM YYYY')
        // console.log("1>"+this.endBook)
      } else {
        this.endBook = dayjs(this.date + " " + this.timeEnd).locale('th')
          .add(this.total, this.dupTypeSelect.type).format('dddd, DD MMMM YYYY')
        // console.log(this.total+"=="+ this.dupTypeSelect.type+"<<2>"+this.endBook)
      }
    },
    createRoom() {
      this.$nuxt.$loading.start()
      let max = new Date(this.date + " " + this.timeEnd);
      let min = new Date(this.date + " " + this.timeStart);
      let _duration = (max.getTime() - min.getTime()) / 1000 / 60;
      this.$axios.post(`createMeetings`, {
        "title": this.title,
        "id_user": this.delegateCheck?this.insteadSelect:null,
        "id_room": this.roomSizeSelect + 1,
        "room_number":this.roomsSelect,
        "id_status":2,
        "duplicate":this.dupSelect=="จองปกติ"?0:1,
        "duplicate_date":null,
        "participants":this.participants,
        "participants_total":null,
        "duration":_duration,
        "total":this.total,
        "type":this.dupTypeSelect.type,
        "start_date":this.date + " " + this.timeStart,
        "end_date":this.date + " " + this.timeEnd,
      }).then(() => {
        this.$nuxt.$loading.finish()
        this.$router.back()
        // this.dialogBooking = false
        // this.dialog = false
        // if (this.$route.params.name === "1") {
        //   this.warning = false
        //   this.message = "หากไม่รับกุญแจหลังจากเวลาที่จองไว้ภายใน 30 นาทีระบบการจองจะถูกยกเลิกอัตโนมัติ"
        //   this.status = true
        // } else {
        //   this.$router.back()
        // }
      }).catch((error) => {
        console.log(error.data)
      })
    },
    async submit() {
      let max = new Date(this.date + " " + this.timeEnd);
      let min = new Date(this.date + " " + this.timeStart);
      let _duration = (max.getTime() - min.getTime()) / 1000 / 60;

      let _data = {
        "title": this.title,
        "id_user": this.delegateCheck?this.insteadSelect:null,
        "id_room": this.roomSizeSelect + 1,
        "room_number":this.roomsSelect,
        "id_status":2,
        "duplicate":this.dupSelect,
        "duplicate_date":null,
        "participants":this.participants,
        "participants_total":null,
        "duration":_duration,
        "total":this.total,
        "type":this.dupTypeSelect.type,
        "start_date":this.date + " " + this.timeStart,
        "end_date":this.date + " " + this.timeEnd,
      }
      // console.log(_data)
      // return
      if (this.checkNull()) {
        this.delegateCheck ? await this.checkUser() : this.createRoom();
      } else {
        this.detail = "กรุณากรอกข้อมูลให้ครบทุกช่องก่อนทำรายการ";
        this.dialog = true;
      }
    },
    checkNull() {
      // console.log((this.dupSelect == "จองซ้ำ") +"&&" +(this.total > 0)+"<<this.dupSelect>>"+this.dupSelect)
      // let temp = !(this.dupSelect == "จองซ้ำ") || (this.dupSelect == "จองซ้ำ" && this.total > 0);
      let checkMailGuest = !this.delegateCheck || (this.delegateCheck && this.insteadSelect != null);
      // console.log(this.roomsSelect+"++"+(this.roomsSelect != null) +"&&"+
      //   (this.title !== "")  +"&&"+
      //   (this.timeStart != null)  +"&&"+
      //   (this.timeEnd != null ) +"&&"+
      //   (this.participants > 0)  +"&&"+
      //   // temp  +"&&"+
      //   checkMailGuest)
      return this.roomsSelect != null &&
        this.title !== "" &&
        this.timeStart != null &&
        this.timeEnd != null &&
        this.participants > 0 &&
        // temp &&
        checkMailGuest;
    },
    async checkUser() {
      await this.$axios.get(`getUserOnMail`, {
        params:{
          email:this.insteadSelect.email
        }
      }).then((res)=>{
          if (res.data.code == "1001" || res.data.code =="1120") {
            this.detail = "Email นี้ยังไม่ได้ลงทะเบียนผ่านระบบ zoom.yru.ac.th กรุณาลงทะเบียนก่อนทำรายการ";
            this.dialog = true;
          }else {
            this.insteadSelect = res.data
            this.createRoom();
          }
      }).catch((e)=>{
        alert(e)
        console.log(e)
      })
    },
    convertDetail() {
      return JSON.parse(this.openItem.equipment).map((d) => d.name).toString()
    },

    check(room) {
      return (this.bookings.length > 0 ? this.bookings.find((d) => d.room.id === room.id) !== undefined : false) || room.status === '0'
      let find = this.bookings.length > 0 ? this.bookings.find((d) => d.room.id === room.id) !== undefined : false
      let day = dayjs(this.date).format("dddd") === dayjs().day(7).format("dddd")
      let _dateStart = ['2022/12/23 12:00', '2022/12/29 12:45', '2022/12/25 12:15',]
      let _dateEnd = ['2022/12/23 12:00', '2022/12/29 12:45', '2022/12/25 12:15',]
      // console.log(_dateStart.splice(_dateStart.length))

      // console.log((_dateStart.indexOf(dayjs(this.date).format('YYYY/MM/DD'))+"dddddd>>"+dayjs(this.date).format('YYYY/MM/DD')))
      // return true
      return ((find || room.status === '0') || day)
    },

    checkColor(room) {
      if (room.status === '0') {
        return 'red'
      } else if (this.check(room)) {
        return 'orange'
      } else {
        return ''
      }
    },

    checkDark(room) {
      return !!(room.status === '0' || this.check(room));
    },

    onOpenItem(item) {
      this.dialogBooking = true
      this.openItem = Object.assign({}, item)
    },

    async getRoom() {
      this.startTimeChange()
      // console.log(this.date + " " + this.timeStart + "<<>>" + JSON.stringify(this.desserts))
      this.$axios.get("/getBookings", {
        params: {
          roomId: 1,
          startDate: this.date + " " + this.timeStart,
          endDate: this.date + " " + this.timeEnd
        }
      }).then(r => {
        // console.log(JSON.stringify(r.data))
      }).catch((e) => {
        console.log(e)
      })
      // if (thi s.desserts.building.length > 0) {
      //   this.onChangeItem(this.desserts.building[0])
      // }
    },

    allowedHours(v) {
      if (this.date === dayjs().format('YYYY-MM-DD')) {
        return v >= dayjs().hour()
      } else {
        return v
      }
    },

    allowedMinutes(v) {
      return v === 30 || v === 0
    },

    allowedEndHours(v) {
      if (this.timeStart === null) return
      return v >= this.timeStart.split(':')[0]
    },

    allowedEndMinutes(v) {
      return v === 30 || v === 0
    },

    allowedDates(val) {
      let start = val < dayjs().format("YYYY-MM-DD");
      let end = val > dayjs().add(1, "month").format("YYYY-MM-DD");
      return !(start || (end && !this.delegatePer()));
    },

    formatDate(date) {
      if (!date) return null

      const [year, month, day] = date.split('-')
      return `${day}/${month}/${year}`
    },

    parseDate(date) {
      if (!date) return null

      const [day, month, year] = date.split('/')
      return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
    },

    async onChangeItem(n) {
      this.roomSizeSelect = n
      // console.log("fff>" + this.timeStart + "<<>>" + n)
      if (this.timeStart === null || this.timeEnd === null) return
      this.checkRoomFree()
      // this.$nextTick(() => {
      //   this.$nuxt.$loading.start()
      // })
      // await this.$axios.get(`building/${n.building.id}`, {
      //   params: {
      //     type_room: this.$route.params.name,
      //   }
      // }).then((res) => {
      //   this.$nuxt.$loading.finish()
      //   this.getBooking(res.data)
      // }).catch((error) => {
      //   this.$nuxt.$loading.finish()
      //   console.log(error)
      // })
    },

    async onChangeRoom(val) {
      this.roomsSelect = val
    },

    onOutsiders(d) {
      this.outsider = d
    },

    onChangeDup(d) {
      this.dupTypeSelect = (d === "จองซ้ำ")?this.dupType[0]:{}
      // console.log(JSON.stringify(this.dupTypeSelect)+"<<>>"+ JSON.stringify(d))
      this.dupSelect = d
    },

    onChangeRegular(d) {
      this.regularSelect = d
    },

    onChangeDupType(d) {
      // console.log("2>>"+ JSON.stringify(d))

      this.dupTypeSelect = d
      this.endBook = null
      this.total = 0
    },

    async getBooking(r) {
      this.$nuxt.$loading.start()
      await this.$axios.get(`booking`, {
        params: {
          roomId: this.$route.params.name,
          startDate: dayjs(this.date + " " + this.timeStart).subtract(1, 'm').format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
          endDate: dayjs(this.date + " " + this.timeEnd).subtract(1, 'm').format('YYYY-MM-DDTHH:mm:ssZ[Z]'),
        }
      }).then((res) => {
        this.bookings = res.data;
        this.rooms = r;
        // console.log(">"+JSON.stringify(this.bookings))
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        this.$nuxt.$loading.finish()
        console.log(error)
      })
    },

    async getCountMyBooking() {
      await this.$axios.get(`/countMyBooking`, {
        params: {
          type_room: this.$route.params.name,
          type_add: 'days',
          add_value: 7
        }
      }).then((res) => {
        this.bookTotal = res.data
      }).catch((error) => {
        console.log(error)
      })
    },

    dialogCount() {
      if (!this.$refs.form.validate()) return
      let limit = this.$route.params.name == 2 ? 4 : 2
      if (this.bookTotal >= limit && !this.delegatePer()) {
        this.status = true
        this.message = `ท่านใช้สิทธิ์${this.desserts.detail}ครบจำนวนแล้ว`
      } else {
        this.warning = true
        this.message = `ท่านสามารถใช้สิทธิ์${this.desserts.detail}ได้อีก ${this.delegatePer() ? 'ไม่จำกัด' : limit - this.bookTotal} ครั้ง<br>ต้องการจองใช่หรือไม่`
      }
    }
  }
};
