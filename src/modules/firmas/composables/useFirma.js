import { ref, reactive } from "vue";
import { eventHandler } from "@/utils/global_functions";
import { textfield, minlength, required } from "@/utils/validations";
import firmas_services from "@/services/firmas.services";
import { useUtilsStore } from "@/store/utils";
import { DateFormattedFn } from "@/utils/global_functions";
const utils_ref = useUtilsStore();

export function useFirma() {
  const search_var = ref("");
  const temp_search_var = ref("");
  const list_firmas = ref([]);
  const total_firmas = ref(0);
  const per_page_var = ref(10);
  const page = ref(1);
  const loading = ref(false);
  const modal_firma = ref(null);
  const modal_confirmation = reactive({
    show: false,
    is_active: false,
    id: null,
  });

  const HEADERS = [
    { title: "N°", value: "id" },
    { title: "Firma", value: "firma", align: "center" },
    { title: "Cargo", value: "cargo", align: "center" },
    { title: "Acuerdo", value: "acuerdo_ejecutivo", align: "center" },
    {
      title: "Fecha inicio de validez",
      key: "fecha_inicio_validez",
      align: "center",
    },
    {
      title: "Fecha fin de validez",
      key: "fecha_fin_validez",
      align: "center",
    },
    { title: "Acciones", key: "actions", align: "center" },
  ];

  const RULES = {
    search_var: [textfield, (value) => minlength(value, null, 2)],
  };

  const getListFirmas = eventHandler(FetchListFirmasFn);

  // regular functions
  function CleanFormFn() {
    temp_search_var.value = "";
    search_var.value = "";
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

  async function FetchListFirmasFn(
    pagination = { page: 1, itemsPerPage: per_page_var.value }
  ) {
    loading.value = true;
    const { data, status, headers } = await firmas_services.getListFirmas({
      page: pagination.page,
      per_page: pagination.itemsPerPage || per_page_var.value,
      search: search_var.value,
    });
    if (status === 200) {
      page.value = pagination.page;
      list_firmas.value = data;
      total_firmas.value = headers["total_rows"];
    }

    loading.value = false;
  }

  return {
    search_var,
    per_page_var,
    page,
    loading,
    HEADERS,
    RULES,
    temp_search_var,
    list_firmas,
    total_firmas,
    CleanFormFn,
    SearchFn,
    getListFirmas,
    modal_firma,
    modal_confirmation,
    openModalConfirmation,
  };
}

export function useModalComponent() {
  const modal_show_var = ref(false);
  const editMode = ref(false);
  const form_var = reactive({
    firma_var: "",
    cargo_var: "",
    acuerdo_var: "",
    fecha_inicio_var: "",
    fecha_fin_var: "",
  });

  const form_modal_ref = ref(null);

  const openModal = () => {
    editMode.value = false;
    modal_show_var.value = true;
  };

  const cleanForm = () => {
    form_var.firma_var = null;
    form_var.cargo_var = null;
    form_var.fecha_inicio_var = null;
    form_var.fecha_fin_var = null;
    form_var.acuerdo_var = null;
  };

  const closeModal = () => {
    modal_show_var.value = false;
    cleanForm();
  };

  const openModeEdit = (data) => {
    editMode.value = true;
    form_var.firma_var = data.firma;
    form_var.cargo_var = data.cargo;
    form_var.fecha_inicio_var = data.fecha_inicio_validez;
    form_var.fecha_fin_var = data.fecha_fin_validez;
    form_var.acuerdo_var = data.acuerdo_ejecutivo;
    form_var.id = data.id;
    modal_show_var.value = true;
  };

  const fetchStoreOrUpdateFn = async (emit) => {
    const { valid } = await form_modal_ref.value?.validate();

    if (!valid) return;

    let response;

    const data = {
      firma: form_var.firma_var,
      cargo: form_var.cargo_var,
      acuerdo_ejecutivo: form_var.acuerdo_var,
      fecha_inicio_validez: form_var.fecha_inicio_var,
      fecha_fin_validez: form_var.fecha_fin_var,
    };

    if (editMode.value)
      response = await firmas_services.putFirma(form_var.id, data);
    else response = await firmas_services.postFirma(data);

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
    firma_var: [
      (value) => required(value, "La firma es requerida"),
      (value) => textfield(value, "La firma debe ser alfanumérico"),
      (value) => minlength(value, null, 1),
    ],
    cargo_var: [
      (value) => required(value, "El cargo es requerido"),
      (value) => textfield(value, "El cargo debe ser alfanumérico"),
      (value) => minlength(value, null, 1),
    ],

    acuerdo_var: [
      (value) => required(value, "El acuerdo ejecutivo es requerido"),
      (value) => textfield(value, "El acuerdo debe ser alfanumérico"),
      (value) => minlength(value, null, 1),
    ],

    fecha_inicio_var: [
      (value) => required(value, "La fecha inicio de validez es requerida"),
    ],

    fecha_fin_var: [
      (value) => required(value, "La fecha fin de validez es requerida"),
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
