<template>
  <div class="text-center">
    <v-dialog v-model="status" width="400">
      <v-card>
        <v-col>
          <v-row>
            <v-col cols="12" align="center">
              <v-icon x-large color="primary">mdi-check-circle
              </v-icon>
              <p style="margin-top: 12px">สมัครสมาชิกเรียบร้อย</p>
              <p>เมื่อได้รับการอนุมัติระบบจะส่งข้อความไปยังอีเมลของคุณ <br/></p>
              <!--            <p>{{ messages }}</p>-->
              <v-btn text @click="close">ปิด</v-btn>
            </v-col>
          </v-row>
        </v-col>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
export default {
  props: {
    status: Boolean,
    callback: Function,
    confirm: Function,
    title: String,
    textBtn: String,
    detail: String,
  },
  methods: {
    close() {
      !this.callback()
    },
    del() {
      !this.confirm()
    }
  }
}
</script>
