<template>
  <div class="text-center">
    <v-dialog v-model="status" width="600">
      <v-card>
        <v-col>
<!--         <p align="center" style="padding-bottom: 24px; padding-top: 12px">-->
<!--            {{ detail }}-->
<!--          <div  align="center" style="padding-bottom: 24px; padding-top: 12px" v-html='detail'/>-->
          <v-text-field label="ตอบกลับ" v-model="detail"></v-text-field>
<!--          </p>-->
          <v-row style="margin: 0">
            <v-col
              align="center" style="padding-top: 0">
              <v-btn
                color="#7b1817"
                text
                @click="close" outlined
                small
              >
                {{ textBtn === undefined ? "ปิด" : textBtn }}
              </v-btn>
            </v-col>
            <v-col
              align="center" style="padding: 0" v-show="confirm">
              <v-btn
                dark
                color="#7b1817"
                @click="confirmReply"
                small
              >
                ยืนยัน
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
  },
  data(){
    return{
      detail:'',
      detail2:false,
    }
  },
  watch:{
    status(val){
      if(!val) {
        this.close()
      }
      // console.log(val+"dia")
    }
  },
  methods: {
    close() {
      !this.callback()
    },
    confirmReply() {
      !this.confirm(this.detail)
    }
  }
}
</script>
