<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center"> Loading.. </v-col>
        </div>
        <v-container fluid v-if="!loading">
          <head-bar :title="headTitle" :hideBtn="true"> </head-bar>
          <v-col>
          <!-- Summary Cards -->
          <v-row class="mb-4">
            <v-col cols="12" sm="6" md="3">
              <v-card
                class="pa-4"
                style="border-radius: 15px; border-left: 4px solid #b27d41"
              >
                <v-row align="center" class="m-0">
                  <v-avatar color="#ECE6E0" size="50" class="mr-3">
                    <v-icon color="#B27D41">mdi-account-group</v-icon>
                  </v-avatar>
                  <div>
                    <p class="m-0" style="color: #846537; font-size: 12px">
                      สมาชิกทั้งหมด
                    </p>
                    <h4 class="m-0" style="color: #5b4840">
                      {{ convert.money(stats.totalMembers,0) }}
                    </h4>
                  </div>
                </v-row>
                <p class="m-0 mt-2" style="font-size: 11px; color: #4caf50">
                  <v-icon small color="#4CAF50">mdi-arrow-up</v-icon>
                  +{{ stats.newMembersToday }} วันนี้
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card
                class="pa-4"
                style="border-radius: 15px; border-left: 4px solid #4caf50"
              >
                <v-row align="center" class="m-0">
                  <v-avatar color="#E8F5E9" size="50" class="mr-3">
                    <v-icon color="#4CAF50">mdi-star-circle</v-icon>
                  </v-avatar>
                  <div>
                    <p class="m-0" style="color: #846537; font-size: 12px">
                      แต้มที่แจกไป
                    </p>
                    <h4 class="m-0" style="color: #5b4840">
                      {{ convert.money(stats.totalPointsGiven,0) }}
                    </h4>
                  </div>
                </v-row>
                <p class="m-0 mt-2" style="font-size: 11px; color: #846537">
                  เดือนนี้ +{{ stats.pointsThisMonth }}
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card
                class="pa-4"
                style="border-radius: 15px; border-left: 4px solid #ff9800"
              >
                <v-row align="center" class="m-0">
                  <v-avatar color="#FFF3E0" size="50" class="mr-3">
                    <v-icon color="#FF9800">mdi-gift</v-icon>
                  </v-avatar>
                  <div>
                    <p class="m-0" style="color: #846537; font-size: 12px">
                      แต้มที่ถูกใช้
                    </p>
                    <h4 class="m-0" style="color: #5b4840">
                      {{ convert.money(stats.totalPointsUsed,0) }}
                    </h4>
                  </div>
                </v-row>
                <p class="m-0 mt-2" style="font-size: 11px; color: #846537">
                  {{ stats.totalRedemptions }} ครั้ง
                </p>
              </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="3">
              <v-card
                class="pa-4"
                style="border-radius: 15px; border-left: 4px solid #9c27b0"
              >
                <v-row align="center" class="m-0">
                  <v-avatar color="#F3E5F5" size="50" class="mr-3">
                    <v-icon color="#9C27B0">mdi-trophy</v-icon>
                  </v-avatar>
                  <div>
                    <p class="m-0" style="color: #846537; font-size: 12px">
                      รางวัลยอดนิยม
                    </p>
                    <h6 class="m-0" style="color: #5b4840">
                      {{ stats.topReward }}
                    </h6>
                  </div>
                </v-row>
                <p class="m-0 mt-2" style="font-size: 11px; color: #846537">
                  แลกไป {{ stats.topRewardCount }} ครั้ง
                </p>
              </v-card>
            </v-col>
          </v-row>

          <!-- Quick Actions -->
          <v-row class="mb-4">
            <v-col cols="12">
              <h6 style="color: #5b4840" class="mb-3">เมนูจัดการ</h6>
            </v-col>
            <v-col
              cols="6"
              sm="4"
              md="2"
              v-for="menu in menus"
              :key="menu.path"
            >
              <v-card
                class="pa-4 text-center"
                style="border-radius: 15px; cursor: pointer"
                hover
                @click="$router.push(menu.path)"
              >
                <v-avatar :color="menu.bgColor" size="50" class="mb-2">
                  <v-icon :color="menu.color">{{ menu.icon }}</v-icon>
                </v-avatar>
                <p class="m-0" style="color: #5b4840; font-size: 13px">
                  {{ menu.title }}
                </p>
              </v-card>
            </v-col>
          </v-row>

          <v-row>
            <!-- Recent Members -->
            <v-col cols="12" md="6">
              <v-card class="pa-4" style="border-radius: 15px">
                <v-row align="center" class="m-0 mb-3">
                  <h6 style="color: #5b4840" class="m-0">สมาชิกใหม่ล่าสุด</h6>
                  <v-spacer />
                  <v-btn
                    text
                    small
                    color="#B27D41"
                    @click="$router.push('/dashboard/loyalty/members')"
                  >
                    ดูทั้งหมด
                    <v-icon small right>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-row>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th style="color: #846537">ชื่อ</th>
                        <th style="color: #846537">เบอร์โทร</th>
                        <th style="color: #846537">ระดับ</th>
                        <th style="color: #846537" class="text-right">แต้ม</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="member in recentMembers" :key="member.id">
                        <td>{{ member.name }}</td>
                        <td>{{ member.phone }}</td>
                        <td>
                          <v-chip small :color="getTierColor(member.tier)" dark>
                            {{ member.tier }}
                          </v-chip>
                        </td>
                        <td class="text-right">
                          {{ convert.money(member.points,0) }}
                        </td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>

            <!-- Recent Redemptions -->
            <v-col cols="12" md="6">
              <v-card class="pa-4" style="border-radius: 15px">
                <v-row align="center" class="m-0 mb-3">
                  <h6 style="color: #5b4840" class="m-0">การแลกรางวัลล่าสุด</h6>
                  <v-spacer />
                  <v-btn
                    text
                    small
                    color="#B27D41"
                    @click="$router.push('/dashboard/loyalty/points')"
                  >
                    ดูทั้งหมด
                    <v-icon small right>mdi-arrow-right</v-icon>
                  </v-btn>
                </v-row>
                <v-simple-table>
                  <template v-slot:default>
                    <thead>
                      <tr>
                        <th style="color: #846537">สมาชิก</th>
                        <th style="color: #846537">รางวัล</th>
                        <th style="color: #846537" class="text-right">แต้ม</th>
                        <th style="color: #846537">เวลา</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr
                        v-for="redemption in recentRedemptions"
                        :key="redemption.id"
                      >
                        <td>{{ redemption.memberName }}</td>
                        <td>{{ redemption.rewardName }}</td>
                        <td class="text-right" style="color: #f44336">
                          -{{ convert.money(redemption.points,0) }}
                        </td>
                        <td>{{ convert.datetime(redemption.createdAt) }}</td>
                      </tr>
                    </tbody>
                  </template>
                </v-simple-table>
              </v-card>
            </v-col>
          </v-row>

          <!-- Charts Row -->
          <v-row class="mt-4">
            <v-col cols="12" md="8">
              <v-card class="pa-4" style="border-radius: 15px">
                <h6 style="color: #5b4840" class="mb-3">สมาชิกใหม่รายเดือน</h6>
                <apexchart
                  type="area"
                  height="300"
                  :options="memberChartOptions"
                  :series="memberChartSeries"
                />
              </v-card>
            </v-col>
            <v-col cols="12" md="4">
              <v-card class="pa-4" style="border-radius: 15px">
                <h6 style="color: #5b4840" class="mb-3">สัดส่วนระดับสมาชิก</h6>
                <apexchart
                  type="donut"
                  height="300"
                  :options="tierChartOptions"
                  :series="tierChartSeries"
                />
              </v-card>
            </v-col>
          </v-row>

          <!-- Top Members -->
          <v-row class="mt-4">
            <v-col cols="12">
              <v-card class="pa-4" style="border-radius: 15px">
                <h6 style="color: #5b4840" class="mb-3">
                  <v-icon color="#B27D41" class="mr-2">mdi-trophy</v-icon>
                  Top 10 สมาชิกแต้มสูงสุด
                </h6>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                    lg="2"
                    v-for="(member, index) in topMembers"
                    :key="member.id"
                  >
                    <v-card
                      class="pa-3 text-center"
                      :style="`border-radius: 15px; border: 2px solid ${
                        index < 3
                          ? ['#FFD700', '#C0C0C0', '#CD7F32'][index]
                          : '#ECE6E0'
                      }`"
                    >
                      <v-avatar
                        :color="
                          index < 3
                            ? ['#FFD700', '#C0C0C0', '#CD7F32'][index]
                            : '#ECE6E0'
                        "
                        size="40"
                        class="mb-2"
                      >
                        <span v-if="index < 3" style="font-weight: bold">{{
                          index + 1
                        }}</span>
                        <v-icon v-else color="#846537">mdi-account</v-icon>
                      </v-avatar>
                      <p
                        class="m-0"
                        style="
                          color: #5b4840;
                          font-size: 13px;
                          font-weight: 500;
                        "
                      >
                        {{ member.name }}
                      </p>
                      <p
                        class="m-0"
                        style="
                          color: #b27d41;
                          font-size: 16px;
                          font-weight: bold;
                        "
                      >
                        {{ convert.money(member.points,0) }}
                      </p>
                      <v-chip
                        x-small
                        :color="getTierColor(member.tier)"
                        dark
                        class="mt-1"
                        >{{ member.tier }}</v-chip
                      >
                    </v-card>
                  </v-col>
                </v-row>
              </v-card>
            </v-col>
          </v-row>
          </v-col>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style scoped>
.v-text-field--outlined >>> fieldset {
  border-color: #a57156;
}
</style>
<script src="./index.js" />
