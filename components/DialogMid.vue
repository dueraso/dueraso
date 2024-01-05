<template>
  <v-dialog v-model="show" persistent width="786">
    <v-form ref="form" v-model="valid">
      <v-card style="border-radius: 15px">
        <v-card-title>
          <h5 class="m-0" style="color: #5B4840">{{ title }}</h5>
          <v-spacer/>
          <v-btn icon @click="show = false">
            <v-icon color="#5B4840">mdi-close</v-icon>
          </v-btn>
        </v-card-title>

        <v-card-text class="p-3" style="background: #F6F6F6">
          <slot></slot>
          <v-row class="m-0" style="justify-content: center;">
            <v-btn color="#B27D41" @click="confirm" dark rounded width="340" class="m-2">
              ตกลง
            </v-btn>
          </v-row>
        </v-card-text>
      </v-card>
    </v-form>
  </v-dialog>
</template>
<script>
export default {
  props: {
    value: Boolean,
    callback: Function,
    title: String,
  },
  computed: {
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$refs.form.reset()
        this.$emit('input', value)
      }
    }
  },
  data() {
    return {
      valid: false
    }
  },
  methods: {
    confirm() {
      if (this.callback) {
        if (!this.$refs.form.validate()) return;
        !this.callback({})
      }
    }
  }
}
</script>
