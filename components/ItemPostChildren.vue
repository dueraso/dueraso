<template>
  <v-col style="padding-left: 0; padding-right: 0">
    <v-card style="padding: 12px;">
      <v-row>
        <v-col>
          <p>
            <v-chip color="green" label dark>
              {{ item.memberCode }}
            </v-chip>
            {{ ownerPost }}
          </p>
          <p style="padding-top: 12px">{{ item.detail }}</p>
        </v-col>
        <v-divider vertical style="margin-top: 10px;margin-bottom: 10px;"/>
        <v-col cols="2">
          <p>วันที่ตอบกลับ<br>
            {{ formatTime(item.createDate) }} น.</p>
          <a style="color: #7B1817" @click="comment">ตอบกลับ</a>
        </v-col>
      </v-row>
    </v-card>
  </v-col>
</template>
<script>

export default {
  data() {
    return {}
  },
  props: {
    index: Number,
    item: {
      type: Object,
    },
    rent: {
      type: Object,
    },
    callback: Function
  },
  computed: {
    ownerPost() {
      // console.log(this.rent)
      if (this.$auth.user.memberCode === this.item.memberCode) {
        return '(คุณ)'
      } else if (this.item.memberCode === this.rent.memberCode) {
        return '(เจ้าของโพส)'
      }
        // else if (this.item.owner.id <= 2) {
        //   return '(ผู้ดูแล)'
      // }
      else {
        return '(ผู้ใช้ทั่วไป)'
      }
    },
  },
  mounted() {
    console.log("llll")
  },
  methods: {
    comment() {
      // console.log("postt"+JSON.stringify(this.item))
      !this.callback(this.item.commentId)
    },
    formatTime(time, format = 'DD MMM YYYY HH:mm') {
      return this.$dayjs(time).format(format)
    },
  },
}
</script>
