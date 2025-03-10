<template>
  <v-app-bar scroll-behavior="hide" :elevation="0" color="primary">
        <v-app-bar-nav-icon v-if="mobile"
        @click="utils_store_ref.side_bar_st = !utils_store_ref.side_bar_st"
      />
    
    <!-- boton en la parte derecha del header -->
    <template v-slot:append >
      <div class="d-flex ga-sm-8 ga-4">
     <!--    <v-btn icon="mdi-bell-outline"> </v-btn> -->

        <div class="d-flex ga-sm-6 mr-sm-8 mr-2 ga-4">
          <div>
            <h4>{{ auth_store_ref?.user_info_st?.user?.nombre}}</h4>
            <p class="text-grey-lighten-1">{{  auth_store_ref?.user_info_st?.user?.rol  }}</p>
          </div>
          <v-avatar>
            <v-img
              alt="John"
              :src="`https://ui-avatars.com/api/?name=${auth_store_ref?.user_info_st?.user?.nombre}`"
            ></v-img>
          </v-avatar>
        </div>
      </div>

    </template>
  </v-app-bar>
</template>

<script setup>
// utilities
import { useUtilsStore } from "../../store/utils";
import { useDisplay } from 'vuetify'

// stores
import { useAuthStore } from "../../store/auth";

// services

// references

const auth_store_ref = useAuthStore();
const utils_store_ref = useUtilsStore();
const { mobile } = useDisplay()



</script>
