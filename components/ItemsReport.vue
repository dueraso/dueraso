<template>
  <v-card>
    <v-row style="margin: 12px">
      <v-col>
        <strong style="margin: 0px;  align-self: center; font-size: 18px;" @click="OnClick">
          <a style="color: black">{{ item.topic }}</a>
        </strong>
        <p style="margin: 0px;  align-self: center;">รุ่น {{ item.amulet.model }} หมายเลข {{ item.number }}</p>
      </v-col>
      <v-divider
          style="margin-bottom: 5px;margin-top: 5px;"
          vertical
      ></v-divider>
      <v-col cols="3">
        <p style="margin: 0px;  align-self: center;">แจ้งเมื่อ {{ formatTime(item.updated_at) }}</p>
        <p style="margin: 0px;  align-self: center;" >{{ item.status.name }}</p>
      </v-col>
    </v-row>
  </v-card>
</template>
<script>
export default {
  data() {
    return {}
  },
  props:{
    index:Number,
    item:{
      type:Object,
    }
  },
  mounted() {
    // console.log("iii>"+JSON.stringify(this.item.id))
    // this.checkStatus()
  },
  methods: {
    async checkStatus(){
      let el = document.getElementById('stat');
        el.style.color = '#00D800';
      if(this.item.status.id === 1){
        el.style.color = '#E4AB40';
      }if(this.item.status.id === 2) {
        el.style.color = '#FF0000';
      }
        // console.log(">>>"+this.item.status.id)
    },
    formatTime (time, format = 'DD MMM YYYY HH:mm') {
      return this.$dayjs(time).format(format)
    },
    OnClick() {
      // console.log("iii>"+JSON.stringify(this.item.id))
      this.$router.push({
        path: `${this.$route.path}/${this.item.id}`
      });
    },
  },
}
</script>