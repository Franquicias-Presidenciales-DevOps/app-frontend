<template>
  <v-container fluid>
    <v-row>
      <!-- Title -->
      <v-col cols="12" class="d-flex justify-center mt-10">
        <span
          class="title-list-view text-primary"
          v-text="'Visitas de campo'"
        />
      </v-col>

      <!-- Tabs headers -->
      <v-col cols="12" class="d-flex">
        <v-tabs
          v-model="selected_tab"
          density="compact"
          class="mx-auto"
          :show-arrows="smAndDown"
        >
          <v-tab
            class="px-sm-6 custom-text-tab"
            value="one"
            text="Seguimiento general"
            prepend-icon="mdi-clipboard-text-outline"
            :variant="selected_tab == 'one' ? 'flat' : 'outlined'"
          />
          <v-tab
            class="px-sm-6 custom-text-tab"
            value="two"
            text="Seguimiento por franquicia"
            prepend-icon="mdi-home-city-outline"
            :variant="selected_tab == 'two' ? 'flat' : 'outlined'"
          />
        </v-tabs>
      </v-col>

      <!-- Tabs content -->
      <v-col cols="12">
        <v-tabs-window v-model="selected_tab">
          <!-- Seguimiento general -->
          <v-tabs-window-item value="one">
            <v-row>
              <!-- informacion -->
              <v-col
                cols="12"
                class="d-flex align-center flex-column flex-sm-row"
              >
                <v-btn
                  variant="flat"
                  class="button-extra my-1"
                  color="primary"
                  height="40"
                  @click="show_filter_gen = !show_filter_gen"
                  :block="xs"
                >
                  <span>
                    {{
                      show_filter_gen ? 'Ocultar filtros' : 'Mostrar filtros'
                    }}
                  </span>
                </v-btn>

                <v-spacer />
                <span class="my-1 my-sm-0" v-if="!smAndDown">
                  Total de resultados: {{ pag_seg_gen.total }}
                </span>
                <v-spacer />
                <v-btn
                  v-if="VerifyRolesFn('CREAR_VISITA_CAMPO')"
                  variant="flat"
                  class="button-extra my-1"
                  color="primary"
                  height="40"
                  text="Agregar"
                  @click="router_ref.push({ name: 'crearVisitaCampo' })"
                  :block="xs"
                />
              </v-col>
              <v-col cols="12" class="d-flex flex-column flex-lg-row">
                <!-- filtros -->
                <transition name="collapse">
                  <div class="mb-3 mb-lg-0 pr-lg-3" v-show="show_filter_gen">
                    <filters-seg-gen-component @filter="FetchListSegGenFn" />
                  </div>
                </transition>

                <v-spacer />
                <span
                  class="my-3 my-sm-0 d-flex align-center justify-center"
                  v-if="smAndDown"
                >
                  Total de resultados: {{ pag_seg_gen.total }}
                </span>
                <v-spacer />

                <!-- tabla -->
                <v-data-table-server
                  ref="table_seg_gen"
                  v-model:items-per-page="pag_seg_gen.per_page"
                  :headers="HEADERS_LIST_SEG_GEN"
                  :items="list_seg_gen"
                  :items-length="pag_seg_gen.total"
                  @update:options="FetchListSegGenFn"
                  :mobile="smAndDown"
                  :loading="load_list_seg_gen"
                  class="mb-1 overflow-x-auto"
                >
                <!-- slot entidad -->
                  <template v-slot:[`item._entidad`]="{ item }">
                    <div class="text-wrap">
                      {{ item.entidad.nombre }}
                    </div>
                  </template>
                  <!-- slot fecha de visita -->
                  <template v-slot:[`item.fecha_visita`]="{ item }">
                    {{ item.fecha_visita ? DateFormatFn(item.fecha_visita) : '-' }}
                  </template>
                  <!-- slot estado -->
                  <template v-slot:[`item.status`]="{ item }">
                    <v-chip
                      :color="GetBodyColorFn(item?.estado?.id)"
                      :class="GetClassColorFn(item?.estado?.id)"
                      :text="item?.estado?.nombre"
                    />
                  </template>
                  <!-- slot acciones -->
                  <template v-slot:[`item.actions`]="{ item }">
                    <div class="d-flex flex-row justify-end">
                      <v-btn
                        v-if="VerifyRolesFn('DETALLE_VISITA_CAMPO')"
                        icon="mdi-eye-outline"
                        variant="plain"
                        v-tooltip:bottom="'Visualizar'"
                        @click="
                          router_ref.push({
                            name: 'detalleVisitaCampo',
                            params: { id: item.id }
                          })
                        "
                      />
                      <v-btn
                        v-if="VerifyRolesFn('EDITAR_VISITA_CAMPO')"
                        icon="mdi-pencil-outline"
                        variant="plain"
                        v-tooltip:bottom="'Editar'"
                        @click="
                          router_ref.push({
                            name: 'editarVisitaCampo',
                            params: { id: item.id }
                          })
                        "
                      />
                      <v-btn
                        v-if="
                          item.estado.id == 1 &&
                          VerifyRolesFn('ELIMINAR_VISITA_CAMPO')
                        "
                        icon="mdi-trash-can-outline"
                        variant="plain"
                        v-tooltip:bottom="'Eliminar'"
                        @click="
                          show_modal_delete = true;
                          item_selected = item
                        "
                      />
                      <v-btn
                        v-if="
                          item.estado.id == 8 &&
                          VerifyRolesFn('IMPRIMIR_REPORTE_VISITA_CAMPO')
                        "
                        icon="mdi-printer-outline"
                        variant="plain"
                        v-tooltip:bottom="'Imprimir'"
                        @click="PrintReportFn(item)"
                      />
                    </div>
                  </template>
                </v-data-table-server>
              </v-col>
            </v-row>
          </v-tabs-window-item>

          <!-- Seguimiento por franquicia -->
          <v-tabs-window-item value="two">
            <v-row>
              <v-col
                cols="12"
                class="d-flex align-center flex-column flex-sm-row"
              >
                <v-btn
                  variant="flat"
                  class="button-extra"
                  color="primary"
                  height="40"
                  @click="show_filter_franq = !show_filter_franq"
                  :block="xs"
                >
                  <span>
                    {{
                      show_filter_franq ? 'Ocultar filtros' : 'Mostrar filtros'
                    }}
                  </span>
                </v-btn>
                <v-spacer />
                <span class="mt-3 mt-sm-0">
                  Total de resultados: {{ pag_seg_franq.total }}
                </span>
                <v-spacer />
              </v-col>
              <v-col cols="12" class="d-flex flex-column flex-lg-row">
                <!-- filtros -->
                <transition name="collapse">
                  <div class="mb-3 mb-lg-0 pr-lg-3" v-show="show_filter_franq">
                    <filters-seg-franq-component
                      @filter="FetchListSegFranqFn"
                    />
                  </div>
                </transition>

                <!-- tabla -->
                <v-data-table-server
                  ref="table_seg_franq"
                  v-model:items-per-page="pag_seg_franq.per_page"
                  :headers="HEADERS_LIST_SEG_FRANQ"
                  :items="list_seg_franq"
                  :items-length="pag_seg_franq.total"
                  @update:options="FetchListSegFranqFn"
                  :mobile="smAndDown"
                  :loading="load_list_seg_franq"
                  class="mb-1"
                >
                  <template v-slot:[`item._entidad`]="{ item }">
                    <div class="text-wrap">
                      {{ item.entidad }}
                    </div>
                  </template>
                  <!-- slot _actions -->
                  <template v-slot:[`item.actions`]="{ item }">
                    <v-btn
                      v-if="VerifyRolesFn('DETALLE_SEGUIMIENTO_VISITA_CAMPO')"
                      icon="mdi-text-box-search-outline"
                      variant="plain"
                      v-tooltip:bottom="'Seguimiento'"
                      @click="
                        router_ref.push({
                          name: 'detalleSeguimiento',
                          params: { id: item.entidad_id }
                        })
                      "
                    />
                  </template>
                </v-data-table-server>
              </v-col>
            </v-row>
          </v-tabs-window-item>
        </v-tabs-window>
      </v-col>
    </v-row>

    <modal-confirmation-component
      show-cancel
      title="Eliminar seguimiento"
      v-model="show_modal_delete"
      subtitle="¿Está seguro que desea eliminar el borrador del seguimiento seleccionado?"
      @accept="DeleteSegFn"
      @cancel="
        show_modal_delete = false;
        item_selected = null
      "
    />
  </v-container>
</template>

<script setup>
import filtersSegGenComponent from '../components/filtersSegGenComponent.vue'
import filtersSegFranqComponent from '../components/filtersSegFranqComponent.vue'
import ModalConfirmationComponent from '@/components/global/ModalConfirmationComponent.vue'

import useListVistCamps from '../composables/useListVistCamps'
import { useDisplay } from 'vuetify'
import { DateFormatFn } from '@/utils/global_functions'
import {
  GetBodyColorFn,
  GetClassColorFn
} from '@/modules/franquicias/composables/useListFranquicias'

import { VerifyRolesFn } from '@/utils/global_functions'

const { smAndDown, xs } = useDisplay()

const {
  selected_tab,
  load_list_seg_gen,
  load_list_seg_franq,
  show_filter_gen,
  show_filter_franq,
  show_modal_delete,
  item_selected,
  list_seg_gen,
  list_seg_franq,
  pag_seg_gen,
  pag_seg_franq,
  HEADERS_LIST_SEG_GEN,
  HEADERS_LIST_SEG_FRANQ,
  FetchListSegGenFn,
  FetchListSegFranqFn,
  PrintReportFn,
  DeleteSegFn,

  router_ref
} = useListVistCamps()
</script>

<style lang="scss" scoped>
.custom-text-tab > :deep(.v-btn__content) {
  font-weight: 500 !important;
  // espacio entre letras
  letter-spacing: 0.35px !important;
}

/* Transición de colapso horizontal */
.collapse-enter-active,
.collapse-leave-active {
  transition: max-width 0.3s ease, opacity 0.3s ease;
  overflow: hidden;
}

.collapse-enter-from {
  max-width: 0;
  opacity: 0;
}

.collapse-enter-to {
  max-width: 400px; /* Ajustar según el contenido */
  opacity: 1;
}

.collapse-leave-from {
  max-width: 400px; /* Ajustar según el contenido */
  opacity: 1;
}

.collapse-leave-to {
  max-width: 0;
  opacity: 0;
}
</style>
