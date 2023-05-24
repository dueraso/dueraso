<template>
  <v-card>
    <v-card-title>
      <span class="text-h5">top 10</span>
      <v-spacer></v-spacer>
<!--      <v-btn-->
<!--        v-if="items.length < type.length"-->
<!--        color="primary"-->
<!--        dark-->
<!--        class="mb-2"-->
<!--        @click="createItem"-->
<!--      >-->
<!--        <v-icon> mdi-plus</v-icon>-->
<!--        เพิ่ม-->
<!--      </v-btn>-->
    </v-card-title>
    <v-card-text>
      <v-container>
        <v-row>
          <v-col
            cols="3"
            v-for="(item, i) in items" :key='i'
          >
            <a @click="editItem(item.id)">
              <v-img
                max-height="300"
                max-width="300"
                :src="item.url"
                style="border-radius: 20px;"
              ></v-img>
            </a>
          </v-col>
        </v-row>
      </v-container>
    </v-card-text>
  </v-card>
</template>
<script>
import error from "@/layouts/error";

export default {
  middleware: ['auth','is-admin'],
  data() {
    return {
      items: {},
      type: {},
    }
  },
  mounted() {
    this.getData()
    this.getType()
  },
  methods: {
    async getData() {
      await this.$axios.get('/hot')
        .then((res) => {
          this.items = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    },

    async getType() {
      await this.$axios.get('/place_type')
        .then((res) => {
          this.type = res.data
        })
        .catch((error) => {
          console.log(error)
        })
    },

    async createItem() {
      await this.$router.push(`${this.$route.name}/update`)
    },

    async editItem(id) {
      await this.$router.push({
        path: `${this.$route.name}/update`,
        query: {
          edite: id
        }
      })
    },

    deleteItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },
  }
}
</script>
