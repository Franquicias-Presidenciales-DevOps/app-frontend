
<template>
  <!-- :title="`${editMode ? 'Editar' : 'Crear'} factura`" -->
  <modal-general-component
    :title="`${editMode ? 'Editar' : 'Crear'} tipo de franquicia`"
    show-cancel
    @cancel="closeModal"
    @accept="fetchStoreOrUpdateFn(emit)"
    v-model="modal_show_var"
    acceptMessage="Guardar"
  >
    <template #content>
      <v-form
        class="ma-0 ma-sm-4"
        ref="form_modal_ref"
        @submit.prevent="fetchStoreOrUpdateFn(emit)"
      >
        <v-text-field
          v-model.trim="form_var.nombre_var"
          label="Nombre *"
          placeholder="Ingresa el nombre"
          maxlength="100"
          :rules="RULES.nombre_var"
        />

        <p class="text-subtitle-1 text-black mt-2">
          <!-- Mostrar factura <span class="text-red">*</span> -->
          Solicitar no. de factura *
        </p>
        <v-switch
          v-model="form_var.show_factura_var"
          color="primary"
          :label="form_var.show_factura_var ? 'Sí' : 'No'"
          hide-details
          density="compact"
          inset
        ></v-switch>
      </v-form>
    </template>
  </modal-general-component>
</template>

<script setup>
import { useModalComponent } from "../composables/useFactura";

const {
  modal_show_var,
  form_var,
  form_modal_ref,
  editMode,
  fetchStoreOrUpdateFn,
  closeModal,
  openModal,
  openModeEdit,
  RULES,
} = useModalComponent();

const emit = defineEmits(["refresh"]);

defineExpose({
  openModeEdit,
  closeModal,
  openModal,
});
</script>

<style lang="scss" scoped>
:deep(.v-switch__track) {
  opacity: 1 !important;
}
</style>