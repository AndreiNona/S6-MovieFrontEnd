<!-- <template>
  <img alt="Vue logo" src="./assets/logo.png">
  <HelloWorld msg="Welcome to Your Vue.js App"/>
</template>

<script>
import HelloWorld from './components/HelloWorld.vue'

export default {
  name: 'App',
  components: {
    HelloWorld
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style> -->
<template>
  <v-app>
    <v-app-bar app>
      <v-toolbar-title>Movie Enthusiast</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-btn text to="/movies" v-bind="$router-link">Movies</v-btn>
      <v-btn text to="/actors" v-bind="$router-link">Actors</v-btn>
      <v-btn text to="/directors" v-bind="$router-link">Directors</v-btn>
    </v-app-bar>

    <v-main>
      <router-view /> <!-- This is where the routed components will render -->
    </v-main>
  </v-app>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style scoped>
/* Add styles if needed */
</style>

