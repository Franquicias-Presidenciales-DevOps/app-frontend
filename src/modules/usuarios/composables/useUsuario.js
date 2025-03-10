import { ref, reactive } from "vue";
import { textfield, minlength } from "@/utils/validations";
import usuarios_services from "@/services/usuarios.services";
import { useUtilsStore } from "@/store/utils";
import { eventHandler } from "@/utils/global_functions";
const utils_ref = useUtilsStore();

export function useUsuario() {
  const search_var = ref("");
  const temp_search_var = ref("");
  const list_oficiales = ref([]);
  const total_oficiales = ref(0);
  const per_page_var = ref(10);
  const page = ref(1);
  const loading = ref(false);
  const modal_usuario = ref(null);
  const modal_confirmation = reactive({
    show: false,
    is_active: false,
    is_blocked: false,
    id: null,
  });

  const getListUsuarios = eventHandler(FetchListUsuariosFn);

  const HEADERS = [
    { title: "Código", value: "cod_colaborador" },
    { title: "Nombre", key: "name" },
    { title: "Departamento", value: "departamento.nombre" },
    { title: "Municipio", value: "municipio.nombre" },
    { title: "Distrito", key: "distrito.nombre" },
    {
      title: "Fecha de creación",
      value: "fecha_creacion",
      key: "fecha_creacion",
    },
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
    getListUsuarios();
  }

  function openModalConfirmation(item) {
    modal_confirmation.is_blocked = item?.is_blocked;
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

  async function FetchListUsuariosFn(
    pagination = { page: 1, itemsPerPage: per_page_var.value }
  ) {
    loading.value = true;
    const { data, status, headers } = await usuarios_services.getListUsuarios({
      page: pagination.page,
      per_page: pagination.itemsPerPage || per_page_var.value,
      valor: search_var.value,
    });
    if (status === 200) {
      page.value = pagination.page;
      list_oficiales.value = data;
      total_oficiales.value = headers["total_rows"];
    }

    loading.value = false;
  }

  async function changeStatusUsuarioFn(id) {
    const response = await usuarios_services.patchUsuario(id);

    if (response && response.status === 200) {
      utils_ref.setNotification({
        message: response.data.message || "Estado cambiado correctamente",
        type: "success",
      });

      FetchListUsuariosFn();
      modal_confirmation.show = false;
    }
  }

  async function unblockedUsuario(id) {
    const { status, data } = await usuarios_services.unblockedUsuario(id);

    if (status === 200) {
      utils_ref.setNotification({
        message: data.message || "Usuario desbloqueado correctamente",
        type: "success",
      });

      FetchListUsuariosFn();
      modal_confirmation.show = false;
    }
  }

  return {
    search_var,
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
    getListUsuarios,
    modal_usuario,
    modal_confirmation,
    changeStatusUsuarioFn,
    openModalConfirmation,
    unblockedUsuario,
  };
}
