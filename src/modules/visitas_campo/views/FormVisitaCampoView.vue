<template>
  <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Aref+Ruqaa|Mirza|Roboto" />
  <v-container fluid>
    <!-- Title -->
    <v-row>
      <v-col cols="12" class="d-flex justify-center mt-10">
        <span class="title-list-view text-primary" v-text="'Visita de campo'" />
      </v-col>
    </v-row>

    <!-- informacion -->
    <v-row v-if="editMode">
      <v-col cols="12" sm="6" md="6">
        <span class="text-primary text-h6 font-weight-bold">
          Número de seguimiento: {{ numero_seguimiento }}
        </span>
      </v-col>
      <v-col cols="12" sm="6" md="6">
        <span class="text-primary text-h6 font-weight-bold">
          Correlativo: {{ editMode ? correlativo : 'Nuevo' }}
        </span>
      </v-col>
    </v-row>

    <!-- Form -->
    <v-row>
      <v-col cols="12" sm="6" md="5">
        <v-autocomplete label="Entidad*" v-model="entidad" :items="entidades" item-title="nombre" return-object
          item-value="id" :rules="RULES.entidad" @update:model-value="getFranquicia"
          :disabled="editMode || store_ref.checkEntidad" />
      </v-col>

      <v-col cols="12" sm="6" md="3">
        <v-autocomplete :disabled="!entidad || editMode || store_ref.checkFranquicia" label="No. Franquicia*"
          v-model="franquicia" :items="franquicias" item-title="codigo_provisional" item-value="id"
          :rules="RULES.n_franquicia" />
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <date-component label="Fecha de visita*" v-model="date_vist_camp" :rules="RULES.date_vist_camp"
          minDate="2019-01-01" :maxDate="today" />
      </v-col>

      <v-col cols="12" sm="6" md="2">
        <v-autocomplete label="Categoría*" v-model="category" :items="categorias" item-title="nombre" item-value="id"
          :rules="RULES.category" />
      </v-col>

      <!-- Texto enriquecido -->
      <v-col cols="12">
        <span>Detalle</span>
        <VuetifyTiptap output="html" v-model="content" rounded :extensions="extensions" style="border: solid thin #adadad;
          border-radius: 5px; color:#000000;" ref="VuetifyTiptapRef" max-height="375px" :model-value="editContent"
          @change="checkContent(content)">
          <!-- Bottom slot personalizar footer del editor -->
          <template v-slot:bottom>
            <v-row>
              <v-col cols="12" class="d-flex justify-end">
              </v-col>
            </v-row>
          </template>
        </VuetifyTiptap>


      </v-col>

    </v-row>

    <!-- Archivos y nombres -->

    <v-row>

      <v-col cols="12" class="mb-0 pb-0">
        <span>Archivos adjuntos</span>
      </v-col>

      <!-- Archivos -->
      <v-col cols="12" md="6">
        <v-form class="d-flex justify-center align-center mb-5" ref="form_files">
          <v-row>
            <v-col cols="12" sm="12" md="9" lg="9">
              <v-file-input label="Seleccionar archivo" prepend-icon="" v-model="file_vist_camp" :rules="RULE_FILE"
                show-size="1000" :disabled="list_files.length >= 25" appendInnerIcon="mdi-upload"
                accept="image/jpeg, image/png, image/jpg" />
            </v-col>
            <v-col cols="12" sm="12" md="3" lg="3">
              <v-btn :disabled="!file_vist_camp" color="primary" variant="outlined" text="Agregar" height="48"
                @click="AddFileFn(file_vist_camp)" width="100%" />
            </v-col>
          </v-row>
        </v-form>

        <v-data-table :items="list_files" :headers="[
          { title: 'Archivo', value: 'file.name', align: 'center' },
          { title: 'Acciones', value: 'actions', sortable: false, align: 'center' }
        ]" hide-default-footer :items-per-page="-1" disable-sort>
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon="mdi-file-outline" variant="plain" v-tooltip:bottom="'Ver'" @click="openShowModal(item)" />

            <v-btn icon="mdi-trash-can-outline" variant="plain" v-tooltip:bottom="'Eliminar'"
              @click="DeleteFileFn(item)" />
          </template>
        </v-data-table>
      </v-col>

      <!-- Nombres -->
      <v-col cols="12" md="6">
        <v-form class="d-flex justify-center align-center mb-5" ref="form_names" @submit.prevent="AddNameFn">
          <v-row>
            <v-col cols="12" sm="12" md="9" lg="9">
              <v-text-field label="Nombre" v-model="name_vist_camp" :rules="RULE_NAME" maxlength="150"
                :disabled="list_names.length >= 25" />
            </v-col>
            <v-col cols="12" sm="12" md="3" lg="3">
              <v-btn :disabled="!name_vist_camp" color="primary" variant="outlined" text="Agregar" height="48"
                @click="AddNameFn" width="100%" />
            </v-col>
          </v-row>
        </v-form>
        <v-data-table :items="list_names" :headers="[
          { title: 'Nombre', value: 'name', align: 'center' },
          { title: 'Acciones', value: 'actions', sortable: false, align: 'center' }
        ]" hide-default-footer :items-per-page="-1">
          <template v-slot:[`item.actions`]="{ item }">
            <v-btn icon="mdi-trash-can-outline" variant="plain" v-tooltip:bottom="'Eliminar'"
              @click="DeleteNameFn(item)" />
          </template>
        </v-data-table>
      </v-col>

    </v-row>

    <!-- Botones -->
    <v-row class="d-flex justify-center" style="margin-bottom: 12px;">
      <!-- Cancelar -->
      <v-col cols="12" sm="4" md="4" lg="2" class="d-flex bottomButtonsContainer">
        <v-btn variant="outlined" color="primary" @click="confirmModalOption(1)" class="px-10 bottomButtons"
          height="48">Cancelar</v-btn>
      </v-col>

      <!-- Borrador -->
      <v-col cols="12" sm="4" md="4" lg="2" class="d-flex bottomButtonsContainer" v-if="estado != 'Finalizado'">
        <v-btn variant="outlined" color="primary" @click="confirmModalOption(2)" class="px-10 bottomButtons"
          :disabled="!entidad || !franquicia" height="48">Borrador</v-btn>
      </v-col>

      <!-- Confirmar -->
      <v-col cols="12" sm="4" md="4" lg="2" class="d-flex bottomButtonsContainer">
        <v-btn color="primary" @click="confirmModalOption(3)" class="px-10 bottomButtons" height="48"
          :disabled="!entidad || !franquicia || !date_vist_camp || !category || !hasContent">Confirmar</v-btn>
      </v-col>

    </v-row>

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

    <modal-confirmation-component show-cancel :title="confirmModalData.title" v-model="isConfirmModal"
      :subtitle="confirmModalData.message" @accept="confirmAction(confirmModalData.option)"
      @cancel="isConfirmModal = false">
    </modal-confirmation-component>

  </v-container>
</template>


<script setup>
import useFormVistCamp from '../composables/useFormVistCamp'
import { useDisplay } from 'vuetify'
import { onMounted } from 'vue'
import useTipTap from '../composables/useTipTap'
import { VuetifyTiptap, VuetifyViewer } from 'vuetify-pro-tiptap'
import { isCancel } from 'axios'


const { smAndDown } = useDisplay()

const {
  extensions,
  content,
} = useTipTap()

const {
  entidad,
  franquicia,
  date_vist_camp,
  category,
  file_vist_camp,
  name_vist_camp,
  list_files,
  list_names,
  RULES,
  RULE_FILE,
  RULE_NAME,
  form_files,
  form_names,
  entidades,
  franquicias,
  categorias,
  VuetifyTiptapRef,
  ruta,
  today,
  isOpen,
  isConfirmModal,
  imageToShow,
  confirmModalData,
  correlativo,
  editMode,
  editContent,
  numero_seguimiento,
  estado,
  hasContent,
  store_ref,
  confirmModalOption,
  getFranquicia,
  FetchEntidadesFn,
  FetchCategoriasFn,
  confirmAction,
  DeleteFileFn,
  DeleteNameFn,
  AddFileFn,
  AddNameFn,
  openShowModal,
  getVisitaCampo,
  checkContent,
} = useFormVistCamp()

onMounted(() => {
  FetchEntidadesFn()
  FetchCategoriasFn()

  if (ruta.currentRoute._value.name == 'editarVisitaCampo') {
    getVisitaCampo(ruta.currentRoute._value.params.id)
  }
})

</script>

<style lang="scss" scoped>
#editor {
  font-family: sans-serif;
  font-size: 18px;
  height: 375px;
}

:deep(.vuetify-pro-tiptap-editor__content.markdown-theme-default) {
  --cyanosis-strong-color: #000000;
  --cyanosis-em-color: #000000;
}

.bottomButtonsContainer {
  justify-content: space-around;
}

:deep(.v-data-table__th) {
  color: white;
  background-color: #1c1e4d;
}

:deep(.v-field__input) {
  overflow: hidden;
}

@media screen and (max-width: 599px) {

  .bottomButtonsContainer {
    justify-content: center;
  }

  .bottomButtons {
    width: 100%;
  }

  .title-list-view {
    font-size: 2.1rem;
  }

}
</style>
