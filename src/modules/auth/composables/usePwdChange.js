import { minlength, required, regex } from "@/utils/validations";
import { onMounted, reactive, ref } from "vue";
import { useUtilsStore } from "@/store/utils";
import { useAuthStore } from "@/store/auth";
import { useRouter } from "vue-router";
import { eventHandler } from "@/utils/global_functions";

import auth_service from "@/services/auth.services";

export const usePwdChange = () => {
  // references
  const utils_ref = useUtilsStore();
  const router_ref = useRouter();
  const store_ref = useAuthStore();

  const form_ref = ref(null);
  const password = reactive({
    old: null,
    new: null,
    confirm: null,
  });

  const validRulesColor = reactive({
    minimo: "",
    mayuscula: "",
    minuscula: "",
    numero: "",
    especial: "",
  });

  const updatePassword = eventHandler(changePasswordFtn, 1000);

  const resetColors = async (color = "primary") => {
    validRulesColor.minimo = color;
    validRulesColor.mayuscula = color;
    validRulesColor.minuscula = color;
    validRulesColor.numero = color;
    validRulesColor.especial = color;
  };

  const valid = (rule, method) => {
    const isValid = method === true;

    validRulesColor[rule] = isValid ? "green" : "red";
    return method;
  };

  const validates = {
    password_old: [
      (value) => required(value, "La contraseña actual es requerida"),
      (value) =>
        minlength(value, "La contraseña debe tener al menos 8 caracteres", 8),
    ],
    password: [
      (value) => {
        const requerido = valid(null, required(value, null)) === true;

        if (!requerido) {
          resetColors("red");
          return "La contraseña nueva es requerida.";
        }
        const minimo = valid("minimo", minlength(value, null, 8)) === true;
        const mayuscula =
          valid("mayuscula", regex(value, null, /[A-ZÑ]/)) === true;
        const minuscula =
          valid("minuscula", regex(value, null, /[a-zñ]/)) === true;
        const numero = valid("numero", regex(value, null, /[0-9]/)) === true;
        const especial =
          valid("especial", regex(value, null, /[?!¡¿*+\-_$#%]/)) === true;

        if (value === password.old)
          return "La contraseña nueva no puede ser igual a la actual.";

        if (minimo && mayuscula && minuscula && numero && especial) return true;

        return "La contraseña no cumple con los requisitos mínimos.";
      },
    ],
    password_confirm: [
      (value) =>
        required(value, "La confirmación de la contraseña es requerida"),
      (value) => value === password.new || "Las contraseñas no coinciden",
    ],
  };

  async function changePasswordFtn() {
    const { valid } = await form_ref.value.validate();
    if (!valid) return;

    const { data, status } = await auth_service.changePassword({
      password_old: password.old,
      password: password.new,
      password_confirmation: password.confirm,
    });

    if (status === 200) {
      localStorage.clear();
      await router_ref.push({ name: "login" });

      utils_ref.setNotification({
        message: data.message || "Contraseña cambiada correctamente",
        type: "success",
      });
    }
  }
  const redirectPath = async (menu) => {
    const path = menu.at(0);

    if (path?.childs?.length > 0) {
      return redirectPath(path.childs);
    }

    return router_ref.push({ name: path?.nombreUri });
  };
  async function closeFtn() {
    if (store_ref.user_info_st?.user?.temp_pwd) {
      localStorage.clear();
      await router_ref.push({ name: "login" });
      return;
    }
    await redirectPath(store_ref.menu_st);
  }

  onMounted(() => {
    resetColors();
  });

  return {
    password,
    validates,
    validRulesColor,
    form_ref,
    resetColors,
    updatePassword,
    closeFtn,
  };
};
