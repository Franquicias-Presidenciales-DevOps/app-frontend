import { ref, reactive } from "vue";
import {
  textfield,
  minlength,
} from "@/utils/validations";
import rolesServices from "@/services/roles.services";
import { useUtilsStore } from "@/store/utils";
import { eventHandler } from "@/utils/global_functions";
const utils_ref = useUtilsStore();

export function useRoles() {
  const search_var = ref("");
  const temp_search_var = ref("");
  const listRoles = ref([]);
  const totalRoles = ref(0);
  const per_page_var = ref(10);
  const page = ref(1);
  const loading = ref(false);
  const modal_role = ref(null);
  const modal_confirmation = reactive({
    show: false,
    is_active: false,
    id: null,
  });

  const getListroles = eventHandler(FetchListrolesFn);

  const HEADERS = [
    { title: "N°", value: "id", align: "center" },
    { title: "Nombre", value: "nombre", key: "nombre", align: "center" },
    { title: "Creado por", value: "user.name", align: "center" },
    { title: "Fecha de creación", value: "created_at", align: "center" },
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
    getListroles();
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
      search_var.value = String(Date.now());
    }
  }

  async function FetchListrolesFn(pagination = { page: 1, itemsPerPage: per_page_var.value }) {
    loading.value = true;
    listRoles.value = [];
    let filter = {}

    if (search_var.value) {
      filter.nombre = temp_search_var.value;
    }

    const { data, status, headers } = await rolesServices.getListRoles({
      page: pagination.page,
      per_page: pagination.itemsPerPage,
      ...filter,
    });

    if (status === 200) {
      page.value = pagination.page;
      listRoles.value = data;
      totalRoles.value = headers["total_rows"];
    }

    loading.value = false;
  }

  async function changeStatusRoleFn(id) {
    const response = await rolesServices.changeRolStatus(id);

    if (response && response.status === 200) {
      utils_ref.setNotification({
        message: response.data.message || "Estado cambiado correctamente",
        type: "success",
      });

      FetchListrolesFn();
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
    listRoles,
    totalRoles,
    CleanFormFn,
    SearchFn,
    FetchListrolesFn,
    modal_role,
    modal_confirmation,
    changeStatusRoleFn,
    openModalConfirmation,
  };
}
