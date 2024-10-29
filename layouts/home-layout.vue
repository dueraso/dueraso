<template>
  <v-app dark>
    <Toolbar class="d-none d-lg-flex"/>
    <ToolbarMainMobile class="d-flex d-lg-none position-fixed"/>
    <nuxt/>
    <v-footer class="p-0 justify-content-center" style="background-color: #ECE6E0">
      <Footer/>
      <v-card-text class="text-center">
        <v-divider style="color:white"/>
        Copyright © {{ new Date().getFullYear() }} dueraso.com All rights reserved. | Dev by dueraso
      </v-card-text>
    </v-footer>
    <v-card width="100%" style="bottom: 0; position: absolute; border-top-left-radius: 15px; border-top-right-radius: 15px;" v-if="allowCookie">
      <v-container>
        <v-row>
          <v-col class="text-left">
            <p style="color: #453C17">
              เว็บไซต์ DUERASO มีการใช้งานคุกกี้ (Cookies) เพื่อประสิทธิภาพ
              และประสบการณ์ที่ดียิ่งขึ้นในการเข้าใช้งานเว็บไซต์
              คุณสามารถศึกษารายละเอียดเพิ่มเติมเกี่ยวกับประเภทของคุกกี้ ที่บริษัทฯ จัดเก็บ วัตถุประสงค์ในการใช้คุกกี้
              และวิธีการตั้งค่าคุกกี้ได้จาก นโยบายการใช้คุกกี้ และ นโยบายการคุ้มครองข้อมูลส่วนบุคคล
            </p>
          </v-col>
          <div class="align-content-center">
            <v-col class="pb-1">
              <v-btn color="#B27D41" rounded dark block @click="onAllowCookie">ยอมรับ</v-btn>
            </v-col>
            <v-col class="pt-1">
              <v-btn color="#B27D41" outlined rounded>ตั้งค่าคุกกี้</v-btn>
            </v-col>
          </div>
        </v-row>
      </v-container>
    </v-card>
  </v-app>
</template>
<script>
import Toolbar from "~/components/Toolbar-home.vue";
import Footer from "~/components/Footer";
import ToolbarMainMobile from "@/components/Toolbar-main-mobile.vue";

export default {
  components: {
    ToolbarMainMobile,
    Toolbar,
    Footer
  },
  watch:{
    allowCookie(val){
      return val;
    }
  },
  data() {
    return {
      allowCookie: false,
      expandOnHover: false,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.allowCookie = sessionStorage.getItem('isCookie') === null;
    })
  },
  methods: {
    onAllowCookie(){
      sessionStorage.setItem('isCookie', "yes")
      this.allowCookie = sessionStorage.getItem('isCookie') === null;
    },
    async getModule() {
      await this.$axios.get(`/module`).then((res) => {
        this.modules = res.data
      }).catch((error) => {
        console.log(error)
      })
    },
  },
};
</script>
