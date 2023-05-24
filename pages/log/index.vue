<template>
  <v-card elevation="0">
    <v-card-title  style="background-color: #EEF7F6; height: 100px">
      <v-container>
        <v-row >
          <h4 style="align-self: center; color: #5561B0">รายการการนำเข้าข้อมูล</h4>
          <v-spacer/>
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
            outlined
            dense
            color="#54B6C8"
            style="max-width: 336px;"
          ></v-text-field>
        </v-row>
      </v-container>
    </v-card-title>
    <v-card-text>
    <v-container style="padding: 0">
        <v-simple-table>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left" style="color: #38857D; font-size: 16px">
                ชื่อสถานที่
              </th>
              <th class="text-left" style="color: #38857D; font-size: 16px">
                พิกัด
              </th>
              <th class="text-left" style="color: #38857D; font-size: 16px">
                ระดับสถานที่
              </th>
              <th class="text-left" style="color: #38857D; font-size: 16px">
                การแก้ไขล่าสุด
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="item in desserts"
              :key="item.name"
            >
              <td>{{ item.name }}</td>
              <td>{{ item.calories }}</td>
              <td width="11%">{{ item.priority }}</td>
              <td width="20%">{{ item.update_at }}</td>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<style>
.truncate {
  max-width: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<script>

export default {
  middleware: ['auth', 'is-admin'],
  data: () => ({
    config: {},
    dialog: true,
    isDisabled: false,
    slide_show: false,
    search: '',
    dialogDelete: false,
    desserts: [{
      name: 'Frozen Yogurt',
      calories: 159,
      priority: 'A',
      update_at: '18/02/65 15:00',
    }, {
      name: 'Frozenb Yogurt',
      calories: 1593,
      priority: 'B',
      update_at: '18/02/65 15:00',
    },],
    place_type: [],
    type_select: '',
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
  }),
  watch: {
    // dialog(val) {
    //   val || this.close()
    // },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    // this.getData();
    // this.getType();
  },

  mounted() {
    // this.$nuxt.$loading.start()
  },

  methods: {
    async getData() {
      await this.$axios.get('/places')
        .then((response) => {
          this.$nuxt.
          // this.$nuxt.$loading.finish()

          this.desserts = response.data;
          // this.desserts = this.$auth.user.id === 1 ? response.data:
          //   response.data.filter((d)=>d.create_by === this.$auth.user.id);
        }).catch((error) => {
          console.log(error)
        })
    },
    async deleteItemConfirm() {
      await this.$axios.delete(`/places/${this.editedItem.id}`)
        .then(() => {
          this.getData()
          this.closeDelete()
        }).catch((error) => {
          console.log(error)
        })
    },
    async getType() {
      await this.$axios.get('/place_type')
        .then((response) => {
          this.place_type = response.data;
        }).catch((error) => {
          console.log(error)
        })
    },

    //----------------end API --------------------//

    async getPlaceList() {
      await this.$axios.get(`/placesLatest`)
        .then((res) => {
          let id = res.data.id + 1
          this.$store.commit("setPlaceId", id);
        }).catch((error) => {
          console.log(error)
        })
    },

    async createItem() {
      await this.getPlaceList()
      this.$store.commit("setReadOnly", false);
      // this.$store.commit("setEditedIndex", -1);
      // this.$store.commit("setPlaces", null);
      await this.$router.push('/update')
      // await this.routePage(null)
    },

    async editItem(item) {
      this.type_select = item.type_id
      this.slide_show = item.slider
      this.$store.commit("setReadOnly", false);
      this.$store.commit("setPlaceId", item.id);

      await this.$router.push({
        path: 'update',
        query: {
          edite: Object.assign({}, item).id
        }
      })
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    closeDelete() {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },
  },
}
</script>
