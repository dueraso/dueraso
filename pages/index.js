import axios from "~/api/config";
import serve from "~/api/server";
import dayjs from "dayjs";
import DialogCon from "~/components/DialogCon";
import 'dayjs/locale/th'
// import _ from 'underscore'

export default {
  components: {
    DialogCon
  },
  middleware: ['isUser'],
  computed: {
    cal() {
      return this.ready ? this.$refs.calendar : null
    },
    nowY() {
      return this.cal ? this.cal.timeToY(this.cal.times.now) + 'px' : '-10px'
    },
    roomSize() {
      return this.zoomLicense
    },
  },
  created() {
    this.$nextTick(function () {
      this.loading = false
    })
    // this.$nuxt.$on('adduser', () => this.addUser())
    // this.countRoom()
  },
  mounted() {
    console.log(this.$auth.user)
    // console.log(this.$auth.user)
    this.ready = true
    if (this.$auth.loggedIn) this.getUser()
    // this.scrollToTime()
    // this.updateTime()
    // this.checkType()
  },
  data() {
    return {
      loading: true,
      status: false,
      statusUser: false,
      detailUser: "",
      ishide: false,
      ready: false,
      categories: [],
      isBooking: null,
      booking: [],
      isNum: null,
      typeRoom: [],
      isCount: [],
      focus: "",
      statusCreate: "",
      type: "month",
      typeToLabel: {
        month: "เดือน",
        week: "สัปดาห์",
        day: "วัน",
      },
      selectedEvent: {},
      selectedElement: null,
      selectedOpen: false,
      events: [],
      colors: ["orange", "green", "#2096f3"],
      typeBook: [
        {
          name: 'นักศึกษา',
          color: "orange"
        },
        {
          name: 'บุคลากรสายวิชาการ',
          color: "green"
        },
        {
          name: 'บุคลากรสายสนับสนุน',
          color: "#2096f3"
        }
      ],
      dialog: false,
      zoom: true,
      typeId: null,
      zoomLicense: {
        small: '',
        medium: '',
        big: ''
      },
      name: '',
      title: '',
      enabled: false,
      valid: false,
      start: {},
      end: {},
      titleRules: [
        v => !!v || 'is required',
      ],
    }
  },
  methods: {
    async register() {
      if (this.statusCreate === "create") {
        await this.createUser()
      } else {
        await this.getUser()
      }
    },
    async createUser() {
      await this.$axios.post(`createUser`, {
        'first_name': this.$auth.user.first_name,
        'last_name': this.$auth.user.last_name,
        'email': this.$auth.user.email,
      }).then((res) => {
        this.statusCreate = "pending"
        this.detailUser = "กรุณายืนยันการลงทะเบียน zoom ใน Email ของท่านภายใน 30 วัน"
        this.statusUser = true
        // console.log('ok')
      }).catch((error) => {
        console.log(error)
      })
    },
    async getUser() {
      await this.$axios.get("getUser", {
        params: {
          email: this.$auth.user.email
        }
      }).then((res) => {
        if (res.data.code == "1001" || res.data.code == "1120") {
          // console.log("1>>")
          this.statusCreate = "create"
          this.detailUser = "Email ของคุณยังไม่ได้ลงทะเบียน zoom ต้องการลงทะเบียนหรือไม่"
          this.statusUser = true
        } else if (res.data.status === "pending") {
          // console.log("2>>")
          this.detailUser = "กรุณายืนยันการลงทะเบียน zoom ใน Email ของท่านภายใน 30 วัน"
          this.statusUser = true
        } else if (res.data.pmi == 0) {
          // console.log("3>>")
          this.detailUser = "การลงทะเบียน zoom ไม่สมบูรณ์ กรุณาติดต่อผู้ดูแลระบบ"
          this.statusUser = true
        } else {
          // console.log("4>>")
          this.addUser(res.data)
          this.statusUser = false
        }
      }).catch((e) => {
        console.log(e)
      })
    },
    async addUser(val) {
      await this.$axios.post(`userZoom`, {
        'id_zoom': val.id,
        'first_name': this.$auth.user.first_name,
        'last_name': this.$auth.user.last_name,
        'email': this.$auth.user.email,
        'masterdepartmentname': this.$auth.user.staff.masterdepartmentname,
        'id_permission': 2
      }).then((res) => {
        this.statusCreate = "active"
        // console.log('ok')
      }).catch((error) => {
        console.log(error)
      })
    },
    checkPermission() {
      if (!this.$auth.loggedIn) return false
      if ((this.$auth.user.ngx_permissions.indexOf('zoom.admin') > -1)) {
        return true
      } else {
        return false
      }
    },
    close() {
      this.status = false
      this.statusUser = false
    },
    async confirm() {
      await this.$axios.delete(`bookingZoom/${this.selectedEvent.id}`).then((res) => {
        this.status = false
        this.getBooking()
        // console.log(res.data)
      }).catch((e) => {
        console.log(e)
      })
    },
    async endฺBooking(selectedEvent) {
      await this.$axios.put(`booking/${selectedEvent.id}`).then((res) => {
        this.selectedOpen = false;
        this.getBooking()
      }).catch((error) => {
        console.log(error)
      })
    },
    checkEndฺBooking(selectedEvent) {
      return (new Date(selectedEvent.start).getTime() <= dayjs() && new Date(selectedEvent.end).getTime() >= dayjs())
    },
    updateTime() {
      setInterval(() => this.cal.updateTimes(), 60 * 1000)
    },
    async bookingZoom() {
      this.events = [];
      this.booking.map(async (d) => {
        // console.log(d)
        this.events.push({
          id: d.id,
          name: d.title,
          meeting_room_id: d.meeting_room_id,
          meeting_id: d.meetings_id,
          password: d.meetings_password,
          timer:
            dayjs(d.start_date).format("HH:mm") +
            " - " +
            dayjs(d.end_date).format("HH:mm"),
          start: new Date(d.start_date),
          end: new Date(d.end_date),
          color: this.colors[d.id_room.id - 1],
          timed: true,
          bookingName: d.id_user.first_name + ' ' + d.id_user.last_name,
          email: d.id_user.email,
          masterdepartmentname: d.id_user.masterdepartmentname
        });
      })
      // await this.getRoom()
      this.$nuxt.$loading.finish()
    },
    async checkTimeCancel(selectedEvent) {
      this.ishide = (this.checkPer(this.$auth.user.email === selectedEvent.email) &&
        (new Date(selectedEvent.start).getTime() >= (dayjs() + 3600000)));
    },
    async getBooking() {
      await axios.get(`bookingZoom`, {
        params: {
          roomId: 3,
          startDate: this.start.date + " 00:00:00",
          endDate: this.end.date + " 23:59:59",
        }
      }).then((res) => {
        this.booking = res.data
        // console.log(JSON.stringify(this.booking))
        this.bookingZoom()
      }).catch((error) => {
        console.log(error)
      })
    },
    async countRoom() {
      await axios.get(`logStaffDayZoom`).then((res) => {
        this.zoomLicense = this.toObject(res.data)
        // console.log("medium>" + this.zoomLicense.medium)
      }).catch((error) => {
        console.log(error)
      })
    },
    toObject(arr) {
      let rv = {};
      for (let i = 0; i < arr.length; ++i)
        rv = arr[i];
      return rv;
    },

    checkPer(bookingBy) {
      if (this.typeId === 1) {
        return (this.$auth.user.ngx_permissions.indexOf('booking.library') !== -1) || (this.$auth.user.ngx_permissions.indexOf('booking.admin') !== -1) ||
          (this.$auth.user.ngx_permissions.indexOf('booking.super_admin') !== -1) || bookingBy
      } else if (this.typeId !== 3) {
        return (this.$auth.user.ngx_permissions.indexOf('booking.admin') !== -1) || (this.$auth.user.ngx_permissions.indexOf('booking.super_admin') !== -1)
          || bookingBy
      } else {
        return false
      }
    },


    //calendar

    async updateRange({start, end}) {
      this.$nextTick(() => {
        // this.$nuxt.$loading.start()
      })
      this.start = start
      this.end = end
      // await this.getBooking()

      // await this.getRoom()
    },
    async showEvent({nativeEvent, event}) {
      // console.log(this.$auth.user.email+"<<00000>>"+JSON.stringify(event.email))
      if (!this.$auth.loggedIn) return
      if (!this.checkPermission() && !(this.$auth.user.email === event.email)) return
      await this.checkTimeCancel(event)
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
  }
}
