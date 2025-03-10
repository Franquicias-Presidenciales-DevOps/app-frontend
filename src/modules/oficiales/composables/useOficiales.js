import { ref, reactive } from "vue";
import { textfield, minlength, required } from "@/utils/validations";
import oficiales_services from "@/services/oficiales.services";
import { useUtilsStore } from "@/store/utils";
import { eventHandler } from "@/utils/global_functions";
const utils_ref = useUtilsStore();

export function useOficiales() {
  const search_var = ref("");
  const filter_by_var = ref("all");
  const temp_search_var = ref("");
  const list_oficiales = ref([]);
  const total_oficiales = ref(0);
  const per_page_var = ref(10);
  const loading = ref(false);
  const modal_oficial = ref(null);
  const page = ref(1);
  const modal_confirmation = reactive({
    show: false,
    is_active: false,
    id: null,
  });

  const getListOficiales = eventHandler(FetchListOficialesFn);

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

  // regular functions
  function CleanFormFn() {
    temp_search_var.value = "";
    search_var.value = "";
    filter_by_var.value = "all";
    getListOficiales();
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

  async function FetchListOficialesFn(
    pagination = { page: 1, itemsPerPage: per_page_var.value }
  ) {
    loading.value = true;
    const { data, status, headers } = await oficiales_services.getListOficiales(
      {
        page: pagination.page,
        per_page: pagination.itemsPerPage || per_page_var.value,
        activo: filter_by_var.value,
        nombre: search_var.value,
      }
    );
    if (status === 200) {
      page.value = pagination.page;
      list_oficiales.value = data;
      total_oficiales.value = headers["total_rows"];
    }

    loading.value = false;
  }

  async function changeStatusOficialFn(id) {
    const response = await oficiales_services.patchOficial(id);

    if (response && response.status === 200) {
      utils_ref.setNotification({
        message: response.data.message || "Estado cambiado correctamente",
        type: "success",
      });

      FetchListOficialesFn();
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
    list_oficiales,
    total_oficiales,
    CleanFormFn,
    SearchFn,
    getListOficiales,
    modal_oficial,
    modal_confirmation,
    changeStatusOficialFn,
    openModalConfirmation,
  };
}

export function useModalComponent() {
  const modal_show_var = ref(false);
  const editMode = ref(false);
  const form_var = reactive({
    nombre_var: "",
  });

  const form_modal_ref = ref(null);

  const openModal = () => {
    editMode.value = false;
    modal_show_var.value = true;
  };

  const cleanForm = () => {
    form_var.nombre_var = null;
  };

  const closeModal = () => {
    modal_show_var.value = false;
    cleanForm();
  };

  const openModeEdit = (data) => {
    editMode.value = true;
    form_var.nombre_var = data.nombre;
    form_var.id = data.id;
    modal_show_var.value = true;
  };

  const fetchStoreOrUpdateFn = async (emit) => {
    const { valid } = await form_modal_ref.value?.validate();

    if (!valid) return;

    let response;

    if (editMode.value)
      response = await oficiales_services.putOficial(form_var.id, {
        nombre: form_var.nombre_var,
      });
    else
      response = await oficiales_services.postOficial({
        nombre: form_var.nombre_var,
      });

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
      (value) => required(value, "El nombre del oficial es requerido"),
      (value) => textfield(value, "El nombre debe ser alfanumérico"),
      (value) => minlength(value, null, 4),
    ],
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
