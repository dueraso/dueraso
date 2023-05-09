<template>
  <v-card max-width="281" align="center" style="padding: 12px">
    <v-img :src="item.cover" max-width="257"></v-img>
    <a style="font-size: 18px; font-weight: bold;color: #4e98e7; margin-bottom: 12px; margin-top: 12px"
       align="left" class="cut-text-2" @click="changePage">{{
        item.title
      }}</a>
    <p align="left" class="cut-text-2">{{item.excerpt}}</p>
  </v-card>
</template>
<script>

export default {
  props:{
    item:Object,
  },
  methods:{
    changePage(){
      this.$router.push(`/events/${this.item.newsId}`)
    }
  }
}
</script>
