<template>
  <v-overlay :value="status" @click="close">
    <v-carousel height="100%" show-arrows-on-hover v-model="index">
      <v-carousel-item v-for="(item, index) in items" :key="index">
        <v-sheet tile>
          <v-row class="fill-height" align="center" justify="center" contain>
            <img :src="convortDo(item)" height="100%" style="-webkit-writing-mode: vertical-rl;"/>
          </v-row>
        </v-sheet>
      </v-carousel-item>
    </v-carousel>
  </v-overlay>
</template>
<script>
import convert from "~/api/convert";

export default {
  props: {
    callback: Function,
    status: Boolean,
    items: Array,
    start:Number,
  },
  watch:{
    start(val){
      this.index = val
    }
  },
  data() {
    return {
      index:0,
      width:1200,
    }
  },
  mounted() {
    this.width = this.$vuetify.breakpoint.width
    this.index = this.start
  },
  methods: {
    convortDo(val) {
      if (val === undefined) return
      return convert.domain(val)
    },
    close() {
      !this.callback()
    }
  },
}
</script>
