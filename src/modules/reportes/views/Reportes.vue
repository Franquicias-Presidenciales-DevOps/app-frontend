<template>
  <div class="my-6">
    <v-card-title>
      <h1 class="d-flex justify-center justify-md-start">Reportes</h1>
    </v-card-title>
    <v-tabs
      v-model="tab"
      @update:modelValue="onTabChange"
      grow
      class="custom-tabs"
    >
      <v-tab value="one">
        <v-icon class="mr-2">mdi-file-document-outline</v-icon>
        Reporte diario</v-tab
      >
      <v-tab value="two">
        <v-icon class="mr-2">mdi-file-document-outline</v-icon>
        Reporte mensual
      </v-tab>
      <v-tab value="three">
        <v-icon class="mr-2">mdi-file-document-outline</v-icon>
        Reporte personalizado</v-tab
      >
      <v-tab value="four">
        <v-icon class="mr-2">mdi-check-decagram-outline</v-icon>
        Calificación de la entidad
      </v-tab>
    </v-tabs>

    <v-card-text>
      <v-tabs-window v-model="tab" rounded>
        <v-tabs-window-item value="one">
          <v-row justify="space-between" class="mt-1">
            <!-- Input para el día -->
            <v-col cols="12" sm="12" lg="4">
              <v-form ref="form_inputDiario">
                <date-component
                  v-model.trim="form_var.fecha_dia_var"
                  minDate="1950-01-01"
                  placeholder="Día"
                  label="Día"
                  :rules="RULES.fecha_inicio_var"
                />
              </v-form>
            </v-col>
            <!-- Botón para reporte diario -->
            <v-col cols="12" sm="4" lg="2">
              <v-btn
                class="text-none button-extra"
                ripple
                height="45"
                color="primary"
                type="submit"
                @click="validate(getListReportesDiarios, form_inputDiario)"
                text="Generar reporte"
              />
            </v-col>
            <v-spacer />
            <!-- Botón para descargar reporte diario -->
            <v-col
              cols="12"
              sm="4"
              lg="2"
              style="display: flex; justify-content: flex-end"
            >
              <v-btn
                class="green-button text-green"
                ripple
                height="45"
                @click="getDocumento"
                type="submit"
                text="Descargar"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" xl="12" sm="12" grow>
              <v-data-table-server
                v-model:items-per-page="per_page_var"
                :headers="HEADERS_DIARIO"
                :loading="loading"
                :items="list_diario"
                :items-length="total_list_diario"
                @update:options="getListReportesDiarios"
                disable-sort
                :mobile="smAndDown"
              >
                <template v-slot:[`item.documentos_transporte`]="{ item }">
                  <v-list class="lista-compacta">
                    <v-list-item
                      v-for="(documento, index) in item.documentos_transporte"
                      :key="index"
                    >
                      {{ index + 1 }}-{{ documento }}
                    </v-list-item>
                  </v-list>
                </template>
              </v-data-table-server>
            </v-col>
          </v-row>
        </v-tabs-window-item>

        <v-tabs-window-item value="two">
          <v-row justify="space-between" class="mt-1">
            <!-- Input para el mes -->
            <v-col cols="12" sm="12" lg="4">
              <v-form ref="form_input">
                <date-component2
                  v-model.trim="form_var.fecha_mes_var"
                  minDate="1950-01-01"
                  placeholder="Mes"
                  label="Mes"
                  :rules="RULES.fecha_inicio_var"
                />
              </v-form>
            </v-col>

            <!--Reporte mensual-->
            <v-col cols="12" sm="4" lg="2">
              <v-btn
                class="text-none button-extra"
                ripple
                height="45"
                color="primary"
                type="submit"
                @click="validate(getListReportesMensuales, form_input)"
                text="Generar reporte"
              />
            </v-col>
            <v-spacer />
            <!--Botón para descargar reporte mensual-->
            <v-col cols="12" sm="4" lg="2" class="d-flex justify-sm-end">
              <v-btn
                class="green-button text-green"
                ripple
                height="45"
                @click="getDocumento"
                type="submit"
                text="Descargar"
              />
            </v-col>
          </v-row>

          <v-row>
            <v-col cols="12" xl="12" sm="12" grow>
              <v-data-table-server
                v-model:items-per-page="per_page_var"
                :headers="HEADERS_MENSUAL"
                :loading="loading"
                :items="list_diario"
                :items-length="total_list_diario"
                @update:options="getListReportesDiarios"
                disable-sort
                :mobile="smAndDown"
              />
            </v-col>
          </v-row>
        </v-tabs-window-item>

        <v-tabs-window-item value="three">
          <v-row class="mt-1 d-flex justify-lg-space-between">
            <v-col cols="12" sm="12" lg="12">
              <v-form
                ref="form_inputPersonalizado"
                @submit.prevent="
                  validate(handleGenerateReport, form_inputPersonalizado)
                "
              >
                <v-row>
                  <!-- Input para la fecha de inicio -->
                  <v-col cols="12" sm="6" lg="3">
                    <date-component
                      v-model.trim="form_var.fecha_inicio_var"
                      minDate="1950-01-01"
                      placeholder="Ingresa la fecha inicio"
                      label="Fecha inicio"
                      :rules="RULES.fecha_inicio_var"
                      :max-date="form_var.fecha_fin_var"
                    />
                  </v-col>

                  <!-- Input para la fecha de fin -->
                  <v-col cols="12" sm="6" lg="3">
                    <date-component
                      v-model.trim="form_var.fecha_fin_var"
                      minDate="1950-01-01"
                      placeholder="Ingresa la fecha fin"
                      label="Fecha fin"
                      :min-date="form_var.fecha_inicio_var"
                      :rules="RULES.fecha_fin_var"
                    />
                  </v-col>

                  <!-- Botón para reporte personalizado -->
                  <v-col cols="12" sm="6" lg="2">
                    <v-btn
                      class="text-none button-extra"
                      ripple
                      height="45"
                      color="primary"
                      type="submit"
                      text="Generar reporte"
                    />
                  </v-col>
                  <v-spacer />
                  <!-- Botón para descargar reporte personalizado -->
                  <v-col cols="12" sm="6" lg="2">
                    <v-btn
                      v-if="list_diario.length > 0"
                      class="green-button text-green"
                      height="45"
                      @click="getDocumento"
                      type="submit"
                      text="Descargar"
                    />
                  </v-col>
                </v-row>
              </v-form>
            </v-col>
          </v-row>

          <v-row> </v-row>
          <v-row>
            <v-col cols="12" xl="12" sm="12" grow>
              <v-data-table-server
                v-if="list_diario.length > 0"
                v-model:items-per-page="per_page_var"
                :headers="HEADERS_PERSONALIZADO"
                :loading="loading"
                :items="list_diario"
                :items-length="total_list_diario"
                @update:options="getListReportesPersonalizado"
                disable-sort
                :mobile="smAndDown"
              />
            </v-col>
          </v-row>
        </v-tabs-window-item>

        <v-tabs-window-item value="four">
          <tab-calificacion />
        </v-tabs-window-item>
      </v-tabs-window>
    </v-card-text>
  </div>
</template>

<script setup>
import { DateFormatFn, DateFormattedFn } from "@/utils/global_functions";
import { useDisplay } from "vuetify";
import { useReportes } from "../composables/useReportes";
import { ref, reactive, watch } from "vue";
import TabCalificacion from "../components/TabCalificacion.vue";
const { smAndDown } = useDisplay();
const {
  form_input,
  form_inputDiario,
  form_inputPersonalizado,
  per_page_var,
  loading,

  RULES,
  validate,
  total_list_diario,
  tab,
  form_var,
  list_diario,

  HEADERS_DIARIO,
  HEADERS_MENSUAL,
  HEADERS_PERSONALIZADO,
  HEADERS_ENTIDADES,
  getDocumento,
  onTabChange,
  getListReportesDiarios,
  getListReportesMensuales,
  getListReportesPersonalizado,
} = useReportes();

const handleGenerateReport = () => {
  const fechaInicio = form_var.fecha_inicio_var;
  const fechaFin = form_var.fecha_fin_var;

  if (fechaInicio && fechaFin && fechaFin < fechaInicio) {
    return;
  }

  // Si la validación pasa, llama a la función para generar el reporte
  getListReportesPersonalizado();
};
</script>

<style lang="scss" scoped>
.green-button {
  border: 1px solid #13c296;
  width: 100%; /* Asegura que el botón ocupe todo el ancho del contenedor */
}

.text-none {
  text-transform: none;
}

.button-extra {
  width: 100%;
}

.ga-4 {
  gap: 16px;
}

@media (max-width: 600px) {
  .flex-column {
    flex-direction: column;
  }
}

.v-tab {
  border: thin solid gray;
}
</style>
