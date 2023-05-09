<template>
  <v-col style="padding-left: 0; padding-right: 0">
    <v-card style="padding: 12px;">
      <v-row style="margin-bottom: 0">
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
          <a style="color: #7B1817" @click="comment(item.commentId)">ตอบกลับ</a>
        </v-col>
      </v-row>

      <v-card v-for="(i, index) in item.children" :key="index" style="margin-top: 12px">
        <v-row style="margin: 0">
          <v-col>
            <p>
              <v-chip color="green" label dark>
                {{ i.memberCode }}
              </v-chip>
              {{ ownerPost }}
            </p>
            <p style="padding-top: 12px">{{ i.detail }}</p>
          </v-col>
          <v-divider vertical style="margin-top: 10px;margin-bottom: 10px;"/>
          <v-col cols="2">
            <p>วันที่ตอบกลับ<br>
                          {{ formatTime(i.createDate) }} น.
            </p>
<!--            <a style="color: #7B1817" @click="comment(i.commentId)">ตอบกลับ</a>-->
          </v-col>
          <!--      <ItemPostChildren v-if="item.children !== undefined" v-for="(item, index) in item.children" :key="index" :item="item" :rent="rent"/>-->
        </v-row>
      </v-card>
    </v-card>
  </v-col>
</template>
<script>
import ItemPostChildren from "./ItemPostChildren";

export default {
  components: {
    ItemPostChildren
  },
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
    // if (this.item.children) {
    //   console.log(this.item.children[0])
    // }
  },
  methods: {
    comment(val) {
      // console.log("postt"+JSON.stringify(this.item))
      !this.callback(val)
    },
    formatTime(time, format = 'DD MMM YYYY HH:mm') {
      return this.$dayjs(time).format(format)
    },
  },
}
</script>
