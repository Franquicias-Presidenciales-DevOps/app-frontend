<template>
  <div class="d-flex text-center justify-center flex-column">
    <span class="title-login text-primary"> Franquicias Presidenciales </span>
  </div>
  <v-form @submit.prevent="LoginFtn" class="mb-10 mt-5" ref="form">
    <div class="text-center">
      <span class="subtitle-login text-primary"> Iniciar sesión </span>
    </div>

    <div class="px-10">
      <div class="mt-4">
        <v-text-field
          :rules="RULES_CONST.user_var"
          autocomplete="username"
          label="Correo electrónico"
          placeholder="Ingresa tu correo electrónico"
          maxlength="50"
          v-model="user_var"
          prepend-inner-icon="mdi-account"
        />
      </div>
      <div>
        <v-text-field
          :rules="RULES_CONST.pass_var"
          :type="show_pass_var ? 'text' : 'password'"
          autocomplete="current-password"
          class="pt-3"
          label="Contraseña"
          maxlength="50"
          placeholder="Ingresa tu contraseña"
          v-model="pass_var"
          prepend-inner-icon="mdi-lock"
        >
          <template #append-inner>
            <v-btn
              :disabled="!pass_var"
              :icon="show_pass_var ? 'mdi-eye-off' : 'mdi-eye'"
              @click="show_pass_var = !show_pass_var"
              :color="getItemColor(1)"
              variant="plain"
            />
          </template>
        </v-text-field>
      </div>
    </div>
    <div class="mt-2 d-flex justify-center">
      <v-btn color="primary" height="40" type="submit">
        <span> Iniciar sesión </span>
      </v-btn>
    </div>

    <br />
    <div class="d-flex justify-center text-center flex-column">
      <spacer-component />
      <recovery-password-component />
    </div>
  </v-form>
</template>

<script setup>
import RecoveryPasswordComponent from "../components/RecoveryPasswordComponent.vue";
import { useLogin } from "../composables/useLogin";

const {
  form,
  user_var,
  pass_var,
  show_pass_var,
  getItemColor,
  RULES_CONST,
  LoginFtn,
} = useLogin();
</script>

<style lang="scss" scoped>
.title-login {
  font-size: 1.65rem;
  font-weight: 600;
  line-height: 48px;
}

.subtitle-login {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 36px;
  text-align: left;
}

.custom-link {
  font-size: 0.875rem;
  font-weight: 400;
  line-height: 19.2px;

  &:hover {
    text-decoration: underline;
  }
}
</style>
