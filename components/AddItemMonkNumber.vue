<template>
  <v-card style="padding: 12px; margin-top: 12px; margin-bottom: 12px">
    <v-row>
      <v-chip color="green" label dark style="align-self: center; margin-left: 12px">ลำดับที่ {{ convert }}</v-chip>
      <v-col style="align-self: center;">
        <v-text-field
            disabled
            rounded
            dense
            outlined
            hide-details
            label="ชื่อผู้ถือครอง"
            v-model="item.owner.username"
        >
        </v-text-field>
      </v-col>
      <v-col cols="1" style="align-self: center;">
        <a @click="OnClick" style="color: #e3ab3f">ดูประวัติ</a>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  props: {
    number: Number,
    item: {
      type: Object
    }
  },
  data() {
    return {}
  },
  computed: {
    convert() {
      let str = "" + this.number
      let pad = "000000"
      let ans = pad.substring(0, pad.length - str.length) + str
      return ans
    }
  },
  methods: {
    OnClick() {
      this.$router.push(`${this.$route.path}/history/owner`)
    }
  },
}
</script>