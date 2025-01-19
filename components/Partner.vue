<template>
  <v-col style="background-color: white">
    <v-img src="./partner.png" style="left: 2%; bottom: 5%; position: absolute;"></v-img>
    <v-container>
      <v-row class="m-0">
        <v-col cols="12">
          <v-row class="justify-content-end m-0">
            <h2 class="m-0 pr-2 align-content-center">
              สปอนเซอร์ของเรา
            </h2>
            <img style="height: 50px" src="/line.png" alt="line">
          </v-row>
        </v-col>

<!--        <v-carousel v-model="model" cycle :show-arrows="false" height="250" hide-delimiter-background>-->
<!--          <v-carousel-item>-->
<!--            <v-row>-->
<!--              <v-col v-for="(color, i) in colors" :key="i">-->
<!--                <v-sheet :color="color" height="100%" tile>-->
<!--                  <v-row class="fill-height" align="center" justify="center">-->
<!--                    <div class="text-h2">-->
<!--                      Slide {{ i + 1 }}-->
<!--                    </div>-->
<!--                  </v-row>-->
<!--                </v-sheet>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-carousel-item>-->

<!--          <v-carousel-item>-->
<!--            <v-row>-->
              <v-col cols="12" md="4" v-for="item in 1" :key="item">
                <v-card style="border-radius: 15px; text-align: -webkit-center; padding: 10px">
                  <v-img src="./arin_sponser.png" style=""/>
                  <v-card-title class="text-left p-0" style="color: #B27D41">
                    ARIN ศูนย์รวมเสื้อผ้าแฟชั่นมือสอง ปลีก/ส่ง
                  </v-card-title>
                </v-card>
              </v-col>
<!--              <v-col cols="3" v-for="(color, i) in items" :key="i">-->
<!--                <v-img :src="color.src" height="100%" tile>-->
<!--                  <v-row class="fill-height" align="center" justify="center">-->
<!--                    <div class="text-h2">-->
<!--                      Slide {{ i + 1 }}-->
<!--                    </div>-->
<!--                  </v-row>-->
<!--                </v-img>-->
<!--              </v-col>-->
<!--            </v-row>-->
<!--          </v-carousel-item>-->
<!--        </v-carousel>-->
      </v-row>
    </v-container>
  </v-col>
</template>
<script>
import convert from "@/plugins/convert";

export default {
  computed: {
    convert() {
      return convert
    }
  },
  mounted() {
    // this.startAutoSlide();
    console.log(convert.height(this.$vuetify))
  },
  data() {
    return {
      items: [
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/squirrel.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/sky.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/bird.jpg',
        },
        {
          src: 'https://cdn.vuetifyjs.com/images/carousel/planet.jpg',
        },
      ],
      model: 0,
      colors: [
        'primary',
        'secondary',
        'yellow darken-2',
        'red',
      ],
    }
  },
  methods: {
    startAutoSlide() {
      setInterval(() => {
        const slideGroup = this.$refs.slideGroup;
        slideGroup.next();
      }, 3000); // Adjust the delay (in milliseconds) between each slide transition
    },
  }
}
</script>
