import { useAuthStore } from "@/store/auth";
import dayJS from "dayjs";


export const VerifyRolesFn = (...roles_params) => {
  const store_ref = useAuthStore();

  const roles_store = store_ref?.user_info_st?.user?.permisos;

  return roles_params.every((role) => roles_store?.includes(role));
};

export const FormatCurrencyFn = (value, symbol = true) => {
  return Intl.NumberFormat("en-US", {
    style: symbol ? "currency" : "decimal",
    currency: "USD",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
};

export const VerifyDuiFn = (value) => {
  if (value === null) return false;
  let valido = false;

  if (value.length === 10) {
    if (value !== "00000000-0") {
      let [digitos, validador] = value.split("-");
      if (typeof digitos !== "undefined" && typeof validador !== "undefined") {
        if (validador.length === 1) {
          digitos = digitos.split("");

          validador = parseInt(validador, 10);
          digitos = digitos.map((digito) => parseInt(digito, 10));
          let suma = digitos.reduce(
            (total, digito, index) => (total += digito * (9 - index)),
            0
          );

          let mod = suma % 10;
          mod = validador === 0 && mod === 0 ? 10 : mod;

          let resta = 10 - mod;

          if (resta === validador) {
            valido = true;
          }
        }
      }
    }
  }
  return valido;
};

export const VerifyNitFn = (value) => {
  if (!value || value.length !== 17 || value === "0000-000000-000-0") {
    return false;
  }

  if (!value.match(/^[0-9]{4}-[0-9]{6}-[0-9]{3}-[0-9]$/)) {
    return false;
  }

  const [ubicacion, fecha, correlativo, validador] = value.split("-");
  const digitos = (ubicacion + fecha + correlativo).split("").map(Number);

  let suma = 0;
  let mod = 0;

  if (parseInt(correlativo, 10) <= 100) {
    suma = digitos.reduce(
      (total, digito, index) => total + digito * (14 - index),
      0
    );
    mod = suma % 11;
    mod = mod === 10 ? 0 : mod;
  } else {
    suma = digitos.reduce(
      (total, digito, index) =>
        total + digito * (3 + 6 * Math.floor((index + 5) / 6) - (index + 1)),
      0
    );
    mod = suma % 11;
    mod = mod > 1 ? 11 - mod : 0;
  }

  return mod === parseInt(validador, 10);
};

export const DateFormatFn = (value, hour = false) => {
  if (value) {
    if (hour) {
      return dayJS(value).format("DD/MM/YYYY hh:mm a");
    } else {
      return dayJS(value).format("DD/MM/YYYY");
    }
  } else return dayJS().format("DD/MM/YYYY");
};

export const DateFormattedFn = (
  value,
  formatString = "DD/MM/YYYY HH:mm:ss"
) => {
  if (value) {
    return dayJS(value).format(formatString);
  } else return dayJS().format(formatString);
};
export const DateFormattFn = (value, formatString = "DD/MM/YYYY HH:mm:ss") => {
  if (value) {
    return dayJS(value).format(formatString);
  } else {
    return 'N/A';
  }
};
export const DateAddDaysFn = (value, days, format= "YYYY-MM-DD") => {
  return dayJS(value).add(days, "day").format(format);
};

export const DateRestDaysFn = (value, days, format= "YYYY-MM-DD") => {
  return dayJS(value).subtract(days, "day").format(format);
};

//Clousure para evitar peticiónes simultaneas
export const eventHandler = (callback, interval = 300) => {
  let blocked = false;
  return async function (event) {
    if (blocked) return;
    
    blocked = true;
    await callback(event);

    setTimeout(() => (blocked = false), interval);
  };
};
