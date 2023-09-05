<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-carousel cycle height="800" hide-delimiter-background show-arrows-on-hover>
          <a href="/">
            <v-carousel-item
              v-for="(item,i) in items"
              :key="i"
              :src="item.src"
              reverse-transition="fade-transition"
            ></v-carousel-item>
          </a>
        </v-carousel>
        <v-container>
          <Service/>
        </v-container>
        <Partner/>
      </v-main>
    </v-app>
  </div>
</template>
<style lang="scss">
.truncate {
  max-width: 10px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.primary {
  color: #B27D41;
}
</style>
<script src="./index.js"/>
