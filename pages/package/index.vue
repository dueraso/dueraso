<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
        <div v-if="loading">
          <v-col align="center">
            Loading..
          </v-col>
        </div>
        <v-container fluid v-if="!loading" style="max-width: 1200px">
          <head-bar :title="headTitle"/>
          <v-img src="./package.png" style="left: 2%; bottom: 10%; position: absolute;"></v-img>
          <Carousel :value="products" :numVisible="3" :numScroll="3" :responsiveOptions="responsiveOptions">
            <template #item="slotProps">
              <div class="p-2 mt-12">
                <v-card style="border-radius: 15px; height: 100%;" class="p-3">
                  <v-card
                    color="#70B183"
                    style="border-radius: 100px; justify-self: center;"
                    class="icon"
                  >
                    <v-icon size="50" dark class="m-5">{{ slotProps.data.icon }}</v-icon>
                  </v-card>
                  <p style="font-size: 24px; color: #70B183; font-weight: 700; padding-top: 35px" class="mb-3 text-center">
                    {{slotProps.data.title}}
                  </p>
                  <h5 style="color: #686868; font-weight: 400;">
                    {{slotProps.data.detail}}
                  </h5>
                  <h5 style="color: #846537; font-weight: 500;" class="text-left" v-for="(item, i) in slotProps.data.package_item" :key="i">
                    - {{item.name}} {{item.total == 0?'ฟรี':item.total}}
                  </h5>
                  <h2 class="text-left" style="color: #846537; font-weight: 700;">
                    <s style="color: gray; font-size: 20px">฿{{slotProps.data.price}}.-</s>
                    ฿{{slotProps.data.promotion_price}}.-
                  </h2>
                </v-card>
              </div>
            </template>
          </Carousel>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>
<style>

.icon {
  position: absolute;
  top: -50px;
  left: 50%;
  transform: translateX(-50%);
  background-color: #fff;
  width: 90px;
  height: 90px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}
</style>
<script src="./index.js"/>
