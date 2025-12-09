<script setup lang="ts">
export interface DpAuthAlertProps {
  type: "success" | "error" | "info" | "warning";
  message: string;
  dismissible?: boolean;
}

const props = withDefaults(defineProps<DpAuthAlertProps>(), {
  dismissible: false,
});

const emit = defineEmits<{
  dismiss: [];
}>();

const isVisible = ref(true);

const handleDismiss = () => {
  isVisible.value = false;
  emit("dismiss");
};

const alertClasses = computed(() => {
  const baseClasses = "p-4 rounded-md border";

  const variantClasses = {
    success: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800",
    error: "bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-300 border-red-200 dark:border-red-800",
    info: "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800",
    warning: "bg-yellow-50 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-300 border-yellow-200 dark:border-yellow-800",
  };

  return `${baseClasses} ${variantClasses[props.type]}`;
});

const iconName = computed(() => {
  const icons = {
    success: "lucide:check-circle",
    error: "lucide:alert-circle",
    info: "lucide:info",
    warning: "lucide:alert-triangle",
  };
  return icons[props.type];
});
</script>

<template>
  <Transition
    enter-active-class="transition-all duration-300"
    enter-from-class="opacity-0 -translate-y-2"
    enter-to-class="opacity-100 translate-y-0"
    leave-active-class="transition-all duration-200"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div v-if="isVisible" :class="alertClasses">
      <div class="flex items-start gap-3">
        <Icon :name="iconName" class="w-5 h-5 flex-shrink-0 mt-0.5" />
        <p class="text-sm font-medium flex-1">{{ message }}</p>
        <button
          v-if="dismissible"
          type="button"
          @click="handleDismiss"
          class="flex-shrink-0 hover:opacity-70 transition-opacity"
          aria-label="Dismiss"
        >
          <Icon name="lucide:x" class="w-4 h-4" />
        </button>
      </div>
    </div>
  </Transition>
</template>
