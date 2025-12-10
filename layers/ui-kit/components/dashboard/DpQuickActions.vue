<script setup lang="ts">
import DpButton from "@ui/DpButton.vue";

export interface QuickAction {
  id: string;
  label: string;
  description?: string;
  icon: string;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export interface DpQuickActionsProps {
  actions: QuickAction[];
  columns?: 1 | 2 | 3 | 4;
  title?: string;
}

const props = withDefaults(defineProps<DpQuickActionsProps>(), {
  columns: 2,
});

const emit = defineEmits<{
  actionClick: [action: QuickAction];
}>();

const gridColsClass = computed(() => {
  const cols = {
    1: "grid-cols-1",
    2: "grid-cols-1 sm:grid-cols-2",
    3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
    4: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4",
  };
  return cols[props.columns];
});

const handleAction = (action: QuickAction) => {
  if (action.disabled) return;

  if (action.onClick) {
    action.onClick();
  }

  emit("actionClick", action);
};
</script>

<template>
  <div class="rounded-lg border border-border bg-background p-6">
    <!-- Title -->
    <h3 v-if="title" class="mb-6 text-lg font-semibold text-foreground">
      {{ title }}
    </h3>

    <!-- Actions grid -->
    <div :class="['grid gap-4', gridColsClass]">
      <div
        v-for="action in actions"
        :key="action.id"
      >
        <!-- With link -->
        <NuxtLink
          v-if="action.to && !action.disabled"
          :to="action.to"
          class="block"
        >
          <div
            class="group flex h-full items-center gap-4 rounded-lg border border-border bg-background p-4 transition-all hover:border-primary-500 hover:shadow-md"
          >
            <div
              class="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-primary-100 text-primary-600 transition-colors group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/20 dark:text-primary-400 dark:group-hover:bg-primary-600"
            >
              <Icon :name="action.icon" class="h-6 w-6" />
            </div>
            <div class="flex-1">
              <p class="font-medium text-foreground">{{ action.label }}</p>
              <p v-if="action.description" class="text-sm text-muted-foreground">
                {{ action.description }}
              </p>
            </div>
            <Icon
              name="lucide:chevron-right"
              class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"
            />
          </div>
        </NuxtLink>

        <!-- With onClick or disabled -->
        <button
          v-else
          type="button"
          :disabled="action.disabled"
          @click="handleAction(action)"
          :class="[
            'group flex h-full w-full items-center gap-4 rounded-lg border border-border bg-background p-4 text-left transition-all',
            action.disabled
              ? 'cursor-not-allowed opacity-50'
              : 'hover:border-primary-500 hover:shadow-md',
          ]"
        >
          <div
            :class="[
              'flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg transition-colors',
              action.disabled
                ? 'bg-muted text-muted-foreground'
                : 'bg-primary-100 text-primary-600 group-hover:bg-primary-600 group-hover:text-white dark:bg-primary-900/20 dark:text-primary-400 dark:group-hover:bg-primary-600',
            ]"
          >
            <Icon :name="action.icon" class="h-6 w-6" />
          </div>
          <div class="flex-1">
            <p class="font-medium text-foreground">{{ action.label }}</p>
            <p v-if="action.description" class="text-sm text-muted-foreground">
              {{ action.description }}
            </p>
          </div>
          <Icon
            v-if="!action.disabled"
            name="lucide:chevron-right"
            class="h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1"
          />
        </button>
      </div>
    </div>

    <!-- Custom footer slot -->
    <div v-if="$slots.footer" class="mt-6">
      <slot name="footer" />
    </div>
  </div>
</template>
