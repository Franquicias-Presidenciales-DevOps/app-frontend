<template>
  <v-container>
    <v-row>
      <v-col
        cols="12"
        class="pb-0 d-flex flex-column flex-sm-row"
        v-if="$route.name != 'crearFranquicia'"
      >
        <!-- número de franquicia -->
        <div
          v-if="store_ref.franquicia?.codigo_franquicia"
          class="d-flex flex-column text-center text-sm-start mr-sm-6 mr-md-12"
        >
          <span v-text="'Número de franquicia'" />
          <span
            class="text-h6"
            v-text="store_ref.franquicia?.codigo_franquicia"
          />
        </div>
        <!-- numero provisional -->
        <div
          :class="`d-flex flex-column text-center text-sm-start ${
            store_ref.franquicia?.codigo_franquicia ? 'ml-sm-6 ml-md-12' : ''
          }`"
        >
          <span v-text="'Número provisional'" />
          <span
            class="text-h6"
            v-text="store_ref.franquicia?.codigo_provisional"
          />
        </div>
      </v-col>

      <!-- info -->
      <v-col cols="12" md="3">
        <div class="d-flex flex-column text-center text-sm-start">
          <span v-text="'Franquicias'" class="text-name text-primary" />
          <div>
            <v-chip
              :color="GetBodyColorFn(store_ref.franquicia?.estados?.id)"
              :class="GetClassColorFn(store_ref.franquicia?.estados?.id)"
              :text="store_ref.franquicia?.estados?.nombre ?? 'Sin guardar'"
            />
          </div>
        </div>
      </v-col>

      <!-- acciones -->
      <action-franquicia-component
        v-if="!store_ref.load_form"
        @anulate="OpenModalAlertFn('anulate')"
        @approve="OpenModalAlertFn('approve')"
        @observe="OpenModalAlertFn('observe')"
        @preview="PreviewFranquiciaFn"
        @send="OpenModalAlertFn('send')"
        @solvent="OpenModalAlertFn('resolve')"
        @save="SaveBorradorFn"
        @save-dates="SaveDatesFn"
      />

      <!-- observaciones/comentarios -->
      <v-col
        cols="12"
        v-if="
          store_ref.franquicia?.estados?.id == 3 ||
          store_ref.franquicia?.estados?.id == 4 ||
          store_ref.franquicia?.estados?.id == 5
        "
      >
        <template v-if="store_ref.franquicia?.estados?.id == 3">
          <v-sheet :elevation="2" rounded class="px-12 py-4">
            <v-icon icon="mdi-information" color="warning" />
            <span
              class="text-warning ml-2 font-weight-bold"
              v-text="'Observaciones'"
            />
            <p class="mb-2 mt-4 text-wrap">
              {{ store_ref.franquicia?.comentario_correccion }}
            </p>
          </v-sheet>
        </template>
        <template v-else-if="store_ref.franquicia?.estados?.id == 4">
          <v-sheet :elevation="2" rounded class="px-12 py-4">
            <v-icon icon="mdi-check-circle" color="success" />
            <span
              class="text-success ml-2 font-weight-bold"
              v-text="'Las resoluciones esperan aprobación'"
            />
          </v-sheet>
        </template>
        <template v-else-if="store_ref.franquicia?.estados?.id == 5">
          <v-sheet
            class="px-12 py-4 bg-red-lighten-5 rounded-lg"
            :elevation="3"
          >
            <v-icon icon="mdi-close-circle" color="red" />
            <span
              class="text-red ml-2 font-weight-bold"
              v-text="'La franquicia ha sido anulada'"
            />
            <p class="mb-2 mt-4 text-wrap">
              {{ store_ref.franquicia?.comentario_anulacion }}
            </p>
          </v-sheet>
        </template>
      </v-col>
    </v-row>

    <!-- tabs -->
    <v-tabs v-model="selected_tab" class="mt-12">
      <v-tab
        value="one"
        text="Información general"
        prepend-icon="mdi-clipboard-text-outline"
        :variant="selected_tab == 'one' ? 'flat' : 'outlined'"
      />
      <v-tab
        v-if="ViewTabAdjuntosFn()"
        value="two"
        text="Adjuntos"
        prepend-icon="mdi-paperclip"
        :variant="selected_tab == 'two' ? 'flat' : 'outlined'"
      />
      <v-tab
        v-if="ViewTabRatingFn()"
        value="three"
        :text="
          [6, 7].includes(store_ref.franquicia?.estado)
            ? 'Seguimiento'
            : 'Calificación de la entidad'
        "
        prepend-icon="mdi-check-decagram-outline"
        :variant="selected_tab == 'three' ? 'flat' : 'outlined'"
      />
    </v-tabs>
    <v-divider :thickness="1" />
    <v-tabs-window v-model="selected_tab">
      <!-- informacion general -->
      <v-tabs-window-item value="one">
        <v-form ref="form_modal">
          <tab-info-general-component class="mt-6" />
        </v-form>
      </v-tabs-window-item>
      <v-tabs-window-item value="two" v-if="ViewTabAdjuntosFn()">
        <tab-adjuntos-component />
      </v-tabs-window-item>
      <v-tabs-window-item value="three" v-if="ViewTabRatingFn()">
        <tab-rate-component />
      </v-tabs-window-item>
    </v-tabs-window>
  </v-container>

  <!-- modal de alerta -->
  <modal-confirmation-component
    v-model="modal_alert"
    :title="title_modal_alert"
    :subtitle="message_modal_alert"
    show-cancel
    @cancel="modal_alert = false"
    @accept="HandlerActionModalFn"
  />

  <!-- modal de comentario -->
  <modal-general-component
    v-model="modal_comment"
    :title="title_modal_alert"
    show-cancel
    @cancel="modal_comment = false"
    @accept="HandlerActionModalFn"
  >
    <template #content>
      <div class="my-2">
        <v-form ref="form_comment_ref">
          <v-textarea
            v-model="comment_modal"
            :rules="RULES_CONST.comment_modal"
            :label="message_modal_alert"
            maxlength="100"
            auto-grow
          />
        </v-form>
      </div>
    </template>
  </modal-general-component>

  <v-dialog max-width="500" v-model="alert_no_content">
    <v-card class="rounded-md">
      <v-card-text
        class="d-flex flex-column text-primary text-no-style px-12 my-8"
      >
        <v-icon
          color="warning"
          icon="mdi-alert-outline"
          size="100"
          class="mx-auto mb-6"
        />
        <span
          class="title-modal mx-auto mb-8"
          v-text="'Al menos un campo debe ser completado'"
        />
        <span
          v-text="'Debe completar la información de uno de los campos:'"
        />
        <ul class="subtitle-modal text-start">
          <li>DUCA</li>
          <li>DMTI</li>
          <li>Itinerario</li>
          <li>Guía aérea no.</li>
          <li>Carta de porte no.</li>
          <li>Conocimiento de embarque no.</li>
          <li>Información de mercaderías recibidas no.</li>
        </ul>
        <div class="mt-6 d-flex flex-column flex-sm-row justify-center ga-4">
          <v-btn
            class="button-extra"
            color="primary"
            height="40"
            @click="alert_no_content = false"
          >
            <span v-text="'Cerrar'" />
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
//utils
import useFranquicia from '../composables/useFranquicia'
import {
  GetBodyColorFn,
  GetClassColorFn
} from '../composables/useListFranquicias'

//components
import TabInfoGeneralComponent from '../components/TabInfoGeneralComponent.vue'
import TabAdjuntosComponent from '../components/TabAdjuntosComponent.vue'
import ActionFranquiciaComponent from '../components/ActionsFranquiciaComponent.vue'
import TabRateComponent from '../components/TabRateComponent.vue'

const {
  comment_modal,
  form_comment_ref,
  form_modal,
  HandlerActionModalFn,
  message_modal_alert,
  alert_no_content,
  modal_alert,
  modal_comment,
  OpenModalAlertFn,
  PreviewFranquiciaFn,
  RULES_CONST,
  SaveBorradorFn,
  selected_tab,
  store_ref,
  title_modal_alert,
  SaveDatesFn,
  VerifyRolesFn,
  ViewTabAdjuntosFn,
  ViewTabRatingFn
} = useFranquicia()
</script>

<style lang="scss" scoped>
.text-name {
  font-size: 2rem;
  font-weight: 600;
  line-height: 48px;
}
</style>
