<template>
  <v-card
    :variant="xs ? 'text' : 'outlined'"
    color="primary"
    class="mx-auto rounded-0 text-center"
    title="Filtros"
    min-width="260"
    :width="lgAndUp ? 290 : ''"
    :max-width="lgAndUp ? 400 : ''"
  >
    <v-card-text class="pb-0">
      <v-form>
        <v-row>
          <v-col cols="12" sm="6" md="4" lg="12">
            <!-- Entidad -->
            <v-autocomplete
              label="Entidad"
              :items="ctl_entidades"
              hide-details
              item-title="nombre"
              return-object
              v-model="filter_s_f.entidad"
              @update:model-value="HandlerEntidadFn"
              :loading="load_ctl_entidades"
            />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="12">
            <!-- Franquicia -->
            <v-autocomplete
              label="No. Franquicia"
              :items="ctl_franquicias"
              hide-details
              :disabled="!filter_s_f.entidad"
              v-model="filter_s_f.n_franquicia"
              item-title="codigo_provisional"
              item-value="id"
              :loading="load_ctl_franquicias"
            />
          </v-col>

          <v-col cols="12" sm="6" md="4" lg="12">
            <!-- Seguimiento -->
            <v-autocomplete
              label="No. Seguimiento"
              :items="ctl_seguimientos"
              hide-details
              v-model="filter_s_f.n_seguimiento"
              :loading="load_ctl_seguimientos"
            />
          </v-col>
        </v-row>
      </v-form>
    </v-card-text>
    <v-card-actions
      class="d-flex justify-center my-4 flex-column flex-sm-row mx-2"
    >
      <v-btn
        variant="outlined"
        class="button-extra"
        color="primary"
        height="40"
        text="Limpiar"
        @click="CleanFormFn"
        :block="xs"
      />
      <v-btn
        variant="flat"
        class="button-extra"
        color="primary"
        height="40"
        :block="xs"
        @click="FilterFn"
      >
        <v-icon icon="mdi-filter" />
        <span v-text="'Filtrar'" />
      </v-btn>
    </v-card-actions>
  </v-card>
</template>

<script setup>
// utils
import { ref, onMounted, computed } from 'vue'
import { useDisplay } from 'vuetify'

// store
import { useVistCampStore } from '../store'

// services
import visita_campos_services from '@/services/visitas_campos.services'

// references
const { xs, lgAndUp } = useDisplay() // breakpoints
const { filter_s_f } = useVistCampStore() // store

// variables
const load_ctl_entidades = ref(false)
const load_ctl_franquicias = ref(false)
const load_ctl_seguimientos = ref(false)
const ctl_entidades = ref([])
const ctl_franquicias = ref([])
const ctl_seguimientos = ref([])

// emits
const emit = defineEmits(['filter'])

// computadas
// computada q retorna un booleano si el objeto filter_s_f esta vacio
const isEmptyFilter = computed(() =>
  Object.values(filter_s_f).every(value => !value)
)

const enable_filter = computed(() => useVistCampStore().enable_filter_s_f)

// regular functions
/**
 * @description Funcion que limpia los filtros
 * @function CleanFormFn
 * @returns {void} No devuelve ningún valor explícito.
 */
 const CleanFormFn = () => {
  if (isEmptyFilter.value) return

  filter_s_f.entidad = null
  filter_s_f.n_franquicia = null
  filter_s_f.n_seguimiento = null

  ctl_franquicias.value = []

  if (enable_filter.value) {
    emit('filter', { page: 1, itemsPerPage: 10, resetVal: true })
    useVistCampStore().enable_filter_s_f = false
  }
}

const FilterFn = () => {
  if (isEmptyFilter.value && enable_filter.value) {
    useVistCampStore().enable_filter_s_f = false
    emit('filter', { page: 1, itemsPerPage: 10, resetVal: true })
    return
  }

  if (isEmptyFilter.value) {
    useVistCampStore().enable_filter_s_f = false
    return
  } else {
    useVistCampStore().enable_filter_s_f = true
    emit('filter', { page: 1, itemsPerPage: 10, resetVal: true })
  }
}

const HandlerEntidadFn = () => {
  if (filter_s_f.entidad === null) {
    filter_s_f.n_franquicia = null
    ctl_franquicias.value = []
    return
  }

  FetchFranquiciasByEntidadFn(filter_s_f.entidad)
}

//async functions
/**
 * @async
 * @description Funcion que obtiene el catalogo de entidades
 * @function FetchCtlEntidadesFn
 * @returns {void} No devuelve ningún valor explícito.
 */
const FetchCtlEntidadesFn = async () => {
  load_ctl_entidades.value = true
  const { data, status } = await visita_campos_services.getFiltroEntidades()
  if (status === 200) ctl_entidades.value = data
  load_ctl_entidades.value = false
}

/**
 * @async
 * @description Funcion que obtiene el catalogo de seguimientos
 * @function FetchCtlSeguimientoFn
 * @returns {void} No devuelve ningún valor explícito.
 */
const FetchCtlSeguimientoFn = async () => {
  load_ctl_seguimientos.value = true
  const { data, status } = await visita_campos_services.getFiltroSeguimientos()
  if (status === 200) ctl_seguimientos.value = data.seguimientos
  load_ctl_seguimientos.value = false
}

/**
 * @async
 * @description Funcion que obtiene las franquicias por entidad
 * @function FetchFranquiciasByEntidadFn
 * @param {number} id_entidad - Id de la entidad
 * @returns {void} No devuelve ningún valor explícito.
 */
const FetchFranquiciasByEntidadFn = async entidad => {
  load_ctl_franquicias.value = true
  const { data, status } = await visita_campos_services.getFiltroFranquicias({
    oficial_id: entidad?.oficial_id || undefined,
    institucion_id: entidad?.institucion_id || undefined
  })
  if (status === 200) ctl_franquicias.value = data.codigos
  load_ctl_franquicias.value = false
}

onMounted(() => {
  FetchCtlEntidadesFn()
  FetchCtlSeguimientoFn()
})
</script>

<style lang="scss" scoped></style>
