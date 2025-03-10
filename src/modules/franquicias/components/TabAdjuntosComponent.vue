<template>
  <v-row class="my-12">
    <v-col
      cols="12"
      sm="9"
      md="7"
      lg="5"
      class="mx-auto text-center"
      v-if="
        VerifyRolesFn('SUBIR_ARCHIVOS_FRANQUICIA') &&
        franq_store.franquicia?.estado == 6
      "
    >
      <drag-and-drop-component v-model="files_adjuntos" />
      <v-btn
        :disabled="files_adjuntos.length === 0"
        height="45"
        color="primary"
        class="button-extra mt-6"
        @click="SendFilesFn"
      >
        <span> Agregar adjunto </span>
      </v-btn>
    </v-col>

    <v-col cols="12" class="px-0">
      <v-row>
        <v-col
          cols="12"
          sm="6"
          md="4"
          lg="3"
          v-for="(file, index) in files_franqucias"
          :key="index"
          class="d-flex flex-column align-center text-center"
        >
          <v-spacer />
          <div
            class="image-container mx-auto"
            @click="ToggleVisibilityFn(index)"
          >
            <img :src="GetCoverFn(file)" />
            <v-fade-transition>
              <div v-if="isVisible(index)" class="overlay">
                <div class="d-flex flex-column container_file">
                  <v-btn
                    height="45"
                    color="info"
                    class="rounded-xl mb-6 elevation-0"
                    text="Visualizar"
                    @click="HandlerActionFn(file)"
                  />
                  <v-btn
                    v-if="VerifyRolesFn('ELIMINAR_ARCHIVOS_FRANQUICIA')"
                    height="45"
                    color="red"
                    class="rounded-xl elevation-0"
                    @click="DeleteFileFn(file)"
                  >
                    <span>Eliminar</span>
                  </v-btn>
                </div>
              </div>
            </v-fade-transition>
          </div>
          <span class="text-wrap px-lg-3 font-weight-bold" v-text="file.filename" />
          <span v-text="file.fecha_creacion" />
        </v-col>
      </v-row>
    </v-col>
  </v-row>

  <v-dialog width="500" v-model="show_modal">
    <v-card :title="image_title">
      <v-card-text class="d-flex flex-column">
        <img :src="image_base64" />
      </v-card-text>

      <v-card-actions class="d-flex flex-row justify-center">
        <v-btn
          class="ml-md-4 button-extra"
          color="primary"
          height="40"
          variant="outlined"
          @click="
            show_modal = false;
            image_base64 = null;
            image_title = '';
          "
          text="Cerrar"
        />
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import { useUtilsStore } from "@/store/utils";
import { useFrancqStore } from "../franquicias.store";
import franquicia_service from "@/services/franquicias.services";
import { VerifyRolesFn } from "@/utils/global_functions";

const route = useRoute();
const utils_store = useUtilsStore();
const franq_store = useFrancqStore();
const showOverlay = ref(null);
const files_adjuntos = ref([]);
const files_franqucias = ref([]);
const show_modal = ref(false);
const image_base64 = ref(null);
const image_title = ref("");

function GetCoverFn(file) {
  if (file.extension === "pdf") {
    return new URL("@/assets/img/cover_file.png", import.meta.url).href;
  } else {
    return `data:image/png;base64,${file.content_file}`;
  }
}

function isVisible(index) {
  return showOverlay.value === index;
}

function ToggleVisibilityFn(index) {
  showOverlay.value = showOverlay.value === index ? null : index;
}

async function HandlerActionFn(file) {
  const response = await franquicia_service.getInfoFile(file.id);

  if (response.status === 200) {
    if (file.extension === "pdf") {
      FetchDocumentFn(response.data);
    } else {
      image_title.value = file.filename;
      image_base64.value = `data:image/png;base64,${response.data.content_file}`;
      show_modal.value = true;
    }
  }
}

function FetchDocumentFn(data) {
  // Crear un enlace de datos a partir de la cadena base64
  const linkSource = `data:application/pdf;base64,${data.content_file}`;

  // Separar el prefijo de la cadena base64
  const base64String = linkSource.split(",")[1];

  // Convertir la cadena base64 a un array de bytes
  const byteCharacters = atob(base64String);
  const byteNumbers = new Array(byteCharacters.length);
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  const byteArray = new Uint8Array(byteNumbers);

  // Crear un Blob a partir del array de bytes
  const blob = new Blob([byteArray], { type: "application/pdf" });

  // Crear una URL de objeto a partir del Blob
  const blobUrl = URL.createObjectURL(blob);

  // Abrir la URL en una nueva pestaña
  window.open(blobUrl, "_blank");
}

async function SendFilesFn() {
  if (files_franqucias.value.length > 25) {
    utils_store.setNotification({
      type: "error",
      message: "Se ha alcanzado el límite de archivos adjuntos",
      timeout: 3000,
    });

    return;
  }

  const formData = new FormData();

  formData.append("franquicia_id", route.params.id);
  formData.append("archivo", Array.from(files_adjuntos?.value).at(0));
  // multiple files
  // Array.from(files_adjuntos?.value).forEach((file) => {
  //   formData.append("archivo[]", file);
  // });

  const { data, status } = await franquicia_service.postFiles(formData);

  if (status === 201) {
    utils_store.setNotification({
      type: "success",
      message: data.message,
      timeout: 3000,
    });

    files_adjuntos.value = [];

    GetFilesByFranqFn();
  }
}

async function DeleteFileFn(file) {
  const { data, status } = await franquicia_service.deleteFile(file.id);

  if (status === 200) {
    utils_store.setNotification({
      type: "success",
      message: data.message,
      timeout: 3000,
    });

    // GetFilesByFranqFn();
    // delete file from array
    files_franqucias.value = files_franqucias.value.filter(
      (item) => item.id !== file.id
    );

    showOverlay.value = null;
  }
}

async function GetFilesByFranqFn() {
  const { data, status } = await franquicia_service.getFilesByFranq(
    route.params.id
  );

  if (status === 200) {
    files_franqucias.value = data.documentos;

    if (data.errores.length > 0) {
      data.errores.forEach((error) => {
        utils_store.setNotification({
          type: "error",
          message: error,
          timeout: 3000,
        });
      });
    }
  }
}

onMounted(() => {
  GetFilesByFranqFn();
});
</script>

<style lang="scss" scoped>
.image-container {
  position: relative;
  display: inline-block;
  max-width: 200px;
  min-width: 150px;
  cursor: pointer;
}

img {
  width: 100%;
  display: block;
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
  border-radius: 20px;
}

@media (max-width: 600px) {
  .container {
    grid-template-columns: 1fr; /* 1 columna en pantallas pequeñas */
  }
}
</style>