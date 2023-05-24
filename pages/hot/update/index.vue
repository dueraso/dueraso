<template>
  <v-data-table
    :headers="headers"
    :items="desserts"
    :search="search"
    sort-by="calories"
    class="elevation-1"
  >
    <template v-slot:item="{ item }">
      <tr>
        <td>{{ item.topic }}</td>
        <td class="truncate">{{ item.detail }}</td>
        <td class="truncate">{{ item.place_type.name }}</td>
        <td class="truncate">{{ item.phone }}</td>
        <td class="truncate">{{ item.price }}</td>
        <td>
          <v-switch
            v-model="item.hot > 0"
            inset
            :disabled="isDisabled"
            @change="onChange(item)"
          ></v-switch>
        </td>
      </tr>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>สถานที่
        </v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        ></v-divider>

        <v-text-field
          v-model="search"
          append-icon="mdi-magnify"
          label="Search"
          single-line
          hide-details
        ></v-text-field>
        <v-spacer></v-spacer>
        <v-btn
          color="primary"
          dark
          @click="checkItem"
        >
          <v-icon>mdi-checkbox-marked-circle</v-icon>
          บันทึก
        </v-btn>
        <v-btn
          color="orange darken-2"
          dark
          @click="close"
          style="margin-left: 10px"
        >
          <v-icon>mdi-cancel</v-icon>
          ยกเลิก
        </v-btn>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">คุณต้องการลบข้อมูล?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn
                color="blue darken-1"
                text>
              </v-btn>
              <v-btn color="blue darken-1" text
              >OK
              </v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
  </v-data-table>

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
import error from "~/layouts/error";
import login from "@/pages/login";
import DropzoneSingle from "~/components/DropzoneSingle";

export default {
  components: {
    DropzoneSingle
  },
  middleware: ['auth','is-admin'],
  data: () => ({
    config: {},
    // dialog: false,
    isDisabled: false,
    slide_show: false,
    search: '',
    dialogDelete: false,
    headers: [
      {
        text: 'หัวข้อ',
        align: 'start',
        value: 'topic',
        width: "20%"
      },
      {text: 'รายละเอียด', value: 'detail', width: "35%"},
      {text: 'ประเภท', value: 'place_type', width: "10%"},
      {text: 'เบอร์', value: 'phone', width: "10%"},
      {text: 'ราคา', value: 'price', width: "15%"},
      {text: 'Hot', value: 'actions', sortable: false, width: "10%"},
    ],
    desserts: [],
    place_type: [],
    hot: {},
    type_select: '',
    editedIndex: -1,
    editedItem: {},
    defaultItem: {
      id: '',
      url_img_topic: '',
      topic: '',
      detail: '',
      url_location: '',
      type_name: '',
      phone: '',
      price: '',
      create_by: '',
      place_type: {},
      galleries: [],
      hot: '',
      slider: 0,
      time: '',
    },
    isCreate: false,
    isCurrent: [],
  }),
  watch: {
    // hot(val) {
    //   val || this.onChange()
    // },
    dialogDelete(val) {
      console.log("===>" + val)
      val || this.closeDelete()
    },
  },

  created() {
    this.isCreate = this.$route.query.edite
    if (this.isCreate) this.getData();
    // this.getType();
  },

  methods: {
    async onChange(item) {
      let _item = this.desserts[this.desserts.indexOf(item)]
      _item.hot = (_item.hot !== 0) ? 0 : this.$route.query.edite
      // let d = this.desserts.filter((age) => age.hot == 1).length
      // this.isDisabled = d >= 10
      // console.log(JSON.stringify(this.isCurrent.find(d => d === item)))
      if (this.isCurrent.find(d => d === item) === undefined) {
        this.isCurrent.push(item)
        // console.log(JSON.stringify(this.isCurrent))
      }
    },

    async getData() {
      console.log("id>>"+this.$route.query.edite)
      await this.$axios.get(`/hot/${this.$route.query.edite}`)
        .then((response) => {
          this.hot = response.data
          // this.desserts = this.hot.place;
          this.getType()
        }).catch((error) => {
          console.log(error)
        })
    },
    //   async deleteItemConfirm() {
    //     await this.$axios.delete(`/places/${item.id}`)
    //       .then(() => {
    //         this.getData()
    //         this.closeDelete()
    //       }).catch((error) => {
    //         console.log(error)
    //       })
    //   },
    async getType() {
      await this.$axios.get(`/place_type/${this.$route.query.edite}`)
        .then((response) => {
          this.desserts = response.data.place;
        }).catch((error) => {
          console.log(error)
        })
    },
    async checkItem(){
      if(this.desserts.filter((age) => age.hot == 1).length > 10){
        alert("เลือกไม่เกิน 10 รายการ")
        return
      }
      this.isCurrent.map(async (d) => {
        await this.save(d)
      })
      this.close()
    },

    async save(item){
      await this.$axios.put(`/places/${item.id}`, {
        'type_id': item.type_id,
        'topic': item.topic,
        'detail': item.detail,
        'url_img_topic': item.url_img_topic,
        'url_location': item.url_location,
        'phone': item.phone,
        'price': item.price,
        'create_by': item.create_by,
        'hot': item.hot,
        'slider': item.slider,
        'time': item.time,
      })
        .then(() => {
        }).catch((error) => {
          console.log(error)
        })
    },
    close(){
      this.$router.back()
    },
  },
}
</script>
