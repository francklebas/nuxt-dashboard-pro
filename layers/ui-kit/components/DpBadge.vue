<script setup lang="ts">
export interface DpBadgeProps {
  variant?: "default" | "primary" | "secondary" | "success" | "warning" | "danger";
  size?: "sm" | "md" | "lg";
}

const props = withDefaults(defineProps<DpBadgeProps>(), {
  variant: "default",
  size: "md",
});

const badgeClasses = computed(() => {
  const classes = ["inline-flex items-center justify-center font-semibold rounded-full transition-colors"];

  // Variant styles
  switch (props.variant) {
    case "primary":
      classes.push("bg-primary text-primary-foreground");
      break;
    case "secondary":
      classes.push("bg-secondary text-secondary-foreground");
      break;
    case "success":
      classes.push("bg-green-500 text-white");
      break;
    case "warning":
      classes.push("bg-yellow-500 text-white");
      break;
    case "danger":
      classes.push("bg-red-500 text-white");
      break;
    default:
      classes.push("bg-muted text-muted-foreground");
  }

  // Size
  switch (props.size) {
    case "sm":
      classes.push("px-2 py-0.5 text-xs");
      break;
    case "md":
      classes.push("px-3 py-1 text-sm");
      break;
    case "lg":
      classes.push("px-4 py-1.5 text-base");
      break;
  }

  return classes.join(" ");
});
</script>

<template>
  <span :class="badgeClasses">
    <slot />
  </span>
</template>
