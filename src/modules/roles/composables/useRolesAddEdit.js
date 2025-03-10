import { ref, reactive } from "vue";
import {
  required,
  textfield,
  minlength,
} from "@/utils/validations";
import roles_services from "@/services/roles.services";
import { useUtilsStore } from "@/store/utils";
import permisosServices from "@/services/permisos.services";
import { useRouter } from "vue-router";
const utils_ref = useUtilsStore();

export function useRolesAddEdit() {

  //Variables
  const isOpen = reactive([false]); //Array con los estados de los acordeones
  const catalogos = ref([]); //Array con los permisos de la franquicia
  const permisos = ref([]); //Array con los ids de los permisos seleccionados
  const ruta = useRouter(); //Para redirigir a otra página
  const EditItem = ref(null); //Objeto con los datos del rol a editar
  const tags = ref([]); //Array con los tags de los permisos seleccionados
  const form_ref = ref(null); //Referencia al formulario
  const form = reactive({
    nombre: "",
    permisos: [],
  });

  //Funciones
  const AbrirCerrar = (index) => {
    isOpen[index] = !isOpen[index];
  }
  const seleccionarTodos = (item) => {
    if (item.seleccionarTodos == true) {
      item.seleccionarTodos = false;
      item.forEach(element => {
        if (form.permisos.includes(element.id)) {
          form.permisos.splice(form.permisos.indexOf(element.id), 1);
        }
      });
    } else {
      item.seleccionarTodos = true;
      item.forEach(element => {
        if (!form.permisos.includes(element.id)) {
          form.permisos.push(element.id);
        }
      }
      );
    }

  }
  const AddPermiso = (permiso, indice, item) => {

    //buscar el el permiso en el array de permisos
    let existe = false;

    for (let i = 0; i < form.permisos.length; i++) {
      if (form.permisos[i] === permiso.id) {
        existe = true;
        break;
      }
    }

    if (existe) {
      //si existe, le hago splice
      form.permisos.splice(form.permisos.indexOf(permiso.id), 1);
      item.seleccionarTodos = false;

    } else {
      //si no existe, lo agrego
      form.permisos.push(permiso.id);
    }

    //Si el array de permisos incluye todos los permisos de la franquicia, seleccionarTodos = true
    let contador = 0;
    item.forEach(element => {
      if (form.permisos.includes(element.id)) {
        contador++;
      }
    });

    if (contador === item.length) {
      item.seleccionarTodos = true;
    } else {
      item.seleccionarTodos = false;
    }

    //limpio las variables
    existe = false;

  }
  const regresar = () => {
    ruta.push("/list-roles");
  }
  const guardar = async () => {

    const { valid } = await form_ref.value?.validate();

    if (form.permisos.length === 0) {
      utils_ref.setNotification({
        message: "El rol debe tener al menos un permiso",
        type: "error",
      });
      return;
    }

    if (!valid) return;

    const body = {
      nombre: form.nombre,
      permisos: form.permisos
    }


    try {
      const { data } = roles_services.createRole(body);

      utils_ref.setNotification({
        message: "Rol agregado correctamente",
        type: "success",
      });

    }
    catch (error) {

      utils_ref.setNotification({
        message: "Error al crear el rol",
        type: "error",
      });
      return;

    }
    finally {
      setTimeout(() => {
        ruta.push("/list-roles");
      }, 1000);
    }

  }
  async function getListPermisos() {
    const { data } = await permisosServices.getListPermisos();
    catalogos.value = data;
  }
  async function getPermiso(id) {
    const { data } = await permisosServices.getPermiso(id);
    EditItem.value = data;
    form.permisos = data.permisos.map(permiso => permiso.id);
    tags.value = data.permisos.map(permiso => permiso.tag);

    //Eliminar duplicados del array de tags
    tags.value = tags.value.filter((item, index) => tags.value.indexOf(item) === index);

    checkAllSelected(); //Verificar si todos los permisos de un catalogo están seleccionados
  }
  const checkAllSelected = () => {

    let indices = []; //Array con los indices de los catalogos, Aduanas, Facturas, etc
    let item //Variable temporal para recorrer el array de catalogos

    for (item in catalogos.value) {
      indices.push(item); //Agrego el indice al array
    }

    for (let i = 0; i < indices.length; i++) {
      let contador = 0;
      for (let j = 0; j < catalogos.value[indices[i]].length; j++) { //Recorro los permisos de cada catalogo
        if (form.permisos.includes(catalogos.value[indices[i]][j].id)) { //Si el permiso está en el array de permisos
          contador++; //Aumento el contador
        }
      }

      if (contador === catalogos.value[indices[i]].length) { //Si el contador es igual a la cantidad de permisos del catalogo
        catalogos.value[indices[i]].seleccionarTodos = true; //Seleccionar todos
      } else {
        catalogos.value[indices[i]].seleccionarTodos = false; //Sino, deseleccionar todos
      }
    }

  }
  const actualizar = async () => {

    if (form.permisos.length === 0) {
      utils_ref.setNotification({
        message: "El rol debe tener al menos un permiso",
        type: "error",
      });
      return;
    }

    const { valid } = await form_ref.value?.validate();

    if (!valid) return;

    const body = {
      nombre: EditItem.value.nombre,
      permisos: form.permisos
    }

    try {
      const { data } = await roles_services.updateRole(EditItem.value.id, body);
      utils_ref.setNotification({
        message: "Rol actualizado correctamente",
        type: "success",
      });

      //Esperar 1 segundo y redirigir a la lista de roles
      setTimeout(() => {
        ruta.push("/list-roles");
      }, 1000);
    }
    catch (error) {
      utils_ref.setNotification({
        message: "Error al actualizar el rol",
        type: "error",
      });
    }


  }
  const ValidarNombre = () => {

    if (form.nombre != null) {
      form.nombre = form.nombre.replace(
        /[^a-zA-ZñÑáéíóúÁÉÍÓÚ ]/g,
        ""
      );
    }

  }

  const ValidarNombreEdit = () => {
    if (EditItem.value.nombre != null) {
      EditItem.value.nombre = EditItem.value.nombre.replace(
        /[^a-zA-ZñÑáéíóúÁÉÍÓÚ ]/g,
        ""
      );
    }

  }

  //Validaciones
  const RULES = {
    nombre: [
      (value) => required(value, "El nombre del oficial es requerido"),
      (value) => textfield(value, "El nombre debe ser alfanumérico"),
      (value) => minlength(value, null, 4),],

    permisos: [
      (value) => required(value, "El rol debe tener al menos un permiso"),
    ]
  };

  return {
    permisos,
    catalogos,
    isOpen,
    AbrirCerrar,
    seleccionarTodos,
    regresar,
    guardar,
    getListPermisos,
    AddPermiso,
    ruta,
    getPermiso,
    EditItem,
    actualizar,
    RULES,
    form,
    form_ref,
    ValidarNombre,
    ValidarNombreEdit
  };

}
