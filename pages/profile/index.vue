<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;">
          <Header title="ข้อมูลส่วนตัว"/>
          <v-col style="padding-left: 0; padding-right: 0;" align="center">
            <v-card style="padding: 12px; max-width: 843px; max-height: 538px; background-image: url('/bg-card.png')">
              <v-row style="margin: 15px;">
                <v-col sm="8" align="left">
                  <p style="font-size: 40px; color: #4E98E7">{{ profile.fullname }}</p>
                </v-col>
                <v-col sm="4" style="" align-self="center" align="right">
                  <v-btn color="#7b1817" dark @click="$router.push(localeLocation('/profile/edit'))">แก้ไขข้อมูล</v-btn>
                </v-col>
                <v-col cols="12" align="left">
                  <p style="font-size: 20px; color: black">รหัสสมาชิก : {{ profile.memberCode }}</p>
                </v-col>
                <v-col align="left" sm="7" style="padding-left: 50px">
                  <p style="padding-bottom: 12px; font-size: 20px;">
                    <v-icon style=" background: linear-gradient(rgb(84, 171, 238), rgb(58, 78, 206)), center center / cover no-repeat;
                      padding: 10px; color: white; margin-right: 12px">mdi-calendar-month-outline
                    </v-icon>
                    วัน เดือน ปีเกิด : {{ profile.birthday }}
                  </p>
                  <p style="padding-bottom: 12px; font-size: 20px">
                    <v-icon style=" background: linear-gradient(rgb(84, 171, 238), rgb(58, 78, 206)), center center / cover no-repeat;
                      padding: 10px; color: white; margin-right: 12px">mdi-card-bulleted-outline
                    </v-icon>
                    เลขบัตรประชาชน : {{ profile.citizen_id }}
                  </p>
                  <p style="padding-bottom: 12px; font-size: 20px">
                    <v-icon style=" background: linear-gradient(rgb(84, 171, 238), rgb(58, 78, 206)), center center / cover no-repeat;
                      padding: 10px; color: white; margin-right: 12px">
                      mdi-account-circle-outline
                    </v-icon>
                    username : {{ profile.username }}
                  </p>
                </v-col>
                <v-col sm="5" align="right">
                  <!--                  <qr-code-->
                  <!--                    text="https://goo.gl/9eIWP9"-->
                  <!--                    error-level="L">-->
                  <!--                  </qr-code>-->
                  <!--                  <qrcode-vue value="www.google.com" :size="size" level="H" />-->
<!--                  <vue-qrcode value="Hello, World!" :options="{ width: 200 }"></vue-qrcode>-->
                </v-col>
              </v-row>
            </v-card>
          </v-col>
          <v-col style="padding-left: 0; padding-right: 0">
            <!--            <v-data-table-->
            <!--              :headers="headers"-->
            <!--              :items="desserts"-->
            <!--              sort-by="calories"-->
            <!--              class="elevation-1"-->
            <!--              hide-default-footer-->
            <!--            >-->
            <!--              <template v-slot:item="{ item }">-->
            <!--                <tr>-->
            <!--                  <td>{{ item.amulet.name }}</td>-->
            <!--                  <td class="truncate">{{ item.amulet.model }}</td>-->
            <!--                  <td class="truncate">{{ item.number }}</td>-->
            <!--                  <td class="truncate">{{ formatTime(item.updated_at) }}</td>-->
            <!--                  <td>-->
            <!--                    <v-btn text @click="toUpload(item)">-->
            <!--                      <v-icon color="#e3ab3f">mdi-image-plus</v-icon>-->
            <!--                    </v-btn>-->
            <!--                  </td>-->
            <!--                </tr>-->
            <!--              </template>-->
            <!--              <template v-slot:top>-->
            <!--                <v-toolbar flat>-->
            <!--                  <v-toolbar-title>ข้อมูลการถือครอง-->
            <!--                  </v-toolbar-title>-->
            <!--                  <v-spacer></v-spacer>-->
            <!--                </v-toolbar>-->
            <!--                <v-divider/>-->
            <!--              </template>-->
            <!--            </v-data-table>-->
<!--            <v-card>-->
<!--              <v-card-title>-->
<!--                <v-col sm="10">-->
<!--                  <p style="font-size: 18px">ข้อมูลการถือครอง</p>-->
<!--                </v-col>-->
<!--                <v-col sm="2">-->
<!--                  <v-btn color="#7b1817" disabled>เพิ่มข้อมูลจากรหัส</v-btn>-->
<!--                </v-col>-->
<!--              </v-card-title>-->
<!--              <v-simple-table>-->
<!--                <template v-slot:default>-->
<!--                  &lt;!&ndash;                <v-card>&ndash;&gt;-->
<!--                  &lt;!&ndash;                  <v-card-title>&ndash;&gt;-->
<!--                  &lt;!&ndash;                    <v-text-field&ndash;&gt;-->
<!--                  &lt;!&ndash;                      append-icon="mdi-magnify"&ndash;&gt;-->
<!--                  &lt;!&ndash;                      label="Search"&ndash;&gt;-->
<!--                  &lt;!&ndash;                      single-line&ndash;&gt;-->
<!--                  &lt;!&ndash;                      hide-details&ndash;&gt;-->
<!--                  &lt;!&ndash;                    ></v-text-field>&ndash;&gt;-->
<!--                  &lt;!&ndash;                  </v-card-title>&ndash;&gt;-->
<!--                  &lt;!&ndash;                  <v-card-text>&ndash;&gt;-->
<!--                  &lt;!&ndash;                  </v-card-text>&ndash;&gt;-->
<!--                  &lt;!&ndash;                </v-card>&ndash;&gt;-->
<!--                  <thead>-->
<!--                  <tr style="background-color: #4E98E7">-->
<!--                    <th class="text-left" v-for="(header, index) in headers" :key="index"-->
<!--                        style="font-size: 16px; color: white">-->
<!--                      {{ header.text }}-->
<!--                    </th>-->
<!--                  </tr>-->
<!--                  </thead>-->
<!--                  <tbody>-->
<!--                  <tr v-for="(item, index) in items" :key="index">-->
<!--                    <td>{{ item.amulet.name }}</td>-->
<!--                    <td class="truncate">{{ item.amulet.model }}</td>-->
<!--                    <td class="truncate">{{ item.number }}</td>-->
<!--                    <td class="truncate">{{ formatTime(item.updated_at) }}</td>-->
<!--                    <td>-->
<!--                      <v-btn text @click="toUpload(item)">-->
<!--                        <v-icon color="#e3ab3f">mdi-image-plus</v-icon>-->
<!--                      </v-btn>-->
<!--                    </td>-->
<!--                  </tr>-->
<!--                  </tbody>-->
<!--                </template>-->
<!--              </v-simple-table>-->
<!--            </v-card>-->
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>
.v-application p {
  margin: 0;
}
</style>
<script>
// import ItemMonkNumber from "~/components/ItemMonkNumber"
import Vue from 'vue'
import VueMask from 'v-mask'
import {VueMaskDirective} from 'v-mask'
// import VueQRCodeComponent from 'vue-qrcode-component'
//
// Vue.component('qr-code', VueQRCodeComponent)

Vue.use(VueMask);
Vue.directive('mask', VueMaskDirective);
import dayjs from 'dayjs'
// import QrcodeVue from 'qrcode.vue'
// import QRCode from 'qrcode'

// import { createApp } from 'vue';
import VueQrcode from '@chenfengyuan/vue-qrcode';

// const app = createApp({});

Vue.component(VueQrcode.name, VueQrcode);

export default {
  components: {
    // ItemMonkNumber,
    VueMask,
    // VueQRCodeComponent,
    // QrcodeVue,
    // QRCode
  },
  data() {
    return {
      value: 'https://www.google.com',
      size: 300,

      ownerOriginal: {},
      profile: {},
      desserts: [],
      headers: [
        {
          text: 'ชื่อ',
          width: "30%",
          size: 16
        },
        {
          text: 'รุ่น',
          width: "20%",
        },
        {
          text: 'หมายเลข',
          width: "25%",
        },
        {
          text: 'วันที่ครอบครอง',
          width: "20%",
        },
        {
          width: "5%",
        },
      ],
      first_name: '',
      last_name: '',
      user_name: '',
      identification: '',
      birthday: '',
      items: [
        {
          amulet: {
            name: '',
            number: '',
            updated_at: '',
            amulet_detail: {
              model: ''
            }
          }
        }
      ],
    }
  },
  mounted() {
    this.profile = this.$auth.user
  },
  methods: {
    onReady(canvas) {
      const context = canvas.getContext('2d');
      const image = new Image();

      image.src = 'https://avatars.githubusercontent.com/u/3456749';
      image.crossorigin = 'anonymous';
      image.onload = () => {
        const coverage = 0.15;
        const width = Math.round(canvas.width * coverage);
        const x = (canvas.width - width) / 2;

        this.drawImage(context, image, x, x, width, width);
      };
    },
    drawImage(context, image, x, y, width, height, radius = 4) {
      context.shadowOffsetX = 0;
      context.shadowOffsetY = 2;
      context.shadowBlur = 4;
      context.shadowColor = '#00000040';
      context.lineWidth = 8;
      context.beginPath();
      context.moveTo(x + radius, y);
      context.arcTo(x + width, y, x + width, y + height, radius);
      context.arcTo(x + width, y + height, x, y + height, radius);
      context.arcTo(x, y + height, x, y, radius);
      context.arcTo(x, y, x + width, y, radius);
      context.closePath();
      context.strokeStyle = '#fff';
      context.stroke();
      context.clip();
      context.fillStyle = '#fff';
      context.fillRect(x, x, width, height);
      context.drawImage(image, x, x, width, height);
    },


    formatTime(time, format = 'DD MMM YYYY') {
      return this.$dayjs(time).format(format)
    },
    OnClick() {
      this.$router.push(`${this.$route.path}/history`)
    },
    toUpload(item) {
      this.$router.push(`${this.$route.name}/${item.amulet.id}`)
    },
    async save() {
      await this.$axios.put(`users/${this.profile.id}`, {
        'name': this.first_name + " " + this.last_name,
        'first_name': this.first_name,
        'last_name': this.last_name,
        'identification': this.identification,
        'birthday': this.birthday,
      }).then((res) => {
        // console.log(">>"+JSON.stringify(res.data))
      }).catch((e) => {
        console.log(e)
      })
    },
    async getAmulet() {
      await this.$axios.get(`/find_owner/${this.profile.id}`)
        .then((res) => {
          this.ownerOriginal = res.data
          this.desserts = res.data.data
          // console.log(JSON.stringify(res.data.data))
        })
        .catch((e) => {
          alert(e)
          console.log(e)
        })
    },
  },
}
</script>
