<template>
  <v-dialog max-width="600" v-model="model" persistent>
    <v-card class="rounded-md">
      <v-card-text
        class="d-flex flex-column text-primary text-no-style px-md-12 my-8"
      >
        <span class="title-modal mx-auto" v-text="title" />
        <p class="subtitle-modal text-center mb-8" v-text="subtitle" />

        <slot name="content" />

        <div class="d-flex flex-column flex-sm-row justify-center mt-2 ga-8">
          <v-btn
            v-show="showCancel"
            class="button-extra"
            color="primary"
            height="40"
            variant="outlined"
            @click="emit('cancel')"
          >
            <span> {{ cancelMessage }} </span>
          </v-btn>
          <v-btn
            class="button-extra"
            color="primary"
            height="40"
            @click="emit('accept')"
          >
            <span> {{ acceptMessage }} </span>
          </v-btn>
        </div>
      </v-card-text>
    </v-card>
  </v-dialog>
</template>

<script setup>
const model = defineModel();

// emits
const emit = defineEmits(["accept", "cancel"]);

// props
const props = defineProps({
  title: String,
  subtitle: String,
  cancelMessage: {
    type: String,
    default: "Cancelar",
  },
  acceptMessage: {
    type: String,
    default: "Aceptar",
  },
  showCancel: {
    type: Boolean,
    default: false,
  },
});
</script>

<style lang="scss" scoped>
</style>