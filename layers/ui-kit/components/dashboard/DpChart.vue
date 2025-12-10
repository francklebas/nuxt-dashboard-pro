<script setup lang="ts">
import type { EChartsOption } from "echarts";

export interface DpChartProps {
  option: EChartsOption;
  height?: string;
  loading?: boolean;
  theme?: "light" | "dark" | "auto";
}

const props = withDefaults(defineProps<DpChartProps>(), {
  height: "400px",
  loading: false,
  theme: "auto",
});

const colorMode = useColorMode();

// Determine theme based on color mode
const chartTheme = computed(() => {
  if (props.theme === "auto") {
    return colorMode.value === "dark" ? "dark" : "light";
  }
  return props.theme;
});

// Merge user option with theme-aware defaults
const chartOption = computed<EChartsOption>(() => {
  const isDark = chartTheme.value === "dark";

  return {
    backgroundColor: "transparent",
    textStyle: {
      color: isDark ? "#e5e7eb" : "#1f2937",
      fontFamily: "inherit",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      top: "10%",
      containLabel: true,
    },
    tooltip: {
      backgroundColor: isDark ? "#1f2937" : "#ffffff",
      borderColor: isDark ? "#374151" : "#e5e7eb",
      borderWidth: 1,
      textStyle: {
        color: isDark ? "#e5e7eb" : "#1f2937",
      },
    },
    ...props.option,
  };
});
</script>

<template>
  <div
    class="relative overflow-hidden rounded-lg border border-border bg-background p-4"
    :style="{ height }"
  >
    <!-- Loading overlay -->
    <div
      v-if="loading"
      class="absolute inset-0 z-10 flex items-center justify-center bg-background/80 backdrop-blur-sm"
    >
      <div class="flex flex-col items-center gap-3">
        <Icon name="lucide:loader-2" class="h-8 w-8 animate-spin text-primary-600" />
        <p class="text-sm text-muted-foreground">Loading chart...</p>
      </div>
    </div>

    <!-- Chart -->
    <VChart
      :option="chartOption"
      :theme="chartTheme"
      autoresize
      class="h-full w-full"
    />
  </div>
</template>
