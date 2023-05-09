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

<!--              <p style="color: white; font-size: 25px; font-family: Sarabun,serif">ประวัติ {{ amulet_item.name }} รุ่น-->
<!--                {{ amulet_item.model }} ลำดับที่-->
<!--                {{ number }}</p>-->
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
<!--              <v-btn rounded color="#e3ab3f" dark>เสนอให้เช่า</v-btn>-->
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
<!--            <span>เปลี่ยนการครอบครอง {{ desserts.total }} ครั้ง</span>-->
<!--            &lt;!&ndash;            <v-menu offset-y>&ndash;&gt;-->
<!--            &lt;!&ndash;              <template v-slot:activator="{ on, attrs }">&ndash;&gt;-->
<!--            &lt;!&ndash;                <v-btn&ndash;&gt;-->
<!--            &lt;!&ndash;                    dark&ndash;&gt;-->
<!--            &lt;!&ndash;                    text&ndash;&gt;-->
<!--            &lt;!&ndash;                    color="primary"&ndash;&gt;-->
<!--            &lt;!&ndash;                    class="ml-2"&ndash;&gt;-->
<!--            &lt;!&ndash;                    v-bind="attrs"&ndash;&gt;-->
<!--            &lt;!&ndash;                    v-on="on"&ndash;&gt;-->
<!--            &lt;!&ndash;                >&ndash;&gt;-->
<!--            &lt;!&ndash;                  {{ itemsPerPage }}&ndash;&gt;-->
<!--            &lt;!&ndash;                  <v-icon>mdi-chevron-down</v-icon>&ndash;&gt;-->
<!--            &lt;!&ndash;                </v-btn>&ndash;&gt;-->
<!--            &lt;!&ndash;              </template>&ndash;&gt;-->
<!--            &lt;!&ndash;              <v-list>&ndash;&gt;-->
<!--            &lt;!&ndash;                <v-list-item&ndash;&gt;-->
<!--            &lt;!&ndash;                    v-for="(number, index) in itemsPerPageArray"&ndash;&gt;-->
<!--            &lt;!&ndash;                    :key="index"&ndash;&gt;-->
<!--            &lt;!&ndash;                    @click="updateItemsPerPage(number)"&ndash;&gt;-->
<!--            &lt;!&ndash;                >&ndash;&gt;-->
<!--            &lt;!&ndash;                  <v-list-item-title>{{ number }}</v-list-item-title>&ndash;&gt;-->
<!--            &lt;!&ndash;                </v-list-item>&ndash;&gt;-->
<!--            &lt;!&ndash;              </v-list>&ndash;&gt;-->
<!--            &lt;!&ndash;            </v-menu>&ndash;&gt;-->
<!--            <v-spacer></v-spacer>-->
<!--            <v-btn-->
<!--                fab-->
<!--                color="#e3ab3f"-->
<!--                class="mr-1"-->
<!--                @click="()=>{getAmulet(desserts.prev_page_url)}"-->
<!--                :disabled="desserts.prev_page_url === null"-->
<!--                small-->
<!--            >-->
<!--              <v-icon color="white">mdi-chevron-left</v-icon>-->
<!--            </v-btn>-->
<!--            <span class="mr-4 ml-4">{{ desserts.current_page }} / {{ desserts.last_page }}-->
<!--          </span>-->
<!--            <v-btn-->
<!--                fab-->
<!--                color="#e3ab3f"-->
<!--                class="ml-1"-->
<!--                @click="()=>{getAmulet(desserts.next_page_url)}"-->
<!--                :disabled="desserts.next_page_url === null"-->
<!--                small-->
<!--            >-->
<!--              <v-icon color="white">mdi-chevron-right</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
<!--          <v-row>-->
<!--            <v-col>-->
<!--              <v-data-table-->
<!--                  :headers="headers"-->
<!--                  :items_list="desserts.data"-->
<!--                  :search="search"-->
<!--                  sort-by="calories"-->
<!--                  class="elevation-1"-->
<!--                  hide-default-footer-->
<!--              >-->
<!--                <template v-slot:item="{ item }">-->
<!--                  <tr>-->
<!--                    <td>{{ item.owner.name }}</td>-->
<!--                    <td class="truncate">{{ formatDateTime(item.updated_at) }}</td>-->
<!--                  </tr>-->
<!--                </template>-->
<!--                <template v-slot:top>-->
<!--                  <v-toolbar flat>-->
<!--                    <v-toolbar-title><p style="font-size: 18px">ข้อมูลการถือครอง</p>-->
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

<!--element.style {-->
<!--  font-size: 20px;-->
<!--}-->
<!--</style>-->
<!--<script>-->
<!--import ItemMonkNumber from "~/components/ItemMonkNumber"-->

<!--export default {-->
<!--  components: {-->
<!--    ItemMonkNumber,-->
<!--  },-->
<!--  data() {-->
<!--    return {-->
<!--      itemsPerPageArray: [4, 8, 12],-->
<!--      search: '',-->
<!--      filter: {},-->
<!--      sortDesc: false,-->
<!--      page: 1,-->
<!--      number: '',-->
<!--      amulet_item: {},-->
<!--      desserts: [],-->
<!--      headers: [-->
<!--        {-->
<!--          text: 'ชื่อผู้ถือครอง',-->
<!--          width: "80%",-->
<!--        },-->
<!--        {-->
<!--          text: 'วันที่ครอบครอง',-->
<!--          width: "20%",-->
<!--        },-->
<!--      ],-->
<!--    }-->
<!--  },-->
<!--  mounted() {-->
<!--    this.getAmulet()-->
<!--    this.getFindAmulet()-->
<!--    this.getFindNumber()-->
<!--  },-->
<!--  methods: {-->
<!--    formatDateTime(time, format = 'DD MMM YYYY HH:mm') {-->
<!--      return this.$dayjs(time).format(format)-->
<!--    },-->
<!--    async getAmulet(url = `/amulet_owner_log/${this.$route.query.id}`) {-->
<!--      await this.$axios.get(url).then((res) => {-->
<!--        this.desserts = res.data-->
<!--        console.log(JSON.stringify(res.data))-->
<!--      }).catch((e) => {-->
<!--        alert(e)-->
<!--        console.log(e)-->
<!--      })-->
<!--    },-->
<!--    async getFindAmulet() {-->
<!--      await this.$axios.get(`/amulet/${this.$route.params.id}`).then((res) => {-->
<!--        this.amulet_item = res.data-->
<!--        // console.log(JSON.stringify(this.amulet_item))-->
<!--      }).catch((e) => {-->
<!--        alert(e)-->
<!--        console.log(e)-->
<!--      })-->
<!--    },-->
<!--    async getFindNumber() {-->
<!--      await this.$axios.get(`/owner/${this.$route.query.id}`).then((res) => {-->
<!--        this.number = res.data.number-->
<!--        // console.log(JSON.stringify(this.amulet_item))-->
<!--      }).catch((e) => {-->
<!--        alert(e)-->
<!--        console.log(e)-->
<!--      })-->
<!--    },-->
<!--  },-->
<!--}-->
<!--</script>-->
