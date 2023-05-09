<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container style="max-width: 1140px;">
          <Header :title="$i18n.t('identity').title"/>
          <v-row
            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;
            margin-top: 12px; margin-right: 0; margin-left: 0;">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('verification').certificateSample }}
            </p>
          </v-row>
          <v-row style="padding-bottom: 24px">
            <v-col sm="12" align="center">
              <v-img src="/identity1-1.jpg"></v-img>
            </v-col>
          </v-row>
          <v-row
            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;
            margin-top: 12px; margin-right: 0; margin-left: 0;">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('verification').howToSubmit }}
            </p>
          </v-row>
          <v-row style="padding-bottom: 24px">
            <v-col sm="12" align="center">
              <v-img src="/identity1-2.jpg"></v-img>
            </v-col>
          </v-row>
          <v-row
            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;
            margin-top: 12px; margin-right: 0; margin-left: 0;">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('verification').serviceFee }}
            </p>
          </v-row>
          <v-row style="padding-bottom: 24px">
            <v-col sm="12" align="center">
              <v-img src="/identity1-3.jpg"></v-img>
            </v-col>
          </v-row>
          <v-row
            style="padding-top: 12px; padding-bottom: 12px;padding-right: 12px; background-color: #7b1817;
            margin-top: 12px; margin-right: 0; margin-left: 0;">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('verification').listOfAmulets }}
            </p>
          </v-row>
          <v-row class="pb-4">
            <v-col sm="12" align="center">
              <v-img src="/22mar23-1.jpg"></v-img>
              <v-img src="/22mar23-2.jpg"></v-img>
              <v-img src="/22mar23-3.jpg"></v-img>
              <v-img src="/22mar23-4.jpg"></v-img>
            </v-col>
          </v-row>
          <v-row
            style="background-color: #7b1817;"
            class="p-2 mt-2 ml-0 mr-0 mb-2"
          >
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('verification').operatingHours }}
            </p>
          </v-row>
          <v-row class="m-0 pb-4">
            <v-card width="1140" class="p-2">
              <p>
                ทุกวันเสาร์ กรณียกเลิกการตรวจในวันเสาร์ใด จะแจ้งให้ทราบล่วงหน้าผ่าน เว็บ siamamuletcollection.com และ
                Facebook “Siam Amulet Collection”<br/>
                ตรวจด้วยเครื่องเอ็กซเรย์ฟลูออเรสเซนต์ ระหว่างเวลา 9.30 น. – 15.00 น.<br/>
                ตรวจพุทธศิลป์โดยผู้เชี่ยวชาญ ตั้งแต่เวลา 9.30 น. เป็นต้นไป</p>
            </v-card>
          </v-row>
          <v-row
            style="background-color: #7b1817;"
            class="p-2 mt-2 ml-0 mr-0 mb-2">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('verification').askForMore }}
            </p>
          </v-row>
          <v-row class="m-0 p-0 pb-4">
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
            style="background-color: #7b1817;"
            class="p-2 mt-2 ml-0 mr-0 mb-2">
            <p style="margin-bottom: 0; padding-left: 12px; color: white; align-self: center" align="center">
              {{ $i18n.t('verification').consultationAbout }}
            </p>
          </v-row>
          <v-row class="m-0 p-0 pb-4">
            <v-card width="1140">
              <v-row class="p-2">
                <v-col sm="12">ท่านสามารถปรึกษาเรื่องพุทธศิลป์ก่อนนำพระมาตรวจได้ที่ Line OpenChat
                  “สมาชิกสยามอมูเลทคอลเลคชั่น”<br/>
                  (กรุณาสมัครสมาชิกในเว็บไซต์ก่อนเข้ากลุ่ม Line)
                </v-col>
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
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
