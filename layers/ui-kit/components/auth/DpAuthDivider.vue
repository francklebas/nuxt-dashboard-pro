<script setup lang="ts">
export interface DpAuthDividerProps {
  text?: string;
}

const props = withDefaults(defineProps<DpAuthDividerProps>(), {
  text: "Or continue with",
});
</script>

<template>
  <div class="flex items-center gap-4 my-6">
    <div class="flex-1 h-px bg-border"></div>
    <span class="text-sm text-muted-foreground">{{ text }}</span>
    <div class="flex-1 h-px bg-border"></div>
  </div>
</template>
