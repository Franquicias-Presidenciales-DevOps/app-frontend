import { ref } from "vue";
import {
  textfield,
  minlength,
} from "@/utils/validations";
import { eventHandler } from "@/utils/global_functions";
import clasificacionesServices from "@/services/clasificaciones.services";
import entidadesServices from "@/services/entidades.services";

export function useTabCalificacion() {
  const search = ref(""); //Campo de busqueda
  const listEntidades = ref([]); //Listado de entidades
  const EntidadesOficiales = ref([]); //Listado de entidades para el select desde la API
  const selectEntidades = ref([]); //Listado de entidades para el select
  const totalEntidades = ref(0); //Total de entidades
  const per_page = ref(10); //Cantidad de entidades por pagina
  const page = ref(1); //Pagina actual
  const entidad = ref(null); //Entidad seleccionada
  const loading = ref(false); //Cargando
  const apiHeaders = ref([]); //Headers de la tabla dinamica desde la API
  const HEADERS = ref([]); //Headers de la tabla
  const temp_search_var = ref(null); //Variable temporal para la busqueda
  let temp_entidad = null; //Variable temporal para la entidad

  const getPromedioEntidades = eventHandler(getListEntidades);

  // validations
  const RULES = {
    search: [textfield, (value) => minlength(value, null, 4)],
  };

  // regular functions
  //Limpiar el formulario
  function CleanFormFn() {
    temp_search_var.value = null;
    search.value = "";
    entidad.value = null;
    totalEntidades.value = 0;
    page.value = 1;
    per_page.value = 10;
    temp_entidad = null;
    getPromedioEntidades();
  }

  //Buscar las entidades
  async function SearchFn(event_param) {
    const { valid } = await event_param;
    if (valid) {
      search.value = String(Date.now());
    }

  }

  //Asignar las entidades al select
  function setSelectEntidades() {
    if (EntidadesOficiales.value.length === 0) return;

    selectEntidades.value = [];

    for (let i = 0; i < EntidadesOficiales.value.length; i++) {
      selectEntidades.value.push({
        text: EntidadesOficiales.value[i].nombre,
        value: EntidadesOficiales.value[i].id,
      });
    }
  }
  //Asignar los headers de la tabla dinamicamente
  function setHeaders() {

    HEADERS.value.push({ title: "Nombre entidad", align: "center", value: "entidad" },
      { title: "Cantidad de franquicias", align: "center", value: "cantidad_franquicias" });

    for (let i = 0; i < apiHeaders.value.length; i++) {
      HEADERS.value.push({ title: apiHeaders.value[i].nombre, align: "center", value: "clasificaciones[" + i + "].promedio_puntaje" });
    }

    HEADERS.value.push({
      title: "Calificación general",
      align: "center",
      value: "calificacion",
    });

  }

  // async functions
  //Obtener el listado de entidades
  async function getListEntidades(pagination = { page: 1, itemsPerPage: per_page.value }) {


    listEntidades.value = [];
    loading.value = true;
    temp_entidad = entidad.value;
    let filter = {}

    if (search.value) {
      filter.buscar = temp_search_var.value;
      filter.tipo_entidad = temp_entidad;
    }

    const response = await clasificacionesServices.getPromedioEntidades({
      per_page: per_page.value,
      page: pagination.page,
      ...filter
    });

    if (response.status === 200) {
      page.value = pagination.page;
      totalEntidades.value = response.headers.total_rows;
      listEntidades.value = response.data.entidades;
    }

    loading.value = false;
  }

  //Obtener el listado de entidades oficiales o fundaciones
  async function getEntidades() {
    const response = await entidadesServices.getEntidades();
    EntidadesOficiales.value = response.data;
    setSelectEntidades();
  }
  //Obtener el listado de clasificaciones
  async function getClasificaciones() {
    const response = await clasificacionesServices.listarClasificaciones();
    apiHeaders.value = response.data;
    apiHeaders.value.reverse();
    setHeaders();
  }

  return {
    search,
    listEntidades,
    totalEntidades,
    apiHeaders,
    per_page,
    page,
    entidad,
    loading,
    HEADERS,
    RULES,
    selectEntidades,
    temp_search_var,
    CleanFormFn,
    getListEntidades,
    getEntidades,
    setHeaders,
    getClasificaciones,
    SearchFn,
  };
}
