<template>
  <section>
    <div class="d-flex flex-column justify-center mx-4" style="height: 100%">
      <div class="d-flex justify-center">
        <LottieAnimation
          ref="animation"
          :animation-data="NotFoundAnimation"
          :loop="true"
          :auto-play="true"
          :speed="1"
          style="width: 900px !important"
        />
      </div>
      <p
        class="mb-0 text-medium-emphasis text-center text-md-h2 text-sm-h4 text-h6"
      >
        La página que buscas no existe
      </p>
      <div class="mx-auto mt-12 d-flex flex-column flex-md-row">
        <v-btn
          @click="$router.push({ name: 'login' })"
          class="text-none mx-4"
          color="info"
          height="50"
          variant="outlined"
        >
          <span>Regresar al login</span>
        </v-btn>
      </div>
    </div>
  </section>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { LottieAnimation } from "lottie-web-vue";
import NotFoundAnimation from "@/assets/lottie/Animation404.json";

let animation = ref();
const has_token = ref(false);

onMounted(() => {
  setTimeout(() => {
    animation.value;
  }, 500);

  const token = localStorage.getItem("token");

  if (token) {
    has_token.value = true;
  }
});
</script>

<style lang="scss" scoped>
section {
  position: relative;
  width: 100%;
  height: 100vh;
}
</style>
