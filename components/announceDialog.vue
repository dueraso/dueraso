<template>
  <v-dialog v-model="dialog" persistent max-width="600px">
    <v-card>
      <v-card-title>
        <span class="text-h5">ประกาศ</span>
      </v-card-title>
      <hr />
      <br />
      <v-spacer></v-spacer>
      <v-card-text
        ><span class="text-h7"
          >ปิดปรับปรุง ขออภัยในความไม่สะดวก เราจะกลับมาอีกครั้ง</span
        >
      </v-card-text>
    </v-card>
  </v-dialog>
</template>
<script>
export default {
  data() {
    return {
      dialog: true
    };
  }
};
</script>
