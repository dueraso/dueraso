<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading" style="max-width: 1200px">
          <v-row class="pa-3 m-0" style="align-items: center;">
            <img style="height: 50px" src="/line.png" alt="line">
            <h4 class="m-2 pl-1 pt-0" style="color: #5B4840">
              {{ headTitle }}
            </h4>
            <v-btn @click="connect">start</v-btn>
            <v-btn @click="disconnect">end</v-btn>

            <v-col cols="">
              <p class="mb-0">
                คนดู
                <strong style="color: #5B4840" class="h5">
                  {{ viewerCount.toLocaleString() }}
                </strong>
                คน
              </p>
            </v-col>
            <v-col cols="">
              <p class="mb-0">
                หัวใจ
                <strong style="color: #5B4840" class="h5">
                  {{ likeCount.toLocaleString() }}
                </strong>
                ครั้ง
              </p>
            </v-col>
            <v-col cols="">
              <p class="mb-0">
                ของขวัญ
                <strong style="color: #5B4840" class="h5">
                  {{ this.diamondsCount.toLocaleString() }}
                </strong>
                ครั้ง
              </p>
            </v-col>
          </v-row>

          <v-row class="m-0">
            <v-col style="height: 100vh">
              <v-row>
                <v-col>
                      <h5 class="containerheader">แชต</h5>
                  <div style="height: 80dvh; overflow-y: auto;">
<!--                <tbody >-->
<!--                <tr>-->
<!--                  <td>-->
                    <div class="chatcontainer">
                    </div>
                  </div>
<!--                  </td>-->
<!--                  <td>-->
<!--                      <h3 class="containerheader">Gifts</h3>-->
<!--                    <div class="giftcontainer">-->
<!--                    </div>-->
<!--                  </td>-->
<!--                </tr>-->
<!--                </tbody>-->
                </v-col>
              </v-row>
            </v-col>
            <v-col>

            </v-col>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<script src="./index.js"/>
