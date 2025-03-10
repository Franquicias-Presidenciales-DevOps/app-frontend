<template>
  <v-container fluid>
    <v-form @submit.prevent="SearchFn">
      <div class="d-flex ga-6 my-6">
        <h1 class="text-primary">Oficiales</h1>
        <v-btn
          v-if="VerifyRolesFn('CREAR_OFICIAL')"
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          @click="modal_oficial?.openModal"
        >
          Agregar
        </v-btn>
      </div>
      <br />
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            :rules="RULES.search_var"
            v-model.trim="temp_search_var"
            placeholder="Buscar oficiales"
            maxLength="50"
            label="Buscar"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="d-flex ga-4 flex-sm-row flex-column">
            <v-btn
              class="text-none button-extra"
              ripple
              height="45"
              color="primary"
              type="submit"
              >Buscar</v-btn
            >

            <v-btn
              class="text-none button-extra"
              ripple
              height="45"
              color="primary"
              variant="outlined"
              @click="CleanFormFn"
              >Limpiar</v-btn
            >
          </div>
        </v-col>

        <v-col cols="12" class="pt-0">
          <v-radio-group
            v-model="filter_by_var"
            @update:model-value="getListOficiales"
            inline
          >
            <v-radio label="Todos" value="all" />
            <v-radio label="Activos" value="active" />
            <v-radio label="Inactivos" value="inactive" />
          </v-radio-group>
        </v-col>

        <v-col>
          <v-data-table-server
            v-model:items-per-page="per_page_var"
            :headers="HEADERS"
            :page="page"
            :loading="loading"
            :items="list_oficiales"
            :items-length="total_oficiales"
            :search="search_var"
            @update:options="getListOficiales"
            :mobile="smAndDown"
            disable-sort
          >
            <!-- slot fecha creación -->
            <template v-slot:[`item.fecha_creacion`]="{ item }">
              {{ DateFormatFn(item.fecha_creacion) }}
            </template>

            <!-- slot fecha edición -->
            <template v-slot:[`item.fecha_edicion`]="{ item }">
              {{ DateFormatFn(item.fecha_edicion) }}
            </template>

            <!-- slot fecha estado -->
            <template v-slot:[`item.activo`]="{ item }">
              <v-chip v-show="item.activo" color="green"> Activo </v-chip>
              <v-chip v-show="!item.activo" color="red"> Inactivo </v-chip>
            </template>

            <!-- slot fecha actions -->
            <template v-slot:[`item.actions`]="{ item }" v-if="VerifyRolesFn('ACTUALIZAR_OFICIAL')">
              <v-btn
                icon="mdi-pencil-outline"
                variant="plain"
                @click="modal_oficial?.openModeEdit(item)"
                v-tooltip:bottom="'Editar'"
              />
              <v-btn
                v-if="item.activo"
                icon="mdi-trash-can-outline"
                variant="plain"
                @click="openModalConfirmation(item)"
                v-tooltip:bottom="'Desactivar'"
              />
              <v-btn
                v-else
                @click="openModalConfirmation(item)"
                icon="mdi-restore"
                variant="plain"
                v-tooltip:bottom="'Activar'"
              />
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-form>
  </v-container>

  <modal-create-edit-component
    ref="modal_oficial"
    @refresh="getListOficiales"
  ></modal-create-edit-component>

  <modal-confirmation-component
    show-cancel
    :title="`${
      !modal_confirmation.is_active ? 'Activar' : 'Desactivar'
    } oficial`"
    v-model="modal_confirmation.show"
    :subtitle="`¿Está seguro de ${
      !modal_confirmation.is_active ? 'activar' : 'desactivar'
    } el registro seleccionado?`"
    @accept="changeStatusOficialFn(modal_confirmation.id)"
    @cancel="modal_confirmation.show = false"
  >
  </modal-confirmation-component>
</template>

<script setup>
import { useOficiales } from "../composables/useOficiales";
import { DateFormatFn } from "@/utils/global_functions";
import { useDisplay } from "vuetify";
import { VerifyRolesFn } from "@/utils/global_functions";
import ModalCreateEditComponent from "../components/ModalCreateEditComponent.vue";
const { smAndDown } = useDisplay();
const {
  search_var,
  temp_search_var,
  filter_by_var,
  loading,
  RULES,
  HEADERS,
  list_oficiales,
  total_oficiales,
  per_page_var,
  page,
  getListOficiales,
  changeStatusOficialFn,
  CleanFormFn,
  SearchFn,
  modal_oficial,
  modal_confirmation,
  openModalConfirmation,
} = useOficiales();
</script>

<style lang="scss" scoped></style>
