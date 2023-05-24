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
        <td>{{ item.name }}</td>
        <td>
          <v-icon
            small
            class="mr-2"
            @click="editItem(item)"
          >
            mdi-pencil
          </v-icon>
          <v-icon
            class="mr-2"
            small
            @click="deleteItem(item)"
          >
            mdi-delete
          </v-icon>
        </td>
      </tr>
    </template>
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>ประเภท
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
        <v-dialog
          v-model="dialog"
          max-width="100%"
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn
              color="primary"
              dark
              class="mb-2"
              @click="createItem()"
            >
              <v-icon> mdi-plus</v-icon>
              เพิ่ม
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col
                    cols="12"
                  >
                    <v-text-field
                      filled
                      v-model="editedItem.name"
                      :disabled="isDisabled"
                      label="ชื่อ"
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">คุณต้องการลบข้อมูล?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
import error from "@/layouts/error";

export default {
  middleware: ['auth','is-admin'],
  data: () => ({
    dialog: false,
    isDisabled: false,
    search: '',
    dialogDelete: false,
    headers: [
      {
        text: 'ชื่อ',
        align: 'start',
        value: 'name',
        width: "90%"
      },
      {text: 'Actions', value: 'actions', sortable: false, width: "10%"},
    ],
    desserts: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      url_icon: '',
    },
    defaultItem: {
      name: '',
      url_icon: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'เพิ่มข้อมูล' : 'แก้ไขข้อมูล'
    },
  },

  watch: {
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.getData();
  },

  mounted() {
  },

  methods: {
    async getData() {
      await this.$axios.get('/place_type')
        .then((response) => {
          this.desserts = response.data;
        }).catch((error) => {
          console.log(error)
        })
    },
    async deleteItemConfirm() {
      await this.$axios.delete(`/place_type/${this.editedItem.id}`)
        .then(() => {
          this.deleteHot()
          this.getData()
          this.closeDelete()
        }).catch((error) => {
          console.log(error)
        })
    },
    async deleteHot() {
      await this.$axios.delete(`/hot/${this.editedItem.id}`)
        .then(() => {
        }).catch((error) => {
          console.log(error)
        })
    },
    async addPlace() {
      console.log("add")
      await this.$axios.post(`/place_type`, {
        'name': this.editedItem.name,
        'url_icon': this.editedItem.url_icon,
      })
        .then(() => {
          this.getData()
        }).catch((error) => {
          console.log(error)
        })
    },
    async editPlace() {
      console.log("edit")
      await this.$axios.put(`/place_type/${this.editedItem.id}`, {
        'name': this.editedItem.name,
        'url_icon': this.editedItem.url_icon,
      })
        .then(() => {
          this.getData()
          this.close()
        }).catch((error) => {
          console.log(error)
        })
    },

    //----------------end API --------------------//

    async createItem() {
      this.$store.commit("setReadOnly", false);
      await this.$router.push(`${this.$route.name}/update`)
    },

    async editItem(item) {
      this.$store.commit("setReadOnly", false);
      this.$store.commit("setPlaceId", item.id);

      await this.$router.push({
        path: `${this.$route.name}/update`,
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
