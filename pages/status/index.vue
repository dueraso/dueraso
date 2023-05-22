<template>
  <div id="app">
    <v-main>
      <v-card elevation="0">
        <v-card-title style="margin: 12px; background-color: #EEF7F6;">
          <v-row style="padding: 12px">
            <h4 style="align-self: center; color: #2096f3; font-size: 20px">
              สถานะลายเซ็นวันนี้
            </h4>
            <v-spacer></v-spacer>
            <v-text-field
              outlined label="ค้นหาหัวข้อ" dense hide-details style="max-width: 400px"
              append-icon="mdi-magnify" v-model="search"/>
          </v-row>
        </v-card-title>
        <v-row style="padding: 12px">
          <v-col>
            <v-simple-table>
              <template v-slot:default>
                <thead>
                <tr>
                  <th class="text-left" style="color: #2196f3; font-size: 16px" v-for="(item, index) in headers"
                      :key="index">
                    {{ item }}
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts" :key="index">
                  <td>{{ item.title }}</td>
                  <td><a>{{ item.user.first_name + " " + item.user.last_name }}</a></td>
                  <td>{{ item.user.masterdepartmentname }}</td>
                  <td>{{ convertDay(item.startDate) + " - " + convertDay(item.endDate) }}</td>
                  <td>
                    <v-chip :color="getColor(item.type)" dark>
                      {{ item.type == 1 ? "ปิดใช้งาน" : "เปิดใช้งาน" }}
                    </v-chip>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
          </v-col>
        </v-row>
      </v-card>
    </v-main>
  </div>
</template>
<script>
import dayjs from "dayjs";

export default {
  middleware: ['auth','isAdmin'],
  data() {
    return {
      search: "",
      headers: ["หัวข้อ", "ชื่อ-สกุล", "สังกัด", "เวลา", "ลายเซ็น"],
      desserts: []
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.getRoom();
    })
  },
  methods: {
    convertDay(val) {
      if (val == undefined) return
      return dayjs(val).format('HH:mm')
    },
    getColor(val) {
      return (val !== 1) ? 'green' : 'red'
    },
    async getRoom() {
      this.$nuxt.$loading.start()
      await this.$axios.get("/getLicensed").then((res) => {
        this.desserts = res.data.data
        this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e);
      });
    },
  }
};
</script>
