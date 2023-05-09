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
<!--              <p style="color: white; font-size: 25px;">เพิ่มรูปภาพพระเครื่องที่ถือครอง</p>-->
<!--              <v-divider vertical style="margin-top: 10px;margin-bottom: 10px;"/>-->
<!--            </v-row>-->
<!--          </v-container>-->
<!--        </v-row>-->
<!--        <v-container>-->
<!--          <v-col>-->
<!--            <v-card style="padding: 12px;">-->
<!--              <v-row>-->
<!--                <v-col>-->
<!--                  <strong style="font-size: 20px">{{ defaultItem.name }}</strong>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--              <v-row>-->
<!--                <v-col style="padding-bottom: 12px;padding-top: 0px">-->
<!--                  <p>รุ่น {{defaultItem.model}} ผลิตในวันที่ {{formatTime(defaultItem.mfg)}}</p>-->
<!--                  <p>ประวัติความเป็นมา : {{defaultItem.history}}</p>-->
<!--                  <p style="margin-top: 10px">วัสดุ : {{ material }}</p>-->
<!--                  <p style="margin-top: 10px">กรรมวิธีการผลิต : {{defaultItem.manufacturing}}</p>-->
<!--                  <p style="margin-top: 10px">ขั้นตอนสำคัญอื่นๆ : {{ defaultItem.other }}</p>-->
<!--                  <p style="margin-top: 10px">-->
<!--                    <strong>ราคาขาย {{defaultItem.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") }} บาท-->
<!--                    </strong></p>-->
<!--                  <p style="margin-top: 10px">บันทึกเมื่อ {{formatTime(defaultItem.updated_at)}} บันทึกโดย {{defaultItem.update_by.username}}</p>-->
<!--                  <p>หมายเหตุ {{defaultItem.note}}</p>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </v-card>-->
<!--          </v-col>-->
<!--          <v-col>-->
<!--            <v-card style="padding: 12px;">-->
<!--              <v-row>-->
<!--                <v-col>-->
<!--                  <DropzoneSingle-->
<!--                      :callback="getPath"-->
<!--                      :addRemove="true"-->
<!--                      :maxFiles="2"-->
<!--                      :clickable="true"/>-->
<!--                </v-col>-->
<!--              </v-row>-->
<!--            </v-card>-->
<!--          </v-col>-->
<!--          <v-overlay v-model="overlay" @click="openImage">-->
<!--            <v-col align="right" style="padding: 0px;">-->
<!--              <v-btn-->
<!--                  fab-->
<!--                  small-->
<!--                  light-->
<!--                  style="margin: 12px;"-->
<!--                  color="#e3ab3f"-->
<!--                  inherit-->
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
<!--                  color="#e3ab3f">-->
<!--                <v-icon>-->
<!--                  mdi-chevron-left-->
<!--                </v-icon>-->
<!--              </v-btn>-->
<!--              <img style="max-width: 1100px;position: relative;" src="/v3.png">-->

<!--              <v-btn-->
<!--                  fab-->
<!--                  small-->
<!--                  light-->
<!--                  style="margin: 12px"-->
<!--                  color="#e3ab3f">-->
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
<!--import DropzoneSingle from "~/components/DropzoneSingle"-->

<!--export default {-->
<!--  middleware: 'auth',-->
<!--  components: {-->
<!--    ItemMonkNumber,-->
<!--    DropzoneSingle,-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      overlay: false,-->
<!--      defaultItem: {-->
<!--        price:'',-->
<!--        update_by:{-->
<!--          username:'',-->
<!--        }-->
<!--      },-->
<!--      material: '',-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.getAmulet()-->
<!--  },-->
<!--  methods: {-->
<!--    getPath(res) {-->
<!--      this.image = res.path-->
<!--      console.log(this.image)-->
<!--    },-->
<!--    formatTime (time, format = 'DD MMM YYYY') {-->
<!--      return this.$dayjs(time).format(format)-->
<!--    },-->
<!--    async getAmulet() {-->
<!--      await this.$axios.get(`amulet/${this.$route.params.amulet}`)-->
<!--          .then((res) => {-->
<!--            this.defaultItem = res.data-->
<!--            console.log(JSON.stringify(this.defaultItem))-->
<!--            // this.roles = this.defaultItem.roles-->
<!--            this.material = JSON.parse(res.data.material).map((d)=>d.name).toString()-->
<!--          })-->
<!--          .catch((e) => {-->
<!--            console.log(e)-->
<!--          })-->
<!--    },-->
<!--    openImage() {-->
<!--      console.log("...")-->
<!--      this.overlay = false-->
<!--    },-->
<!--    OnClick() {-->
<!--      this.$router.push(`${this.$route.path}/history`)-->
<!--    },-->
<!--  },-->
<!--}-->
<!--</script>-->
