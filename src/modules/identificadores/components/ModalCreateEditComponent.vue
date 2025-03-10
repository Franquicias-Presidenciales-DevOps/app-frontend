
<template>
  <modal-general-component
    :title="`${editMode ? 'Editar' : 'Crear'} identificador de gestión`"
    show-cancel
    @cancel="closeModal"
    @accept="fetchStoreOrUpdateFn(emit)"
    acceptMessage="Guardar"
    v-model="modal_show_var"
  >
    <template #content>
      <v-form
        class="ma-0 ma-sm-6"
        ref="form_modal_ref"
        @submit.prevent="fetchStoreOrUpdateFn(emit)"
      >
        <p class="text-subtitle-1 text-center text-primary" v-if="!editMode">
          Recuerda que al crear un identificador nuevo, todos los demás
          identificadores quedarán inactivos.
        </p>
        <br />
        <v-text-field
          v-model.trim="form_var.nombre_var"
          label="Nombre *"
          placeholder="Ingresa el identificador"
          maxlength="3"
          :rules="RULES.nombre_var"
          @blur="ValidarIdentificador(form_var.nombre_var)"
        />
      </v-form>
    </template>
  </modal-general-component>
</template>

<script setup>
import { useModalComponent } from "../composables/useIdenticadores";

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
  ValidarIdentificador,
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
</style>../composables/useIdenticadores
