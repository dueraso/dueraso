<template>
  <v-container style="max-width: 1140px" class="text-right pt-0">
    <a :href="switchLocalePath('th')" style="align-self: center">
      <b-img src="/thailand.png" style="max-width: 30px;max-height: 30px;" class="p-1"/>
    </a>
    <a :href="switchLocalePath('en')" style="align-self: center">
      <b-img src="/united-kingdom.png" style="max-width: 30px;max-height: 30px;" class="p-1"/>
    </a>
    <a :href="switchLocalePath('ch')" style="align-self: center">
      <b-img src="/china.png" style="max-width: 30px;max-height: 30px;" class="p-1"/>
    </a>
  </v-container>
</template>
