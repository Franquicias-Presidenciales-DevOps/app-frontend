<template>
  <!-- loader -->
  <v-row
    align-content="center"
    class="fill-height"
    justify="center"
    v-if="store_ref.load_form"
  >
    <v-col class="text-subtitle-1 text-center" cols="12">
      Cargando información...
    </v-col>
    <v-col cols="6">
      <v-progress-linear color="primary" height="6" indeterminate rounded />
    </v-col>
  </v-row>

  <!-- form -->
  <v-row v-else>
    <!-- fechas importantes -->
    <v-col v-if="ViewDatesFn()" cols="12">
      <div class="d-flex flex-row mb-2">
        <v-icon icon="mdi-information" color="primary" />
        <span
          class="text-primary ml-2 font-weight-bold"
          v-text="'Fechas importantes'"
        />
      </div>
      <v-row>
        <v-col cols="12" md="6">
          <date-component
            name="fecha_reporte_date"
            v-model="store_ref.fecha_importante.reporte"
            label="Fecha de reporte"
            :rules="RULES_CONST.fecha_reporte"
            :clearable="false"
            :disabled="
              store_ref.franquicia?.estado !== 6 &&
              store_ref.franquicia?.estado !== 7
            "
          />
        </v-col>
        <v-col cols="12" md="6">
          <date-component
            name="fecha_entrega_date"
            v-model="store_ref.fecha_importante.entrega"
            label="Fecha de entrega"
            :rules="RULES_CONST.fecha_entrega"
            :clearable="false"
            :disabled="
              store_ref.franquicia?.estado !== 6 &&
              store_ref.franquicia?.estado !== 7
            "
          />
        </v-col>
      </v-row>
    </v-col>

    <!-- entidad -->
    <v-col cols="12" md="6">
      <v-select
        name="entidad_select"
        :items="ctl_entidades"
        :rules="RULES_CONST.entidad"
        :clearable="!view_mode"
        item-title="nombre"
        item-value="id"
        label="Entidad *"
        v-model="store_ref.entidad"
        :readonly="view_mode"
        @update:modelValue="
          store_ref.institucion = null;
          store_ref.oficial = null;
        "
      />
    </v-col>

    <!-- institucion/oficial -->
    <v-col cols="12">
      <v-autocomplete
        :class="invalid.institucion_autocomplete ? 'warning--errors' : ''"
        :error-messages="
          invalid.institucion_autocomplete
            ? ['¡Personería jurídica expirada!']
            : []
        "
        :items="ctl_instituciones"
        :readonly="view_mode"
        :rules="RULES_CONST.institucion"
        item-title="nombre"
        label="Fundación/Institución *"
        name="institucion_autocomplete"
        ref="institucion_ref"
        return-object
        v-if="store_ref.entidad === 1"
        v-model="store_ref.institucion"
      />
      <v-autocomplete
        name="oficial_autocomplete"
        :items="ctl_oficiales"
        :rules="RULES_CONST.oficial"
        item-title="nombre"
        label="Oficial *"
        return-object
        v-else-if="store_ref.entidad === 2"
        v-model="store_ref.oficial"
        :readonly="view_mode"
      />
    </v-col>

    <!-- aduana -->
    <v-col cols="12">
      <v-autocomplete
        name="aduana_autocomplete"
        :items="ctl_aduanas"
        :rules="RULES_CONST.aduana"
        item-title="nombre"
        label="Aduana *"
        return-object
        v-model="store_ref.aduana"
        :readonly="view_mode"
      />
    </v-col>

    <!-- guia aerea -->
    <v-col cols="12" md="6">
      <v-text-field
        :class="invalid.guia_aerea_textfield ? 'warning--errors' : ''"
        :error-messages="
          invalid.guia_aerea_textfield
            ? ['Identificador repetido de la franquicia']
            : []
        "
        :readonly="view_mode"
        :rules="RULES_CONST.guia_aerea"
        @change="
          invalid.guia_aerea_textfield = false;
          SearchValueFn(guia_aerea_ref);
        "
        label="Guía aérea no."
        maxlength="50"
        name="guia_aerea_textfield"
        ref="guia_aerea_ref"
        v-model="store_ref.guia_aerea"
      />
    </v-col>

    <!-- embarque -->
    <v-col cols="12" md="6">
      <v-text-field
        :class="invalid.embarque_textfield ? 'warning--errors' : ''"
        :error-messages="
          invalid.embarque_textfield
            ? ['Identificador repetido de la franquicia']
            : []
        "
        :readonly="view_mode"
        :rules="RULES_CONST.embarque"
        @change="
          invalid.embarque_textfield = false;
          SearchValueFn(embarque_ref);
        "
        label="Conocimiento de embarque no."
        maxlength="50"
        name="embarque_textfield"
        ref="embarque_ref"
        v-model="store_ref.embarque"
      />
    </v-col>

    <!-- mercaderia -->
    <v-col cols="12" md="6">
      <v-text-field
        :class="invalid.mercaderia_textfield ? 'warning--errors' : ''"
        :error-messages="
          invalid.mercaderia_textfield
            ? ['Identificador repetido de la franquicia']
            : []
        "
        :readonly="view_mode"
        :rules="RULES_CONST.mercaderia"
        @change="
          invalid.mercaderia_textfield = false;
          SearchValueFn(mercaderia_ref);
        "
        label="Información de mercaderías recibidas no."
        maxlength="50"
        name="mercaderia_textfield"
        ref="mercaderia_ref"
        v-model="store_ref.mercaderia"
      />
    </v-col>

    <!-- carta porte -->
    <v-col cols="12" md="6">
      <v-text-field
        :class="invalid.carta_porte_textfield ? 'warning--errors' : ''"
        :error-messages="
          invalid.carta_porte_textfield
            ? ['Identificador repetido de la franquicia']
            : []
        "
        :readonly="view_mode"
        :rules="RULES_CONST.carta_porte"
        @change="
          invalid.carta_porte_textfield = false;
          SearchValueFn(carta_porte_ref);
        "
        label="Carta de porte no."
        maxlength="50"
        name="carta_porte_textfield"
        ref="carta_porte_ref"
        v-model="store_ref.carta_porte"
      />
    </v-col>

    <!-- dmti -->
    <v-col cols="12" md="6">
      <v-text-field
        :class="invalid.dmti_textfield ? 'warning--errors' : ''"
        :error-messages="
          invalid.dmti_textfield
            ? ['Identificador repetido de la franquicia']
            : []
        "
        :readonly="view_mode"
        :rules="RULES_CONST.dmti"
        @change="
          invalid.dmti_textfield = false;
          SearchValueFn(dmti_ref);
        "
        label="DMTI"
        maxlength="50"
        name="dmti_textfield"
        ref="dmti_ref"
        v-model="store_ref.dmti"
      />
    </v-col>

    <!-- fecha de la franquicia -->
    <v-col cols="12" md="6">
      <date-component
        v-model="store_ref.fecha_franquicia"
        label="Fecha de la franquicia *"
        name="fecha_franquicia_date"
        :disabled="view_mode"
        :rules="RULES_CONST.fecha_franquicia"
      />
    </v-col>

    <!-- DUCA -->
    <v-col cols="12" md="6">
      <v-text-field
        v-model="store_ref.duca"
        label="DUCA"
        :rules="RULES_CONST.duca"
        maxlength="150"
        name="duca_textfield"
        :readonly="view_mode"
      />
    </v-col>

    <!-- tipo de franquicia -->
    <v-col cols="12" md="6">
      <v-autocomplete
        v-model="store_ref.tipo_factura"
        label="Tipo de franquicia *"
        :rules="RULES_CONST.tipo_factura"
        :items="ctl_facturas"
        item-title="nombre"
        return-object
        name="tipo_factura_autocomplete"
        :readonly="view_mode"
      />
    </v-col>

    <!-- cantidad de bultos -->
    <v-col cols="12" md="6">
      <v-text-field
        v-model.number="store_ref.cantidad_bultos"
        label="Cantidad de bultos *"
        :rules="RULES_CONST.cantidad_bultos"
        maxlength="15"
        name="cantidad_bultos_textfield"
        :readonly="view_mode"
      />
    </v-col>

    <!-- clase -->
    <v-col cols="12" md="6">
      <v-autocomplete
        v-model="store_ref.clase"
        label="Clase *"
        :items="ctl_clases"
        :rules="RULES_CONST.clase"
        item-title="nombre"
        return-object
        name="clase_autocomplete"
        :readonly="view_mode"
      />
    </v-col>

    <!-- n factura -->
    <v-col cols="12" v-if="store_ref.tipo_factura?.mostrar_no_factura === 1">
      <v-text-field
        v-model="store_ref.n_factura"
        label="N° de factura"
        :rules="RULES_CONST.n_factura"
        maxlength="150"
        name="n_factura_textfield"
        :readonly="view_mode"
      />
    </v-col>

    <!-- contenido -->
    <v-col cols="12">
      <v-textarea
        v-model="store_ref.contenido"
        label="Contenido *"
        :rules="RULES_CONST.contenido"
        maxlength="500"
        auto-grow
        name="contenido_textarea"
        :readonly="view_mode"
      />
    </v-col>

    <!-- itinerario -->
    <v-col cols="12">
      <v-textarea
        v-model="store_ref.itinerario"
        label="Itinerario"
        :rules="RULES_CONST.itinerario"
        maxlength="500"
        auto-grow
        name="itinerario_textarea"
        :readonly="view_mode"
      />
    </v-col>

    <!-- destino -->
    <v-col cols="12">
      <v-textarea
        v-model="store_ref.destino"
        label="Destino *"
        :rules="RULES_CONST.destino"
        maxlength="500"
        auto-grow
        name="destino_textarea"
        :readonly="view_mode"
      />
    </v-col>

    <!-- nota -->
    <v-col cols="12">
      <v-textarea
        v-model="store_ref.nota"
        label="Nota"
        :rules="RULES_CONST.nota"
        maxlength="500"
        auto-grow
        name="nota_textarea"
        :readonly="view_mode"
      />
    </v-col>

    <!-- observacion -->
    <v-col cols="12">
      <v-textarea
        v-model="store_ref.observacion"
        label="Observación"
        :rules="RULES_CONST.observacion"
        maxlength="500"
        auto-grow
        name="observacion_textarea"
        :readonly="view_mode"
      />
    </v-col>

    <!-- alerta -->
    <modal-confirmation-component
      v-model="show_alert"
      icon-type
      icon="mdi-alert-outline"
      :title="title_identify"
      :subtitle="subtitle_identify"
      @accept="show_alert = false"
      icon-color="warning"
      accept-message="Cerrar"
    />
  </v-row>
</template>

<script setup>
import useFranquiciaForm from "../composables/useFormFranquicia";

const {
  carta_porte_ref,
  ctl_aduanas,
  ctl_clases,
  ctl_entidades,
  ctl_facturas,
  ctl_instituciones,
  ctl_oficiales,
  dmti_ref,
  embarque_ref,
  guia_aerea_ref,
  institucion_ref,
  invalid,
  mercaderia_ref,
  RULES_CONST,
  SearchValueFn,
  show_alert,
  store_ref,
  title_identify,
  view_mode,
  ViewDatesFn,
  VerifyJuridicoFn,
  subtitle_identify,
} = useFranquiciaForm();
</script>

<style scoped lang="scss">
.warning--errors :deep(.v-field-label),
.warning--errors :deep(.v-field__outline),
.warning--errors :deep(.v-messages__message) {
  color: #f9a825 !important;
}
</style>