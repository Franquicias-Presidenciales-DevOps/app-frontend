
<template>
  <div
    ref="dropzone"
    :style="{ borderColor: validate.color, width: mobile ? '100%' : width }"
    class="dropzone hover-drag pa-4 pa-sm-8 d-flex flex-column align-center justify-center"
    @dragover="handleDragOver"
    @dragleave="resetValidation"
    @drop="handleDrop"
  >
    <div
      class="d-flex ga-4 pa-sm-4 flex-sm-row flex-column align-center justify-center"
    >
      <v-icon size="60" color="grey">mdi-cloud-upload-outline</v-icon>
      <p class="text-grey text-center text-wrap">
        <slot name="description">
          Seleccione un archivo, {{ max }}MB como máximo, formato PNG, JPG, JPEG
          o PDF.
        </slot>
      </p>
    </div>
    <ul class="text-grey my-2 my-sm-1 text-center">
      <li v-for="file in files" :key="file.name">
        {{ file.name }} - {{ sizeFile(file.size) }} MB
        <v-icon
          @click="
            deleteFile(file.name);
            resetValidation();
          "
          color="grey"
          class="text-none"
          >mdi-close</v-icon
        >
      </li>
    </ul>

    <v-btn
      @click="selectFile"
      variant="outlined"
      class="text-none"
      color="primary"
      rounded="3"
    >
      <span class="text-subtitle-2">{{ placeholder }}</span>
    </v-btn>

    <input
      hidden
      ref="fileInput"
      type="file"
      style="display: none"
      :accept="accept.join(', ')"
    />

    <v-expand-transition>
      <p v-show="validate.message" class="text-red-accent-3 mt-2">
        {{ validate.message }}
      </p>
    </v-expand-transition>
  </div>
</template>

<script setup>
import { computed, reactive, ref } from "vue";
import { useDisplay } from "vuetify";
const { mobile } = useDisplay();

const props = defineProps({
  accept: {
    type: Array,
    default: () => ["image/png", "image/jpeg", "image/jpg", "application/pdf"],
  },

  icon: {
    type: String,
    default: "mdi-cloud-upload-outline",
  },

  placeholder: {
    type: String,
    default: "Seleccionar archivo",
  },

  errorFormat: {
    type: String,
    default: "Formato no válido",
  },

  errorSize: {
    type: String,
    default: "El archivo no puede ser mayor a 5MB",
  },

  max: {
    type: Number,
    default: 5,
  },

  multiple: {
    type: Boolean,
    default: false,
  },

  maxFiles: {
    type: Number,
    default: 5,
  },

  rules: {
    type: Array,
    default: () => [],
  },

  required: {
    type: Boolean,
    default: false,
  },

  width: {
    type: String,
    default: "100%",
  },

  maxlength: {
    type: Number,
    default: 50,
  },

  regex_valid: {
    type: RegExp,
    default: /^[a-zA-Z0-9_-]*$/,
  },
});

const files = defineModel({
  prop: "files",
  event: "change",
  default: [],
});
const fileInput = ref(null);
const dropzone = ref(null);

const validate = reactive({
  color: "grey",
  message: null,
});

const validations = [
  ({ files }) => {
    if (!files) return;
    const name = Array.from(files).map((file) => file.name.split(".")[0]);
    if (name.at(0)?.length > props.maxlength) {
      return `El nombre del archivo no puede exceder los ${props.maxlength} caracteres`;
    }
  },
  ({ files }) => {
    if (!files) return;
    const name = Array.from(files).map((file) => file.name.split(".")[0]);
    if (!name.every((n) => props.regex_valid.test(n))) {
      return "El nombre del archivo no puede contener caracteres especiales";
    }
  },
  ({ dataTransfer }) => {
    if (dataTransfer?.items?.length > 1 && !props.multiple) {
      return "Solo se permite un archivo";
    }
  },
  ({ dataTransfer }) => {
    if (!dataTransfer) return;
    if (!validateFormat(dataTransfer?.items)) return props.errorFormat;
  },

  ({ files }) => {
    if (!files) return;
    return !validateFormat(files) && props.errorFormat;
  },

  ({ files }) => {
    if (!files) return;
    return !validateSize(files) && props.errorSize;
  },

  ({ files }) => {
    return (
      props.multiple &&
      files?.length > props.maxFiles &&
      `Solo se permite un máximo de ${props.maxFiles} archivos`
    );
  },
];

const handleDrop = (e) => {
  e.preventDefault();
  dropzone.value.style.backgroundColor = "transparent";

  handleRules({ files: [...e?.dataTransfer.files, ...files.value] });

  if (validate.message || e.dataTransfer.files.length === 0) return;

  addFiles(e.dataTransfer.files);
};

const selectFile = () => {
  resetValidation();
  fileInput.value.click();
  fileInput.value.onchange = (e) => {
    if (props.multiple) {
      handleRules({ files: [...e.target?.files, ...files.value] });
    } else {
      files.value = [];
      handleRules({ files: [...e.target?.files] });
    }
    if (validate.message) return;

    addFiles(e.target.files);
  };
};

const addFiles = (list, onlyOne = !props.multiple) => {
  resetValidation();
  if (files.value?.length > 0 && !onlyOne) {
    files.value = [...files.value, ...ignoreDuplicates(list)];
    return;
  }
  files.value = list;
};

const sizeFile = (size) => {
  return (size / Math.pow(1024, 2)).toFixed(2);
};

const validateFormat = (files) => {
  return Array.from(files).every((file) => {
    return props.accept.includes(file.type);
  });
};

const isFile = (files) => {
  if (!files || files.length === 0) return false;
  return Array.from(files).every((file) => file.kind === "file");
};

const errorValidation = (message) => {
  validate.color = "red";
  validate.message = message;
  dropzone.value.style.backgroundColor = "rgba(255,0,0,0.1)";
};

const ignoreDuplicates = (list) => {
  if (!list) return [];
  return Array.from(list).filter(
    (file) => !Array.from(files.value).some((f) => f.name === file.name)
  );
};

const resetValidation = () => {
  validate.color = "grey";
  validate.message = null;
  dropzone.value.style.backgroundColor = "transparent";
};

const validateSize = (files) => {
  if (!files) return;
  return Array.from(files).every((file) => {
    return sizeFile(file.size) <= props.max;
  });
};
const deleteFile = (name) => {
  files.value = Array.from(files.value).filter((file) => file.name !== name);
  fileInput.value.value = null;
};
const handleDragOver = (e) => {
  e.preventDefault();
  dropzone.value.style.backgroundColor = "rgba(0,0,0,0.1)";
  handleRules({ dataTransfer: e.dataTransfer });
};

const globalValidates = ({ files, dataTransfer }) => {
  if (!dataTransfer && files) return resetValidation();

  if (dataTransfer && !isFile(dataTransfer?.items))
    return "Solo se permiten archivos";
};
const handleRules = (e) => {
  const rules = [...validations, ...props.rules];
  const global = globalValidates(e);

  if (global) return errorValidation(global);

  const errors = rules
    .map((rule) => (typeof rule(e) === "string" ? rule(e) : null))
    .filter((error) => error !== null);

  if (errors.length > 0) {
    errors.forEach((error) => errorValidation(error));
  }
};

const isValid = computed(() => {
  if (props.required && files.value.length === 0) return false;

  return validate.message === null;
});

defineExpose({
  isValid,
  resetValidation,
  deleteFile,
  addFiles,
});
</script>

<style scoped>
.dropzone {
  border-width: 1px;
  border-style: dashed;
  border-radius: 10px;
  cursor: grab;
  transition: all 0.3s ease-in-out;
}
</style>