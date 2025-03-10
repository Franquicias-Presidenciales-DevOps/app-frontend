<template>
  <v-container fluid>
    <v-form @submit.prevent="SearchFn">
      <div class="d-flex ga-6 my-6 flex-column flex-sm-row">
        <h1 class="text-primary">Identificador de gestión</h1>
        <v-btn
          v-if="VerifyRolesFn('CREAR_IDENTIFICADOR_GESTION')"
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          @click="modal_identificador?.openModal"
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
            placeholder="Buscar identificador de gestión"
            maxLength="100"
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
            @update:model-value="getListIdentificadores"
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
            :items="list_identificadores"
            :items-length="total_identificadores"
            :search="search_var"
            @update:options="getListIdentificadores"
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
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                v-if="
                  item.activo &&
                  VerifyRolesFn('ACTUALIZAR_IDENTIFICADOR_GESTION')
                "
                icon="mdi-pencil-outline"
                variant="plain"
                @click="modal_identificador?.openModeEdit(item)"
                v-tooltip:bottom="'Editar'"
              />
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-form>
  </v-container>

  <modal-create-edit-component
    ref="modal_identificador"
    @refresh="getListIdentificadores"
  ></modal-create-edit-component>
</template>

<script setup>
import { useIdentificadores } from "../composables/useIdenticadores";
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
  list_identificadores,
  total_identificadores,
  per_page_var,
  page,
  getListIdentificadores,
  CleanFormFn,
  SearchFn,
  modal_identificador,
  modal_confirmation,
  openModalConfirmation,
} = useIdentificadores();
</script>

<style lang="scss" scoped></style>
