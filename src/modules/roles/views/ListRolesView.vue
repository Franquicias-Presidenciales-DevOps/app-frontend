<template>
  <v-container fluid>
    <v-form @submit.prevent="SearchFn">
      <div class="d-flex ga-6 my-6">
        <h1 class="text-primary">Roles</h1>
        <v-btn
          href="/agregar-rol"
          class="text-none button-extra"
          ripple
          height="45"
          color="primary"
          v-if="VerifyRolesFn('CREAR_ROL')"
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
            placeholder="Buscar rol"
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
            >
              Buscar
            </v-btn>

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
            :items="listRoles"
            :items-length="totalRoles"
            :page="page"
            :search="search_var"
            @update:options="FetchListrolesFn"
            :mobile="smAndDown"
            disable-sort
          >
            <!--Slot de fechas-->

            <template v-slot:[`item.created_at`]="{ item }">
              {{ DateFormatFn(item.created_at) }}
            </template>

            <!-- slot fecha estado -->
            <template v-slot:[`item.activo`]="{ item }">
              <v-chip v-show="item.activo" color="green"> Activo </v-chip>
              <v-chip v-show="!item.activo" color="red"> Inactivo </v-chip>
            </template>

            <!-- slot fecha actions -->
            <template v-slot:[`item.actions`]="{ item }">
              <template v-if="VerifyRolesFn('ACTUALIZAR_ROL')">
                <v-btn
                  icon="mdi-pencil-outline"
                  variant="plain"
                  v-tooltip:bottom="'Editar'"
                  :href="'/editar-rol/' + item.id"
                />
                <v-btn
                  v-if="item.activo"
                  icon="mdi-trash-can-outline"
                  variant="plain"
                  @click="openModalConfirmation(item)"
                  v-tooltip:bottom="'Desactivar'"
                />
                <v-btn
                  v-else
                  @click="openModalConfirmation(item)"
                  icon="mdi-restore"
                  variant="plain"
                  v-tooltip:bottom="'Activar'"
                />
              </template>
            </template>
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-form>
  </v-container>

  <modal-confirmation-component
    show-cancel
    :title="`${!modal_confirmation.is_active ? 'Activar' : 'Desactivar'} rol`"
    v-model="modal_confirmation.show"
    :subtitle="`¿Está seguro de ${
      !modal_confirmation.is_active ? 'activar' : 'desactivar'
    } el registro seleccionado?`"
    @accept="changeStatusRoleFn(modal_confirmation.id)"
    @cancel="modal_confirmation.show = false"
  >
  </modal-confirmation-component>
</template>

<script setup>
import { useRoles } from "@/modules/roles/composables/useRoles";
import { DateFormatFn } from "@/utils/global_functions";
import { useDisplay } from "vuetify";
import { onMounted } from "vue";
import { VerifyRolesFn } from "@/utils/global_functions";

const { smAndDown } = useDisplay();
const {
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
} = useRoles();

onMounted(() => {
  FetchListrolesFn();
});
</script>

<style lang="scss" scoped></style>
