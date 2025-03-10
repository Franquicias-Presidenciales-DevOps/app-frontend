<template>
  <v-container fluid>
    <!-- Encabezado de la pagina -->
    <v-row class="d-flex my-6 mx-1  justify-center align-center">
      <v-col cols="6" xs="6" sm="6" align="start">
        <h1 class="text-primary title-text"> Detalle de seguimiento </h1>
      </v-col>
      <!-- Boton regresar -->
      <v-col cols="6" xs="6" sm="6" style="display: flex; justify-content: end; align-items: end">
        <v-btn class="text-none button-extra" ripple height="45" color="primary" variant="outlined"
          @click="backToListView">
          Regresar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Detalles-->
    <v-card class="ma-5 px-5 py-2" :elevation="smAndDown ? 1 : 0">
      <v-row>

        <!-- N° de seguimiento -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>N° de seguimiento</span>
          <span class="detail">{{ numeroSeguimiento ?? "-" }}</span>
        </v-col>

        <!-- Entidad -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>Entidad</span>
          <span class="detail">{{ entidadNombre ?? "-" }}</span>
        </v-col>

        <!-- Código franquicia -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>Código de franquicia</span>
          <span class="detail">{{ codigoFranquicia ?? "-" }}</span>
        </v-col>

        <!-- Totales -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>Total de reportes</span>
          <span class="detail">{{ totalReportes ?? "-" }}</span>
        </v-col>

        <!-- Total con observacion -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>Total con observaciones</span>
          <span class="detail">{{ totalConObs ?? "-" }}</span>
        </v-col>

        <!-- Total sin observacion -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>Total sin observaciones</span>
          <span class="detail">{{ totalSinObs ?? "-" }}</span>
        </v-col>

      </v-row>
    </v-card>

    <!-- Reportes -->
    <v-card elevation="0" class="py-2">

      <!-- Titulo y botones de imprimir y agregar-->
      <v-card-title class="mb-3">
        <v-row class="reportBtnsRow">
          <v-col cols="12" xs="12" sm="6" md="6" lg="6">
            <h2 class="text-primary reportTitle">Reportes</h2>
          </v-col>
          <v-col class="reportNbtns" cols="12" xs="12" sm="6" md="6" lg="6">
            <v-btn ripple height="45" color="primary" class="upperBtns" :disabled="!entidadNombre && !codigoFranquicia"
              @click="addReportFn">
              <v-icon class="mr-2">mdi-file-plus-outline</v-icon> Agregar reporte
            </v-btn>
            <v-btn ripple height="45" color="primary" variant="outlined" class="upperBtns"
              v-if="VerifyRolesFn('IMPRIMIR_REPORTES_VISITA_CAMPO')"
              @click="printAllReports(ruta.currentRoute._value.params.id)">
              <v-icon class="mr-2">mdi-printer-outline</v-icon>Imprimir todos
            </v-btn>
          </v-col>
        </v-row>
      </v-card-title>

      <!-- Tarjetas de reportes-->
      <v-card-text v-for="reporte in reportesArray" :key="reporte.id" style="max-height: 200px;">
        <v-row>

          <!-- Icono de estado -->
          <v-col cols="2" xs="2" sm="1" md="1" lg="1" class="iconLine" style="margin-top: 15px;">

            <v-btn v-if="reporte.categoria == 'Sin observaciones'" class="sideIcon" readonly color="success"
              density="default" icon="mdi-check-circle" variant="tonal"></v-btn>

            <v-btn v-if="reporte.categoria == 'Con observaciones'" class="sideIcon" readonly color="warning"
              density="default" icon="mdi-alert-circle" variant="tonal"></v-btn>


              <v-divider v-if="reporte.id == lastReporte.id" thickness="0" opacity="0" vertical
              style="margin: auto;"></v-divider>

            <v-divider v-else-if="reporte.id == firstReporte.id" :thickness="4" vertical style="margin: auto;"></v-divider>



            <v-divider v-else-if="reporte.id == lastReporte.id" thickness="0" opacity="0" vertical
              style="margin: auto;"></v-divider>
            <v-divider v-else :thickness="4" vertical style="margin: auto;"></v-divider>

          </v-col>

          <!-- detalle de reporte -->
          <v-col cols="10" xs="10" sm="11" md="11" lg="11">
            <v-card elevation="3" style="height: 180px;">
              <v-card-title>
                <!-- Encabezado y fecha-->
                <v-row>
                  <v-col cols="12" xs="12" sm="6" md="7" lg="7" class="EstadoSpan">
                    <span v-if="reporte.categoria == 'Sin observaciones'" style="color: green;">
                      <v-icon class=" mb-1" size="x-small" color="success">mdi-check-circle</v-icon>
                      {{ reporte.categoria }}
                    </span>
                    <span v-else color="warning" style="color: orange;">
                      <v-icon class="mb-1" size="x-small" color="warning">mdi-alert-circle</v-icon>
                      {{ reporte.categoria }}
                    </span>

                  </v-col>
                  <v-col cols="12" xs="12" sm="6" md="5" lg="5" class="dateSpan" style="gap: 5px;">
                    <span class="text-primary" v-if="mdAndUp">Fecha de visita: </span>
                    <span class="text-primary">{{ DateFormatFn(reporte.fecha) }}</span>
                  </v-col>
                </v-row>
              </v-card-title>

              <!-- detalle -->
              <v-card-text class="reporteContent">
                <v-row class="reporteContent">

                  <!-- detalle en vista mobile extra small-->
                  <v-col v-if="xs" cols="12" xs="12" sm="9" md="10" lg="10">
                    <span
                      v-html="reporte.detalle.length > 42 ? reporte.detalle.substring(0, 42) + '...' : reporte.detalle"></span>
                  </v-col>

                  <!-- detalle en vista mobile y tablet-->
                  <v-col v-else-if="mobile" cols="12" xs="12" sm="8" md="9" lg="9" style="padding-left: 20px;">
                    <span
                      v-html="reporte.detalle.length > 100 ? reporte.detalle.substring(0, 150) + '...' : reporte.detalle"></span>
                  </v-col>

                  <!-- detalle en vista desktop up-->
                  <v-col v-else-if="mdAndUp" cols="12" xs="12" sm="8" md="9" lg="9" style="padding-left: 20px;">
                    <span
                      v-html="reporte.detalle.length > 350 ? reporte.detalle.substring(0, 500) + '...' : reporte.detalle"></span>
                  </v-col>

                  <!-- detalle en vista mobile small-->
                  <v-col v-else-if="smAndDown" cols="12" xs="12" sm="8" md="9" lg="9" style="padding-left: 20px;">
                    <span
                      v-html="reporte.detalle.length > 100 ? reporte.detalle.substring(0, 150) + '...' : reporte.detalle"></span>
                  </v-col>

                  <!-- Botones de detalles e imprimir -->
                  <v-col cols="12" xs="12" sm="4" md="3" lg="3" class="cardsnBtns">

                    <v-btn ripple color="primary" class="detailsBtn" @click="goToDetails(reporte.id)">
                      <v-icon class="mr-1">mdi-clipboard-outline</v-icon>Detalle
                    </v-btn>

                    <v-btn ripple color="primary" variant="outlined" class="detailsBtn"
                      v-if="VerifyRolesFn('IMPRIMIR_REPORTE_VISITA_CAMPO')" @click="printReport(reporte.id)">
                      <v-icon class="mr-1">mdi-printer-outline</v-icon>Imprimir
                    </v-btn>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

  </v-container>
</template>

<script setup>

import { useDetallesSeguimiento } from "../composables/useDetallesSeguimiento";
import { useDisplay } from "vuetify";
import { onMounted } from "vue";
import { DateFormatFn } from "@/utils/global_functions";
import { VerifyRolesFn } from "@/utils/global_functions";

const { smAndDown, xs, mobile, mdAndUp } = useDisplay();
const {
  numeroSeguimiento,
  entidadNombre,
  codigoFranquicia,
  totalReportes,
  totalConObs,
  totalSinObs,
  reportesArray,
  firstReporte,
  lastReporte,
  ruta,
  store_ref,
  addReportFn,

  getDetallesSeguimiento,
  printAllReports,
  printReport,
  backToListView,
  goToDetails,
} = useDetallesSeguimiento();

onMounted(() => {
  getDetallesSeguimiento(ruta.currentRoute._value.params.id);
});

</script>

<style lang="scss" scoped>
.detalles-seguimiento {
  display: flex;
  flex-direction: column;
  justify-content: center;
  color: #223E69;
}

.detail {
  color: #637381;
  font-weight: 700;
}

.reportNbtns {
  display: flex;
  justify-content: end;
  gap: 5px;
}

.detailsBtn {
  height: 45px;
  width: 100%;
  margin-bottom: 5px;
}

.iconLine {
  display: flex;
  align-items: center;
  flex-direction: column;
  margin-top: 15px;
  padding-bottom: 0;
  overflow-y: overlay;
  height: 213px;
}

.dateSpan {
  font-size: calc(12px + 0.5vw);
  display: flex;
  justify-content: end;
}

.reporteContent {
  display: flex;
  font-size: 12px;
  max-height: 132px;
  overflow: hidden;
}

@media screen and (max-width: 850px) {

  .sideIcon {
    height: 30px;
  }

  .dateSpan {
    display: flex;
    justify-content: end;
  }
}

@media screen and (max-width: 670px) {

  .dateSpan {
    font-size: 12px;
  }

  .sideIcon {
    height: 20px;
  }

  .reportTitle {
    font-size: 26px
  }
}

@media screen and (max-width: 620px) {
  .reportTitle {
    display: none;
    width: 0%;
  }

  .reportBtnsRow {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-left: 140px;
  }


}


@media screen and (max-width: 599px) {

  .dateSpan {
    display: flex;
    justify-content: start;
  }

  .sideIcon {
    height: 50px;
  }

  .detailsBtn {
    font-size: 3px;
    width: 90px;
    height: fit-content;
  }

  .cardsnBtns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .reportTitle {
    display: none;
  }

  .title-text {
    font-size: 24px;
  }

  .detalles-seguimiento {
    font-size: 12px;
  }

  .reportNbtns {
    display: flex;
    justify-content: center;
  }

  .reporteContent {
    display: flex;
    flex-direction: column-reverse;
    font-size: 12px;
    max-height: 132px;
    overflow: hidden;
  }


  .EstadoSpan {
    font-size: 19px;
    padding-bottom: 0%;
    padding-left: 0%;
  }

  .reportBtnsRow {
    display: flex;
    flex-direction: column-reverse;
    align-items: center;
    margin-left: 0;
  }

}

@media screen and (max-width: 400px) {

  .sideIcon {
    height: 30px;
    width: 30px;
  }

  .upperBtns {
    width: 130px;
  }

  .title-text {
    font-size: 22px;
  }


}
</style>
