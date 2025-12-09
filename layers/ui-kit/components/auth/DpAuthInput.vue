<script setup lang="ts">
export interface DpAuthInputProps {
  modelValue: string;
  type?: "text" | "email" | "password" | "tel";
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  autocomplete?: string;
  icon?: string;
  id?: string;
}

const props = withDefaults(defineProps<DpAuthInputProps>(), {
  type: "text",
  required: false,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const inputId = computed(() => props.id || `input-${Math.random().toString(36).substring(2, 9)}`);

const inputClasses = computed(() => [
  "w-full px-4 py-2.5 border rounded-md bg-background text-foreground placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:border-transparent transition-colors",
  props.error
    ? "border-red-500 focus:ring-red-500"
    : "border-input focus:ring-ring",
  props.disabled && "opacity-50 cursor-not-allowed",
  props.icon && "pl-10",
]);
</script>

<template>
  <div class="w-full">
    <label
      v-if="label"
      :for="inputId"
      class="block text-sm font-medium text-foreground mb-2"
    >
      {{ label }}
      <span v-if="required" class="text-red-500">*</span>
    </label>

    <div class="relative">
      <Icon
        v-if="icon"
        :name="icon"
        class="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground"
      />

      <input
        :id="inputId"
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />
    </div>

    <p
      v-if="error"
      class="mt-1.5 text-sm text-red-500 flex items-center gap-1"
    >
      <Icon name="lucide:alert-circle" class="w-4 h-4" />
      {{ error }}
    </p>
  </div>
</template>
