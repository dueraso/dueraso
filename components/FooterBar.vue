<template>
  <v-footer :absolute="true" app dark style="background-color: #7b1817">
    <v-container style="max-width: 1140px;" class="p-0">
      <v-row class="p-0 m-0">
        <v-col class="text-center">
    <span variant="faded">Copyright &copy; {{ new Date().getFullYear() }}
      www.siamamuletcollection.com. All rights reserved.
    </span>
        </v-col>
        <!--    <v-col>-->
        <a :href="switchLocalePath('th')" style="align-self: center">
          <b-img src="/thailand.png" style="max-width: 30px;max-height: 30px;" class="p-1"/>
        </a>
        <a :href="switchLocalePath('en')" style="align-self: center">
          <b-img src="/united-kingdom.png" style="max-width: 30px;max-height: 30px;" class="p-1"/>
        </a>
        <a :href="switchLocalePath('ch')" style="align-self: center">
          <b-img src="/china.png" style="max-width: 30px;max-height: 30px;" class="p-1"/>
        </a>
        <!--    </v-col>-->
      </v-row>
    </v-container>
  </v-footer>
</template>
