<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container style="max-width: 1730px;" v-if="!loading">
        <v-simple-table fixed-header>
          <template v-slot:default>
            <thead>
            <tr>
              <th class="text-left">Name</th>
              <th class="text-left">Calories</th>
              <th width="110">
                <v-btn outlined @click="openItem({})">
                  <v-icon>mdi-plus</v-icon>
                  เพิ่ม
                </v-btn>
              </th>
            </tr>
            </thead>
            <tbody>
            <tr v-for="(item, index) in desserts.data" :key="index">
              <td>{{ item.title }}</td>
              <td>{{ item.detail }}</td>
              <td>
                <v-btn fab small text @click="openItem(item)">
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
        </v-container>
<!--        <v-container style="max-width: 1730px;" v-if="!loading">-->
<!--&lt;!&ndash;          <Header :title="this.$i18n.t('header').home"/>&ndash;&gt;-->
<!--          <v-row-->
<!--            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;-->
<!--            margin-top: 12px; margin-right: 0; margin-left: 0;">-->
<!--            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">-->
<!--              {{this.$i18n.t("header").amuletMarket}}-->
<!--            </p>-->
<!--            <v-spacer/>-->
<!--            <v-btn text dark @click="$router.push(localeLocation('/post'))" style="padding: 12px">-->
<!--              {{ this.$i18n.t("index").seeMore }}-->
<!--              <v-icon>mdi-chevron-right</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
<!--          <v-row style="padding-bottom: 24px">-->
<!--            <v-col v-for="i in itemsPsda.data" :key="i.newsId" sm="3" align="center">-->
<!--              <ItemsHire :item="i" :exchange="exchange"/>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--&lt;!&ndash;          <v-row style="padding-bottom: 24px">&ndash;&gt;-->
<!--&lt;!&ndash;            <v-col v-for="i in itemsSale.data" :key="i.newsId" sm="3" align="center">&ndash;&gt;-->
<!--&lt;!&ndash;              <ItemsHire :item="i" :exchange="exchange"/>&ndash;&gt;-->
<!--&lt;!&ndash;            </v-col>&ndash;&gt;-->
<!--&lt;!&ndash;            <v-col style="padding-right: 12px;" v-show="itemsSale.data.length === 0">&ndash;&gt;-->
<!--&lt;!&ndash;              <v-card class="d-flex align-center" flat height="300">&ndash;&gt;-->
<!--&lt;!&ndash;                <v-col align="center">&ndash;&gt;-->
<!--&lt;!&ndash;                  <p>ไม่มีข้อมูล</p>&ndash;&gt;-->
<!--&lt;!&ndash;                </v-col>&ndash;&gt;-->
<!--&lt;!&ndash;              </v-card>&ndash;&gt;-->
<!--&lt;!&ndash;            </v-col>&ndash;&gt;-->
<!--&lt;!&ndash;          </v-row>&ndash;&gt;-->
<!--          <v-row-->
<!--            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;-->
<!--            margin-top: 12px; margin-right: 0; margin-left: 0;">-->
<!--            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">-->
<!--              {{ this.$i18n.t("header").news }}-->
<!--            </p>-->
<!--            <v-spacer/>-->
<!--&lt;!&ndash;            <v-select&ndash;&gt;-->
<!--&lt;!&ndash;              label="เลือกข่าวที่ต้องการ" :items="templeItems" required return-object dense&ndash;&gt;-->
<!--&lt;!&ndash;              item-text="title" item-value="templeId" v-model="temple" @change="getEvens"&ndash;&gt;-->
<!--&lt;!&ndash;              style="max-width: 357px; padding-right: 24px" hide-details dark&ndash;&gt;-->
<!--&lt;!&ndash;            ></v-select>&ndash;&gt;-->
<!--            <v-btn text dark @click="$router.push(localeLocation('events'))" style="padding: 12px">-->
<!--              {{ this.$i18n.t("index").seeMore }}-->
<!--              <v-icon>mdi-chevron-right</v-icon>-->
<!--            </v-btn>-->
<!--          </v-row>-->
<!--          <v-row>-->
<!--            <v-col v-for="i in items.data" :key="i.newsId" sm="3" align="center">-->
<!--              <ItemEvents :item="i"/>-->
<!--            </v-col>-->
<!--          </v-row>-->
<!--          <v-row style="margin-top: 12px;" class="m-0 pt-2">-->
<!--              <v-img src="/banner.png" class="m-0" @click="$router.push(localeLocation('/my-shops'))"></v-img>-->
<!--          </v-row>-->
<!--          <v-row-->
<!--            style="background-color: #7b1817;"-->
<!--            class="p-2 mt-2 ml-0 mr-0 mb-0">-->
<!--            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">-->
<!--              {{ this.$i18n.t("header").aboutUs }}-->
<!--            </p>-->
<!--          </v-row>-->
<!--          <v-row class="p-0 m-0 mb-2">-->
<!--            <v-card class="d-flex p-2" flat>-->
<!--              {{ this.$i18n.t("header").aboutCon }}-->
<!--            </v-card>-->
<!--          </v-row>-->
<!--          <v-img src="/owner.png"></v-img>-->
<!--        </v-container>-->
      </v-main>
    </v-app>
  </div>
</template>
<style>
.cut-text-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

iframe {
  width: 100%;
  max-height: 650px;
}
</style>
<script src="./index.js"/>
