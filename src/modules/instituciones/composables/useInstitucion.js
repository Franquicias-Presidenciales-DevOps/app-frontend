import { ref, reactive } from "vue";
import { eventHandler } from "@/utils/global_functions";
import { textfield, minlength, required } from "@/utils/validations";
import institucion_services from "@/services/instituciones.services";
import { useUtilsStore } from "@/store/utils";
import { DateFormattedFn } from "@/utils/global_functions";
const utils_ref = useUtilsStore();

export function useInstitucion() {
  const search_var = ref("");
  const filter_by_var = ref("all");
  const temp_search_var = ref("");
  const list_instituciones = ref([]);
  const total_instituciones = ref(0);
  const per_page_var = ref(10);
  const page = ref(1);
  const loading = ref(false);
  const modal_institucion = ref(null);
  const modal_confirmation = reactive({
    show: false,
    is_active: false,
    id: null,
  });

  const HEADERS = [
    { title: "N°", value: "id" },
    { title: "Nombre", value: "nombre" },
    { title: "Creador", value: "creador" },
    { title: "Editor", value: "editor" },
    { title: "Fecha de creación", key: "fecha_creacion" },
    { title: "Fecha de edición", key: "fecha_edicion" },
    { title: "Estado", key: "activo", align: "center" },
    { title: "Acciones", key: "actions", align: "center" },
  ];

  const RULES = {
    search_var: [textfield, (value) => minlength(value, null, 4)],
  };

  const getListInstituciones = eventHandler(FetchListInstitucionesFn);

  // regular functions
  function CleanFormFn() {
    temp_search_var.value = "";
    search_var.value = "";
    filter_by_var.value = "all";

    getListInstituciones();
  }

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

  async function FetchListInstitucionesFn(
    pagination = { page: 1, itemsPerPage: per_page_var.value }
  ) {
    loading.value = true;
    const { data, status, headers } =
      await institucion_services.getListInstituciones({
        page: pagination.page,
        per_page: pagination.itemsPerPage || per_page_var.value, 
        activo: filter_by_var.value,
        nombre: search_var.value,
      });
    if (status === 200) {
      page.value = pagination.page;
      list_instituciones.value = data;
      total_instituciones.value = headers["total_rows"];
    }

    loading.value = false;
  }

  async function changeStatusInstitucionFn(id) {
    const response = await institucion_services.patchInstitucion(id);

    if (response && response.status === 200) {
      utils_ref.setNotification({
        message: response.data.message || "Estado cambiado correctamente",
        type: "success",
      });

      getListInstituciones();
      modal_confirmation.show = false;
    }
  }

  return {
    search_var,
    filter_by_var,
    per_page_var,
    page,
    loading,
    HEADERS,
    RULES,
    temp_search_var,
    list_instituciones,
    total_instituciones,
    CleanFormFn,
    SearchFn,
    getListInstituciones,
    modal_institucion,
    modal_confirmation,
    changeStatusInstitucionFn,
    openModalConfirmation,
  };
}

export function useModalComponent() {
  const modal_show_var = ref(false);
  const editMode = ref(false);
  const form_var = reactive({
    nombre_var: "",
    presidente_var: "",
    fecha_inicio_var: "",
    fecha_fin_var: "",
  });

  const form_modal_ref = ref(null);

  const openModal = () => {
    editMode.value = false;
    modal_show_var.value = true;
  };

  const cleanForm = () => {
    form_var.nombre_var = null;
    form_var.presidente_var = null;
    form_var.fecha_inicio_var = null;
    form_var.fecha_fin_var = null;
  };

  const closeModal = () => {
    modal_show_var.value = false;
    cleanForm();
  };

  const openModeEdit = (data) => {
    editMode.value = true;
    form_var.nombre_var = data.nombre;
    form_var.presidente_var = data.representante_legal;
    form_var.fecha_inicio_var = data.fecha_inicio_junta_directiva;
    form_var.fecha_fin_var = data.fecha_fin_junta_directiva;
    form_var.id = data.id;
    modal_show_var.value = true;
  };

  const fetchStoreOrUpdateFn = async (emit) => {
    const { valid } = await form_modal_ref.value?.validate();

    if (!valid) return;

    let response;

    const data = {
      nombre: form_var.nombre_var,
      representante_legal: form_var.presidente_var,
      fecha_inicio_junta_directiva: form_var.fecha_inicio_var,
      fecha_fin_junta_directiva: form_var.fecha_fin_var,
    };

    if (editMode.value)
      response = await institucion_services.putInstitucion(form_var.id, data);
    else response = await institucion_services.postInstitucion(data);

    if ((response && response.status === 201) || response.status === 200) {
      utils_ref.setNotification({
        message: response.data.message,
        type: "success",
      });

      emit("refresh");

      closeModal();
    }
  };

  const RULES = {
    nombre_var: [
      (value) => required(value, "El nombre de la institución es requerido"),
      (value) => textfield(value, "El nombre debe ser alfanumérico"),
      (value) => minlength(value, null, 4),
    ],
    presidente_var: [
      (value) => required(value, "El nombre del presidente es requerido"),
      (value) => textfield(value, "El nombre debe ser alfanumérico"),
      (value) => minlength(value, null, 10),
    ],

    fecha_inicio_var: [
      (value) => required(value, "La fecha de inicio es requerida"),
    ],

    fecha_fin_var: [(value) => required(value, "La fecha final es requerida")],
  };

  return {
    modal_show_var,
    form_var,
    editMode,
    form_modal_ref,
    RULES,
    fetchStoreOrUpdateFn,
    closeModal,
    openModeEdit,
    openModal,
  };
}
