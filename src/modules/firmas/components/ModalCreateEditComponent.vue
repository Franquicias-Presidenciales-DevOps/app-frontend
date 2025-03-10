
<template>
  <modal-general-component
    :max-width="mobile ? '100%' : '600'"
    :fullscreen="mobile"
    :title="`${editMode ? 'Editar' : 'Crear un nuevo'} firmante`"
    show-cancel
    @cancel="closeModal"
    @accept="fetchStoreOrUpdateFn(emit)"
    v-model="modal_show_var"
    acceptMessage="Guardar"
  >
    <template #content>
      <v-form
        class="ma-0 ma-sm-4 d-flex flex-column ga-4"
        ref="form_modal_ref"
        @submit.prevent="fetchStoreOrUpdateFn(emit)"
      >
        <v-text-field
          v-model.trim="form_var.firma_var"
          label="Firma*"
          placeholder="Ingresar firma"
          maxlength="100"
          :rules="RULES.firma_var"
        />

        <v-text-field
          v-model.trim="form_var.cargo_var"
          label="Cargo*"
          placeholder="Ingresar cargo"
          maxlength="100"
          :rules="RULES.cargo_var"
        />

        <v-text-field
          v-model.trim="form_var.acuerdo_var"
          label="Acuerdo*"
          placeholder="Ingresar acuerdo"
          maxlength="100"
          :rules="RULES.acuerdo_var"
        />

        <v-row class="mt-1">
          <v-col cols="12" sm="6">
            <date-component
              v-model="form_var.fecha_inicio_var"
              minDate="1950-01-01"
              :maxDate="DateRestDaysFn(form_var.fecha_fin_var, 1)"
              placeholder="Ingresa la fecha inicio"
              label="Fecha inicio de validez*"
              :rules="RULES.fecha_inicio_var"
            ></date-component>
          </v-col>

          <v-col cols="12" sm="6">
            <date-component
              :disabled="!form_var.fecha_inicio_var"
              v-model="form_var.fecha_fin_var"
              :minDate="DateAddDaysFn(form_var.fecha_inicio_var, 1)"
              label="Fecha fin de validez*"
              placeholder="Ingresa la fecha fin"
              :rules="RULES.fecha_fin_var"
            ></date-component>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </modal-general-component>
</template>

<script setup>
import { useModalComponent } from "../composables/useFirma";
import { useDisplay } from "vuetify";
import { DateAddDaysFn, DateRestDaysFn } from "@/utils/global_functions";
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
const { mobile } = useDisplay();
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