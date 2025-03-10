<template>
  <v-container fluid>
    <v-form @submit.prevent="SearchFn">
      <div class="d-flex ga-6 my-6 flex-column flex-sm-row">
        <h1 class="text-primary">Firmante</h1>
        <v-btn
          v-if="VerifyRolesFn('CREAR_FIRMANTE')"
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          @click="modal_firma?.openModal"
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
            maxLength="100"
            placeholder="Buscar firmas"
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

        <v-col>
          <v-data-table-server
            v-model:items-per-page="per_page_var"
            :headers="HEADERS"
            :page="page"
            :loading="loading"
            :items="list_firmas"
            :items-length="total_firmas"
            :search="search_var"
            @update:options="getListFirmas"
            :mobile="smAndDown"
            disable-sort
          >
            <!-- slot fecha creación -->
            <template v-slot:[`item.fecha_inicio_validez`]="{ item }">
              {{ DateFormatFn(item.fecha_inicio_validez) }}
            </template>

            <!-- slot fecha edición -->
            <template v-slot:[`item.fecha_fin_validez`]="{ item }">
              {{ DateFormatFn(item.fecha_fin_validez) }}
            </template>

            <!-- slot fecha actions -->
            <template v-slot:[`item.actions`]="{ item }">
              <v-btn
                v-if="VerifyRolesFn('ACTUALIZAR_FIRMANTE')"
                icon="mdi-pencil-outline"
                variant="plain"
                @click="modal_firma?.openModeEdit(item)"
                v-tooltip:bottom="'Editar'"
              />
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-form>
  </v-container>

  <modal-create-edit-component
    ref="modal_firma"
    @refresh="getListFirmas"
  ></modal-create-edit-component>
</template>

<script setup>
import { useFirma } from "@/modules/firmas/composables/useFirma";
import { DateFormatFn } from "@/utils/global_functions";
import { useDisplay } from "vuetify";
import ModalCreateEditComponent from "../components/ModalCreateEditComponent.vue";
import { VerifyRolesFn } from "@/utils/global_functions";
const { smAndDown } = useDisplay();
const {
  search_var,
  temp_search_var,
  loading,
  RULES,
  HEADERS,
  list_firmas,
  total_firmas,
  per_page_var,
  page,
  getListFirmas,
  CleanFormFn,
  SearchFn,
  modal_firma,
  modal_confirmation,
  openModalConfirmation,
} = useFirma();
</script>

<style lang="scss" scoped></style>
