<template>
  <v-card max-width="281" align="center"  style="padding: 12px">
    <v-img :src="convortDo()" max-width="257" height="240"></v-img>
    <a style="font-size: 18px; font-weight: bold;color: #4e98e7; margin-bottom: 12px; margin-top: 12px"
       align="left" class="cut-text-2" @click="changePage">{{
        item.title
      }}</a>
    <p align="left" class="cut-text">{{item.excerpt}}</p>
  </v-card>
</template>
<script>
import convert from "~/api/convert";

export default {
  props:{
    item:Object,
  },
  mounted() {
    // console.log(this.item.cover)
  },
  methods:{
    convortDo(){
      if(this.item.cover === null) return
      return convert.domain(this.item.cover)
    },
    changePage() {
      // console.log(this.localeLocation('/events/'+this.item.newsId))
      this.$router.push(this.localeLocation("/events/"+this.item.newsId))
    },
  }
}
</script>
