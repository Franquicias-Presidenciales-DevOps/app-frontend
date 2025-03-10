<template>
  <v-text-field
    readonly
    :rules="rules"
    :model-value="formattedDate"
    @click:control="HandleClickControlFn"
    append-inner-icon="mdi-calendar"
    :placeholder="formattedDate"
    :label="label"
    base-color="primary"
    :clearable="!disabled"
    @click:clear="clearDate"
  >
    <v-menu
      style="width: fit-content; z-index: 100"
      transition="scroll-x-transition"
      activator="parent"
      :close-on-content-click="false"
      :disabled="disabled"
    >
      <v-card>
        <v-card-title class="d-flex justify-center align-center">
          <v-btn
            :disabled="currentYear <= new Date(minDate).getFullYear() + 1"
            class="year-button"
            icon
            @click="prevYear"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <span class="mx-4">{{ currentYear }}</span>
          <v-btn
            :disabled="currentYear >= new Date().getFullYear()"
            class="year-button"
            icon
            @click="nextYear"
          >
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-card-title>
        <v-divider></v-divider>
        <v-card-text>
          <v-row no-gutters>
            <v-col
              v-for="(month, index) in months"
              :key="index"
              cols="4"
              class="py-2 text-center"
            >
              <v-btn
                :disabled="
                  index > currentMonth &&
                  currentYear >= new Date().getFullYear()
                "
                @click="selectMonth(index)"
                :class="[
                  'custom-span',
                  { 'v-btn--selected': isSelectedMonth(index) },
                ]"
              >
                {{ month }}
              </v-btn>
            </v-col>
          </v-row>
        </v-card-text>
      </v-card>
    </v-menu>
  </v-text-field>
</template>
<script setup>
import { computed, ref, watch } from "vue";
import { DateFormattedFn } from "@/utils/global_functions";

const props = defineProps({
  format: {
    type: String,
    default: "YYYY-MM",
  },
  placeholder: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  maxDate: {
    type: String,
    default: null,
  },
  minDate: {
    type: String,
    default: null,
  },
  allowedDates: {
    type: Array,
    default: null,
  },
  rules: {
    type: Array,
    default: () => [],
  },
  responseFormat: {
    type: String,
    default: "YYYY-MM",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  weekdays: {
    type: Array,
    default: () => [0, 1, 2, 3, 4, 5, 6],
  },
  viewMode: {
    type: String,
    default: null,
  },
  name: {
    type: String,
  },
});

const emits = defineEmits(["click:control"]);

const date = defineModel({ value: null });
const currentMonth = ref(new Date().getMonth());
const currentYear = ref(new Date().getFullYear());

const months = [
  "ENE",
  "FEB",
  "MAR",
  "ABR",
  "MAY",
  "JUN",
  "JUL",
  "AGO",
  "SEP",
  "OCT",
  "NOV",
  "DIC",
];

const monthNames = [
  "Enero",
  "Febrero",
  "Marzo",
  "Abril",
  "Mayo",
  "Junio",
  "Julio",
  "Agosto",
  "Septiembre",
  "Octubre",
  "Noviembre",
  "Diciembre",
];

const formattedDate = ref("");

watch(date, () => {
  formattedDate.value = formatDate(date.value);
});

const formatDate = (dateValue) => {
  if (!dateValue) return "";
  const [year, month] = dateValue.split("-");
  return `${monthNames[parseInt(month) - 1]} ${year}`;
};

const selectMonth = (index) => {
  date.value = `${currentYear.value}-${(index + 1)
    .toString()
    .padStart(2, "0")}`;
};

const isSelectedMonth = (index) => {
  return (
    date.value ===
    `${currentYear.value}-${(index + 1).toString().padStart(2, "0")}`
  );
};

const prevYear = () => {
  currentYear.value--;
};

const nextYear = () => {
  currentYear.value++;
};

const HandleClickControlFn = () => {
  if (!props.disabled) {
    emits["click:control"];
  }
};

const clearDate = () => {
  date.value = null;
  formattedDate.value = "";
};
</script>
<style lang="scss" scoped>
.v-btn--selected {
  transition: all ease-in-out 0.4s;
  background-color: rgb(var(--v-theme-primary));
  padding: 0.2rem;
  color: white !important;
}

:deep(.v-field__input),
:deep(.v-field__input) input {
  cursor: pointer !important;
}

.year-button {
  border-radius: 5px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #e6e8eb !important;
}
</style>
