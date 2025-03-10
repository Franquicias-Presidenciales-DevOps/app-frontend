<template>
  <section class="mt-8">
    <v-row>
      <v-col cols="12" class="d-flex flex-column">
        <span class="text-h6 text-primary font-weight-bold">
          {{
            store_ref.franquicia?.estado == 6
              ? "Puntaje"
              : "Calificación de la entidad"
          }}
        </span>
        <span
          class="text-h6 font-weight-bold mt-2 mb-6 text-wrap"
          v-text="nombre_entidad"
        />
      </v-col>
      <v-col
        cols="12"
        md="4"
        lg="3"
        class="d-flex flex-column text-center text-md-start ml-lg-3"
      >
        <v-progress-circular
          v-show="!isNaN(general_rate)"
          color="primary"
          :model-value="general_rate"
          class="mx-auto"
          :size="180"
          :width="20"
          :rotate="250"
          :max="10"
        >
          <span class="text-h4" v-text="general_rate / 10" />
        </v-progress-circular>
      </v-col>

      <v-col cols="12" md="8" class="px-0">
        <v-row no-gutters>
          <v-col
            cols="12"
            sm="6"
            class="d-flex flex-column px-3 px-md-5 text-center text-sm-start"
            v-for="(item, index) in editable_data_rate"
            :key="index"
          >
            <span v-text="item?.nombre" />
            <rate-component
              :int-count="[6, 7].includes(store_ref.franquicia?.estado)"
              v-model="item.puntaje"
              class="my-5"
              :maximo="item?.puntaje_maximo"
              :readonly="
                store_ref.franquicia?.estado == 2 ||
                store_ref.franquicia?.estado == 4
              "
            />
          </v-col>
        </v-row>
      </v-col>

      <v-col
        cols="12"
        class="text-center"
        v-if="[6, 7].includes(store_ref.franquicia?.estado)"
      >
        <v-btn
          height="45"
          color="primary"
          class="button-extra mt-1 my-md-0"
          :text="init_rate ? 'Editar puntaje' : 'Guardar puntaje'"
          @click="VerifyRateFn"
        />
      </v-col>
    </v-row>

    <v-row
      class="mt-12"
      v-if="
        store_ref.franquicia?.estado == 6 || store_ref.franquicia?.estado == 7
      "
    >
      <template v-if="VerifyRolesFn('GUARDAR_OBSERVACION')">
        <v-col cols="12">
          <span
            class="text-h6 text-primary"
            v-text="'Comentarios/anotaciones'"
          />
        </v-col>
        <v-col cols="12" md="6">
          <span v-text="'Comentario/anotación *'" />
          <v-form ref="form_ref">
            <v-textarea
              v-model.trim="comentario_anotacion"
              rows="8"
              auto-grow
              placeholder="Escriba..."
              :counter="2000"
              maxlength="2000"
              :rules="RULES_CONST.colaboracion_franquicia"
            />
          </v-form>
        </v-col>
        <v-col cols="12" md="6">
          <span v-text="'Adjuntos'" />
          <drag-and-drop-component ref="adjnt_ref" v-model="adjunto_file" />
        </v-col>
      </template>
      <v-col
        cols="12"
        class="d-flex flex-column justify-center mt-8"
        v-if="VerifyRolesFn('LISTAR_OBSERVACIONES')"
      >
        <v-btn
          height="45"
          color="primary"
          class="mx-auto button-extra my-1 my-md-0"
          text="Agregar observación"
          @click="ValidCommentsFn"
        />

        <v-data-table
          class="mt-6"
          :items="list_obs_rate"
          :headers="HEADERS"
          :mobile="smAndDown"
          hide-default-footer
          :items-per-page="-1"
        >
          <!-- slot adjunto -->
          <!-- eslint-disable-next-line -->
          <template v-slot:[`item.num`]="{ _, index }">
            {{ index + 1 }}
          </template>

          <!-- slot adjunto -->
          <template v-slot:[`item.adjunto`]="{ item }">
            <span
              v-text="item?.archivo"
              class="link-text"
              @click="FetchDetailFileFn(item)"
            />
          </template>

          <!-- slot acciones -->
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn
              v-if="VerifyRolesFn('ELIMINAR_OBSERVACION')"
              icon="mdi-trash-can-outline"
              variant="plain"
              v-tooltip:bottom="'Eliminar'"
              @click="DeleteObsFn(item)"
            />
          </template>
        </v-data-table>
      </v-col>
    </v-row>
  </section>

  <v-dialog width="500" v-model="show_modal">
    <v-card :title="file_title">
      <v-card-text class="d-flex flex-column">
        <img :src="file_image" />
      </v-card-text>

      <v-card-actions class="d-flex flex-row justify-center">
        <v-btn
          class="ml-md-4 button-extra"
          color="primary"
          height="40"
          variant="outlined"
          @click="
            show_modal = false;
            file_image = null;
            file_title = '';
          "
          text="Cerrar"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import RateComponent from "./RateComponent.vue";
import useRateFranquicia from "../composables/useRateFranquicia";

const {
  comentario_anotacion,
  adjunto_file,
  list_obs_rate,
  load_list_obs,
  show_modal,
  file_image,
  file_title,

  editable_data_rate,
  nombre_entidad,
  init_rate,
  HEADERS,
  RULES_CONST,
  form_ref,
  adjnt_ref,
  store_ref,
  smAndDown,

  VerifyRateFn,
  ValidCommentsFn,
  DeleteObsFn,
  FetchDetailFileFn,
  general_rate,
  VerifyRolesFn
} = useRateFranquicia();
</script>

<style lang="scss" scoped>
:deep(.v-progress-circular__overlay) {
  stroke-linecap: round !important;
}

:deep(.v-progress-circular__underlay) {
  color: #f1f4f9 !important;
}

:deep(.v-table__wrapper) thead {
  background-color: #1c1e4d !important;
}

:deep(.v-data-table-header__content) {
  color: #fff !important;
}

.link-text {
  text-decoration: underline;
  color: blue;
  cursor: pointer;
}
</style>