<template>
  <v-dialog max-width="500" v-model="model">
    <v-card class="rounded-md">
      <v-card-text
        class="d-flex flex-column text-primary text-no-style px-12 my-8"
      >
        <span v-show="titleType" class="title-modal mx-auto mb-8" v-text="title" />
        <v-icon v-show="iconType" :color="iconColor" :icon="icon" size="100" class="mx-auto mb-6" />
        <p class="subtitle-modal text-center" v-text="subtitle" />
        <div class="mt-6 d-flex flex-column flex-sm-row justify-center ga-4">
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
  icon: {
    type: String,
    default: "mdi-alert-circle-outline",
  },
  titleType: {
    type: Boolean,
    default: true,
  },
  iconType: {
    type: Boolean,
    default: false,
  },
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
  iconColor: {
    type: String,
    default: "primary",
  },
});
</script>