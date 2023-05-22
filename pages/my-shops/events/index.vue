<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <v-row class="pa-3 mt-1" style="background: #eef7f6">
            <h5 class="mb-0 ml-4" style="color: #00000080">
              <v-icon x-large>mdi-clipboard-edit-outline</v-icon>
              รายรับ-รายจ่าย
            </h5>
            <v-spacer/>
            <v-btn outlined @click="openItem({})" class="mr-3">
              <v-icon>mdi-plus</v-icon>
              เพิ่ม
            </v-btn>
          </v-row>
          <v-col>
            <v-simple-table fixed-header>
              <template v-slot:default>
                <thead>
                <tr>
                  <th v-for="(item, i) in tableHead" :key="i" class="text-left" style="font-size: 14px"
                      :width="item.width">{{ item.title }}
                  </th>
                  <th width="120">
                  </th>
                </tr>
                </thead>
                <tbody>
                <tr v-for="(item, index) in desserts.data" :key="index">
                  <td>{{ item.name }}</td>
                  <td>{{ item.user }}</td>
                  <td>{{ item.create_by.name }}</td>
                  <td>{{ item.status }}</td>
                  <td>{{ item.permissions }}</td>
                  <td>{{ item.created_at }}</td>
                  <td class="p-0 text-right">
                    <v-btn fab small text @click="dd.openItem(item)">
                      <v-icon>mdi-pen</v-icon>
                    </v-btn>
                    <v-btn fab small text @click="onDelete(item)">
                      <v-icon>mdi-delete-outline</v-icon>
                    </v-btn>
                  </td>
                </tr>
                </tbody>
              </template>
            </v-simple-table>
            <div class="text-center">
              <v-dialog
                v-model="dialog"
                width="500"
                persistent
              >
                <v-card>
                  <v-card-title class="text-h5 grey lighten-2 mb-3">
                    Privacy Policy
                  </v-card-title>

                  <v-card-text>
                    <v-text-field
                      v-model="item.title"
                      label="title"
                      outlined
                      clearable
                      dense
                    ></v-text-field>
                    <v-text-field
                      v-model="item.detail"
                      label="detail"
                      outlined
                      clearable
                      dense
                    ></v-text-field>
                  </v-card-text>

                  <v-divider></v-divider>

                  <v-card-actions>
                    <v-spacer></v-spacer>
                    <v-btn
                      color="primary"
                      text
                      @click="confirm"
                    >
                      ok
                    </v-btn>
                    <v-btn
                      color="primary"
                      text
                      @click="dialog = false"
                    >
                      cancel
                    </v-btn>
                  </v-card-actions>
                </v-card>
              </v-dialog>
            </div>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script>
import dayjs from "dayjs";
import B from "@/utils/myFunction";

export default {
  // middleware: ['auth','isAdmin'],
  layout: "seller-layout",
  // extends:B,
  // mixins:
  //   B
  // ,
  data() {
    return {
      loading: true,
      search: "",
      dialog: false,
      tableHead: [
        {
          title: "ชื่อ-สกุล",
          width: ""
        },
        {
          title: "ผู้ใช้งาน",
          width: "15%"
        },
        {
          title: "สร้างโดย",
          width: ""
        },
        {
          title: "สถานะ",
          width: "5%"
        },
        {
          title: "สิทธิ์",
          width: "10%"
        },
        {
          title: "สร้างเมื่อ",
          width: "10%"
        },
      ],
      desserts: {
        data: [
          {
            name: "super_admin",
            user: "super_admin",
            create_by: {
              name: "super_admin",
            },
            status: "1",
            permissions: "super_admin",
            created_at: "12:29:00 2023/12/23"
          },
          {
            name: "arthit dueraso",
            user: "dueraso",
            create_by: {
              name: "arthit dueraso",
            },
            status: "1",
            permissions: "admin",
            created_at: "12:29:00 2023/12/23"
          },
        ]
      },
      item: {},
    };
  },
  created() {
    this.$nextTick(() => {
      this.loading = false
    })
  },
  props:{

  },
  mounted() {
      // this.getRoom();

    // this.test()
  },
  computed:{
    dd(){
      return new B()
    },
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

    confirm() {
      if (this.item.id) {
        console.log("Update> " + this.item.id)
        this.onUpdate()
      } else {
        console.log("Create> " + this.item.id)
        this.onCreate()
      }
    },

  }
};
</script>
