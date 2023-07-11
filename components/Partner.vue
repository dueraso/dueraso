<template>
  <v-card style="background: #eef7f6">
    <v-container>
      <v-row class="m-0">
        <v-col class="text-center" cols="12">
          <h2>
            พาร์ทเนอร์ของเรา
          </h2>
          <h5>
            เราภูมิใจที่ทำงานร่วมกับ ผู้นำทางด้านเทคโนโลยี ทั้งผู้ผลิต hardware และ software เพื่อลูกค้าของเรา
          </h5>
        </v-col>

        <v-carousel v-model="model" cycle :show-arrows="false" height="250"
                    hide-delimiter-background>
          <v-carousel-item>
            <v-row>
              <v-col v-for="(color, i) in colors" :key="i">
                <v-sheet :color="color" height="100%" tile>
                  <v-row class="fill-height" align="center" justify="center">
                    <div class="text-h2">
                      Slide {{ i + 1 }}
                    </div>
                  </v-row>
                </v-sheet>
              </v-col>
            </v-row>
          </v-carousel-item>
          <v-carousel-item>
            <v-row>
              <v-col cols="3" v-for="(color, i) in items" :key="i">
                <v-img :src="color.src" height="100%" tile>
                  <v-row class="fill-height" align="center" justify="center">
                    <div class="text-h2">
                      Slide {{ i + 1 }}
                    </div>
                  </v-row>
                </v-img>
              </v-col>
            </v-row>
          </v-carousel-item>
        </v-carousel>
      </v-row>
    </v-container>
  </v-card>
</template>
<script>
export default {
  mounted() {
    // this.startAutoSlide();
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
  methods:{
    startAutoSlide() {
      setInterval(() => {
        console.log("งง>>")
        const slideGroup = this.$refs.slideGroup;
        slideGroup.next();
      }, 3000); // Adjust the delay (in milliseconds) between each slide transition
    },
  }
}
</script>
