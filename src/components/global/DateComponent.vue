<template>
  <v-text-field
    readonly
    :rules="rules"
    :model-value="formatDate(date)"
    @click:control="HandleClickControlFn"
    append-inner-icon="mdi-calendar"
    placeholder="DD/MM/YYYY"
    :label="label"
    base-color="primary"
    :clearable="!disabled"
    @click:clear="date = null; date_picker = null"
    :hide-details="hideDetails"
  >
    <v-menu
      v-model="show_date_picker"
      activator="parent"
      :close-on-content-click="false"
      :disabled="disabled"
    >
      <v-date-picker
        color="primary"
        width="auto"
        type="year"
        :weekdays="weekdays"
        v-model="date_picker"
        @update:model-value="handleDateUpdate"
        :max="maxDate"
        :min="minDate"
        :allowed-dates="filterOnlyDates"
        no-title="false"
        hide-header
      >
      <!-- <template v-slot:title>
          <span class="text-no-style">Selecciona una fecha</span>
        </template>
        <template v-slot:header>
          <span class="font-weight-bold text-h6 pa-4">Fecha </span>
        </template> -->
      </v-date-picker>
    </v-menu>
  </v-text-field>
</template>

<script setup>
import { ref } from "vue";
import { DateFormattedFn } from "@/utils/global_functions";

const props = defineProps({
  format: {
    type: String,
    default: "DD/MM/YYYY",
  },
  placeholder: {
    type: String,
    default: "DD/MM/YYYY",
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
    default: "YYYY-MM-DD",
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
    default: "year",
  },
  name: {
    type: String,
  },
  hideDetails: {
    type: Boolean,
    default: false,
  },
});

const emits = defineEmits(["click:control"]);

const date_picker = ref(null);
const show_date_picker = ref(false);
const date = defineModel({});

const formatDate = (date, format = props.format) => {
  if (!date) return null;
  return DateFormattedFn(date, format);
};

const filterOnlyDates = (date) => {
  if (!props.allowedDates || props.allowedDates.includes(formatDate(date)))
    return true;
  return false;
};

const handleDateUpdate = (newDate) => {
  if (!newDate) return;

  // Convertir la fecha al formato YYYY-MM-DD
  const formattedDate = newDate.toISOString().split('T')[0];
  date.value = formattedDate;
  show_date_picker.value = false;
};

const HandleClickControlFn = () => {
  if (!props.disabled) {
    emits("click:control");
  }
};
</script>

<style lang="scss" scoped>

:deep(.v-field__input) {
  cursor: pointer !important;

  input {
    cursor: pointer !important;
  }
}

:deep(.v-date-picker-controls) {
  display: contents;
}

:deep(.v-date-picker-controls__month) {
  display: flex;
  justify-content: space-between;
}

:deep(.v-date-picker-month) {
  display: contents;
}

:deep(.v-date-picker-month__days) {
  display: grid;
  grid-template-columns: min-content min-content min-content min-content min-content min-content min-content;
  justify-content: none;
  column-gap: 0;
  flex: none;
}

:deep(.v-date-picker-month__day) {
  align-items: center;
  display: flex;
  justify-content: center;
  position: relative;
  height: auto;
  // width: 32px;
}

:deep(.v-date-picker-years__content) {
  display: grid;
  flex: 1 1;
  justify-content: space-around;
  grid-template-columns: repeat(3, 1fr);
  gap: 0px;
  padding-inline: 0px;
}

</style>
