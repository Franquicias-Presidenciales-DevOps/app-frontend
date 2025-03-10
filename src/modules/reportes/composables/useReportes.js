import { ref, reactive } from "vue";
import { eventHandler } from "@/utils/global_functions";
import { textfield, minlength, required } from "@/utils/validations";

import { useUtilsStore } from "@/store/utils";
import reportes_services from "@/services/reportes.services";

const utils_ref = useUtilsStore();

export function useReportes() {
  const search_var = ref(null);
  const fecha_reporte_diario_var = ref(null);
  const fecha_reporte_mensual_var = ref(null);
  const fecha_reporte_personalizado_inicio_var = ref(null);
  const fecha_reporte_personalizado_fin_var = ref(null);
  const select_item_entidad = ref(null);
  const tab = ref(null);

  const fecha_inicio_var = ref(null);
  const fecha_fin_var = ref(null);
  const mes_var = ref(null);
  const dia = ref(null);

  const list_diario = ref([]);
  const list_mensual = ref([]);
  const list_personalizado = ref([]);
  const list_entidades = ref([]);
  const total_list_diario = ref(0);
  const total_list_mensual = ref(0);
  const total_list_personalizado = ref(0);
  const per_page_var = ref(10);
  const loading = ref(false);
  const initialFormState = {
    fecha_inicio_var: null,
    fecha_fin_var: null,
    fecha_mes_var: null,
    fecha_dia_var: null,
  };
  const form_var = reactive({ ...initialFormState });
  const modal_confirmation = reactive({
    show: false,
    is_active: false,
    id: null,
  });
  const form_input = ref(null);
  const form_inputDiario = ref(null);
  const form_inputPersonalizado = ref(null);
  const HEADERS_DIARIO = [
    { title: "Código de solicitud", value: "codigo_solicitud" },
    { title: "Cantidad de bultos", value: "cantidad_bultos" },
    { title: "Contenido", value: "contenido" },
    { title: "Documento de transporte", key: "documentos_transporte" },
    { title: "Oficial solicitante", key: "nombre_solicitante" },
  ];
  const HEADERS_MENSUAL = [
    { title: "Código de solicitud", value: "codigo_solicitud" },
    { title: "Nombre solicitante", value: "nombre_solicitante" },
    { title: "Contenido", value: "contenido" },
    { title: "Estado", key: "estado", align: "center" },
    { title: "Fecha de ingreso", value: "fecha_ingreso" },
    { title: "Fecha de despacho", value: "fecha_despacho" },
  ];
  const HEADERS_PERSONALIZADO = [
    { title: "Código de solicitud", value: "codigo_solicitud" },
    { title: "Nombre solicitante", value: "nombre_solicitante" },
    { title: "Contenido", value: "contenido" },
    { title: "Estado", key: "estado", align: "center" },
    { title: "Fecha de ingreso", value: "fecha_ingreso" },
    { title: "Fecha de despacho", value: "fecha_despacho" },
  ];
  const HEADERS_ENTIDADES = [
    { title: "N°", value: "id" },
    { title: "Codigo de solicitud", value: "nombre" },
    { title: "Cantidad de bultos", value: "creador" },
    { title: "Contenido", value: "editor" },
    { title: "Documento de transporte", key: "fecha_creacion" },
    { title: "Oficial solicitante", key: "fecha_edicion" },
    { title: "Mostrar factura", key: "mostrar_no_factura", align: "center" },
    { title: "Estado", key: "activo", align: "center" },
    { title: "Acciones", key: "actions" },
  ];

  const RULES = {
    fecha_inicio_var: [
      (value) => required(value, "La fecha de inicio es requerida"),
    ],

    fecha_fin_var: [(value) => required(value, "La fecha de fin es requerida")],
    search_var: [textfield, (value) => minlength(value, null, 4)],
  };

  function openModalConfirmation(item) {
    modal_confirmation.show = true;
    modal_confirmation.id = item.id;
    modal_confirmation.is_active = item.activo;
  }

  // async functions
  async function SearchFn(event_param) {
    const { valid } = await event_param;

    if (valid) {
      search_var.value = temp_search_var.value;
    }
  }
  const getListReportesDiarios = eventHandler(FetchListReportesDiariosFn);

  const getListReportesMensuales = eventHandler(FetchListReportesMensualFn);
  const getListReportesPersonalizado = eventHandler(
    FetchListReportesPersonalizadoFn
  );
  async function getListReportesMensuales2() {
    await form_input.value?.validate();

    if (!form_input.value.isValid) return;
    FetchListReportesDiariosFn();
  }

  // Obtener la fecha actual en formato YYYY-MM-DD
  const today = new Date().toISOString().split("T")[0];

  async function FetchListReportesDiariosFn(
    pagination = { page: 1, itemsPerPage: per_page_var.value }
  ) {
    loading.value = true;
    const { data, status, headers } =
      await reportes_services.getListReporteDiario({
        page: pagination.page,
        per_page: pagination.itemsPerPage,
        fecha_inicio: form_var.fecha_inicio_var,
        fecha_fin: form_var.fecha_fin_var,
        mes: form_var.fecha_mes_var,
        dia: form_var.fecha_dia_var,
      });
    if (status === 200) {
      list_diario.value = data;
      total_list_diario.value = headers["total_rows"];
    }

    loading.value = false;
  }
  async function FetchListReportesMensualFn(
    pagination = { page: 1, itemsPerPage: per_page_var.value }
  ) {
    loading.value = true;
    const { data, status, headers } =
      await reportes_services.getListReporteDiario({
        page: pagination.page,
        per_page: pagination.itemsPerPage,
        fecha_inicio: form_var.fecha_inicio_var,
        fecha_fin: form_var.fecha_fin_var,
        mes: form_var.fecha_mes_var,
        dia: form_var.fecha_dia_var,
      });
    if (status === 200) {
      list_diario.value = data;
      total_list_diario.value = headers["total_rows"];
    }

    loading.value = false;
  }

  async function validate(method, form_ref) {
    await form_ref?.validate();
    if (!form_ref.isValid) return;
    method();
  }

  async function FetchListReportesPersonalizadoFn(
    pagination = { page: 1, itemsPerPage: per_page_var.value }
  ) {
    loading.value = true;
    const { data, status, headers } =
      await reportes_services.getListReporteDiario({
        page: pagination.page,
        per_page: pagination.itemsPerPage,
        fecha_inicio: form_var.fecha_inicio_var,
        fecha_fin: form_var.fecha_fin_var,
        mes: form_var.fecha_mes_var,
        dia: form_var.fecha_dia_var,
      });
    if (status === 200) {
      list_diario.value = data;
      total_list_diario.value = headers["total_rows"];
    }

    loading.value = false;
  }
  const getDocumento = eventHandler(FetchDocumentoFn);

  function getCurrentDate() {
    return new Date().toISOString().slice(0, 10); // Obtener la fecha actual en formato YYYY-MM-DD
  }

  function onTabChange(newTab) {
    Object.assign(form_var, initialFormState);
    // Aquí puedes manejar la lógica cuando se cambia de tab
    const currentDate = getCurrentDate();
    list_diario.value = [];
    if (newTab === "one") {
      form_var.fecha_dia_var = currentDate;
      getListReportesDiarios();
    } else if (newTab === "two") {
      list_diario.value.splice(0);
      //form_var.fecha_mes_var.value = currentDate; // Obtener el mes actual en formato YYYY-MM
      Object.assign(form_var, initialFormState);
      //getListReportesDiarios();
    } else if (newTab === "three") {
      list_diario.value.splice(0);
      // form_var.fecha_inicio_var = currentDate;
      // form_var.fecha_fin_var = currentDate;
    }
  }
  async function FetchDocumentoFn() {
    loading.value = true;
    try {
      const response = await reportes_services.getReportesDocumento({
        fecha_inicio: form_var.fecha_inicio_var,
        fecha_fin: form_var.fecha_fin_var,
        mes: form_var.fecha_mes_var,
        dia: form_var.fecha_dia_var,
      });

      if (response.status === 200) {
        const blob = new Blob([response.data], { type: "application/msword" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "reporte_franquicia.docx"; // Nombre del archivo
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a); // Limpieza del DOM
        window.URL.revokeObjectURL(url); // Limpieza de la URL
      } else {
        console.error("Error en la respuesta de la API:", response);
      }
    } catch (error) {
      console.error("Error al descargar el documento", error);
    } finally {
      loading.value = false;
    }
  }

  return {
    search_var,

    per_page_var,
    loading,

    form_input,
    form_inputDiario,
    form_inputPersonalizado,
    RULES,

    form_var,
    tab,

    modal_confirmation,
    HEADERS_DIARIO,
    HEADERS_MENSUAL,
    HEADERS_PERSONALIZADO,
    HEADERS_ENTIDADES,
    list_diario,
    list_mensual,
    list_personalizado,
    list_entidades,
    total_list_diario,

    fecha_inicio_var,
    fecha_fin_var,
    mes_var,
    dia,
    onTabChange,
    getListReportesDiarios,
    getListReportesMensuales2,
    getListReportesMensuales,
    getListReportesPersonalizado,
    getDocumento,
    validate,
  };
}
