<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #EEF7F6; height: 100px">
      <v-container>
        <v-row>
          <h4 style="align-self: center; color: #5561B0">รายชื่อผู้ใช้งานในระบบ</h4>
          <v-spacer/>
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
            outlined
            dense
            color="#54B6C8"
            v-model="search"
            @keydown.enter="searchUser"
            style="max-width: 336px;"
          ></v-text-field>
          <v-btn
            @click="addUser"
            style="align-self: center; margin-left: 12px"
            color="#54B6C8"
            dark>
            เพิ่มผู้ใช้งาน
          </v-btn>
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
                ชื่อ - สกุล
              </th>
              <th class="text-left" style="color: #38857D; font-size: 16px">
                ผู้ใช้งาน
              </th>
              <th class="text-left" style="color: #38857D; font-size: 16px">
                สิทธิ์
              </th>
              <th class="text-left" style="color: #38857D; font-size: 16px">
                สถานะ
              </th>
              <th style="max-width: 50px">
              </th>
            </tr>
            </thead>
            <tbody>
            <tr
              v-for="item in desserts"
              :key="item.name"
            >
              <td >{{ item.name }}</td>
              <td >{{ item.user_name }}</td>
              <td >{{ item.roles.name }}</td>
              <td width="10%">{{ item.active === 1 ? 'ปกติ':'ระงับ'}}</td>
              <th class="text-left" width="8%" v-if="item.roles.id !== 1">
                <v-icon color="#38857D" @click="editItem(item)" >mdi-pencil-outline</v-icon>
                <v-icon color="#38857D" v-if="roles" @click="deleteItem(item)">mdi-delete-outline</v-icon>
              </th>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card-text>
    <v-dialog
      v-model="dialog"
      width="535"
      style="height: 215px; "
    >
      <v-card>

        <v-card-text style="padding: 24px">
          <h3 style="font-size: 20px; padding-bottom: 12px" class="text-center">ยืนยันการลบข้อมูล</h3>

          <v-col align="center">
            <v-btn
              color="#54B6C8"
              dark
              style="padding-right: 35px; padding-left: 35px"
              @click="dialog = false"
            >
              ยกเลิก
            </v-btn>
            <v-btn
              color="#54B6C8"
              dark
              style="margin-left: 24px; padding-right: 35px; padding-left: 35px"
              @click="deleteItemConfirm"
            >
              ยืนยัน
            </v-btn>
          </v-col>
        </v-card-text>
      </v-card>
    </v-dialog>
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
  middleware: 'auth',
  data: () => ({
    config: {},
    dialog: false,
    isDisabled: false,
    slide_show: false,
    search: '',
    dialogDelete: false,
    desserts: [],
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

  computed:{
    roles() {
      return this.$auth.user.roles <= 2
    },
  },
  created() {
    this.getData();
    // this.getType();
  },

  mounted() {
    // this.$nuxt.$loading.start()
  },

  methods: {
    async addUser(){
      this.$router.push(`${this.$route.name}/add_user`)
    },
    async getData() {
      await this.$axios.get('/users')
        .then((response) => {
          // this.$nuxt.$loading.finish()

          this.desserts = response.data;
          // console.log(JSON.stringify(response.data))
        }).catch((error) => {
          console.log(error)
        })
    },
    async searchUser() {
      await this.$axios.get(`/filter`, {
        params: {
          "search": this.search,
        }
      })
        .then((response) => {
          this.desserts = response.data;
        }).catch((error) => {
          alert(error)
          console.log(error)
        })
    },
    async deleteItemConfirm() {
      await this.$axios.delete(`/users/${this.editedItem.id}`)
        .then(() => {
          this.getData()
          this.dialog = false
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
      await this.$router.push({
        path: `${this.$route.name}/add_user`,
        query: {
          edite: Object.assign({}, item).id
        }
      })
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },
  },
}
</script>
