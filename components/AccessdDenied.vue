<template>
  <div>
    <h1>403 - ACCESS DENIED</h1>
    <v-divider/>
    <h3>Oops, You don't have permission to access this page.</h3>
    <br>
    <br>
    <v-btn outlined @click="$router.push('/')" color="#38857d">
      Go Back To home
    </v-btn>
  </div>
</template>
