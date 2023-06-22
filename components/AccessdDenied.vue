<template>
  <div>
    <h1>403 - ปฏิเสธการเข้าใช้</h1>
    <v-divider/>
    <h3>อ๊ะ คุณไม่ได้รับอนุญาตให้เข้าถึงหน้านี้</h3>
    <br>
    <br>
    <v-btn outlined @click="$router.push('/')" color="#38857d">
      กลับไปหน้าหลัก
    </v-btn>
  </div>
</template>
