<template>
  <v-col
    cols="12"
    md="9"
    class="d-flex flex-column flex-md-row align-md-center justify-md-start"
  >
    <!-- regresar / cancelar -->
    <v-btn
      height="45"
      variant="outlined"
      color="primary"
      class="mr-md-4 px-7 my-1 my-md-0"
      @click="$router.push({ name: 'listFranquicias' })"
    >
      <span>
        {{ $route.name != "crearFranquicia" ? "Regresar" : "Cancelar" }}
      </span>
    </v-btn>

    <!-- borrador / sin guardar -->
    <template
      v-if="
        store_ref.franquicia?.estados?.id == null ||
        store_ref.franquicia?.estados?.id == 1
      "
    >
      <v-btn
        v-if="
          VerifyRolesFn('CREAR_BORRADOR') ||
          VerifyRolesFn('ACTUALIZAR_FRANQUICIA')
        "
        height="45"
        variant="outlined"
        color="primary"
        class="mx-sm-4 px-7 my-4 my-1 my-md-0"
        @click="emits('save')"
      >
        <span> Guardar </span>
      </v-btn>
      <v-btn
        v-if="VerifyRolesFn('ENVIAR_FRANQUICIA_REVISION')"
        height="45"
        color="primary"
        class="mx-md-2 mx-lg-4 button-extra my-1 my-md-0"
        @click="emits('send')"
      >
        <span> Enviar </span>
      </v-btn>
    </template>

    <!-- observado -->
    <template v-if="store_ref.franquicia?.estados?.id == 3">
      <v-btn
        v-if="VerifyRolesFn('ACTUALIZAR_OBSERVACION_FRANQUICIA')"
        height="45"
        variant="outlined"
        color="primary"
        class="mx-sm-4 px-7 my-4 my-1 my-md-0"
        @click="emits('save')"
      >
        <span> Guardar </span>
      </v-btn>
      <v-btn
        v-if="VerifyRolesFn('SOLVENTAR_FRANQUICIA')"
        height="45"
        color="success"
        class="mx-md-2 mx-lg-4 button-extra my-1 my-md-0"
        @click="emits('solvent')"
      >
        <span> Solventar </span>
      </v-btn>
    </template>

    <!-- solventar / revision -->
    <template
      v-if="
        store_ref.franquicia?.estados?.id == 2 ||
        store_ref.franquicia?.estados?.id == 4
      "
    >
      <v-btn
        v-if="VerifyRolesFn('PREVISUALIZAR_DOCUMENTO_FRANQUICIA')"
        height="45"
        color="lightBlue"
        class="mx-md-2 mx-lg-4 button-extra my-1 my-md-0"
        @click="emits('preview')"
      >
        <span> Previsualizar </span>
      </v-btn>
      <v-btn
        v-if="VerifyRolesFn('OBSERVAR_FRANQUICIA')"
        height="45"
        color="warning"
        class="mx-md-2 mx-lg-4 button-extra my-1 my-md-0"
        @click="emits('observe')"
      >
        <span> Observar </span>
      </v-btn>
      <v-btn
        v-if="VerifyRolesFn('ANULAR_FRANQUICIA')"
        height="45"
        color="red"
        class="mx-md-2 mx-lg-4 button-extra my-1 my-md-0"
        @click="emits('anulate')"
      >
        <span> Anular </span>
      </v-btn>
      <v-btn
        v-if="VerifyRolesFn('APROBAR_FRANQUICIA')"
        height="45"
        color="success"
        class="mx-md-2 mx-lg-4 button-extra my-1 my-md-0"
        @click="emits('approve')"
      >
        <span> Aprobar </span>
      </v-btn>
    </template>

    <!-- aprobar / firmado -->
    <template
      v-if="
        store_ref.franquicia?.estados?.id == 6 ||
        store_ref.franquicia?.estados?.id == 7
      "
    >
      <v-btn
        v-if="VerifyRolesFn('PREVISUALIZAR_DOCUMENTO_FRANQUICIA')"
        height="45"
        color="lightBlue"
        class="mx-md-2 mx-lg-4 button-extra my-1 my-md-0"
        @click="emits('preview')"
      >
        <span> Previsualizar </span>
      </v-btn>
      <v-btn
        :disabled="
          store_ref.fecha_importante.reporte == null &&
          store_ref.fecha_importante.entrega == null
        "
        v-if="VerifyRolesFn('GESTIONAR_FECHAS')"
        height="45"
        variant="outlined"
        color="primary"
        class="mx-md-4 px-7 my-4 my-1 my-md-0"
        @click="emits('saveDates')"
      >
        <span> Guardar </span>
      </v-btn>
      <v-btn
        v-if="VerifyRolesFn('ANULAR_FRANQUICIA')"
        height="45"
        color="red"
        class="mx-md-2 mx-lg-4 button-extra my-1 my-md-0"
        @click="emits('anulate')"
      >
        <span> Anular </span>
      </v-btn>
    </template>
  </v-col>
</template>

<script setup>
import { VerifyRolesFn } from "@/utils/global_functions";
import { useFrancqStore } from "../franquicias.store";

const store_ref = useFrancqStore();

const emits = defineEmits([
  "anulate",
  "approve",
  "observe",
  "preview",
  "save",
  "saveDates",
  "send",
  "solvent",
]);
</script>