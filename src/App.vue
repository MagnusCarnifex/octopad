<template>
  <div id="app">
    <TestPage />
  </div>
</template>

<script>
import TestPage from './components/TestPage.vue';

export default {
  name: 'App',
  components: {
    TestPage,
  },
};
</script>

<style>
@import './assets/css/bulma.min.css';

#app {
  font-family: Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
