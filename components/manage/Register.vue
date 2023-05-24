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
              <td class="truncate">{{ item.name }}</td>
              <td class="truncate">{{ item.phone }}</td>
              <td class="truncate">{{ item.email }}</td>
              <td>{{ item.active }}</td>
              <td>{{ item.status.name }}</td>
              <td align="center">
                <v-icon class="mr-2" x-large @click="()=>approve(item, true)" color="green">
                  mdi-check-circle
                </v-icon>
                <v-icon class="mr-2" x-large @click="()=>approve(item, false)" color="red">
                  mdi-close-circle
                </v-icon>
              </td>
            </tr>
          </template>
          <template v-slot:top>
            <v-toolbar flat>
              <v-toolbar-title>สมาชิกรายใหม่
              </v-toolbar-title>
              <v-spacer></v-spacer>
              <v-btn
                rounded
                color="green"
                dark
                @click="()=>register()"
              >
                เพิ่มผู้ใช้งาน
              </v-btn>
            </v-toolbar>
            <v-divider/>
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
export default {
  data() {
    return {
      itemsPerPageArray: [4, 8, 12],
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
          width: "20%",
        },
        {
          text: 'เบอร์',
          width: "20%",
        },
        {
          text: 'email',
          width: "15%",
        },
        {
          text: 'active',
          width: "20%",
        },
        {
          text: 'สถานะ',
          width: "13%",
        },
        {
          text: "Actions",
          value: "actions",
          align:"center",
          sortable: false,
          width: "12%"
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
    this.getApprove()
  },
  methods: {
    async getApprove(){
      await this.$axios.get('approve')
        .then((res) => {
          this.desserts = res.data
          console.log(res.data)
        }).catch((error) => {
          console.log(error)
        })
    },
    async approve(item, b){
      await this.$axios.put(`users/${item.id}`,{
        name : item.name,
        phone : item.phone,
        email : item.email,
        email_verified_at : item.email_verified_at,
        active : item.active,
        status : b?1:3,
        roles : item.roles.id,
        permission_type : item.permission_type.id,
      })
        .then((res) => {
          this.getApprove()
          console.log(JSON.stringify(res.data))
        }).catch((error) => {
          console.log(error)
        })
    },
    register(){
      this.$router.push(`${this.$route.name}/add_user`)
    },
    nextPage() {
      if (this.page + 1 <= this.numberOfPages) this.page += 1
    },
    formerPage() {
      if (this.page - 1 >= 1) this.page -= 1
    },
    updateItemsPerPage(number) {
      this.itemsPerPage = number
    },
    OnClick(r) {
      console.log("<<<" + JSON.stringify(r))
      this.$router.push(`${this.$route.path}/edit`)
    }
  },
}
</script>
