<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <v-container>
          <v-row no-gutters>
            <template v-for="n in 10">
              <v-col>
                <v-card
                  class="pa-2"
                  outlined
                  tile
                >
                  Column
                </v-card>
              </v-col>
              <v-responsive
                v-if="n % 2"
                :key="`width-${n}`"
                width="100%"
              ></v-responsive>
            </template>
          </v-row>
        </v-container>
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
