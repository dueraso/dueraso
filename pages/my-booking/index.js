import axios from "~/api/config";
import dayjs from "dayjs";

export default {
  // head(){
  //   return {
  //     title: 'รายการจองทั้งหมด'
  //   }
  // },
  middleware: ['auth'],
  data() {
    return {
      dates: [],
      refDates: [],
      pending: [],
      menu: false,
      modal: false,
      search: '',
      filter: {},
      page: 1,
      tab: null,
      dialog: false,
      itemsPerPage: 4,
      desserts: [],
      status: ['รออนุมัติ', 'อนุมัติ', 'ไม่อนุมัติ'],
      openItem: {
        building: {
          name: '',
          number: '',
        },
        room: {
          name: '',
          floor: '',
          equipment: '',
          total: '',
        },
        bookingBy: {
          name: '',
        }
      },
    }
  },
  computed: {
    filterName() {
      if (this.openItem.room.equipment === '') return ''
      let d = this.openItem.room.equipment
      return JSON.parse(d).map((s) => s.name).toString()
    },
    dateRangeText() {
      return this.refDates.join(' ~ ')
    },
    numberOfPages() {
      return Math.ceil(this.desserts.length / this.itemsPerPage)
    },
    filteredKeys() {
      return this.keys.filter(key => key !== 'Name')
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.getPending()
    })
  },
  methods: {
    async pageBooking() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/myBookingZoom`).then((res) => {
        this.desserts = res.data;
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        alert(error)
        console.log(error)
      })
    },
    convertRoom: (val) => val.name,
    onOpenItem(item) {
      this.openItem = item
      this.dialog = true
    },
    convertDay(val) {
      return dayjs(val).format('DD-MM-YYYY HH:mm')
    },
    async getPending() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/myBookingZoom`).then((res) => {
        this.$nuxt.$loading.finish()
        // console.log(JSON.stringify(res.data))
        this.desserts = res.data
      }).catch((error) => {
        console.log(error)
      })
    },
  },
}
