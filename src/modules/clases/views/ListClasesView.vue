<template>
  <v-container fluid>
    <v-form @submit.prevent="SearchFn">
      <div class="d-flex ga-6 my-6">
        <h1 class="text-primary">Clases</h1>
        <v-btn
          v-if="VerifyRolesFn('CREAR_CLASE')"
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          @click="modal_clase?.openModal"
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
            maxLength="50"
            placeholder="Buscar clases"
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
            @update:model-value="getListClases"
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
            :page="page"
            :headers="HEADERS"
            :loading="loading"
            :items="list_clases"
            :items-length="total_clases"
            :search="search_var"
            @update:options="getListClases"
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
            <template
              v-slot:[`item.actions`]="{ item }"
              v-if="VerifyRolesFn('ACTUALIZAR_CLASE')"
            >
              <v-btn
                icon="mdi-pencil-outline"
                variant="plain"
                @click="modal_clase?.openModeEdit(item)"
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
    ref="modal_clase"
    @refresh="getListClases"
  ></modal-create-edit-component>

  <modal-confirmation-component
    show-cancel
    :title="`${!modal_confirmation.is_active ? 'Activar' : 'Desactivar'} clase`"
    v-model="modal_confirmation.show"
    :subtitle="`¿Está seguro de ${
      !modal_confirmation.is_active ? 'activar' : 'desactivar'
    } el registro seleccionado?`"
    @accept="changeStatusClaseFn(modal_confirmation.id)"
    @cancel="modal_confirmation.show = false"
  >
  </modal-confirmation-component>
</template>

<script setup>
import { useClases } from "../composables/useClases";
import { DateFormatFn } from "@/utils/global_functions";
import { useDisplay } from "vuetify";
import ModalCreateEditComponent from "../components/ModalCreateEditComponent.vue";
import { VerifyRolesFn } from "@/utils/global_functions";
const { smAndDown } = useDisplay();
const {
  search_var,
  temp_search_var,
  filter_by_var,
  loading,
  RULES,
  HEADERS,
  list_clases,
  total_clases,
  per_page_var,
  page,
  getListClases,
  changeStatusClaseFn,
  CleanFormFn,
  SearchFn,
  modal_clase,
  modal_confirmation,
  openModalConfirmation,
} = useClases();
</script>

<style lang="scss" scoped></style>
