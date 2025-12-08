<script setup lang="ts">
export interface DpCardProps {
  variant?: "default" | "bordered" | "elevated" | "outline";
  padding?: "none" | "sm" | "md" | "lg";
  hover?: boolean;
}

const props = withDefaults(defineProps<DpCardProps>(), {
  variant: "default",
  padding: "md",
  hover: false,
});

const cardClasses = computed(() => {
  const classes = ["rounded-lg transition-all duration-200"];

  // Variant styles
  switch (props.variant) {
    case "bordered":
      classes.push("border border-border bg-card");
      break;
    case "elevated":
      classes.push("shadow-lg bg-card");
      break;
    case "outline":
      classes.push("border-2 border-border bg-transparent");
      break;
    default:
      classes.push("bg-card");
  }

  // Padding
  switch (props.padding) {
    case "none":
      classes.push("p-0");
      break;
    case "sm":
      classes.push("p-4");
      break;
    case "md":
      classes.push("p-6");
      break;
    case "lg":
      classes.push("p-8");
      break;
  }

  // Hover effect
  if (props.hover) {
    classes.push("hover:shadow-xl hover:scale-[1.02]");
  }

  return classes.join(" ");
});
</script>

<template>
  <div :class="cardClasses">
    <slot />
  </div>
</template>
