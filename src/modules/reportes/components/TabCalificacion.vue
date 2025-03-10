<template>
  <v-container fluid>
    <v-form @submit.prevent="SearchFn">
      <v-row>
        <!-- Buscar -->
        <v-col cols="12" sm="6" lg="4">
          <v-text-field
            v-model.trim="temp_search_var"
            :rules="RULES.search"
            label="Buscar"
            placeholder="Buscar"
            maxLength="150"
          ></v-text-field>
        </v-col>

        <!-- Entidad -->
        <v-col cols="12" sm="6" lg="4">
          <v-select
            v-model="entidad"
            :items="selectEntidades"
            label="Entidad"
            placeholder="Entidad"
            item-title="text"
            item-value="value"
          ></v-select>
        </v-col>

        <!--Botone de Buscar-->
        <v-col cols="12" sm="6" lg="2">
          <v-btn
            class="text-none button-extra"
            ripple
            height="45"
            width="100%"
            color="primary"
            type="submit"
            text="Buscar"
          />
        </v-col>
        <v-spacer></v-spacer>
        <!--Boton de Limpiar-->
        <v-col cols="12" sm="6" lg="2">
          <v-btn
            class="text-none button-extra"
            ripple
            height="45"
            width="100%"
            color="primary"
            variant="outlined"
            text="Limpiar"
            @click="CleanFormFn"
          />
        </v-col>

        <v-col cols="12" sm="12" lg="9">
          <!-- Alerta -->
          <v-alert
            border="start"
            color="info"
            variant="tonal"
            type="info"
            density="compact"
            text="Las clasificaciones mostradas en la tabla, están basadas en promedios."
          >
          </v-alert>
        </v-col>

        <!-- Tabla -->
        <v-col cols="12" sm="12" lg="12">
          <v-data-table-server
            :headers="HEADERS"
            :items="listEntidades"
            :items-length="totalEntidades"
            :page="page"
            v-model:items-per-page="per_page"
            :search="search"
            :loading="loading"
            :mobile="smAndDown"
            @update:options="getListEntidades"
          >
          </v-data-table-server>
        </v-col>
      </v-row>
    </v-form>
  </v-container>
</template>

<script setup>
import { onMounted } from "vue";
import { useTabCalificacion } from "../composables/useTabCalificacion";
import { useDisplay } from "vuetify";

const { smAndDown } = useDisplay();

const {
  search,
  listEntidades,
  totalEntidades,
  per_page,
  page,
  entidad,
  loading,
  HEADERS,
  RULES,
  selectEntidades,
  temp_search_var,
  CleanFormFn,
  getListEntidades,
  getEntidades,
  getClasificaciones,
  SearchFn,
} = useTabCalificacion();

onMounted(() => {
  getClasificaciones();
  getEntidades();
  getListEntidades();
});
</script>

<style lang="scss" scoped>
:deep(.v-alert__content) {
  color: black;
}
</style>
