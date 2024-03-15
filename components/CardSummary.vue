<template>
  <v-card height="100%" class="card" style="border-radius: 15px;">
    <v-container fluid>
      <h4>{{title}}</h4>
      <v-row height="100%">
        <v-col>
          <h2 class="grey--text ">
            {{ model == null ? 0 : convert.money(model, 0) }}
          </h2>
          <h6 class="font-weight-normal grey--text">{{statistics}}</h6>
        </v-col>
        <v-col align-self="center" align="center">
          <v-icon size="60" :color="color">{{ icon }}</v-icon>
        </v-col>
      </v-row>
    </v-container>
  </v-card>
</template>

<script>
import convert from "../plugins/convert";

export default {
  computed: {
    model: {
      get() {
        if (this.value === undefined) return 
        return (typeof this.value) === "number"?this.value.toString():this.value

      },
      set(value) {
        this.$emit('input', value)
      }
    },
    convert() {
      return convert
    }
  },
  props: {
    value: String,
    title: String,
    color: String,
    icon: String,
    statistics: String,
  },
  mounted() {
    console.log(this.value)
  }
}
</script>
