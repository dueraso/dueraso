import axios from "~/api/config";
import dayjs from "dayjs";

export default {
  middleware: ['auth','isAdmin'],
  data() {
    return {
      itemsPerPageArray: [10, 15, 20],
      itemsPerPage: 10,
      selected: [],
      selectedAll: false,
      dates: [],
      refDates: [],
      pending: [],
      menu: false,
      modal: false,
      search: '',
      filter: {},
      page: 1,
      tab: null,
      delSelect: false,
      dialog: false,
      dialogDelete: false,
      type: '',
      desserts: [],
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
        booking_by: {
          name: ''
        }
      },
      typeStatus:[
        "active",
        "inactive",
        "pending"
      ],
      typeStatusSelect:"pending"
    }
  },
  watch: {
    page(val) {
      // this.selected = []
      this.page = val
      this.getPending()
      // console.log("page>" + JSON.stringify(this.selected))
    },
    selectedAll(val) {
      this.selected = val ? this.desserts.data.map((i) => i.id) : [];
      // console.log("selectedAll>" + JSON.stringify(this.selected))
    },
    selected(val) {
      console.log(val)
      this.selected = val
      this.delSelect = val.length > 0
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
    // this.dates = this.convertDay(true)
    // this.type = (this.$auth.user.ngx_permissions.indexOf('booking.library') === -1) ? 'admin' : 'library'
    this.$nextTick(() => {
      this.getPending()
    })
  },
  methods: {
    updateItemsPerPage (number) {
      this.itemsPerPage = number
      this.getPending()
    },
    async delGroup() {
      await this.$axios.delete(`/destroyMany/${this.selected}`).then((res) => {
        this.selectedAll = false
        this.selected = []
        this.getPending()
      }).catch((e) => {
        console.log(e)
      })
    },
    async searchBooking() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/searchBooking/${this.search}`).then((res) => {
        this.desserts = res.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e)
      })
    },
    async pageBooking(url = 'pending') {
      let p = url.split('api/')
      this.$nuxt.$loading.start()
      await axios.get(`/${url.split('api/')[p.length - 1]}`).then((response) => {
        this.desserts = response.data;
        this.$nuxt.$emit('eventName', this.desserts.total)
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
      if(val == undefined) return
      return dayjs(val).format('DD-MM-YYYY HH:mm')
    },
    async approve(item, b) {
      await this.$axios.put(`pending/${item.id}`, {
        status: b ? 1 : 2,
      }).then((res) => {
        this.getPending()
        // console.log(JSON.stringify(res.data))
      }).catch((error) => {
        console.log(error)
      })
    },
    delBooking(item) {
      this.openItem = Object.assign({}, item)
      this.dialogDelete = true
    },
    async deleteItemConfirm() {
      this.$axios.delete(`booking/${this.openItem.id}`).then((res) => {
        this.getPending()
        this.closeDelete()
      }).catch((error) => {
        console.log(error)
      })
    },
    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.openItem = Object.assign({}, this.openItem)
        // this.editedIndex = -1
      })
    },
    async getPending() {
      this.$nuxt.$loading.start()
      await this.$axios.get(`/getUserList`,{
        params:{
          status:this.typeStatusSelect
        }
      }).then((res) => {
        this.desserts = res.data
        // this.$nuxt.$emit('eventName', this.desserts.total)
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        console.log(error)
      })
    },
  },
}
