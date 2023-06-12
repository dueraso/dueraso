<template>
  <div>
    <h1>{{error.statusCode}} - {{error.message}}</h1>
    <v-divider/>
    <h3>อ๊ะ, {{otherError}}</h3>
    <br>
    <br>
    <v-btn outlined @click="$router.push('/')" color="#38857d">
      กลับไปหน้าหลัก
    </v-btn>
  </div>
</template>
<script>
export default {
  props:{
    error:null,
    otherError:null
  }
}
</script>
