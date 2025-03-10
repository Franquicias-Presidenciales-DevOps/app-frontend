
<template>
  <v-text-field
    :type="show_pass_var ? 'text' : 'password'"
    autocomplete="password"
    maxlength="50"
    :prepend-inner-icon="showIcon ? 'mdi-lock' : ''"
  >
    <template #append-inner>
      <v-btn
        :icon="show_pass_var ? 'mdi-eye-off' : 'mdi-eye'"
        @click="show_pass_var = !show_pass_var"
        variant="plain"
      />
    </template>
  </v-text-field>
</template>

<script setup>
import { ref } from "vue";

const props = defineProps({
  showIcon: {
    type: Boolean,
    default: false,
  },
});

const show_pass_var = ref(false);
</script>

<style>
</style>