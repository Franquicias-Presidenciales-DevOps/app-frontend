// utilities
import { onMounted, ref } from "vue";
import { required, email, minlength } from "@/utils/validations";
import { useRouter } from "vue-router";
import { deleteDatabase } from "@/plugins/indexedDB";
import { BroadcastSession } from "@/plugins/broadcastSession";
// stores
import { useAuthStore } from "@/store/auth";

// services
import auth_service from "@/services/auth.services";
import catalogos_services from "@/services/catalogos.services";

export function useLogin() {
  // variables
  const user_var = ref(null);
  const pass_var = ref(null);
  const show_pass_var = ref(false);
  const form = ref(null);


  const broadcastSession = BroadcastSession.getInstance();

  // references
  const store_ref = useAuthStore();
  const router_ref = useRouter();

  // constants
  const RULES_CONST = {
    user_var: [required, email],
    pass_var: [required, (value) => minlength(value, null, 4)],
  };

  // regular functions
  /**
   * @description Función que se encarga de cambiar el color del ícono del botón según estado
   * @param {Number} index Índice del campo
   * @returns {String} Color del ícono
   */
  const getItemColor = (index) => {
    if (pass_var.value != null) {
      return form.value.items[index].errorMessages.length > 0
        ? "error"
        : "primary";
    } else {
      return "primary";
    }
  };

  const getPath = (menu) => {
    const path = menu.at(0);

    if (path?.childs?.length > 0) {
      return getPath(path.childs);
    }

    return {
      uri: path?.uri,
      name: path?.nombreUri,
    };
  };

  const redirectPath = async (name) => {
    return router_ref.push({ name: name });
  };
  // async functions
  /**
   * @description Función que se encarga de realizar el login (API)
   * @param {Object} event_param Objeto que contiene los valores de los campos del formulario
   * @async
   */
  const LoginFtn = async (event_param) => {
    const { valid } = await event_param;

    if (valid) {
      const { data, status } = await auth_service.login(
        user_var.value,
        pass_var.value
      );

      if (status === 200) {
        store_ref.setAuthAct(data);
        await store_ref.obtainPathsAct();

        InitCatalogosFn();

        const { name, uri } = getPath(store_ref.menu_st);

        broadcastSession.sendReloadWindow(uri);

        await redirectPath(name);
      }
    } else return;
  };

  async function InitCatalogosFn() {
    Promise.all([
      catalogos_services.getListDepartamentos(),
      catalogos_services.getListMunicipios(),
      catalogos_services.getListDistritos(),
    ]);
  }

  async function VerifyLocalDbFn() {

    const exist_dbs = await indexedDB.databases()

    if (exist_dbs.length > 0) {
      const db_catalogos = exist_dbs.some(db => db.name === 'catalogos');

      if (db_catalogos) {
        deleteDatabase('catalogos')
      }
    }
  }

  onMounted(() => {
    localStorage.clear();
    store_ref.user_info_st = {};
    VerifyLocalDbFn()
  });

  return {
    user_var,
    pass_var,
    show_pass_var,
    form,

    RULES_CONST,

    getItemColor,
    LoginFtn,
  };
}
