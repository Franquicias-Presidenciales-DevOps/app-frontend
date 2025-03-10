<template>
  <loader-component />
  <router-view />
</template>

<script setup>
// global components
import LoaderComponent from "./components/global/LoaderComponent.vue";



</script>

<style lang="scss">
::-webkit-scrollbar {
  height: 6px;
  width: 6px;
}
/* Track */
::-webkit-scrollbar-track {
  -webkit-border-radius: 6px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
  border-radius: 6px;
}
/* Handle */
::-webkit-scrollbar-thumb {
  -webkit-border-radius: 6px;
  -webkit-box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.5);
  background: rgb(var(--v-theme-primary));
  border-radius: 6px;
}
::-webkit-scrollbar-thumb:window-inactive {
  background: rgb(var(--v-theme-primary));
}
</style>
