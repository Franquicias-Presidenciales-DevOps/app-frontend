
<template>
  <modal-general-component
    :fullscreen="mobile"
    :max-width="mobile ? '100%' : '700'"
    :title="`${editMode ? 'Editar' : 'Crear un nuevo'} usuario`"
    show-cancel
    @cancel="closeModal"
    :acceptMessage="!editMode ? 'Crear' : 'Guardar'"
    @accept="fetchStoreOrUpdateFn(emit)"
    v-model="modal_show_var"
  >
    <template #content>
      <v-form
        class="ma-0 ma-sm-4"
        ref="form_modal_ref"
        @submit.prevent="fetchStoreOrUpdateFn(emit)"
      >
        <v-row dense>
          <v-col cols="12">
            <v-text-field
              v-model.trim="form_var.nombres_var"
              label="Nombres *"
              placeholder="Ingresar nombres"
              maxlength="100"
              :rules="RULES.nombres_var"
            />
          </v-col>

          <v-col cols="12">
            <v-text-field
              v-model.trim="form_var.apellidos_var"
              label="Apellidos *"
              placeholder="Ingresar apellidos"
              maxlength="100"
              :rules="RULES.apellidos_var"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-text-field
              v-model.trim="form_var.cargo_var"
              label="Cargo *"
              placeholder="Ingresar cargo"
              maxlength="100"
              :rules="RULES.cargo_var"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model.trim="form_var.titulo_var"
              label="Título *"
              placeholder="Ingresar título Lic, Ing, etc"
              maxlength="50"
              :rules="RULES.titulo_var"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model.trim="form_var.correo_var"
              label="Correo *"
              placeholder="Ingresar correo"
              maxlength="100"
              :rules="RULES.correo_var"
            />
          </v-col>

          <v-col cols="12" sm="6">
            <v-text-field
              v-model.trim="form_var.codigo_colaborador_var"
              label="Código de colaborador *"
              placeholder="Ingresar código"
              maxlength="3"
              :rules="RULES.codigo_colaborador_var"
              @blur="ValidarCodigoColaborador(form_var.codigo_colaborador_var)"
            />
          </v-col>
          <v-col cols="12" sm="6">
            <v-autocomplete
              label="Departamento *"
              name="departamento_var"
              v-model.trim="form_var.departamento_var"
              placeholder="Seleccionar"
              :items="catalogos.departamentos"
              item-title="nombre"
              item-value="id"
              clearable
              variant="outlined"
              @update:model-value="
                resetInputs(['municipio_var', 'distrito_var'])
              "
              :rules="RULES.departamento_var"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              name="municipio_var"
              :disabled="!form_var.departamento_var"
              label="Municipio *"
              v-model.trim="form_var.municipio_var"
              placeholder="Seleccionar"
              item-title="nombre"
              item-value="id"
              :items="filterMunicipios"
              variant="outlined"
              :rules="RULES.municipio_var"
              @update:model-value="resetInputs(['distrito_var'])"
              clearable
            ></v-autocomplete>
          </v-col>

          <v-col cols="12" sm="6">
            <v-autocomplete
              clearable
              name="distrito_var"
              :disabled="!form_var.municipio_var"
              label="Distrito *"
              v-model.trim="form_var.distrito_var"
              placeholder="Seleccionar"
              item-title="nombre"
              item-value="id"
              :items="filterDistritos"
              variant="outlined"
              :rules="RULES.distrito_var"
            ></v-autocomplete>
          </v-col>

          <v-col cols="12">
            <v-autocomplete
              multiple
              chips
              label="Roles *"
              item-title="nombre"
              item-value="rol_id"
              v-model="form_var.roles_var"
              placeholder="Seleccionar"
              :items="catalogos.roles"
              variant="outlined"
              :rules="RULES.roles_var"
              return-object
            >
            </v-autocomplete>
          </v-col>

          <v-col>
            <p class="text-subtitle-1 text-black mt-2">
              Firmador de reportes <span class="text-red">*</span>
            </p>
            <v-switch
              v-model="form_var.is_firmador_var"
              color="primary"
              :label="form_var.is_firmador_var ? 'Si' : 'No'"
              hide-details
              density="compact"
              inset
            ></v-switch>
          </v-col>
        </v-row>
      </v-form>
    </template>
  </modal-general-component>
</template>

<script setup>
import { useModalComponent } from "../composables/useModal";
import { useDisplay } from "vuetify";
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
  catalogos,
  filterDistritos,
  filterMunicipios,
  resetInputs,
  ValidarCodigoColaborador,
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
