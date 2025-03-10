import { ref, reactive, onMounted, computed } from "vue";
import {
  textfield,
  minlength,
  required,
  email,
  number,
} from "@/utils/validations";
import { useUtilsStore } from "@/store/utils";
import usuarios_services from "@/services/usuarios.services";
import catalogos_services from "@/services/catalogos.services";

export function useModalComponent() {
  const utils_ref = useUtilsStore();

  const modal_show_var = ref(false);
  const editMode = ref(false);

  const catalogos = reactive({
    departamentos: [],
    municipios: [],
    distritos: [],
    roles: [],
  });

  const form_var = reactive({
    nombres_var: "",
    apellidos_var: "",
    cargo_var: "",
    titulo_var: "",
    correo_var: "",
    codigo_colaborador_var: "",
    departamento_var: null,
    municipio_var: null,
    distrito_var: null,
    roles_var: [],
    is_firmador_var: false,
  });

  const form_modal_ref = ref(null);

  const openModal = () => {
    editMode.value = false;
    modal_show_var.value = true;
  };

  const cleanForm = async () => {
    form_modal_ref.value.reset();
  };

  const closeModal = () => {
    modal_show_var.value = false;
    cleanForm();
  };

  const openModeEdit = (data) => {
    editMode.value = true;
    form_var.nombres_var = data?.name;
    form_var.apellidos_var = data?.last_name;
    form_var.cargo_var = data?.cargo;
    form_var.titulo_var = data?.titulo;
    form_var.correo_var = data?.email;
    form_var.codigo_colaborador_var = data?.cod_colaborador;
    form_var.departamento_var = data?.departamento?.id;
    form_var.municipio_var = data?.municipio?.id;
    form_var.distrito_var = data?.distrito?.id;
    form_var.roles_var = data?.roles;
    form_var.is_firmador_var = data?.firmador;
    form_var.id = data.id;
    modal_show_var.value = true;
  };

  const resetInputs = (inputs) => {
    form_modal_ref.value?.items.forEach((item) => {
      if (inputs.includes(item.id)) item.reset();
    });
  };

  const fetchCtlCatalogosFn = async () => {
    const [departamentos, municipios, distritos, roles] = await Promise.all([
      catalogos_services.getListDepartamentos(),
      catalogos_services.getListMunicipios(),
      catalogos_services.getListDistritos(),
      catalogos_services.getListRoles(),
    ]);

    if (departamentos.status === 200)
      catalogos.departamentos = departamentos.data;
    if (municipios.status === 200) catalogos.municipios = municipios.data;
    if (distritos.status === 200) catalogos.distritos = distritos.data;
    if (roles.status === 200)
      catalogos.roles = roles.data.map((item) => {
        return {
          rol_id: item.id,
          nombre: item.nombre,
        };
      });
  };

  const filterMunicipios = computed(() => {
    return catalogos.municipios.filter(
      (item) => item.id_departamento === form_var.departamento_var
    );
  });

  const filterDistritos = computed(() => {
    return catalogos.distritos.filter(
      (item) => item.id_municipio === form_var.municipio_var
    );
  });

  const ValidarCodigoColaborador = async (valor) => {
    if (valor.length === 1) {
      form_var.codigo_colaborador_var = "00" + valor;
    } else if (valor.length === 2) {
      form_var.codigo_colaborador_var = "0" + valor;
    }
  };

  const fetchStoreOrUpdateFn = async (emit) => {
    const { valid } = await form_modal_ref.value?.validate();

    if (!valid) return;

    let response;

    const roles = form_var.roles_var
      .map((item) => item.rol_id)
      .filter((item) => item);

    const data = {
      name: form_var.nombres_var,
      last_name: form_var.apellidos_var,
      email: form_var.correo_var,
      cod_colaborador: form_var.codigo_colaborador_var,
      cargo: form_var.cargo_var,
      titulo: form_var.titulo_var,
      id_distrito: form_var.distrito_var,
      roles: roles.length > 0 ? roles : null,
      firmador: form_var?.is_firmador_var || false,
    };

    if (editMode.value)
      response = await usuarios_services.putUsuario(form_var.id, data);
    else response = await usuarios_services.postUsuario(data);

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
    nombres_var: [
      (value) => required(value, "El nombre del usuario es requerido"),
      (value) => textfield(value, "El nombre debe ser alfanumérico"),
      (value) => minlength(value, null, 3),
    ],

    apellidos_var: [
      (value) => required(value, "El apellido es requerido"),
      (value) => textfield(value, "El apellido debe ser alfanumérico"),
      (value) => minlength(value, null, 3),
    ],

    cargo_var: [
      (value) => required(value, "El cargo es requerido"),
      (value) => textfield(value, "El cargo debe ser alfanumérico"),
      (value) => minlength(value, null, 4),
    ],

    codigo_colaborador_var: [
      (value) => required(value, "El código de colaborador es requerido"),
      (value) => number(value, "El código de colaborador debe ser un número"),
    ],

    titulo_var: [
      (value) => required(value, "El título del usuario es requerido"),
      (value) => textfield(value, "El título debe ser alfanumérico"),
      (value) => minlength(value, null, 2),
    ],

    correo_var: [
      (value) => required(value, "El correo es requerido"),
      (value) => minlength(value, null, 8),
      (value) => email(value, "El correo no es válido"),
    ],

    departamento_var: [
      (value) => required(value, "El departamento es requerido"),
    ],
    municipio_var: [(value) => required(value, "El municipio es requerido")],
    distrito_var: [(value) => required(value, "El distrito es requerido")],
    roles_var: [(value) => required(value, "Los roles son requeridos")],
  };

  onMounted(() => {
    fetchCtlCatalogosFn();
  });
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
    catalogos,
    filterDistritos,
    filterMunicipios,
    resetInputs,
    ValidarCodigoColaborador,
  };
}
