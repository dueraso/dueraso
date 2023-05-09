<template>
  <v-list density="compact" nav class="p-0" style="border-radius: 4px;">
    <v-list-item style="background: #7b1817" dark class="m-0 pt-1 pb-1">ประเภทพระ</v-list-item>
    <v-list-item
      v-for="(item, i) in items"
      :key="i"
      :to="item.categoryId"
      router
      exact class="m-0"
    >
      <!--        <v-list-item-action>-->
      <!--          <v-icon>{{ item.icon }}</v-icon>-->
      <!--        </v-list-item-action>-->
      <v-list-item-content class="p-0">
        <v-tooltip top>
          <template v-slot:activator="{ on, attrs }">
            <v-list-item-title
              v-text="item.title" class="pb-1 pt-1" style="font-size: 14px; text-underline-offset: unset"
              v-bind="attrs"
              v-on="on"/>
          </template>
          <span>{{ item.title }}</span>
        </v-tooltip>
      </v-list-item-content>
    </v-list-item>
  </v-list>
</template>
<script>
export default {
  data() {
    return {
      drawer: true,
      miniVariant: false,
      clipped: false,
      items: [],
    }
  },
  mounted() {
    this.$nextTick(() => {
      this.getCategory()
    })
  },
  methods: {
    async getCategory() {
      // this.$nuxt.$loading.start()
      this.$axios.$get("/sacred-object-out/category").then((res) => {
        this.categoryItems = res.data
        let d = [
          {
            title: 'ทั้งหมด / 全部 / All',
            categoryId: `post`
          },
        ]
        this.items = [...d, ...res.data]
        // this.$nuxt.$loading.finish()
      }).catch((e) => {
        console.log(e)
      })
    },
    test() {
      console.log("k")
    }
  }
}
</script>
