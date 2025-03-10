<template>
  <v-col cols="4" style="
      margin: 0;
      padding: 0;
      justify-content: center;
      align-items: space-evenly;
      "
    >
    <v-checkbox :model-value="selectedPermisos.includes(opcion?.id)" :label="opcion.descripcion" color="primary" hide-details
      density="compact" class="pa-2 ma-2" @click="$emit('AddPermiso', [indice, opcion]);" />
  </v-col>
</template>

<script setup>
import { defineProps, defineEmits, toRefs } from 'vue';

const props = defineProps({ indice: Number, opcion: Object, selectedPermisos: Array });
const emit = defineEmits(['AddPermiso']);


const { selectedPermisos, opcion } = toRefs(props);
</script>

<style scoped>

:deep(.v-label) {
  font-size: 15.4px;
}

</style>
