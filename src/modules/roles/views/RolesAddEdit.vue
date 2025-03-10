<template>
  <div class="container" style="margin-bottom: 150px">
    <!-- Encabezado de la pagina -->
    <v-row class="d-flex my-6">
      <v-col
        cols="12"
        sm="6"
        align="center"
        style="display: flex; margin-top: 10px"
      >
        <h1
          class="text-primary"
          v-if="ruta.currentRoute._value.name == 'editarRol'"
        >
          Editar rol
        </h1>

        <h1 class="text-primary" v-else>Agregar rol</h1>
      </v-col>
      <!-- Boton regresar -->
      <v-col
        cols="12"
        sm="6"
        align="center"
        style="display: flex; justify-content: space-evenly"
      >
        <v-btn
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          variant="outlined"
          style="margin-top: 10px"
          @click="regresar"
        >
          Regresar
        </v-btn>

        <!-- Boton Actualizar -->
        <v-btn
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          v-if="ruta.currentRoute._value.name == 'editarRol'"
          style="margin-top: 10px; margin-right: 10px"
          @click="actualizar"
        >
          Actualizar
        </v-btn>

        <!-- Boton Guardar -->
        <v-btn
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          v-else
          style="margin-top: 10px; "
          @click="guardar"
        >
          Guardar
        </v-btn>
      </v-col>
    </v-row>

    <v-form ref="form_ref" lazy-validation>
      <!-- Nombre del rol Editar -->
      <v-text-field
        v-if="ruta.currentRoute._value.name == 'editarRol' && EditItem"
        v-model="EditItem.nombre"
        label="Nombre del rol*"
        placeholder="Ingrese el nombre del rol"
        outlined
        class="mr-6"
        width="100%"
        :rules="RULES.nombre"
        @keyup="ValidarNombreEdit"
      ></v-text-field>

      <!-- Nombre del rol Agregar -->
      <v-text-field
        v-else
        v-model="form.nombre"
        label="Nombre del rol*"
        placeholder="Ingrese el nombre del rol"
        outlined
        class="mr-6"
        width="100%"
        :rules="RULES.nombre"
        @keyup="ValidarNombre"
      ></v-text-field>

      <h2
        class="text-primary"
        align="start"
        style="display: flex;"
      >
        Recursos
      </h2>

      <!--Permisos en Editar -->
      <template v-if="ruta.currentRoute._value.name == 'editarRol'">
        <template v-for="(item, index) in catalogos" :key="item.id">
          <v-card class="mt-10 elevation-8" style="width: 100%">
            <v-toolbar light color="white" rounded="xl" density="compact">
              <v-btn
                :icon="isOpen[index] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="AbrirCerrar(index)"
              ></v-btn>
              <h3 class="text-primary">{{ index }}</h3>
              <v-checkbox
                v-show="isOpen[index]"
                v-model="item.seleccionarTodos"
                @click="seleccionarTodos(item)"
                label="Seleccionar todos"
                style="
                  margin-left: auto;
                  margin-right: 10px;
                  margin-top: 32px;
                  margin-bottom: 10px;
                "
                color="primary"
              ></v-checkbox>
            </v-toolbar>
            <v-divider
              v-show="isOpen[index]"
              color="indigo-darken-4"
              thickness="1px"
              opacity="100"
            ></v-divider>
            <v-expand-transition>
              <v-card-text v-show="isOpen[index]">
                <v-row no-gutter align="start">
                  <PermisoCheckbox
                    v-model="form.permisos"
                    v-for="(opcion, indice) in item"
                    :key="indice"
                    :indice="indice"
                    :opcion="opcion"
                    :selectedPermisos="form.permisos"
                    @-add-permiso="AddPermiso(opcion, indice, item)"
                    :rules="RULES.permisos"
                  />
                </v-row>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </template>
      </template>

      <!--Permisos en Agregar -->
      <template v-else>
        <template v-for="(item, index) in catalogos" :key="item.id">
          <v-card class="mt-10 elevation-8" style="width: 100%">
            <v-toolbar light color="white" rounded="xl" density="compact">
              <v-btn
                :icon="isOpen[index] ? 'mdi-chevron-up' : 'mdi-chevron-down'"
                @click="AbrirCerrar(index)"
              ></v-btn>
              <h3 class="text-primary">{{ index }}</h3>
              <v-checkbox
                v-show="isOpen[index]"
                v-model="item.seleccionarTodos"
                @click="seleccionarTodos(item)"
                label="Seleccionar todos"
                style="
                  margin-left: auto;
                  margin-right: 10px;
                  margin-top: 32px;
                  margin-bottom: 10px;
                "
                color="primary"
              ></v-checkbox>
            </v-toolbar>
            <v-divider
              v-show="isOpen[index]"
              color="indigo-darken-4"
              thickness="1px"
              opacity="100"
            ></v-divider>
            <v-expand-transition>
              <v-card-text v-show="isOpen[index]">
                <v-row no-gutter align="start">
                  <PermisoCheckbox
                    v-model="form.permisos"
                    v-for="(opcion, indice) in item"
                    :key="indice"
                    :indice="indice"
                    :opcion="opcion"
                    :selectedPermisos="form.permisos"
                    @-add-permiso="AddPermiso(opcion, indice, item)"
                    :rules="RULES.permisos"
                  />
                </v-row>
              </v-card-text>
            </v-expand-transition>
          </v-card>
        </template>
      </template>
    </v-form>
  </div>
</template>

<script setup>
import { useRolesAddEdit } from "@/modules/roles/composables/useRolesAddEdit";
import { onMounted } from "vue";
import PermisoCheckbox from "../components/PermisoCheckbox.vue";
import router from "../router";

const {
  permisos,
  catalogos,
  AbrirCerrar,
  seleccionarTodos,
  regresar,
  guardar,
  isOpen,
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
} = useRolesAddEdit();

onMounted(() => {
  getListPermisos();
  if (ruta.currentRoute._value.name == "editarRol") {
    getPermiso(ruta.currentRoute._value.params.id);
  }
});
</script>

<style lang="scss" scoped>
</style>
