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

<!--              <p style="color: white; font-size: 25px; font-family: Sarabun,serif">-->
<!--                ประวัติ {{ this.amulet.name }} รุ่น {{ this.amulet.model }}</p>-->
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
<!--          <v-row-->
<!--              class="mt-2"-->
<!--              align="center"-->
<!--              justify="center"-->
<!--              style="margin: 12px"-->
<!--          >-->
<!--            <span>เปลี่ยนการครอบครอง {{ originalItem.total }} ครั้ง</span>-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-btn-->
<!--                fab-->
<!--                color="#e3ab3f"-->
<!--                class="mr-1"-->
<!--                small-->
<!--                @click="()=>{getAmuletLogs(originalItem.prev_page_url)}"-->
<!--                :disabled="originalItem.prev_page_url === null"-->
<!--            >-->
<!--              <v-icon color="white">mdi-chevron-left</v-icon>-->
<!--            </v-btn>-->
<!--            <span class="mr-4 ml-4">{{ originalItem.current_page }} / {{ originalItem.last_page }}-->
<!--          </span>-->
<!--            <v-btn-->
<!--                fab-->
<!--                color="#e3ab3f"-->
<!--                class="ml-1"-->
<!--                small-->
<!--                @click="()=>{getAmuletLogs(originalItem.next_page_url)}"-->
<!--                :disabled="originalItem.next_page_url === null"-->
<!--            >-->
<!--              <v-icon color="white">mdi-chevron-right</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
<!--          <v-row>-->
<!--            <v-col>-->
<!--              <v-data-table-->
<!--                  :headers="headers"-->
<!--                  :items_list="desserts"-->
<!--                  :search="search"-->
<!--                  sort-by="calories"-->
<!--                  class="elevation-1"-->
<!--                  hide-default-footer-->
<!--              >-->
<!--                <template v-slot:item="{ item }">-->
<!--                  <tr @click="OnClick(item)">-->
<!--                    <td>{{ item.update_by.name }}</td>-->
<!--                    <td class="truncate">{{ item.note }}</td>-->
<!--                    <td>{{ formatTime(item.updated_at) }}</td>-->
<!--                  </tr>-->
<!--                </template>-->
<!--                <template v-slot:top>-->
<!--                  <v-toolbar flat>-->
<!--                    <v-toolbar-title><p style="font-size: 18px">รายการการเปลี่ยนแปลงข้อมูล</p>-->
<!--                    </v-toolbar-title>-->
<!--                    <v-spacer></v-spacer>-->
<!--                  </v-toolbar>-->
<!--                  <v-divider/>-->
<!--                </template>-->
<!--              </v-data-table>-->
<!--            </v-col>-->
<!--          </v-row>-->
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
<!--  components: {-->
<!--    ItemMonkNumber,-->
<!--  },-->
<!--  computed: {-->
<!--    numberOfPages() {-->
<!--      return Math.ceil(this.desserts.length / this.itemsPerPage)-->
<!--    },-->
<!--    filteredKeys() {-->
<!--      return this.keys.filter(key => key !== 'Name')-->
<!--    },-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      itemsPerPageArray: [4, 8, 12],-->
<!--      search: '',-->
<!--      filter: {},-->
<!--      sortDesc: false,-->
<!--      page: 1,-->
<!--      itemsPerPage: 4,-->
<!--      desserts: [],-->
<!--      amulet: {},-->
<!--      originalItem: {},-->
<!--      updateBy: {},-->
<!--      headers: [-->
<!--        {-->
<!--          text: 'ผู้เปลี่ยนแปลง',-->
<!--          width: "30%",-->
<!--        },-->
<!--        {-->
<!--          text: 'หมายเหตุ',-->
<!--          width: "55%",-->
<!--        }, {-->
<!--          text: 'วันที่เปลี่ยนแปลง',-->
<!--          width: "15%",-->
<!--        },-->
<!--      ],-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.getAmuletLogs()-->
<!--    this.getAmulet()-->
<!--  },-->
<!--  methods: {-->
<!--    formatTime(time, format = 'DD MMM YYYY HH:mm') {-->
<!--      return this.$dayjs(time).format(format)-->
<!--    },-->
<!--    async getAmuletLogs(url = `amulet_logs/${this.$route.params.id}`) {-->
<!--      await this.$axios.get(url).then((res) => {-->
<!--        res.data.data.map((d) => {-->
<!--          let _lod = JSON.parse(d.json_old)-->
<!--          _lod.update_by = d.update_by-->
<!--          _lod.amulet = d.amulet-->
<!--          _lod.log_id = d.id-->
<!--          this.desserts.push(_lod)-->
<!--          // console.log(JSON.stringify(JSON.parse(d.json_old).update_by))-->
<!--          // console.log(JSON.stringify(_lod))-->
<!--          //  this.getUser(JSON.parse(d.json_old).update_by)-->
<!--        })-->
<!--        this.originalItem = res.data-->
<!--        // console.log(JSON.stringify(res.data.data))-->
<!--      }).catch((e) => {-->
<!--        alert(e)-->
<!--        console.log(e)-->
<!--      })-->
<!--    },-->
<!--    async getAmulet() {-->
<!--      await this.$axios.get(`amulet/${this.$route.params.id}`).then((res) => {-->
<!--        this.amulet = res.data-->
<!--        // console.log(this.amulet)-->
<!--      }).catch((e) => {-->
<!--        alert(e)-->
<!--        console.log(e)-->
<!--      })-->
<!--    },-->
<!--    nextPage() {-->
<!--      if (this.page + 1 <= this.numberOfPages) this.page += 1-->
<!--    },-->
<!--    formerPage() {-->
<!--      if (this.page - 1 >= 1) this.page -= 1-->
<!--    },-->
<!--    updateItemsPerPage(number) {-->
<!--      this.itemsPerPage = number-->
<!--    },-->
<!--    OnClick(r) {-->
<!--      this.$router.push(`${this.$route.path}/${r.log_id}`)-->
<!--    }-->
<!--  },-->
<!--}-->
<!--</script>-->
