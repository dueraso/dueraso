<template>
  <v-dialog v-model="show" width="500">
    <v-card style="border-radius: 15px">
      <v-col>
        <h4 align="center" style="color: #846537" class="m-0 pt-3 pb-3">
          คุณต้องการลบรายการใช่หรือไม่
        </h4>
        <v-row class="m-0">
          <v-col
            align="center" style="padding: 0" class="pb-2">
            <v-btn outlined small rounded color="#A57156" @click="show = false" class="m-2" width="150">
              ยกเลิก
            </v-btn>
            <v-btn dark small color="#B27D41" @click="confirm" class="m-2" rounded width="150">
              ยืนยัน
            </v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean,
    cancel: Function,
    confirm: Function,
    title: String,
    textBtn: String,
    detail: String,
  },
  computed: {
    show: {
      get () {
        return this.value
      },
      set (value) {
        this.$emit('input', value)
      }
    }
  },
  methods:{
    close() {
      !this.cancel()
    },
    del() {
      !this.confirm()
    }
  }
}
</script>
