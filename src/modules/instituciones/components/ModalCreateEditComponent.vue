
<template>
  <modal-general-component
    :max-width="mobile ? '100%' : '600'"
    :fullscreen="mobile"
    :title="`${editMode ? 'Editar' : 'Crear'} institución`"
    acceptMessage="Guardar"
    show-cancel
    @cancel="closeModal"
    @accept="fetchStoreOrUpdateFn(emit)"
    v-model="modal_show_var"
  >
    <template #content>
      <v-form
        class="ma-0 ma-sm-4 d-flex flex-column ga-4"
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

        <v-text-field
          v-model.trim="form_var.presidente_var"
          label="Presidente/Representante Legal *"
          placeholder="Ingresa el nombre"
          maxlength="150"
          :rules="RULES.presidente_var"
        />

        <v-row>
          <v-col cols="12">
            <p class="text-subtitle-1 text-primary mt-2">
              Periodo de la junta directiva*
            </p>
          </v-col>
          <v-col cols="12" sm="6">
            <date-component
              v-model.trim="form_var.fecha_inicio_var"
              minDate="1950-01-01"
              :maxDate="DateRestDaysFn(form_var.fecha_fin_var, 1)"
              placeholder="Ingresa la fecha inicio"
              label="Fecha inicio"
              :rules="RULES.fecha_inicio_var"
            ></date-component>
          </v-col>

          <v-col cols="12" sm="6">
            <date-component
              :disabled="!form_var.fecha_inicio_var"
              v-model.trim="form_var.fecha_fin_var"
              :minDate="DateAddDaysFn(form_var.fecha_inicio_var, 1)"
              label="Fecha fin"
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
import { useModalComponent } from "../composables/useInstitucion";
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

