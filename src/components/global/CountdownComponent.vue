<template>
  <div>
    <p>{{ time_left_var }}</p>
  </div>
</template>

<script setup>
// utilities
import { ref, onMounted } from "vue";
import dayjs from "dayjs";

// props
const props = defineProps({
  valueProp: {
    type: String,
    required: true,
  },
});

// variables
const time_left_var = ref(null);

// regular functions
/**
 * @description Función para calcular el tiempo restante
 */
const CalculateTimeFtn = () => {
  const target_date_scp_var = dayjs(props.valueProp);
  const now_scp_var = dayjs();
  const difference_scp_var = target_date_scp_var.diff(now_scp_var, "second");

  const seconds_scp_var = difference_scp_var % 60;
  const minutes_scp_var = Math.floor((difference_scp_var / 60) % 60);
  const hours_scp_var = Math.floor((difference_scp_var / 3600) % 24);
  const days_scp_var = Math.floor(difference_scp_var / 86400);

  time_left_var.value = `${days_scp_var} días, ${hours_scp_var} horas, ${minutes_scp_var} minutos, ${seconds_scp_var} segundos`;
};

onMounted(() => {
  CalculateTimeFtn();
  setInterval(CalculateTimeFtn, 1000);
});
</script>
