<template>
  <v-col class="text-center" cols="12">
    <span>
        Copyright © {{dayjs().format("YYYY")}} dueraso.com All rights reserved. | Powered by : Dueraso Development
    </span>
  </v-col>
</template>

<script>
import dayjs from "dayjs";

export default {
  methods: {dayjs}
}

</script>
