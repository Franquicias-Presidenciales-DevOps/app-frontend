<template>
  <v-navigation-drawer
    style="border-top-right-radius: 25px"
    v-model="drawer"
    rail
    temporary
    :elevation="1"
    :scrim="false"
    :rail-width="railWidth"
    disable-route-watcher
    :mobile="mobile"
  
  >
    <div class="d-flex justify-end pa-4">
      <v-app-bar-nav-icon
       :icon="mobile ? 'mdi-close' : 'mdi-menu'"
        @click="toggleSideBar"
      />

    </div>

    <v-list
      dense
      nav
      class="pt-3 px-4 d-flex flex-column ga-2"
      v-if="!utils_store_ref.side_bar_st || mobile"
    >
      <template v-for="primary in auth_store_ref.menu_st" :key="primary.id">
        <v-list-group
          color="primary"
          class="submenu"
          v-if="primary.childs && primary.childs.length"
        >
          <template v-slot:activator="{ props }">
            <v-list-item
              :prepend-icon="primary.icono"
              :title="primary.nombre"
              color="primary"
              base-color="primary"
              v-bind="props"
              class="title"
            >
              <v-tooltip activator="parent" location="end">
                {{ primary.nombre }}
              </v-tooltip>
            </v-list-item>
          </template>

          <template v-for="secondary in primary.childs" :key="secondary.id">
            <v-list-item
              :prepend-icon="null"
              :value="secondary.id"
              :title="secondary.nombre"
              class="subtitle"
              base-color="primary"
              @click="redirectSiderBar(secondary)"
            >
              <v-tooltip activator="parent" location="end">
                {{ secondary.nombre }}
              </v-tooltip>
            </v-list-item>
          </template>
        </v-list-group>
        <v-list-item
          :prepend-icon="primary.icono"
          :title="primary.nombre"
          :value="primary.id"
          base-color="primary"
          @click="redirectSiderBar(primary)"
          class="title"
          color="primary"
          v-else
        >
          <v-tooltip activator="parent" location="end">
            {{ primary.nombre }}
          </v-tooltip>
        </v-list-item>
      </template>
    </v-list>

    <template v-slot:append v-if="!utils_store_ref.side_bar_st  || mobile">
      <v-list
        base-color="text"
        :disabled="false"
        class="mb-4 d-flex flex-column ga-2 px-4"
      >
        <template v-for="(item, i) in LIST_OPTIONS_CONST" :key="i">
          <v-list-item
            class="item-menu"
            :prepend-icon="item.icon"
            :title="item.title"
            :value="item"
            @click="HandleActionFtn(item.id)"
            base-color="text"
            v-if="!item.hide"
          />
        </template>
      </v-list>
    </template>
  </v-navigation-drawer>
</template>

<script setup>
// stores
import { useUtilsStore } from "../../store/utils";
import { useAuthStore } from "../../store/auth";
import { useRouter } from "vue-router";
import { computed, ref } from "vue";
import { useDisplay } from 'vuetify'
import auth_service from "../../services/auth.services";
import { deleteDatabase } from "@/plugins/indexedDB";
import { BroadcastSession } from "@/plugins/broadcastSession";
// references
const utils_store_ref = useUtilsStore();
const auth_store_ref = useAuthStore();
const router_ref = useRouter();
const { mobile,width } = useDisplay()
const broadcastSession = BroadcastSession.getInstance();


const LIST_OPTIONS_CONST = [
  {
    id: 1,
    title: "Perfil",
    icon: "mdi-account",
    hide: true,
  },
  {
    id: 2,
    title: "Cambiar contraseña",
    icon: "mdi-lock-outline",
  },
  {
    id: 3,
    title: "Cerrar sesión",
    icon: "mdi-logout",
  },
];


const railWidth = computed(() => {

  if(mobile.value) return (width.value - 45) ;

  return utils_store_ref.side_bar_st ? 80 : 300;
});


const drawer = computed(() => {
  return mobile.value ? utils_store_ref.side_bar_st : true;
});


// async functions
/**
 * @description Funcion para cerrar sesion
 * @async
 */
const CerrarSesionFtn = async () => {
  const { status } = await auth_service.logout();

  if (status === 200) {
    auth_store_ref.$reset();
    utils_store_ref.$reset();
    broadcastSession.sendReloadWindow();
    deleteDatabase("catalogos");
    router_ref.push({ name: "login" });
  }
};

const redirectSiderBar = (item) => {
  utils_store_ref.side_bar_st = !utils_store_ref.side_bar_st;
  router_ref.push({ name: item.nombreUri, path: item.uri });
};

const toggleSideBar = () => {
  utils_store_ref.side_bar_st = !utils_store_ref.side_bar_st;
};

// regular functions
/**
 * @description Funcion para manejar las acciones del menu
 * @param {Number} id_option
 */
const HandleActionFtn = (id_option_param) => {
  switch (Number(id_option_param)) {
    case 1: // perfil
      break;
    case 2: // cambiar contraseña
    redirectSiderBar({ nombreUri: "changePassword" });
      break;
    case 3: // cerrar sesion
      CerrarSesionFtn();
      break;
    default:
      break;
  }
};
</script>
<style scoped lang="scss">
.title :deep(.v-list-item-title) {
  font-size: 16px;
}

.subtitle :deep(.v-list-item-title) {
  font-size: 14px;
}

:deep(.v-list-item) {
  padding: 0.6em !important;
}

:deep(.v-list-group__items) {
  padding-left: 0.2em !important;
}
</style>
