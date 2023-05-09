<template>
  <v-card style="padding: 12px; margin-top: 12px; margin-bottom: 12px">
    <v-row>
      <v-chip color="green" label dark style="align-self: center; margin-left: 12px">ลำดับที่ {{ convert }}</v-chip>
      <v-col style="align-self: center;">
        <p>{{ item.owner.username }}</p>
      </v-col>
      <v-col cols="1" style="align-self: center;">
        <a @click="OnClick" style="color: #e3ab3f" v-if="this.$auth.user.roles <= 2">ดูประวัติ</a>
      </v-col>
      <v-divider vertical style="margin-top: 10px;margin-bottom: 10px;"/>
      <v-col cols="2" align="center">
        <p>วันที่แก้ไขล่าสุด<br>
          {{ formatTime(item.updated_at) }} น.</p>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
import dayjs from 'dayjs'

export default {
  components: {
    dayjs
  },
  data() {
    return {}
  },
  computed: {
    convert() {
      let str = "" + this.number
      let pad = "000000"
      return pad.substring(0, pad.length - str.length) + str
    }
  },
  props: {
    number: Number,
    item: {
      type: Object,
    }
  },
  methods: {
    formatTime(time, format = 'DD MMM YYYY HH:mm') {
      return this.$dayjs(time).format(format)
    },
    OnClick() {
      // console.log(JSON.stringify(this.item))
      // this.$router.push(`${this.$route.path}/history/owner`)
      this.$router.push({
        path: `${this.$route.path}/history/owner`,
        query: {
          id: this.item.id
        },
      })
    }
  },
}
</script>