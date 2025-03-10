// utilities
import App from "./App.vue";
import { createApp } from "vue";

// resources
import { registerPlugins } from "@/plugins";

// styles
import "@/assets/styles/index.scss";
import "@/assets/styles/font.scss";

import { BroadcastSession } from "@/plugins/broadcastSession";

const app = createApp(App);

const broadcastSession = BroadcastSession.getInstance();

broadcastSession.receiveReloadSession();

registerPlugins(app);

app.config.errorHandler = (err, vm, info) => {
    console.error('¡ADVERTENCIA!', err);
    console.error('Información de ViewModel:', vm);
    console.error('Información adicional:', info);
};

app.mount("#app");

console.info("%cAVISO IMPORTANTE:", "color: red; font-size: 20px; font-weight: bold;");
console.info("%cEsta es una consola de desarrollador y su uso indebido puede causar problemas de seguridad. ", "color: orange; font-size: 16px;");
console.info("%cAbsténgase de modificar o rastrear peticiones en esta consola a menos que sea un desarrollador autorizado.", "color: orange; font-size: 16px;");
console.info("%cEl uso no autorizado de esta consola podría tener repercusiones legales.", "color: orange; font-size: 16px;");
