<template>
  <v-pagination
    v-model="page"
    :length="2"
    @input="test"
    :total-visible="7"
  ></v-pagination>
</template>
<script>
export default {
  props:{
    // length:Number,
    // page:Number,
    callback:Function
  },
  data(){
    return{
      page:1
    }
  },
  methods:{
    test(){
      console.log(">>"+this.page)
      !this.callback(this.page)
    }
  }
}
</script>
