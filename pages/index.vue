<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-carousel cycle height="800" hide-delimiter-background show-arrows-on-hover>
          <v-carousel-item
            v-for="(item,i) in items"
            :key="i"
            :src="item.src"
            reverse-transition="fade-transition"
          ></v-carousel-item>
        </v-carousel>
        <v-container>
          <Service/>
        </v-container>
                  <Partner/>
      </v-main>
    </v-app>
  </div>
  <!--  <script src="https://unpkg.com/swiper/swiper-bundle.min.js"></script>-->
</template>
<style>
.truncate {
  max-width: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
<script src="./index.js"/>
