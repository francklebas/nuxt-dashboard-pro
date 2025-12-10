<script setup lang="ts">
export interface DpStatsCardProps {
  title: string;
  value: string | number;
  change?: number;
  changeLabel?: string;
  icon?: string;
  iconColor?:
    | "primary"
    | "success"
    | "warning"
    | "danger"
    | "info"
    | "muted";
  trend?: "up" | "down" | "neutral";
  loading?: boolean;
}

const props = withDefaults(defineProps<DpStatsCardProps>(), {
  iconColor: "primary",
  trend: "neutral",
  loading: false,
});

const iconColorClass = computed(() => {
  const colors = {
    primary: "text-primary-600 dark:text-primary-400 bg-primary-100 dark:bg-primary-900/20",
    success: "text-green-600 dark:text-green-400 bg-green-100 dark:bg-green-900/20",
    warning: "text-yellow-600 dark:text-yellow-400 bg-yellow-100 dark:bg-yellow-900/20",
    danger: "text-red-600 dark:text-red-400 bg-red-100 dark:bg-red-900/20",
    info: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/20",
    muted: "text-muted-foreground bg-muted",
  };
  return colors[props.iconColor];
});

const trendIcon = computed(() => {
  if (props.trend === "up") return "lucide:trending-up";
  if (props.trend === "down") return "lucide:trending-down";
  return "lucide:minus";
});

const trendColorClass = computed(() => {
  if (props.trend === "up") return "text-green-600 dark:text-green-400";
  if (props.trend === "down") return "text-red-600 dark:text-red-400";
  return "text-muted-foreground";
});
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg border border-border bg-background p-6 transition-all hover:shadow-md"
  >
    <!-- Loading skeleton -->
    <div v-if="loading" class="space-y-3">
      <div class="h-4 w-20 animate-pulse rounded bg-muted"></div>
      <div class="h-8 w-32 animate-pulse rounded bg-muted"></div>
      <div class="h-3 w-24 animate-pulse rounded bg-muted"></div>
    </div>

    <!-- Content -->
    <div v-else class="space-y-2">
      <!-- Header with icon -->
      <div class="flex items-center justify-between">
        <p class="text-sm font-medium text-muted-foreground">
          {{ title }}
        </p>
        <div
          v-if="icon"
          :class="['flex h-10 w-10 items-center justify-center rounded-full', iconColorClass]"
        >
          <Icon :name="icon" class="h-5 w-5" />
        </div>
      </div>

      <!-- Value -->
      <div class="flex items-baseline gap-2">
        <p class="text-3xl font-bold text-foreground">
          {{ value }}
        </p>
      </div>

      <!-- Change indicator -->
      <div v-if="change !== undefined" class="flex items-center gap-1">
        <Icon :name="trendIcon" :class="['h-4 w-4', trendColorClass]" />
        <span :class="['text-sm font-medium', trendColorClass]">
          {{ Math.abs(change) }}%
        </span>
        <span v-if="changeLabel" class="text-sm text-muted-foreground">
          {{ changeLabel }}
        </span>
      </div>
    </div>
  </div>
</template>
