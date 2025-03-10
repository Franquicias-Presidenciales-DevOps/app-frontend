<template>
  <v-container fluid>
    <v-form @submit.prevent="SearchFn">
      <div class="d-flex ga-6 my-6 flex-column flex-sm-row">
        <!-- <h1 class="text-primary">Facturas comerciales</h1> -->
        <h1 class="text-primary">Tipo de franquicia</h1>
        <v-btn
          v-if="VerifyRolesFn('CREAR_FACTURA')"
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          @click="modal_factura?.openModal"
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
            placeholder="Buscar tipo de franquicias"
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
            @update:model-value="getListFacturas"
            :disabled="loading"
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
            :items="list_facturas"
            :items-length="total_facturas"
            :search="search_var"
            @update:options="getListFacturas"
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

            <template v-slot:[`item.mostrar_no_factura`]="{ item }">
              <v-chip :color="item.mostrar_no_factura ? 'green' : 'red'">
                {{ item.mostrar_no_factura ? "Sí" : "No" }}
              </v-chip>
            </template>

            <!-- slot fecha estado -->
            <template v-slot:[`item.activo`]="{ item }">
              <v-chip v-show="item.activo" color="green"> Activo </v-chip>
              <v-chip v-show="!item.activo" color="red"> Inactivo </v-chip>
            </template>

            <!-- slot fecha actions -->
            <template
              v-slot:[`item.actions`]="{ item }"
              v-if="VerifyRolesFn('ACTUALIZAR_FACTURA')"
            >
              <v-btn
                icon="mdi-pencil-outline"
                variant="plain"
                @click="modal_factura?.openModeEdit(item)"
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
    ref="modal_factura"
    @refresh="getListFacturas"
  ></modal-create-edit-component>

  <modal-confirmation-component
    show-cancel
    :title="`${
      !modal_confirmation.is_active ? 'Activar' : 'Desactivar'
    } tipo de franquicia`"
    v-model="modal_confirmation.show"
    :subtitle="`¿Está seguro de ${
      !modal_confirmation.is_active ? 'activar' : 'desactivar'
    } el registro seleccionado?`"
    @accept="changeStatusFacturaFn(modal_confirmation.id)"
    @cancel="modal_confirmation.show = false"
  >
  </modal-confirmation-component>
</template>

<script setup>
import { useFactura } from "../composables/useFactura";
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
  list_facturas,
  total_facturas,
  per_page_var,
  page,
  getListFacturas,
  changeStatusFacturaFn,
  CleanFormFn,
  SearchFn,
  modal_factura,
  modal_confirmation,
  openModalConfirmation,
} = useFactura();
</script>

<style lang="scss" scoped></style>
