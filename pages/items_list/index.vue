<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;">
          <Header title="ทะเบียนพระเครื่อง"/>
          <v-row style="margin: 0px">
            <v-col cols="12" sm="7" style="padding: 0">
              <v-text-field
                label="ค้นหาชื่อพระ"
                append-icon="mdi-magnify"
                style="padding-right: 12px"
                hide-details
                v-model="search"
                @keydown.enter="getAmulet(search)"
              ></v-text-field>
            </v-col>
            <v-select
              disabled
              :items="items"
              style="padding-right: 12px"
              label="เลือกประเภทพระเครื่อง"
              hide-details
            ></v-select>
            <v-btn style="margin-top: 12px" color="#7b1817" dark @click="$router.push(localeLocation(`/items_list/add/edit`))">
              ลงทะเบียนพระเครื่อง
            </v-btn>
          </v-row>
          <v-row style="margin-top: 12px; margin-bottom: 12px">
            <v-spacer/>
            <v-pagination
              v-model="page"
              :length="amuletItems.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
          <v-col style="padding-right: 0; padding-left: 0" v-show="amuletItems.data.length === 0">
            <v-card class="d-flex align-center" flat height="300" >
              <v-col align="center">
                <p>ไม่มีข้อมูล ยังไม่พร้อมใช้งาน</p>
              </v-col>
            </v-card>
          </v-col>
          <v-row>
            <v-col v-for="(i, index) in amuletItems.data" :key="index" sm="3" align="center">
              <ItemLists :item="i"/>
            </v-col>
          </v-row>
          <v-row style="margin-top: 12px;">
            <v-spacer/>
            <v-pagination
              v-model="page"
              :length="amuletItems.pageTotal"
              :total-visible="7"
            ></v-pagination>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
.v-application .primary {
  background-color: #7b1817 !important;
  border-color: #7b1817 !important;
}
/*.truncate {*/
/*  max-width: 10px;*/
/*  white-space: nowrap;*/
/*  overflow: hidden;*/
/*  text-overflow: ellipsis;*/
/*}*/
</style>
<script>
import ItemLists from "~/components/ItemLists"
import axios from "~/api/config";

export default {
  components: {
    ItemLists
  },
  middleware: 'auth',
  data: () => ({
    page: 1,
    config: {},
    items: [],
    isDisabled: false,
    slide_show: false,
    search: '',
    dialogDelete: false,
    desserts: [],
    place_type: [],
    type_select: '',
    editedIndex: -1,
    editedItem: {},
    amuletItems: {
      data:[]
    },
  }),
  watch: {
    dialogDelete(val) {
      val || this.closeDelete()
    },
    page(val){
      this.getAmulet()
    }
  },

  mounted() {
    this.$nextTick(() => {
      this.getAmulet()
    })
  },

  methods: {
    async getAmulet(title='') {
      this.$nuxt.$loading.start()
      await this.$axios.get('/sacred-object-out/my', {
        params: {
          keyword:title,
          page: this.page,
          limit: 10,
        }
      }).then((res) => {
        // console.log(res.data)
        this.amuletItems = res.data;
        this.$nuxt.$loading.finish()
      }).catch((error) => {
        alert(error)
        console.log(error)
      })
    },

    // async getMyStatus(search = '') {
    //   await axios.get(`/sacred-object/my`, {
    //     headers: {
    //       'Authorization': `Bearer ${this.$auth.$storage.getLocalStorage('token')}`
    //     },
    //     params: {
    //       keyword: search,
    //       page: this.page,
    //       limit: 8,
    //       templeId: ''
    //     }
    //   }).then((res) => {
    //     this.items = res.data
    //     console.log(JSON.stringify(this.items))
    //     this.$nuxt.$loading.finish()
    //   }).catch((error) => {
    //     console.log(error.message)
    //   })
    // },


    // CheckLogin() {
    //   if (this.$auth.loggedIn) {
    //     return this.$auth.user.roles === 1
    //   }
    //   return false
    // },
    // addItem() {
    //   this.$router.push(`${this.$route.name}/add/edit`)
    // },
    // async getData() {
    //   await this.$axios.get('/places').then((response) => {
    //     this.desserts = response.data;
    //   }).catch((error) => {
    //     console.log(error)
    //   })
    // },
    // async deleteItemConfirm() {
    //   await this.$axios.delete(`/places/${this.editedItem.id}`).then(() => {
    //     this.getData()
    //     this.closeDelete()
    //   }).catch((error) => {
    //     console.log(error)
    //   })
    // },
    //
    // closeDelete() {
    //   this.dialogDelete = false
    //   this.$nextTick(() => {
    //     this.editedItem = Object.assign({}, this.defaultItem)
    //     this.editedIndex = -1
    //   })
    // },
    //
    // async searchAmulet() {
    //   this.$nuxt.$loading.start()
    //   await this.$axios.get(`/filter_amulet`, {
    //     params: {
    //       "search": this.search,
    //     }
    //   }).then((response) => {
    //     this.$nuxt.$loading.finish()
    //     this.amuletItems = response.data;
    //     // console.log(JSON.stringify(response.data))
    //   }).catch((error) => {
    //     alert(error)
    //     console.log(error.data)
    //   })
    // },
  },
}
</script>
