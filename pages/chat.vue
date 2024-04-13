<template>
  <div id="app">
    <v-app style="background-color: transparent">
      <v-main>
      <div>
        <div class="message" v-for="(msg, index) in messages" :key="index">
          {{ msg.message }}
        </div>
        <div class="form">
          <v-text-field dense outlined v-model="message" class="input"/>
          <button class="btn" type="button" @click="sendMessage">Send</button>
        </div>
      </div>
      </v-main>
    </v-app>
  </div>
</template>

<script>
// import socket from '../socket.io'

import socket from "~/plugins/socket.io";
import pkg from "~/package.json";

export default {
  layout: "auth-layout",
  data() {
    return {
      message: '',
      messages: [],
      version: pkg.version,
    }
  },
  mounted() {
    console.log(navigator.userAgent)
    socket.on('sendMessage', (msg) => {
      console.log(msg)
      this.messages.push(msg)
    })
  },
  methods: {
    sendMessage() {
      socket.emit('sendMessage', {
        name:this.$auth.user.name,
        project:pkg.name,
        message:this.message
      })
      this.message = ''
    }
  }
}
</script>

<style scoped>
.form {
  background: grey;
  position: fixed;
  bottom: 0;
  width: 100%;
}

input {
  border: 0;
  padding: 10px;
  width: 90%;
  margin-right: .5%;
}

.btn {
  width: 9%;
  background: rgb(130, 224, 255);
  border: none;
  padding: 10px;
}

.message {
  margin-left: 50px;
}
</style>
