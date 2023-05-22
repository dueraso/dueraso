<template>
  <div class="text-center">
    <v-dialog v-model="status" width="400">
      <v-card>
        <v-col>
          <div align="center" style="padding-bottom: 24px; padding-top: 12px" v-html='detail'/>
          <v-row style="margin: 0">
            <v-col
              align="center" style="padding: 0" v-show="confirm">
              <v-btn dark color="#7b1817" @click="del" small>
                ยืนยัน
              </v-btn>
            </v-col>
            <v-col
              align="center" style="padding-top: 0">
              <v-btn color="#7b1817" text @click="close" small>
                {{ textBtn === undefined ? "ปิด" : textBtn }}
              </v-btn>
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
