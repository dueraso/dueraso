<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;">
          <Header :title="$i18n.t('contactUs').title"/>
          <v-row class="mb-0"
                 style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;
            margin-top: 12px; margin-right: 0; margin-left: 0;">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('contactUs').contact1 }}
            </p>
          </v-row>
          <v-row style="padding-bottom: 24px" class="m-0 p-0">
            <v-card width="1140">
              <v-row class="p-2">
                <v-col sm="3" align="center">
                  WeChat ID: siamamuletcollection
                  <v-img src="/WeChat.jpg"></v-img>
                </v-col>
                <v-col sm="3" align="center">
                  Line ID: @057vduzp
                  <v-img src="/QR-Line-nut.png"></v-img>
                </v-col>
                <v-col sm="3" align="center">
                  {{ $i18n.t('contactUs').tel }}
                  <v-row class="p-0 m-0">
                      <v-icon size="60">mdi-phone</v-icon>
                    <v-col class="pl-0">
                      <p style="font-size: 18px">
                        <a :href="'tel: 0815523664'">+66 81 552 3664</a>
                        <br/>
                        <a :href="'tel: 0661409888'">+66 66 140 9888</a>
                      </p>
                    </v-col>
                  </v-row>
                </v-col>
              </v-row>
            </v-card>
          </v-row>
          <v-row
            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;
            margin-top: 12px; margin-right: 0; margin-left: 0;" class="mb-0">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('contactUs').contact2 }}
            </p>
          </v-row>
          <v-row style="padding-bottom: 24px" class="m-0 p-0">
            <v-card width="1140">
              <v-row class="p-2">
                <v-col sm="3" align="center">
                  Line ID: @577owbay
                  <v-img src="/QR-Line-SAC.png"></v-img>
                </v-col>
                <v-col sm="3">
                  <p align="center">{{ $i18n.t('contactUs').tel }}</p>
                  <v-row class="p-0 m-0">
                    <v-icon size="60" class="pr-2" style="align-items: start;">mdi-phone</v-icon>
                    <v-col class="pl-0">
                      <a :href="'tel: 022270059'">02 227 0059</a>
                      <p>{{ $i18n.t('contactUs').monFri }}</p>
                      <a :href="'tel: 0636519741'">063 651 9741</a>
                      <p>{{ $i18n.t('contactUs').everyDay }}</p>
                    </v-col>
                  </v-row>
                </v-col>
                <v-col sm="3" align="center">
                  Facebook: Siam Amulet Collection
                  <br/>暹羅護身符系列
                  <v-img src="/FB-SAC.png"></v-img>
                </v-col>
              </v-row>
            </v-card>
          </v-row>
          <v-row
            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;
            margin-top: 12px; margin-right: 0; margin-left: 0;" class="mb-0">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('contactUs').contact3 }}
            </p>
          </v-row>
          <v-row style="padding-bottom: 24px" class="m-0 p-0">
            <v-card width="1140">
              <v-row class="p-2">
                <v-col sm="3">
                  Line OpenChat:<br/>
                  สมาชิกสยามอมูเลทคอลเลคชั่น
                </v-col>
                <v-col sm="3" align="center">
                  <v-img src="/Line OpenChat.png"></v-img>
                </v-col>
              </v-row>
            </v-card>
          </v-row>
          <v-row
            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;
            margin-top: 12px; margin-right: 0; margin-left: 0;" class="mb-0">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('contactUs').contact4 }}
            </p>
          </v-row>
          <v-row style="padding-bottom: 24px" class="m-0 p-0">
            <v-card width="1140">
              <v-row class="p-2">
                <v-icon style="align-items: start;" size="60" class="p-2">mdi-office-building</v-icon>
                <v-col>
                  <p>บริษัท เอ็กซ์เปอร์ทิส (ประเทศไทย) จำกัด <br/>
                    42 ซ.โชคอำนวย ถ.สุทธิสารวินิจฉัย แขวงสามเสนนอก เขตห้วยขวาง กรุงเทพมหานคร 10310
                  </p>
                  <p>專業知識（泰國）有限公司<br/>
                    42 Soi Chok Amnuay, Sutthisan Winitchai Rd. Samsennok 分區，懷恭區，曼谷 10310</p>
                  <p>Expertise (Thailand) Co.,Ltd<br/>
                    42 Soi Chok Amnuay, Sutthisan Winitchai Rd. Samsennok Subdistrict, Huai Khwang District, Bangkok
                    10310
                  </p>
                </v-col>
              </v-row>
              <v-row class="p-2">
                <v-icon style="align-items: start;" size="60" class="p-2">mdi-phone</v-icon>
                <v-col>
                  <p style="font-size: 18px">โทรศัพท์ / 電話 / Tel:<br/>
                    +66 2 227 0059 (จ-ศ / 週一至週五 / Mon-Fri)<br/>
                    +66 63 6519741 (ทุกวัน / 每天 / Every day)
                  </p>
                </v-col>
              </v-row>
              <v-row class="p-2">
                <v-icon style="align-items: start;" size="60" class="p-2">mdi-map</v-icon>
                <v-col>
                  <p>ตำแหน่งบนแผนที่ / 谷歌地圖 / Google Map: 13.792813, 100.581798,
                    <a :href="'https://goo.gl/maps/X65kA6ZDAxzRRQko9'">https://goo.gl/maps/X65kA6ZDAxzRRQko9</a>
                  </p>
                  <p>รูปแผนที่บริษัท / 公司地圖 / Map</p>
                </v-col>
              </v-row>
              <v-img src="/map.jpg"></v-img>
            </v-card>
          </v-row>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
