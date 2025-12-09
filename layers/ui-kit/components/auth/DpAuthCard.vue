<script setup lang="ts">
export interface DpAuthCardProps {
  title: string;
  description?: string;
  showLogo?: boolean;
  maxWidth?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<DpAuthCardProps>(), {
  showLogo: false,
  maxWidth: "md",
});

const maxWidthClasses = computed(() => {
  const widths = {
    sm: "max-w-sm",
    md: "max-w-md",
    lg: "max-w-lg",
  };
  return widths[props.maxWidth];
});
</script>

<template>
  <div class="min-h-screen bg-background flex items-center justify-center px-4 py-12">
    <div :class="['w-full', maxWidthClasses]">
      <!-- Logo -->
      <div v-if="showLogo" class="flex justify-center mb-8">
        <div class="w-12 h-12 bg-primary-600 rounded-lg flex items-center justify-center">
          <Icon name="lucide:layout-dashboard" class="w-6 h-6 text-white" />
        </div>
      </div>

      <!-- Card -->
      <div class="bg-background border border-border rounded-lg shadow-lg p-6 sm:p-8">
        <!-- Header -->
        <div class="mb-6">
          <h1 class="text-2xl sm:text-3xl font-bold text-foreground mb-2">
            {{ title }}
          </h1>
          <p v-if="description" class="text-sm text-muted-foreground">
            {{ description }}
          </p>
        </div>

        <!-- Content slot -->
        <slot />
      </div>

      <!-- Footer slot -->
      <div v-if="$slots.footer" class="mt-6 text-center">
        <slot name="footer" />
      </div>
    </div>
  </div>
</template>
