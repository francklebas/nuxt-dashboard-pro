<script setup lang="ts">
export interface DpPasswordInputProps {
  modelValue: string;
  label: string;
  placeholder?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  showStrength?: boolean;
  autocomplete?: string;
  id?: string;
}

const props = withDefaults(defineProps<DpPasswordInputProps>(), {
  required: false,
  disabled: false,
  showStrength: false,
  autocomplete: "current-password",
});

const emit = defineEmits<{
  "update:modelValue": [value: string];
}>();

const showPassword = ref(false);
const inputId = computed(() => props.id || `password-${Math.random().toString(36).substring(2, 9)}`);

const togglePasswordVisibility = () => {
  showPassword.value = !showPassword.value;
};

// Password strength calculation
const passwordStrength = computed(() => {
  if (!props.showStrength || !props.modelValue) return null;

  const password = props.modelValue;
  let strength = 0;

  // Length check
  if (password.length >= 8) strength++;
  if (password.length >= 12) strength++;

  // Character variety checks
  if (/[a-z]/.test(password)) strength++;
  if (/[A-Z]/.test(password)) strength++;
  if (/[0-9]/.test(password)) strength++;
  if (/[^A-Za-z0-9]/.test(password)) strength++;

  if (strength <= 2) return { level: "weak", label: "Weak", color: "red" };
  if (strength <= 4) return { level: "medium", label: "Medium", color: "yellow" };
  return { level: "strong", label: "Strong", color: "green" };
});

const strengthBarClasses = computed(() => {
  if (!passwordStrength.value) return "";

  const baseClasses = "h-1 rounded-full transition-all duration-300";
  const colorClasses = {
    weak: "bg-red-500",
    medium: "bg-yellow-500",
    strong: "bg-green-500",
  };

  return `${baseClasses} ${colorClasses[passwordStrength.value.level]}`;
});

const strengthBarWidth = computed(() => {
  if (!passwordStrength.value) return "0%";

  const widths = {
    weak: "33%",
    medium: "66%",
    strong: "100%",
  };

  return widths[passwordStrength.value.level];
});

const inputClasses = computed(() => [
  "w-full px-4 py-2.5 pr-12 border rounded-md bg-background text-foreground placeholder:text-muted-foreground",
  "focus:outline-none focus:ring-2 focus:border-transparent transition-colors",
  props.error
    ? "border-red-500 focus:ring-red-500"
    : "border-input focus:ring-ring",
  props.disabled && "opacity-50 cursor-not-allowed",
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
      <input
        :id="inputId"
        :type="showPassword ? 'text' : 'password'"
        :value="modelValue"
        :placeholder="placeholder"
        :required="required"
        :disabled="disabled"
        :autocomplete="autocomplete"
        :class="inputClasses"
        @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
      />

      <button
        type="button"
        :disabled="disabled"
        class="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
        @click="togglePasswordVisibility"
        :aria-label="showPassword ? 'Hide password' : 'Show password'"
      >
        <Icon
          :name="showPassword ? 'lucide:eye-off' : 'lucide:eye'"
          class="w-5 h-5"
        />
      </button>
    </div>

    <!-- Password strength indicator -->
    <div v-if="showStrength && modelValue" class="mt-2 space-y-1">
      <div class="flex items-center justify-between">
        <div class="flex-1 bg-muted rounded-full h-1 mr-3">
          <div
            :class="strengthBarClasses"
            :style="{ width: strengthBarWidth }"
          />
        </div>
        <span
          :class="[
            'text-xs font-medium',
            passwordStrength?.color === 'red' && 'text-red-500',
            passwordStrength?.color === 'yellow' && 'text-yellow-500',
            passwordStrength?.color === 'green' && 'text-green-500',
          ]"
        >
          {{ passwordStrength?.label }}
        </span>
      </div>
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
