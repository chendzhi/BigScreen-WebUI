<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
export default {
  name: 'App'
}
</script>

<style lang="scss" scoped>
#app {
  position: relative;
  z-index: 1;
  overflow: auto;
}
</style>
