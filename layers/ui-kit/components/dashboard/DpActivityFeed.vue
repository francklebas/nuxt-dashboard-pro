<script setup lang="ts">
export interface Activity {
  id: string;
  type: "user" | "system" | "alert" | "success" | "warning";
  title: string;
  description?: string;
  timestamp: string;
  icon?: string;
  user?: {
    name: string;
    avatar?: string;
  };
}

export interface DpActivityFeedProps {
  activities: Activity[];
  maxItems?: number;
  loading?: boolean;
  emptyMessage?: string;
}

const props = withDefaults(defineProps<DpActivityFeedProps>(), {
  maxItems: 10,
  loading: false,
  emptyMessage: "No recent activity",
});

const displayedActivities = computed(() => {
  return props.activities.slice(0, props.maxItems);
});

const getActivityIcon = (activity: Activity) => {
  if (activity.icon) return activity.icon;

  const icons = {
    user: "lucide:user",
    system: "lucide:settings",
    alert: "lucide:alert-circle",
    success: "lucide:check-circle",
    warning: "lucide:alert-triangle",
  };
  return icons[activity.type] || "lucide:circle";
};

const getActivityColor = (type: Activity["type"]) => {
  const colors = {
    user: "bg-blue-100 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400",
    system: "bg-gray-100 dark:bg-gray-900/20 text-gray-600 dark:text-gray-400",
    alert: "bg-red-100 dark:bg-red-900/20 text-red-600 dark:text-red-400",
    success: "bg-green-100 dark:bg-green-900/20 text-green-600 dark:text-green-400",
    warning: "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-600 dark:text-yellow-400",
  };
  return colors[type];
};

const formatTimestamp = (timestamp: string) => {
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};
</script>

<template>
  <div class="rounded-lg border border-border bg-background">
    <!-- Header -->
    <div class="border-b border-border px-6 py-4">
      <h3 class="text-lg font-semibold text-foreground">
        <slot name="title">Recent Activity</slot>
      </h3>
    </div>

    <!-- Content -->
    <div class="divide-y divide-border">
      <!-- Loading state -->
      <div v-if="loading" class="space-y-0">
        <div
          v-for="i in 5"
          :key="i"
          class="flex items-start gap-4 px-6 py-4"
        >
          <div class="h-10 w-10 animate-pulse rounded-full bg-muted"></div>
          <div class="flex-1 space-y-2">
            <div class="h-4 w-3/4 animate-pulse rounded bg-muted"></div>
            <div class="h-3 w-1/2 animate-pulse rounded bg-muted"></div>
          </div>
          <div class="h-3 w-16 animate-pulse rounded bg-muted"></div>
        </div>
      </div>

      <!-- Empty state -->
      <div
        v-else-if="displayedActivities.length === 0"
        class="flex flex-col items-center justify-center px-6 py-12 text-center"
      >
        <Icon name="lucide:inbox" class="mb-3 h-12 w-12 text-muted-foreground/50" />
        <p class="text-sm text-muted-foreground">{{ emptyMessage }}</p>
      </div>

      <!-- Activities list -->
      <div
        v-else
        v-for="activity in displayedActivities"
        :key="activity.id"
        class="flex items-start gap-4 px-6 py-4 transition-colors hover:bg-muted/50"
      >
        <!-- Icon or Avatar -->
        <div
          v-if="activity.user?.avatar"
          class="h-10 w-10 overflow-hidden rounded-full bg-muted"
        >
          <img
            :src="activity.user.avatar"
            :alt="activity.user.name"
            class="h-full w-full object-cover"
          />
        </div>
        <div
          v-else
          :class="[
            'flex h-10 w-10 items-center justify-center rounded-full',
            getActivityColor(activity.type),
          ]"
        >
          <Icon :name="getActivityIcon(activity)" class="h-5 w-5" />
        </div>

        <!-- Content -->
        <div class="flex-1 space-y-1">
          <p class="text-sm font-medium text-foreground">
            {{ activity.title }}
          </p>
          <p v-if="activity.description" class="text-sm text-muted-foreground">
            {{ activity.description }}
          </p>
          <p v-if="activity.user" class="text-xs text-muted-foreground">
            by {{ activity.user.name }}
          </p>
        </div>

        <!-- Timestamp -->
        <div class="flex-shrink-0">
          <p class="text-xs text-muted-foreground">
            {{ formatTimestamp(activity.timestamp) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Footer -->
    <div v-if="activities.length > maxItems" class="border-t border-border px-6 py-3">
      <slot name="footer">
        <button
          class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300"
        >
          View all activity
        </button>
      </slot>
    </div>
  </div>
</template>
