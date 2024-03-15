<template>
  <v-row>
    <v-col cols="6" sm="3">
      <card-summary v-model="item.customer" title="ลูกค้าวันนี้" color="green" icon="mdi-account-box-outline" statistics="+23% Up"/>
    </v-col>

    <v-col cols="6" sm="3">
      <card-summary v-model="item.price" title="ยอดขายวันนี้" color="warning" icon="mdi-chart-areaspline" statistics="-3% Down"/>
    </v-col>

    <v-col cols="6" sm="3">
      <card-summary v-model="item.total" title="รายการสินค้าวันนี้" color="red" icon="mdi-cart-plus" statistics="-10% Down"/>
    </v-col>

    <v-col cols="6" sm="3">
<!--      <card-summary v-model="item.monthTotal" title="ยอดเดือนนี้" color="orange" icon="mdi-gesture-double-tap" statistics="+50% Up"/>-->
    </v-col>
  </v-row>
</template>

<script>
import convert from "../plugins/convert";
import CardSummary from "~/components/CardSummary.vue";

export default {
  components:{
    CardSummary
  },
  props: {
    value: Object,
    callback: Function,
    title: String,
  },
  computed: {
    convert() {
      return convert
    },
    item: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
}
</script>
