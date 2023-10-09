<script setup>

import TheHeader from "@/components/TheHeader.vue";
</script>

<template>
  <header><TheHeader /></header>
  <div>
  <router-view></router-view>
  </div>
</template>

<style scoped>

div {
  position: relative;
  background-color: var(--background-color);
}

header {
  position: relative;
  left: 0;
  top: 0;
  width: 100%;
}

</style>
