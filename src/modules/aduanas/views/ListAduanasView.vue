<template>
  <v-container fluid>
    <!-- buscador -->
    <v-form @submit.prevent="SearchFn" class="mb-5">
      <v-row>
        <v-col
          cols="12"
          class="d-flex align-center justify-center justify-sm-start flex-column flex-md-row"
        >
          <span
            class="title-list-view text-primary mr-md-6"
            v-text="'Aduanas'"
          />
          <v-btn
            class="ml-md-4 button-extra"
            color="primary"
            height="40"
            @click="show_add_var = true"
            v-if="VerifyRolesFn('CREAR_ADUANA')"
          >
            <span> Agregar </span>
          </v-btn>
        </v-col>
        <v-col cols="12" md="8" class="pb-0">
          <v-text-field
            class="mr-md-8"
            label="Buscar"
            placeholder="Escribe aquí para buscar"
            v-model="temp_search_var"
            maxlength="100"
            :rules="RULES_CONST.temp_search_var"
          />
          <v-radio-group
            v-model="filter_by_var"
            @update:model-value="FetchListAduanasFn"
            inline
            hide-details
          >
            <v-radio label="Todos" value="all" />
            <v-radio label="Activos" value="active" />
            <v-radio label="Inactivos" value="inactive" />
          </v-radio-group>
        </v-col>
        <v-col
          cols="12"
          md="4"
          class="pb-0 d-flex flex-column flex-sm-row justify-sm-center"
        >
          <v-btn
            class="mr-sm-4 button-extra my-2 mt-sm-0 mb-sm-4 mt-md-1 mb-md-0"
            color="primary"
            height="40"
            type="submit"
            @keydown.enter.prevent
          >
            <span> Buscar </span>
          </v-btn>
          <v-btn
            class="ml-sm-4 button-extra mb-4 mb-md-0 mt-md-1"
            color="primary"
            variant="outlined"
            height="40"
            @click="CleanSearcherFn"
          >
            <span> Limpiar </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- tabla -->
    <v-data-table-server
      v-model:items-per-page="per_page_var"
      :page="page"
      :headers="HEADERS_CONST"
      :items="list_aduanas_var"
      :items-length="total_aduanas_var"
      :loading="loading_var"
      :search="search_var"
      @update:options="FetchListAduanasFn"
      :mobile="smAndDown"
    >
      <!-- slot fecha creación -->
      <template v-slot:[`item.fecha_creacion`]="{ item }">
        {{ DateFormatFn(item.fecha_creacion, true) }}
      </template>

      <!-- slot fecha edición -->
      <template v-slot:[`item.fecha_edicion`]="{ item }">
        {{ DateFormatFn(item.fecha_edicion, true) }}
      </template>

      <!-- slot fecha estado -->
      <template v-slot:[`item.activo`]="{ item }">
        <v-chip v-show="item.activo" color="green"> Activo </v-chip>
        <v-chip v-show="!item.activo" color="red"> Inactivo </v-chip>
      </template>

      <!-- slot fecha actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <div>
          <template v-if="VerifyRolesFn('ACTUALIZAR_ADUANA')">
            <v-btn
              icon="mdi-pencil-outline"
              variant="plain"
              v-tooltip:bottom="'Editar'"
              @click="InjectInfoEditFn(item)"
            />
            <v-btn
              v-if="item.activo"
              icon="mdi-trash-can-outline"
              variant="plain"
              v-tooltip:bottom="'Desactivar'"
              @click="OpenModalConfirmationFn(item)"
            />
            <v-btn
              v-else
              icon="mdi-restore"
              variant="plain"
              v-tooltip:bottom="'Activar'"
              @click="OpenModalConfirmationFn(item)"
            />
          </template>
        </div>
      </template>
    </v-data-table-server>
  </v-container>

  <!-- modal add/edit -->
  <modal-general-component
    :title="
      Object.keys(selected_aduana_var).length === 0
        ? 'Crear aduana'
        : 'Editar aduana'
    "
    v-model="show_add_var"
    show-cancel
    accept-message="Guardar"
    @cancel="CloseModalFn"
    @accept="HandlerAduanaFn"
  >
    <template #content>
      <div class="my-2">
        <v-form ref="form_modal_ref" @submit.prevent="HandlerAduanaFn">
          <v-text-field
            v-model="nombre_var"
            :rules="RULES_CONST.nombre_var"
            label="Nombre *"
            placeholder="Ingresa el nombre"
            maxlength="150"
          />
        </v-form>
      </div>
    </template>
  </modal-general-component>

  <modal-confirmation-component
    show-cancel
    :title="`${
      !modal_confirmation.is_active ? 'Activar' : 'Desactivar'
    } aduana`"
    v-model="modal_confirmation.show"
    :subtitle="`¿Está seguro de ${
      !modal_confirmation.is_active ? 'activar' : 'desactivar'
    } el registro seleccionado?`"
    @accept="ChangeStatusAduanaFn(modal_confirmation.id)"
    @cancel="modal_confirmation.show = false"
  />
</template>

<script setup>
// utils
import { useAduana } from "../composables/useAduana";
import { DateFormatFn } from "@/utils/global_functions";
import { useDisplay } from "vuetify";
import { VerifyRolesFn } from "@/utils/global_functions";

const { smAndDown } = useDisplay();

const {
  temp_search_var,
  search_var,
  filter_by_var,
  per_page_var,
  page,
  list_aduanas_var,
  total_aduanas_var,
  loading_var,

  show_add_var,
  nombre_var,
  selected_aduana_var,
  form_modal_ref,
  modal_confirmation,

  HEADERS_CONST,
  RULES_CONST,

  ChangeStatusAduanaFn,
  CleanSearcherFn,
  CloseModalFn,
  FetchListAduanasFn,
  HandlerAduanaFn,
  InjectInfoEditFn,
  SaveAduanaFn,
  SearchFn,
  UpdateAduanaFn,
  OpenModalConfirmationFn,
} = useAduana();
</script>

<style lang="scss" scoped>
.title-list-view {
  font-size: 2.3rem;
  font-weight: 600;
  line-height: 48px;
}
</style>
