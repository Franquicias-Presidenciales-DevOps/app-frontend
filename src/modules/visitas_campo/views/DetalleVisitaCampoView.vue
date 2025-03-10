<template>
  <v-container fluid>
    <!-- Encabezado de la pagina -->
    <v-row class="mt-6">
      <v-col cols="12" xs="12" sm="12" lg="12" class="title-text">
        <h1 class="text-primary "> Visita de campo</h1>
      </v-col>
    </v-row>

    <v-row>
      <!-- Chip de estado -->
      <v-col cols="12" xs="12" sm="6" md="6" lg="6" class="estadoChip">
        <v-chip :color="category === 1 ? 'success' : 'warning'" class="text-none" height="45" width="200"
          v-if="isLoaded && category">
          {{ category === 1 ? 'Sin obervaciones' : 'Con observaciones' }}
        </v-chip>
        <!--<v-chip class="text-none" height="45" width="200"
          v-else>
          Sin categoria asignada
        </v-chip>-->
      </v-col>
      <!-- Boton regresar -->
      <v-col cols="12" xs="12" sm="6" md="6" lg="6" class="reportNbtns">
        <v-btn class="text-none button-extra" ripple height="45" color="primary" width="140"
          :disabled="estado === 'Borrador'" @click="printReport(ruta.currentRoute._value.params.id)">
          <v-icon class="mr-1">mdi-printer</v-icon>
          Imprimir
        </v-btn>
        <v-btn class="text-none button-extra" ripple height="45" color="primary" variant="outlined" width="140"
          v-if="store_ref.seguimientoFlag && store_ref.seguimientoId" @click="backToSeguimiento">
          Regresar
        </v-btn>
        <v-btn class="text-none button-extra" ripple height="45" color="primary" variant="outlined" width="140" v-else
          @click="backToListView">
          Regresar
        </v-btn>
      </v-col>
    </v-row>

    <!-- Detalles-->
    <v-row>
      <v-col cols="12" class="informacion-general text-primary">
        <h2 class="text-primary">Información general</h2>
      </v-col>
    </v-row>

    <!-- Mas detalles -->
    <v-card class="mt-10 moreDetails" :elevation="smAndDown ? 1 : 0">
      <v-row v-if="isLoaded">
        <!-- Correlativo -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>Correlativo</span>
          <span class="detail">{{ correlativo ?? '-' }}</span>
        </v-col>

        <!-- Número de seguimiento -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>N° de seguimiento</span>
          <span class="detail">{{ numero_seguimiento ?? '-' }}</span>
        </v-col>

        <!-- Código franquicia -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>Código de franquicia</span>
          <span class="detail">{{ franquicia ?? '-' }}</span>
        </v-col>

        <!-- Entidad -->
        <v-col cols="6" xs="6" sm="6" md="3" lg="3" class="detalles-seguimiento">
          <span>Entidad</span>
          <span class="detail">{{ entidad.nombre ?? '-' }}</span>
        </v-col>

        <!-- Fecha de visita -->
        <v-col cols="6" xs="6" sm="6" md="2" lg="2" class="detalles-seguimiento">
          <span>Fecha de visita</span>
          <span class="detail">{{ date_vist_camp ? DateFormatFn(date_vist_camp) : '-' }}</span>
        </v-col>

      </v-row>
    </v-card>

    <!-- Reporte -->
    <v-card elevation="0" class="mt-10">

      <!-- Titulos -->
      <v-card-title class="mb-3 px-0 mx-0">
        <v-row class="reportBtnsRow">
          <v-col cols="12" xs="12" sm="12" md="12" lg="12">
            <h2 class="text-primary reportTitle" v-if="detalles">Detalles</h2>
          </v-col>
          <v-col cols="12" xs="12" sm="12" md="12" lg="12" v-if="detalles">
            <span class="text-primary" style="font-size:large">Comentarios</span>
          </v-col>
        </v-row>
      </v-card-title>

      <!-- Cuerpo -->
      <v-card-text class="px-0 mx-0 mb-5">
        <v-row>
          <!-- Texto -->
          <v-col class="pt-0" cols="12" v-if="detalles">

            <div v-html="detalles" style="color: #637381; text-align: justify;"></div>

          </v-col>

          <!-- Personas -->
          <v-col cols="12" v-if="list_names.length > 0">
            <span class="text-primary" style="font-size:large">Nombre(s) Jurídico/Natural</span><br>
            <span v-for="name in list_names" :key="name" class="detail"><br>{{ name.name }}</span>
          </v-col>

          <!-- Imagenes -->
          <v-col cols="12" v-if="list_files.length > 0">
            <h2 class="text-primary">Documentos adjuntos</h2>
          </v-col>
          <v-col v-for="(file, index) in list_files" cols="12" sm="6" md="4" lg="2" xl="2" class="d-flex justify-center"
            :key="index">
            <div class="image-container" @click="ToggleVisibilityFn(index)">
              <v-img cover :lazy-src="file.url" :src="file.url" style="border-radius: 15px" height="250">
              </v-img>
              <v-fade-transition>
                <div v-if="isVisible(index)" class="overlay">
                  <div class="d-flex flex-column container_file">
                    <!-- Visualizar -->
                    <v-btn height="45" color="info" class="rounded-xl mb-6 elevation-0" text="Visualizar"
                      @click="openShowModal(file)" />
                    <!-- Descargar -->
                    <v-btn height="45" color="primary" class="rounded-xl elevation-0" text="Descargar"
                      @click="downloadFile(file)" />
                  </div>
                </div>
              </v-fade-transition>
            </div>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <!-- Modal imagen -->
    <v-dialog v-model="isOpen" max-width="900">
      <v-card>
        <v-card-title class="headline">
        </v-card-title>
        <v-card-text>
          <v-row>
            <v-col cols="12" class="d-flex justify-center">
              <v-img :src="imageToShow" max-height="900" />
            </v-col>
          </v-row>
        </v-card-text>
        <v-card-actions>
          <v-btn color="primary" text @click="isOpen = false">Cerrar</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup>

import { useDetallesVisita } from '../composables/useDetallesVisita';
import { useDisplay } from "vuetify";
import { onMounted, onUnmounted } from "vue";
import { DateFormatFn } from '@/utils/global_functions';

const { smAndDown } = useDisplay();

const {
  entidad,
  franquicia,

  date_vist_camp,
  category,
  list_files,
  list_names,
  isLoaded,
  ruta,
  imageToShow,

  numero_seguimiento,
  correlativo,
  detalles,
  store_ref,
  isOpen,
  estado,
  getVisitaCampo,
  printReport,
  isVisible,
  ToggleVisibilityFn,
  openShowModal,
  downloadFile,
  backToListView,
  backToSeguimiento,
} = useDetallesVisita();

onMounted(() => {
  getVisitaCampo(ruta.currentRoute._value.params.id)
});

onUnmounted(() => {
  store_ref.seguimientoFlag = false;
  store_ref.seguimientoId = null;
});

</script>

<style lang="scss" scoped>
.detalles-seguimiento {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

:deep(ul){
  margin-left: 45px;
  padding-left: 0;
}

.overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(5px);
  border-radius: 15px;
}

.image-container {
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  width: 100%;
  cursor: pointer;
}

.informacion-general {
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.title-text {
  font-size: 25px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.detail {
  margin-top: 15px;
  color: #637381;
  font-weight: 100;
}

.reportNbtns {
  display: flex;
  justify-content: end;
  gap: 5px;
}

.estadoChip {
  display: flex;
  justify-content: start;
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
}

.reportTitle {
  font-size: x-large;
}



@media screen and (max-width: 960px) {
  .moreDetails {
    padding: 15px;
  }
}

@media screen and (max-width: 599px) {


  .detailsBtn {
    font-size: 8%;
    width: fit-content;
    height: fit-content;
  }

  .title-text {
    font-size: 16px;
    display: flex;
    justify-content: start;
    align-items: start;
    margin-left: 10px;
  }

  .cardsnBtns {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 5px;
  }

  .detalles-seguimiento {
    font-size: 13px;
  }

  .informacion-general {
    margin-left: 10px;
  }

  .reportNbtns {
    display: flex;
    justify-content: center;
  }

  .dateSpan {
    font-size: 12px;
    padding-top: 0%;
  }

  .EstadoSpan {
    font-size: 20px;
    padding-bottom: 0%;
  }

  .reportBtnsRow {
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .estadoChip {
    display: flex;
    justify-content: start;
    margin-left: 10px;
  }

}

@media screen and (max-width: 400px) {

  .sideIcon {
    height: 30px;
  }


}
</style>
