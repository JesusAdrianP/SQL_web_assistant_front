<template>
  <img alt="Vue logo" src="./assets/logoapp.png">
  <InicioView />
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'
import InicioView from './views/Inicio.vue';

export default {
  name: 'App',
  components: {
    InicioView
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
img {
  width: 20%;
  height: 20%;
}
</style>
