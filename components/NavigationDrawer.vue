<template>
  <v-navigation-drawer
    v-model="show" :mini-variant="false" :clipped="true" fixed app style="border-radius: 15px;"
    class="m-3 pt-3 pb-3">
    <!--    <v-list-item class="px-2 d-flex d-none d-md-flex d-lg-none">-->
    <!--      <v-list-item-title align="center" style="font-weight: 500; font-size: 18px">-->
    <!--        <v-icon>mdi-account-outline</v-icon>-->
    <!--        {{ $auth.user.name }}-->
    <!--      </v-list-item-title>-->
    <!--      <v-btn color="#E8AE0F" icon text>-->
    <!--        <v-icon>mdi-bell-badge-outline</v-icon>-->
    <!--      </v-btn>-->

    <!--      <v-btn icon @click="$router.push('/all-apps')">-->
    <!--        <v-icon>mdi-reply</v-icon>-->
    <!--      </v-btn>-->
    <!--    </v-list-item>-->

    <!--    <v-divider class="d-flex d-none d-md-flex d-lg-none"></v-divider>-->

    <v-list v-for="(item, i) in modules" :key="i" class="pt-0 pb-0" flat>
      <v-list-group :value="true" color="#B27D41" v-if="item.children" vertical>
        <template v-slot:activator>
          <v-list-item-icon class="mr-0" v-if="item.icon">
            <v-icon v-text="item.icon"></v-icon>
          </v-list-item-icon>
          <v-list-item-content style="font-weight: 500;" class="pl-6">
            <v-list-item-title>
              {{ item.title }}
            </v-list-item-title>
          </v-list-item-content>
        </template>

        <v-list-item
          v-for="(ite, i) in item.children" :key="i" link class="pl-14" :to="ite.diractory"
          style="font-weight: 500;">
          <v-list-item-content :class="item.icon?'ml-6':'ml-0'">
            <v-list-item-title v-text="ite.title"></v-list-item-title>
          </v-list-item-content>
        </v-list-item>
      </v-list-group>

      <v-list-item
        color="#B27D41"
        v-if="!item.children" :to="item.diractory" router style=" text-decoration: unset;font-weight: 500;"
        class="pl-4">
        <v-list-item-icon class="mr-0" v-if="item.icon">
          <v-icon v-text="item.icon"></v-icon>
        </v-list-item-icon>
        <v-list-item-content class="pl-6">
          <v-list-item-title class=" pt-0 mb-0">
            {{ item.title }}
          </v-list-item-title>
        </v-list-item-content>
      </v-list-item>
    </v-list>
  </v-navigation-drawer>
</template>
<script>
import convert from "../plugins/convert";

export default {
  props: {
    value: Boolean,
    callback: Function,
    modules: Array
  },

  computed: {
    convert() {
      return convert
    },
    show: {
      get() {
        return this.value
      },
      set(value) {
        this.$emit('input', value)
      }
    }
  },
  data() {
    return {
      // modules: [],
    };
  },
  mounted() {
    console.log(this.modules)
  }
}
</script>
