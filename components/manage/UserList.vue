<template>
  <v-container>
    <v-row>
      <v-col>
        <v-data-table
          :headers="headers"
          :items="desserts"
          :search="search"
          sort-by="calories"
          class="elevation-1"
        >
          <template v-slot:item="{ item }">
            <tr>
              <td><a @click="OnClick(item)" style="color: black">{{ item.name }}</a></td>
              <td class="truncate">{{ item.phone }}</td>
              <td>{{ item.email }}</td>
              <td>{{ item.active === 1 ? 'ปกติ' : 'ระงับ' }}</td>
              <td>{{ item.status.name }}</td>
              <td>{{ item.roles.name }}</td>
              <td>
                <v-icon class="mr-2" @click="deleteItem(item.id)" color="#e3ab3f">
                  mdi-delete
                </v-icon>
              </td>
            </tr>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>สมาชิกทั้งหมด
              </v-toolbar-title>
              <v-spacer></v-spacer>
            </v-toolbar>
            <v-divider/>
          </template>
        </v-data-table>
      </v-col>
    </v-row>

    <v-dialog v-model="dialogDelete" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">คุณต้องการลบข้อมูล?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="()=>dialogDelete = false">Cancel</v-btn>
          <v-btn color="blue darken-1" text @click="deleteConfirm">OK</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      dialogDelete: false,
      itemsSelected: '',
      search: '',
      filter: {},
      sortDesc: false,
      page: 1,
      tab: null,
      itemsPerPage: 4,
      desserts: [],
      headers: [
        {
          text: 'ชื่อ - นามสกุล',
          width: "30%",
        },
        {
          text: 'เบอร์',
          width: "15%",
        },
        {
          text: 'email',
          width: "20%",
        },
        {
          text: 'active',
          width: "10%",
        },
        {
          text: 'สถานะ',
          width: "10%",
        },
        {
          text: 'สิทธิ์',
          width: "10%",
        },
        {
          text: "Actions",
          value: "actions",
          align: "center",
          sortable: false,
          width: "5%"
        },
      ],
    }
  },
  computed: {
    numberOfPages() {
      return Math.ceil(this.desserts.length / this.itemsPerPage)
    },
    filteredKeys() {
      return this.keys.filter(key => key !== 'Name')
    },
  },
  mounted() {
    this.getUsers()
  },
  methods: {
    async getUsers() {
      await this.$axios.get('users')
        .then((res) => {
          this.desserts = res.data
          console.log(res.data)
        }).catch((error) => {
          console.log(error)
        })
    },
    deleteItem(item){
      this.itemsSelected = item
      this.dialogDelete = true
    },
    async deleteConfirm() {
      await this.$axios.delete(`users/${this.itemsSelected}`)
        .then((res) => {
          this.getUsers()
          this.dialogDelete = false
        }).catch((error) => {
          console.log(error)
        })
    },
    OnClick(item) {
      this.$router.push({
        path: `${this.$route.path}/edit`,
        query: {
          ref: item.id
        }
      })
    },
  },
}
</script>
