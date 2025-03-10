
<template>
  <div class="d-flex flex-column align-center justify-center pa-6">
    <img src="@/assets/img/encrypted.svg" class="mx-auto d-block" />
    <h1 class="py-2 text-primary text-center">Cambiar contraseña</h1>
    <br />

    <v-sheet class="pa-sm-6" elevation="0" :width="!smAndDown ? '400' : '100%'">
      <v-form @submit.prevent="updatePassword" ref="form_ref">
        <v-row>
          <v-col cols="12">
            <password-text-field-component
              v-model.trim="password.old"
              label="Contraseña actual *"
              placeholder="Ingresa tu contraseña actual"
              :rules="validates.password_old"
              @input="form_ref?.validate()"
            />
          </v-col>
          <v-col cols="12">
            <password-text-field-component
              :disabled="!password.old"
              v-model.trim="password.new"
              label="Contraseña *"
              placeholder="Ingresa tu contraseña"
              :rules="validates.password"
            />
          </v-col>
          <v-col cols="12">
            <password-text-field-component
              :disabled="!password.new"
              v-model.trim="password.confirm"
              label="Confirmar contraseña *"
              placeholder="Confirma tu contraseña"
              :rules="validates.password_confirm"
            />
          </v-col>

          <v-col cols="12">
            <ul class="list-decorator">
              <li>
                Mínimo 8 caracteres
                <v-icon :color="validRulesColor.minimo"
                  >mdi-check-circle</v-icon
                >
              </li>
              <li>
                Al menos una letra mayúscula
                <v-icon :color="validRulesColor.mayuscula"
                  >mdi-check-circle</v-icon
                >
              </li>
              <li>
                Al menos una letra minúscula
                <v-icon :color="validRulesColor.minuscula"
                  >mdi-check-circle</v-icon
                >
              </li>
              <li>
                Al menos un número
                <v-icon :color="validRulesColor.numero"
                  >mdi-check-circle</v-icon
                >
              </li>
              <li>
                Al menos un carácter especial ?!¡¿*+-_#$%
                <v-icon :color="validRulesColor.especial"
                  >mdi-check-circle</v-icon
                >
              </li>
            </ul>
          </v-col>
          <v-col cols="12">
            <div class="d-flex justify-center ga-6 flex-lg-row flex-column">
              <v-btn
                @click="closeFtn"
                rounded
                class="text-none button-extra"
                ripple
                height="45"
                color="primary"
                :block="mobile"
                variant="outlined"
              >
                <span> Cancelar </span>
              </v-btn>

              <v-btn
                @click="
                  () => {
                    resetColors();
                  }
                "
                type="submit"
                rounded
                class="text-none button-extra"
                ripple
                height="45"
                color="primary"
                :block="mobile"
              >
                <span> Aceptar </span>
              </v-btn>
            </div>
          </v-col>
        </v-row>
      </v-form>
    </v-sheet>
  </div>
</template>

<script setup >
import PasswordTextFieldComponent from "../components/PasswordTextFieldComponent.vue";
import { useDisplay } from "vuetify";
import { usePwdChange } from "../composables/usePwdChange";
const { mobile, smAndDown } = useDisplay();

const {
  password,
  validates,
  validRulesColor,
  resetColors,
  form_ref,
  updatePassword,
  closeFtn,
} = usePwdChange();
</script>

<style lang="scss" scoped>
:deep(.list-decorator) li {
  list-style: circle inside;
  font-size: 0.94rem;
}
</style>