<template>
  <div
    class="d-block text-center text-sm-start mb-3 mb-sm-1"
    v-if="props.titleProp"
  >
    <span class="ml-1 text-h6">
      {{ props.titleProp }}
    </span>
  </div>
  <v-data-table
    v-model:items-per-page="pagination_var.paginate.per_page"
    v-model:page="pagination_var.paginate.page"
    :headers="props.tableHeadersProp"
    :items="props.itemsProp"
    :items-per-page-options="opt_per_page_var"
    :items-length="pagination_var.total_rows"
    @update:itemsPerPage="ObserverPerPageFtn"
    @update:page="ObserverPageFtn"
  />
</template>
<script setup>
// utilities
import { ref, onUpdated, onMounted } from "vue";

// props
const props = defineProps({
  tableHeadersProp: {
    type: Array,
    required: true,
  },
  axiosHeadersProp: {
    type: Object,
  },
  itemsProp: {
    type: Array,
    required: true,
  },
  optPerPageProp: {
    type: Array,
  },
  titleProp: {
    type: String,
  },
});

// emits
const emit = defineEmits(["refreshEmit"]);

// variables
const opt_per_page_var = ref([]);
const pagination_var = ref({
  paginate: { page: 1, per_page: 10 },
  total_rows: 0,
});

// funciones regulares
/**
 * @description Inicializa el componente llenando el listado de opciones por página
 */
const InitFtn = () => {
  if (props.optPerPageProp === undefined) {
    opt_per_page_var.value = [
      { value: 10, title: "10" },
      { value: 25, title: "25" },
      { value: 50, title: "50" },
      { value: 100, title: "100" },
      { value: -1, title: "$vuetify.dataFooter.itemsPerPageAll" },
    ];
  } else {
    props.optPerPageProp.forEach((item) => {
      if (item === -1) {
        opt_per_page_var.value.push({
          value: Number(item),
          title: "$vuetify.dataFooter.itemsPerPageAll",
        });
      } else {
        opt_per_page_var.value.push({
          value: Number(item),
          title: String(item),
        });
      }
    });
  }
};

/**
 * @description Decodifica los headers de axios para obtener la paginación
 * @param {Object} value_param
 */
const DecodeAxiosHeadersFtn = (value_param) => {
  pagination_var.value.paginate.page = Number(value_param.page);
  pagination_var.value.paginate.per_page = Number(value_param.per_page);
  pagination_var.value.total_rows = Number(value_param.total_rows);
};

/**
 * @description Observa el cambio de la paginación por opción de página
 * @param {Number} value_param
 */
const ObserverPerPageFtn = (value_param) => {
  if (value_param === -1) {
    emit("refreshEmit", { pagination: false });
  } else {
    emit("refreshEmit", { page: 1, per_page: value_param });
  }
};

/**
 * @description Observa el cambio de la paginación por página
 * @param {Number} value_param
 */
const ObserverPageFtn = (value_param) => {
  emit("refreshEmit", {
    page: value_param,
    per_page: pagination_var.value.paginate.per_page,
  });
};

onMounted(() => {
  InitFtn();
});

onUpdated(() => {
  if (Object.keys(props.axiosHeadersProp).length != 0) {
    DecodeAxiosHeadersFtn(props.axiosHeadersProp);
  }
});
</script>