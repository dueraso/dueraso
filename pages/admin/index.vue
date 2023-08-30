<template>
  <v-card elevation="0">
    <v-card-title style="background-color: #eef7f6; height: 100px">
      <v-container>
        <v-row>
          <h4 style="align-self: center; color: #5561b0">
            รายชื่อข้อมูลสถานที่
          </h4>
          <v-spacer />
          <v-text-field
            prepend-inner-icon="mdi-magnify"
            label="ค้นหา"
            single-line
            hide-details
            outlined
            dense
            v-model="search"
            color="#54B6C8"
            style="max-width: 336px"
            @keydown.enter="searchPlaces"
          ></v-text-field>
          <v-btn
            style="align-self: center; margin-left: 12px"
            color="#54B6C8"
            dark
          >
            เพิ่มสถานที่
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
              <th class="text-left" style="color: #38857d; font-size: 16px">
                ชื่อสถานที่
              </th>
              <th class="text-left" style="color: #38857d; font-size: 16px">
                พิกัด
              </th>
              <th class="text-left" style="color: #38857d; font-size: 16px">
                ระดับสถานที่
              </th>
              <th class="text-left" style="color: #38857d; font-size: 16px">
                การแก้ไขล่าสุด
              </th>
              <th style="max-width: 50px"></th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="item in desserts" :key="item.name">
              <td>{{ item.topic }}</td>
              <td>{{ item.latitude + "," + item.longitude }}</td>
              <td width="11%">{{ item.priority }}</td>
              <td width="20%">{{ convertDay(item.updated_at) }}</td>
              <th class="text-left" width="8%">
                <v-icon color="#38857D" @click="editItem(item)"
                >mdi-pencil-outline</v-icon
                >
                <v-icon color="#38857D" v-if="roles" @click="deleteItem(item)"
                >mdi-delete-outline</v-icon
                >
              </th>
            </tr>
            </tbody>
          </template>
        </v-simple-table>
      </v-container>
    </v-card-text>
    <v-dialog v-model="dialog" width="535" style="height: 215px">
      <v-card>
        <v-card-text style="padding: 24px">
          <h3 style="font-size: 20px; padding-bottom: 12px" class="text-center">
            ยืนยันการลบข้อมูล
          </h3>

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
import dayjs from "dayjs";

export default {
  layout:"admin-layout",
  // middleware: 'auth',
  data: () => ({
    config: {},
    dialog: false,
    isDisabled: false,
    slide_show: false,
    search: "",
    dialogDelete: false,
    desserts: [],
    place_type: [],
    type_select: "",
    editedIndex: -1,
    editedItem: {},
    defaultItem: {},
  }),
  computed: {
    roles() {
      return true;
      // return this.$auth.user.roles <= 2;
    },
  },
  watch: {
    // dialog(val) {
    //   val || this.close()
    // },
    dialogDelete(val) {
      val || this.closeDelete();
    },
  },

  created() {
    // this.getData();
  },

  mounted() {},

  methods: {
    convertDay(day) {
      return dayjs(day).format("DD-MM-YYYY HH:mm:ss");
    },

    async getData() {
      await this.$axios
        .get("/full_places")
        .then((response) => {
          this.desserts = response.data;
          // console.log(JSON.stringify(this.desserts))
          // this.desserts = this.$auth.user.id === 1 ? response.data:
          //   response.data.filter((d)=>d.create_by === this.$auth.user.id);
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async deleteItemConfirm() {
      console.log(JSON.stringify(this.editedItem));
      await this.$axios
        .delete(`/places/${this.editedItem.id}`)
        .then(() => {
          this.getData();
          this.closeDelete();
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async getType() {
      await this.$axios
        .get("/place_type")
        .then((response) => {
          this.place_type = response.data;
        })
        .catch((error) => {
          console.log(error);
        });
    },

    async searchPlaces() {
      console.log("สสส");
      await this.$axios
        .get(`/filter_places`, {
          params: {
            search: this.search,
          },
        })
        .then((response) => {
          this.desserts = response.data;
        })
        .catch((error) => {
          alert(error);
          console.log(error);
        });
    },

    async createItem() {
      await this.getPlaceList();
      this.$store.commit("setReadOnly", false);
      // await this.$router.push("/update");
    },

    async editItem(item) {
      // await this.$router.push({
      //   path: "/update",
      //   query: {
      //     edite: Object.assign({}, item).id,
      //   },
      // });
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item);
      this.editedItem = Object.assign({}, item);
      this.dialog = true;
    },

    closeDelete() {
      this.dialog = false;
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem);
        this.editedIndex = -1;
      });
    },
  },
};
</script>
