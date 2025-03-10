<template>
  <v-dialog max-width="500" v-model="isActive">
    <template v-slot:activator>
      <div>
        <a @click="isActive = true" class="text-grey text-no-style custom-link">
          <span> Recupera tu contraseña</span>
        </a>
      </div>
    </template>

    <template v-slot:default="{ isActive }">
      <v-card class="rounded-xl">
        <v-card-text
          class="d-flex flex-column text-primary text-no-style px-12 my-8"
        >
          <span class="title-modal mx-auto"> Recuperar contraseña </span>
          <p class="subtitle-modal text-center">
            Se enviará un correo con los pasos para restablecer tu contraseña.
          </p>
          
          <v-form ref="form_input">
            <v-text-field
              :rules="RULES_CONST.email_var"
              autocomplete="email"
              label="Correo electrónico"
              placeholder="Ingresa tu correo electrónico"
              maxlength="50"
              v-model="email_var"
              prepend-inner-icon="mdi-account"
            />
          </v-form>

            <div class="mt-6 d-flex flex-column flex-sm-row ga-4 ga-sm-8 justify-center">
              <v-btn
                class=" button-extra"
                color="primary"
                height="40"
                variant="outlined"
                @click="isActive.value = false"
              >
                <span> Cancelar </span>
              </v-btn>
              <v-btn
                class="button-extra"
                color="primary"
                height="40"
                type="submit"
                @click="recuperarPasswordFN(email_var)"
              >
                <span> Enviar   </span>
              </v-btn>
            </div>
          
        </v-card-text>
      </v-card>
    </template>
  </v-dialog>

  <modal-confirmation-component
    v-model="show_alert_var"
    icon-type
    icon="mdi-check-circle-outline"
    subtitle="Correo enviado con éxito para restablecer tu contraseña."
    @accept="show_alert_var = false; isActive = false"
  />
</template>

<script setup>
// TODO: Migrar código a composable, cuando se agregue la funcionalidad de envío de correo - 26/06/2024
import { ref, watch } from "vue";

import { required, email } from "@/utils/validations";
import { useRecuperarPassword } from "../composables/useRecuperarContraseña";

const { email_var, isActive, show_alert_var,RULES_CONST, form_input,
  recuperarPasswordFN,
 } = useRecuperarPassword();



watch(isActive, (value) => {
  if (value === false) {
    email_var.value = null;
  }
});
</script>

<style scoped lang="scss">
.custom-link {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 19.2px;
  cursor: pointer;

  &:hover {
    text-decoration: underline;
  }
}
</style>
