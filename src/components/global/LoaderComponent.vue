<template>
  <section class="container" v-if="utils_store_ref.loader_st">
    <v-progress-circular
      :size="150"
      bg-color="transparent"
      color="white"
      indeterminate
    />
  </section>
</template>

<script setup>
// stores
import { useUtilsStore } from "../../store/utils";

// references
const utils_store_ref = useUtilsStore();
</script>

<style scoped lang="scss">
.container {
  align-items: center;
  background: rgba(0, 0, 0, 0.32);
  display: flex;
  justify-content: center;
  left: 0;
  min-height: 100vh;
  min-width: 100vw;
  position: fixed;
  top: 0;
  z-index: 9999;
}
</style>