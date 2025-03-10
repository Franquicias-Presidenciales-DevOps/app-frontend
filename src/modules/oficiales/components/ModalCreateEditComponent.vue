
<template>
  <modal-general-component
    :title="`${editMode ? 'Editar' : 'Crear'} oficial`"
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
          maxlength="150"
          :rules="RULES.nombre_var"
        />
      </v-form>
    </template>
  </modal-general-component>
</template>

<script setup>
import { useModalComponent } from "../composables/useOficiales";

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
