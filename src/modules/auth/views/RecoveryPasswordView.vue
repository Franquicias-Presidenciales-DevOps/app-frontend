<template>
  <div class="d-flex text-center justify-center flex-column">
    <span class="text-h4 font-weight-medium">Bienvenido</span>
    <span class="text-medium-emphasis">
      Por favor ingrese sus credenciales
    </span>
  </div>
  <v-form class="my-10">
    <div>
      <v-text-field
        autocomplete="username"
        class="pt-3"
        label="Usuario / correo electrónico"
        placeholder="Ingresa tu nombre de usuario / correo electrónico"
        prepend-inner-icon="mdi-email"
        variant="outlined"
      />
    </div>

    <div class="mt-2">
      <v-btn block class="text-none" color="info" height="52">
        <span> Enviar </span>
      </v-btn>
    </div>
  </v-form>
  <v-divider />
  <div class="d-flex text-center flex-column">
    <v-btn @click="$router.push('/login')" variant="text" class="text-none">
      <span> Regresar al login </span>
    </v-btn>
  </div>
</template>

<script setup>

</script>