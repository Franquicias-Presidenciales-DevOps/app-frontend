<template>
  <v-container fluid>
    <v-form @submit.prevent="SearchFn">
      <div class="d-flex ga-6 my-6">
        <h1 class="text-primary">Usuarios</h1>
        <v-btn
          v-if="VerifyRolesFn('CREAR_USUARIO')"
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          @click="modal_usuario?.openModal"
        >
          Agregar
        </v-btn>
      </div>
      <br />
      <v-row>
        <v-col cols="12" sm="6">
          <v-text-field
            :rules="RULES.search_var"
            v-model.trim="temp_search_var"
            placeholder="Buscar usuario"
            maxLength="50"
            label="Buscar"
          ></v-text-field>
        </v-col>

        <v-col cols="12" sm="6">
          <div class="d-flex ga-4 flex-sm-row flex-column">
            <v-btn
              class="text-none button-extra"
              ripple
              height="45"
              color="primary"
              type="submit"
              >Buscar</v-btn
            >

            <v-btn
              class="text-none button-extra"
              ripple
              height="45"
              color="primary"
              variant="outlined"
              @click="CleanFormFn"
              >Limpiar</v-btn
            >
          </div>
        </v-col>

        <v-col>
          <v-data-table-server
            v-model:items-per-page="per_page_var"
            :headers="HEADERS"
            :loading="loading"
            :items="list_oficiales"
            :items-length="total_oficiales"
            :page="page"
            :search="search_var"
            @update:options="getListUsuarios"
            :mobile="smAndDown"
            disable-sort
          >
            <template v-slot:[`item.name`]="{ item }">
              {{ item.name }} {{ item.last_name }}
            </template>

            <template v-slot:[`item.activo`]="{ item }">
              <v-chip v-show="item?.is_blocked" color="orange">
                Bloqueado
              </v-chip>
              <v-chip v-show="item.activo && !item?.is_blocked" color="green">
                Activo
              </v-chip>
              <v-chip v-show="!item.activo && !item?.is_blocked" color="red">
                Inactivo
              </v-chip>
            </template>

            <template
              v-slot:[`item.actions`]="{ item }"
              v-if="VerifyRolesFn('ACTUALIZAR_USUARIO')"
            >
              <v-btn
                icon="mdi-pencil-outline"
                variant="plain"
                @click="modal_usuario?.openModeEdit(item)"
                v-tooltip:bottom="'Editar'"
              />
              <v-btn
                v-if="item.activo && !item.is_blocked"
                icon="mdi-trash-can-outline"
                variant="plain"
                @click="openModalConfirmation(item)"
                v-tooltip:bottom="'Desactivar'"
              />
              <v-btn
         
              v-else-if="VerifyRolesFn('DESBLOQUEAR_USUARIO') && item.is_blocked"
                icon="mdi-lock-open-outline"
                variant="plain"
                @click="openModalConfirmation(item)"
                v-tooltip:bottom="'Desbloquear'"
              />
              <v-btn
                v-else
                @click="openModalConfirmation(item)"
                icon="mdi-restore"
                variant="plain"
                v-tooltip:bottom="'Activar'"
              />
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-form>
  </v-container>

  <modal-create-edit-component
    ref="modal_usuario"
    @refresh="getListUsuarios"
  ></modal-create-edit-component>

  <modal-confirmation-component
    v-if="!modal_confirmation.is_blocked"
    show-cancel
    :title="!modal_confirmation.is_active ? 'Activar' : 'Desactivar'"
    v-model="modal_confirmation.show"
    :subtitle="`¿Está seguro de ${
      !modal_confirmation.is_active ? 'activar' : 'desactivar'
    } el registro seleccionado?`"
    @accept="changeStatusUsuarioFn(modal_confirmation.id)"
    @cancel="modal_confirmation.show = false"
  >
  </modal-confirmation-component>

  <modal-confirmation-component
    v-else
    show-cancel
    title="Desbloquear usuario"
    v-model="modal_confirmation.show"
    subtitle="¿Está seguro de desbloquear el registro seleccionado?"
    @accept="unblockedUsuario(modal_confirmation.id)"
    @cancel="modal_confirmation.show = false"
  >
  </modal-confirmation-component>
</template>

<script setup>
import { useUsuario } from "../composables/useUsuario";
import { useDisplay } from "vuetify";
import { VerifyRolesFn } from "@/utils/global_functions";
import ModalCreateEditComponent from "../components/ModalCreateEditComponent.vue";
const { smAndDown } = useDisplay();
const {
  search_var,
  temp_search_var,
  loading,
  RULES,
  HEADERS,
  list_oficiales,
  total_oficiales,
  per_page_var,
  page,
  getListUsuarios,
  changeStatusUsuarioFn,
  CleanFormFn,
  SearchFn,
  modal_usuario,
  modal_confirmation,
  openModalConfirmation,
  unblockedUsuario,
} = useUsuario();
</script>

<style lang="scss" scoped></style>
