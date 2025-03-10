import { ref, reactive } from "vue";
import { eventHandler } from "@/utils/global_functions";
import { textfield, minlength, required } from "@/utils/validations";
import facturas_services from "@/services/facturas.services";
import { useUtilsStore } from "@/store/utils";

const utils_ref = useUtilsStore();

export function useFactura() {
  const search_var = ref(null);
  const filter_by_var = ref("all");
  const temp_search_var = ref("");
  const list_facturas = ref([]);
  const total_facturas = ref(0);
  const per_page_var = ref(10);
  const page = ref(1);
  const loading = ref(false);
  const modal_factura = ref(null);
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
    { title: "Mostrar factura", key: "mostrar_no_factura", align: "center" },
    { title: "Estado", key: "activo", align: "center" },
    { title: "Acciones", key: "actions" , align: "center"},
  ];

  const RULES = {
    search_var: [
      textfield,
      (value) => minlength(value, null, 4),
    ],
  };

  const getListFacturas = eventHandler(FetchListFacturasFn);

  // regular functions
  function CleanFormFn() {
    temp_search_var.value = "";
    search_var.value = "";
    filter_by_var.value = "all";

    getListFacturas();
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

  async function FetchListFacturasFn(
    pagination = { page: 1, itemsPerPage: per_page_var.value }
  ) {
    loading.value = true;

    const { data, status, headers } = await facturas_services.getListfacturas({
      page: pagination.page,
      per_page: pagination.itemsPerPage || per_page_var.value,
      nombre: search_var.value,
      activo: filter_by_var.value,
    });
    if (status === 200) {
      page.value = pagination.page;
      list_facturas.value = data;
      total_facturas.value = headers["total_rows"];
    }

    loading.value = false;
  }

  async function changeStatusFacturaFn(id) {
    const response = await facturas_services.patchfactura(id);

    if (response && response.status === 200) {
      utils_ref.setNotification({
        message: response.data.message || "Estado cambiado correctamente",
        type: "success",
      });

      FetchListFacturasFn();
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
    list_facturas,
    total_facturas,
    CleanFormFn,
    SearchFn,
    getListFacturas,
    modal_factura,
    modal_confirmation,
    changeStatusFacturaFn,
    openModalConfirmation,
  };
}

export function useModalComponent() {
  const modal_show_var = ref(false);
  const editMode = ref(false);
  const form_var = reactive({
    nombre_var: "",
    show_factura_var: false,
  });

  const form_modal_ref = ref(null);

  const openModal = () => {
    editMode.value = false;
    modal_show_var.value = true;
    form_var.show_factura_var = true;
  };

  const cleanForm = () => {
    form_var.nombre_var = null;
    form_var.show_factura_var = false;
  };

  const closeModal = () => {
    modal_show_var.value = false;
    cleanForm();
  };

  const openModeEdit = (data) => {
    editMode.value = true;
    form_var.nombre_var = data.nombre;
    form_var.show_factura_var = data.mostrar_no_factura === 1;
    form_var.id = data.id;
    modal_show_var.value = true;
  };

  const fetchStoreOrUpdateFn = async (emit) => {
    const { valid } = await form_modal_ref.value?.validate();

    if (!valid) return;

    let response;
    const data = {
      nombre: form_var.nombre_var,
      mostrar_no_factura: form_var.show_factura_var,
    };

    if (editMode.value)
      response = await facturas_services.putfactura(form_var.id, data);
    else
      response = await facturas_services.postfactura(data);

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
      (value) => required(value, "El nombre de la factura es requerido"),
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
