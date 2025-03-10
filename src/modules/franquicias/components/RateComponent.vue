<template>
  <v-slider
    :max="10"
    :min="0"
    :class="
      readonly
        ? 'hide-element pt-3 pb-1 px-3 px-md-0'
        : 'pt-3 pb-1 px-3 px-md-0'
    "
    color="primary"
    v-model="model"
    :readonly="readonly"
    :step="intCount ? 1 : null"
    thumb-label="always"
    hide-details
  />
</template>

<script setup>
const model = defineModel();

const props = defineProps({
  readonly: {
    type: Boolean,
    default: false,
  },
  maximo: {
    type: Number,
    default: "10",
  },
  intCount: {
    type: Boolean,
    default: true,
  },
});
</script>

<style lang="scss" scoped>
// slider background
:deep(.v-slider-track__background--opacity) {
  opacity: 100;
  background-color: #dce6f5 !important;
}

// thumb color
:deep(.v-slider-thumb__label) {
  background-color: #1c1e4d !important;

  &::before {
    color: #1c1e4d !important;
  }
}

.hide-element {
  :deep(.v-slider__container) {
    cursor: no-drop;
  }

  :deep(.v-slider-thumb__ripple),
  :deep(.v-slider-thumb__surface) {
    display: none !important;
  }
}
</style>