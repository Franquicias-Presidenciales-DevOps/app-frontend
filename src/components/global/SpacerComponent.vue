<template>

<div>
  <svg
    :width="props.width"
    :height="props.height"
    viewBox="0 0 274 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <line y1="11.8311" x2="273.776" y2="11.8311" :stroke="props.color" />
    <rect width="40" height="24" transform="translate(117)" fill="white" />
    <path
      d="M132.624 12.936C132.624 10.488 134.576 8.712 136.992 8.712C139.408 8.712 141.36 10.488 141.36 12.936C141.36 15.4 139.408 17.192 136.992 17.192C134.576 17.192 132.624 15.4 132.624 12.936ZM134.208 12.936C134.208 14.632 135.472 15.848 136.992 15.848C138.528 15.848 139.776 14.632 139.776 12.936C139.776 11.256 138.528 10.056 136.992 10.056C135.472 10.056 134.208 11.256 134.208 12.936Z"
      :fill="props.color"
    />
  </svg>
</div>
</template>

<script setup>
const props = defineProps({
  color: {
    type: String,
    default: "#8F9197",
  },
  width: {
    type: String,
    default: "274",
  },

  height: {
    type: String,
    default: "24",
  },
});
</script>

<style></style>
