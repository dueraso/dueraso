<!--<template>-->
<!--  <div id="app">-->
<!--    <v-app id="inspire" style="background-image: url('/bg-main.svg');">-->
<!--      <v-main>-->
<!--        <v-row style="background-image: url('/head-bar.png'); height: 220px" align="center">-->
<!--          <v-container>-->
<!--            <v-row style="margin: 12px" ustify="center">-->
<!--              <v-btn-->
<!--                  fab-->
<!--                  small-->
<!--                  color="#e3ab3f"-->
<!--                  style="margin-right: 12px"-->
<!--                  @click="()=>this.$router.back()"-->
<!--              >-->
<!--                <v-icon>-->
<!--                  mdi-chevron-left-->
<!--                </v-icon>-->
<!--              </v-btn>-->

<!--              <p style="color: white; font-size: 25px; font-family: Sarabun,serif">ประวัติ {{ log.name }} รุ่น {{ log.model }}</p>-->
<!--              <v-divider vertical style="margin-top: 10px;margin-bottom: 10px;"/>-->

<!--              <v-spacer></v-spacer>-->
<!--&lt;!&ndash;              <v-text-field&ndash;&gt;-->
<!--&lt;!&ndash;                  label="ค้นหา"&ndash;&gt;-->
<!--&lt;!&ndash;                  append-icon="mdi-magnify"&ndash;&gt;-->
<!--&lt;!&ndash;                  required&ndash;&gt;-->
<!--&lt;!&ndash;                  rounded&ndash;&gt;-->
<!--&lt;!&ndash;                  dense&ndash;&gt;-->
<!--&lt;!&ndash;                  style="max-width: 357px; padding-right: 20px"&ndash;&gt;-->
<!--&lt;!&ndash;                  solo&ndash;&gt;-->
<!--&lt;!&ndash;                  hide-details&ndash;&gt;-->
<!--&lt;!&ndash;              ></v-text-field>&ndash;&gt;-->
<!--&lt;!&ndash;              <v-btn rounded color="#e3ab3f" dark>เสนอให้เช่า</v-btn>&ndash;&gt;-->
<!--            </v-row>-->
<!--          </v-container>-->
<!--        </v-row>-->
<!--        <v-container>-->
<!--          <v-col>-->
<!--            <v-card style="padding: 12px;">-->
<!--              <v-row>-->
<!--                <v-col>-->
<!--                  <strong style="font-size: 20px">ประวัติ {{ log.name }} รุ่น {{ log.model }}</strong>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--              <v-row>-->
<!--                <v-col style="padding-bottom: 12px;padding-top: 0px">-->
<!--                  <p>รุ่น {{ log.model }} ผลิตในวันที่ {{ formatDateTime(log.mfg) }}</p>-->
<!--                  <p>ประวัติความเป็นมา : {{ log.history }} </p>-->
<!--                  <p style="margin-top: 10px">วัสดุ : {{ material.toString() }}</p>-->
<!--                  <p style="margin-top: 10px">กรรมวิธีการผลิต : {{ log.manufacturing }}</p>-->
<!--                  <p style="margin-top: 10px">ขั้นตอนสำคัญอื่นๆ : {{ log.other }}</p>-->
<!--                  <p style="margin-top: 10px">-->
<!--                    <strong>ราคาซื้อ {{ log.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} บาท</strong>-->
<!--                  </p>-->
<!--                  <p style="margin-top: 10px">บันทึกเมื่อ {{ formatTime(item.updated_at) }} บันทึกโดย {{ item.update_by.name }}</p>-->
<!--                  <p>หมายเหตุ {{ log.node }}</p>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--              <v-row>-->
<!--                <v-col>-->
<!--                  <img-->
<!--                      v-for="(img, index) in log.galleries"-->
<!--                      :key="index"-->
<!--                      :src="img.path"-->
<!--                      style="max-width: 176px; padding: 12px"-->
<!--                      @click="openImage(img.path, index)">-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </v-card>-->
<!--          </v-col>-->
<!--          <v-overlay v-model="overlay">-->
<!--            <v-col align="right" style="padding: 0px;">-->
<!--              <v-btn-->
<!--                  fab-->
<!--                  small-->
<!--                  light-->
<!--                  style="margin: 12px;"-->
<!--                  color="#e3ab3f"-->
<!--                  inherit-->
<!--                  @click="closeImage"-->
<!--              >-->
<!--                <v-icon>-->
<!--                  mdi-close-->
<!--                </v-icon>-->
<!--              </v-btn>-->
<!--            </v-col>-->

<!--            <v-row align="center">-->
<!--              <v-btn-->
<!--                  fab-->
<!--                  small-->
<!--                  light-->
<!--                  style="margin: 12px"-->
<!--                  color="#e3ab3f"-->
<!--                  @click="prevImage">-->
<!--                <v-icon>-->
<!--                  mdi-chevron-left-->
<!--                </v-icon>-->
<!--              </v-btn>-->
<!--              <img style="max-width: 1100px;max-height: 600px;position: relative;" :src="selectImg">-->

<!--              <v-btn-->
<!--                  fab-->
<!--                  small-->
<!--                  light-->
<!--                  style="margin: 12px"-->
<!--                  color="#e3ab3f"-->
<!--                  @click="nextImage">-->
<!--                <v-icon>-->
<!--                  mdi-chevron-right-->
<!--                </v-icon>-->
<!--              </v-btn>-->
<!--            </v-row>-->
<!--          </v-overlay>-->
<!--        </v-container>-->
<!--      </v-main>-->
<!--    </v-app>-->
<!--  </div>-->
<!--</template>-->
<!--<style>-->
<!--.v-application p {-->
<!--  margin: 0;-->
<!--}-->
<!--</style>-->
<!--<script>-->
<!--import ItemMonkNumber from "~/components/ItemMonkNumber"-->
<!--export default {-->
<!--  components:{-->
<!--    ItemMonkNumber,-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      overlay: false,-->
<!--      item:{-->
<!--        price: '',-->
<!--        update_by:{-->
<!--          name:''-->
<!--        },-->
<!--      },-->
<!--      log:{-->
<!--        price:0,-->
<!--      },-->
<!--      selectImg: '',-->
<!--      indexImg: 0,-->
<!--      material:[],-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    // console.log(">>"+this.$route.params.detail)-->
<!--    this.getAmuletLogs()-->
<!--  },-->
<!--  methods: {-->
<!--    openImage(url, index) {-->
<!--      this.indexImg = index-->
<!--      this.selectImg = url-->
<!--      this.overlay = true-->
<!--    },-->
<!--    closeImage() {-->
<!--      this.overlay = false-->
<!--    },-->
<!--    prevImage() {-->
<!--      if(this.indexImg <= 0) return-->
<!--      this.selectImg = this.item.galleries[&#45;&#45;this.indexImg].path-->
<!--    },-->
<!--    nextImage() {-->
<!--      if(this.indexImg >= (this.item.galleries.length - 1)) return-->
<!--      this.selectImg = this.item.galleries[++this.indexImg].path-->
<!--    },-->
<!--    formatDateTime(time, format = 'DD MMM YYYY') {-->
<!--      return this.$dayjs(time).format(format)-->
<!--    },-->
<!--    formatTime(time, format = 'DD MMM YYYY HH:mm') {-->
<!--      return this.$dayjs(time).format(format)-->
<!--    },-->
<!--    async getAmuletLogs() {-->
<!--      await this.$axios.get(`/amulet_log/${this.$route.params.detail}`).then((res) => {-->
<!--        this.item = res.data-->
<!--        this.log = JSON.parse(this.item.json_old)-->
<!--        // console.log(JSON.stringify(this.log))-->
<!--        this.material = JSON.parse(this.log.material).map((m)=>m.name)-->
<!--      }).catch((e) => {-->
<!--        alert(e)-->
<!--        console.log(e)-->
<!--      })-->
<!--    },-->
<!--    test(url) {-->
<!--      this.overlay = true-->
<!--    },-->
<!--    Test1() {-->
<!--      console.log("...")-->
<!--      this.overlay = false-->
<!--    },-->
<!--    OnClick(){-->
<!--      this.$router.push(`${this.$route.path}/history`)-->
<!--    },-->
<!--  },-->
<!--}-->
<!--</script>-->
