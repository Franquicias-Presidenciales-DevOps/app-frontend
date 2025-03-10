<template>
  <v-app>
    <aside-bar-component />
    <header-component />
    <v-main class="d-flex justify-center ">
      <div :class="`w-100 px-0 px-lg-0 ${router_ref.currentRoute.value.meta.noSpace ? 'w-lg-85' : 'w-lg-66 px-sm-12'}`">
      <router-view />
    </div>
    </v-main>
  </v-app>
</template>

<script setup>
// global components
import AsideBarComponent from "../components/layout/AsideBarComponent.vue";
import HeaderComponent from "../components/layout/HeaderComponent.vue";

// utilities
import { computed, onMounted } from "vue";
import { useRouter } from "vue-router";

// stores
import { useAuthStore } from "../store/auth";

// references
const auth_store_ref = useAuthStore();
const router_ref = useRouter();

// computed
const goBackCmp = computed(() => {
  const history_scp_var = router_ref.options.history.state;
  if (history_scp_var.current !== "/") {
    return history_scp_var.position > 1;
  }
});

onMounted(() => {
  auth_store_ref.obtainInfoStorageAct();
});
</script>

<style scoped>
@media (min-width: 1280px) {
  .w-lg-85 {
    width: 90% !important;
  }
}
</style>