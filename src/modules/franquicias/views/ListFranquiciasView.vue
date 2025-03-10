<template>
  <v-container fluid>
    <!-- info -->
    <v-form @submit.prevent="" class="mb-5" ref="form">
      <v-row>
        <v-col
          cols="12"
          class="d-flex align-center justify-center justify-sm-start flex-column flex-md-row"
        >
          <span
            class="title-list-view text-primary mr-md-6"
            v-text="'Franquicias'"
          />
          <v-btn
            class="ml-md-4 button-extra"
            color="primary"
            height="40"
            @click="$router.push({ name: 'crearFranquicia' })"
            v-if="VerifyRolesFn('CREAR_FRANQUICIA')"
          >
            <span> Agregar </span>
          </v-btn>
        </v-col>

        <!-- buscador -->
        <v-col cols="12" md="6">
          <v-text-field
            label="Buscar"
            v-model="filters.temp_search"
            :rules="RULES_CONST.temp_search"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <date-component
            label="Fecha inicio"
            v-model="filters.fecha_inicio"
            :max-date="filters.fecha_fin"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <date-component
            :disabled="!filters.fecha_inicio"
            label="Fecha fin"
            v-model="filters.fecha_fin"
            :min-date="filters.fecha_inicio"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            label="Estado"
            :items="ctl_status"
            v-model="filters.status"
            item-title="nombre"
            item-value="id"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3">
          <v-autocomplete
            label="Entidad"
            :items="ctl_entidades"
            v-model="filters.entidad"
            item-title="nombre"
            item-value="id"
          />
        </v-col>

        <!-- optional -->
        <v-col cols="12" sm="6" md="3" v-show="ContainValueFn(1)">
          <v-autocomplete
            label="Aduana"
            :items="ctl_aduanas"
            v-model="filters.aduana"
            item-title="nombre"
            item-value="id"
          />
        </v-col>
        <!-- <v-col cols="12" sm="6" md="3" v-show="ContainValueFn(2)">
          <v-text-field
            label="No. Orden"
            v-model="filters.n_orden"
            :rules="RULES_CONST.n_orden"
          />
        </v-col> -->
        <v-col cols="12" sm="6" md="3" v-show="ContainValueFn(3)">
          <v-text-field
            label="No. Guía aérea"
            v-model="filters.n_guia"
            :rules="RULES_CONST.n_guia"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" v-show="ContainValueFn(4)">
          <v-text-field
            label="Conoc. de embarque no."
            v-model="filters.embarque"
            :rules="RULES_CONST.embarque"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" v-show="ContainValueFn(5)">
          <v-text-field
            label="Inf. de mercaderías rec. no."
            v-model="filters.mercaderia"
            :rules="RULES_CONST.mercaderia"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" v-show="ContainValueFn(6)">
          <v-text-field
            label="Carta de porte no."
            v-model="filters.carta_porte"
            :rules="RULES_CONST.carta_porte"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" v-show="ContainValueFn(7)">
          <v-text-field
            label="Nota de pedido no."
            v-model="filters.nota_pedido"
            :rules="RULES_CONST.nota_pedido"
          />
        </v-col>
        <v-col cols="12" sm="6" md="3" v-show="ContainValueFn(8)">
          <v-autocomplete
            label="Tipo de franquicia"
            :items="ctl_facturas"
            v-model="filters.tipo_factura"
            item-title="nombre"
            item-value="id"
          />
        </v-col>
        <v-col
          cols="12"
          lg="3"
          class="d-flex flex-column flex-sm-row justify-center justify-lg-start"
        >
          <v-btn
            height="45"
            color="primary"
            class="mx-md-4 button-extra"
            @click="SearchValueFn"
          >
            <span> Buscar </span>
          </v-btn>

          <!-- add filters -->
          <v-dialog max-width="400">
            <template v-slot:activator="{ props: activatorProps }">
              <v-btn
                v-bind="activatorProps"
                text="Agregar más filtros"
                variant="flat"
                class="my-4 my-sm-0 mx-sm-4 button-extra elevation-1 text-primary"
                height="45"
              />
            </template>

            <template v-slot:default="{ isActive }">
              <v-card title="Más filtros">
                <v-card-text class="d-flex flex-column">
                  <div class="mx-auto">
                    <template v-for="item in ctl_filters" :key="item.value">
                      <v-checkbox
                        v-model="filters_selected"
                        :label="item.name"
                        :value="item.value"
                        hide-details
                        density="compact"
                      />
                    </template>
                  </div>
                </v-card-text>

                <v-card-actions class="d-flex flex-row justify-center">
                  <v-btn
                    class="ml-md-4 button-extra"
                    color="primary"
                    height="40"
                    variant="outlined"
                    @click="
                      filters_selected = [];
                      isActive.value = false;
                    "
                  >
                    <span> Cancelar </span>
                  </v-btn>
                  <v-btn
                    class="ml-md-4 button-extra bg-primary"
                    height="40"
                    @click="isActive.value = false"
                  >
                    <span> Aceptar </span>
                  </v-btn>
                </v-card-actions>
              </v-card>
            </template>
          </v-dialog>

          <v-btn
            height="45"
            color="primary"
            class="mx-md-4 button-extra"
            variant="outlined"
            @click="CleanFiltersFn"
          >
            <span> Limpiar </span>
          </v-btn>
        </v-col>
      </v-row>
    </v-form>

    <!-- tabla -->
    <v-data-table-server
      ref="table"
      v-model:items-per-page="per_page_var"
      :headers="HEADERS_CONST"
      :items="list_franquicias_var"
      :items-length="total_franquicias_var"
      :loading="loading_var"
      @update:options="FetchListFranquiciasFn"
      :mobile="smAndDown"
      :search="filters.search"
    >
      <!-- slot fecha creación -->
      <template v-slot:[`item.entidad`]="{ item }">
        {{ item.tipo == 1 ? item.institucion?.nombre : item.oficial?.nombre }}
      </template>

      <!-- slot fecha creación -->
      <template v-slot:[`item.fecha_creacion`]="{ item }">
        {{ DateFormatFn(item.fecha_creacion, true) }}
      </template>

      <!-- slot fecha estado -->
      <template v-slot:[`item.status`]="{ item }">
        <v-chip
          :color="GetBodyColorFn(item?.estados?.id)"
          :class="GetClassColorFn(item?.estados?.id)"
          :text="item?.estados?.nombre"
        />
      </template>

      <!-- slot fecha actions -->
      <template v-slot:[`item.actions`]="{ item }">
        <div class="d-flex flex-row" v-if="ShowActionFn(item)">
          <v-btn
            :icon="GetActionsFn(item)"
            variant="plain"
            v-tooltip:bottom="GetTextActionsFn(item)"
            @click="HandlerVisualizarFn(item)"
          />
        </div>
        <div v-else class="text-center"><span v-text="'-'" /></div>
      </template>
    </v-data-table-server>
  </v-container>
</template>

<script setup>
// utils
import { useListFranquicia } from "../composables/useListFranquicias";
import { DateFormatFn } from "@/utils/global_functions";
import { useDisplay } from "vuetify";
import { VerifyRolesFn } from "@/utils/global_functions";

const { smAndDown } = useDisplay();

const {
  per_page_var,
  list_franquicias_var,
  total_franquicias_var,
  loading_var,

  filters,
  filters_selected,

  HEADERS_CONST,
  RULES_CONST,
  ctl_filters,
  ctl_status,
  ctl_aduanas,
  ctl_facturas,
  ctl_entidades,

  ContainValueFn,
  GetBodyColorFn,
  GetClassColorFn,
  HandlerVisualizarFn,
  FetchListFranquiciasFn,
  CleanFiltersFn,
  GetActionsFn,
  GetTextActionsFn,
  table,
  form,
  SearchValueFn,
  ShowActionFn
} = useListFranquicia();
</script>

<style lang="scss" scoped>
.title-list-view {
  font-size: 2.3rem;
  font-weight: 600;
  line-height: 48px;
}
:deep(.v-card-title) {
  text-align: center;
  color: #1c1e4d;
}
</style>