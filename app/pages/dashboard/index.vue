<script setup lang="ts">
import type { EChartsOption } from "echarts";
import DpStatsCard from "@ui/components/dashboard/DpStatsCard.vue";
const DpChart = defineAsyncComponent(() =>
  import("@ui/components/dashboard/DpChart.vue")
);
import DpActivityFeed from "@ui/components/dashboard/DpActivityFeed.vue";
import DpQuickActions from "@ui/components/dashboard/DpQuickActions.vue";
import type { Activity } from "@ui/components/dashboard/DpActivityFeed.vue";
import type { QuickAction } from "@ui/components/dashboard/DpQuickActions.vue";

definePageMeta({
  middleware: ["auth"],
});

useHead({
  title: "Dashboard - Dashboard Pro",
  meta: [
    {
      name: "description",
      content: "View your analytics, metrics, and recent activity in one place.",
    },
  ],
});

const { t, locale } = useI18n();
const { user } = useAuth();

// Welcome message with user name
const welcomeMessage = computed(() => {
  if (user.value?.name) {
    return t("dashboard.welcome", { name: user.value.name });
  }
  return t("dashboard.welcomeGuest");
});

// Mock stats data - reactive to language changes
const stats = computed(() => [
  {
    title: t("dashboard.stats.totalUsers"),
    value: "2,543",
    change: 12.5,
    changeLabel: t("dashboard.metrics.vsLastMonth"),
    icon: "lucide:users",
    iconColor: "primary" as const,
    trend: "up" as const,
  },
  {
    title: t("dashboard.stats.revenue"),
    value: "$45,234",
    change: 8.2,
    changeLabel: t("dashboard.metrics.vsLastMonth"),
    icon: "lucide:dollar-sign",
    iconColor: "success" as const,
    trend: "up" as const,
  },
  {
    title: t("dashboard.stats.orders"),
    value: "1,234",
    change: -3.1,
    changeLabel: t("dashboard.metrics.vsLastWeek"),
    icon: "lucide:shopping-cart",
    iconColor: "info" as const,
    trend: "down" as const,
  },
  {
    title: t("dashboard.stats.conversion"),
    value: "3.24%",
    change: 0.5,
    changeLabel: t("dashboard.metrics.thisMonth"),
    icon: "lucide:trending-up",
    iconColor: "warning" as const,
    trend: "up" as const,
  },
  {
    title: t("dashboard.stats.visitors"),
    value: "12,543",
    change: 15.3,
    changeLabel: t("dashboard.metrics.vsLastWeek"),
    icon: "lucide:eye",
    iconColor: "primary" as const,
    trend: "up" as const,
  },
  {
    title: t("dashboard.stats.avgSessionTime"),
    value: "4m 32s",
    change: 2.1,
    changeLabel: t("dashboard.metrics.vsLastWeek"),
    icon: "lucide:clock",
    iconColor: "muted" as const,
    trend: "up" as const,
  },
]);

// Chart data - Mock 30 days of performance trends
// Use seed-based random for consistent data
const seededRandom = (seed: number) => {
  const x = Math.sin(seed) * 10000;
  return x - Math.floor(x);
};

const generateDates = (currentLocale: string) => {
  const dates = [];
  const today = new Date();
  const localeCode = currentLocale === 'fr' ? 'fr-FR' : 'en-US';
  for (let i = 29; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    dates.push(date.toLocaleDateString(localeCode, { month: 'short', day: 'numeric' }));
  }
  return dates;
};

const generateRevenueData = () => {
  const baseRevenue = 35000;
  return Array.from({ length: 30 }, (_, i) => {
    const trend = i * 450;
    const variation = seededRandom(i * 100) * 5000 - 2500;
    const weekendBoost = [0, 6].includes(i % 7) ? 3000 : 0;
    return Math.round(baseRevenue + trend + variation + weekendBoost);
  });
};

const generateUsersData = () => {
  const baseUsers = 1800;
  return Array.from({ length: 30 }, (_, i) => {
    const trend = i * 25;
    const variation = seededRandom(i * 200) * 200 - 100;
    const weekendDip = [0, 6].includes(i % 7) ? -150 : 0;
    return Math.round(baseUsers + trend + variation + weekendDip);
  });
};

const generateOrdersData = () => {
  const baseOrders = 850;
  return Array.from({ length: 30 }, (_, i) => {
    const trend = i * 15;
    const variation = seededRandom(i * 300) * 120 - 60;
    const weekendBoost = [0, 6].includes(i % 7) ? 80 : 0;
    return Math.round(baseOrders + trend + variation + weekendBoost);
  });
};

const chartOption = computed<EChartsOption>(() => {
  // Generate consistent data
  const revenueData = generateRevenueData();
  const usersData = generateUsersData();
  const ordersData = generateOrdersData();

  return {
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "cross",
        label: {
          backgroundColor: "#6a7985",
        },
      },
      formatter: (params: any) => {
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${params[0].axisValue}</div>`;
        params.forEach((param: any) => {
          const value = param.seriesName === t("dashboard.charts.revenue")
            ? `$${param.value.toLocaleString()}`
            : param.value.toLocaleString();
          result += `<div>${param.marker} ${param.seriesName}: <strong>${value}</strong></div>`;
        });
        return result;
      },
    },
    legend: {
      data: [t("dashboard.charts.revenue"), t("dashboard.charts.users"), t("dashboard.charts.orders")],
      bottom: 0,
      left: "center",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "12%",
      top: "10%",
      containLabel: true,
    },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: generateDates(locale.value),
    },
    yAxis: [
      {
        type: "value",
        name: t("dashboard.charts.revenue"),
        position: "left",
        axisLabel: {
          formatter: (value: number) => `$${(value / 1000).toFixed(0)}k`,
        },
      },
      {
        type: "value",
        name: t("dashboard.charts.users") + " / " + t("dashboard.charts.orders"),
        position: "right",
        axisLabel: {
          formatter: (value: number) => value.toFixed(0),
        },
      },
    ],
    series: [
      {
        name: t("dashboard.charts.revenue"),
        type: "line",
        smooth: true,
        yAxisIndex: 0,
        data: revenueData,
        itemStyle: {
          color: "#3b82f6",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: "rgba(59, 130, 246, 0.3)" },
              { offset: 1, color: "rgba(59, 130, 246, 0.05)" },
            ],
          },
        },
      },
      {
        name: t("dashboard.charts.users"),
        type: "line",
        smooth: true,
        yAxisIndex: 1,
        data: usersData,
        itemStyle: {
          color: "#10b981",
        },
        areaStyle: {
          color: {
            type: "linear",
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
            { offset: 0, color: "rgba(16, 185, 129, 0.3)" },
            { offset: 1, color: "rgba(16, 185, 129, 0.05)" },
          ],
        },
      },
    },
    {
      name: t("dashboard.charts.orders"),
      type: "line",
      smooth: true,
      yAxisIndex: 1,
      data: ordersData,
      itemStyle: {
        color: "#f59e0b",
      },
      areaStyle: {
        color: {
          type: "linear",
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            { offset: 0, color: "rgba(245, 158, 11, 0.3)" },
            { offset: 1, color: "rgba(245, 158, 11, 0.05)" },
          ],
        },
      },
    },
  ],
};
});

// Recent activity mock data
const activities = ref<Activity[]>([
  {
    id: "1",
    type: "success",
    title: "New user registration",
    description: "John Doe signed up for an account",
    timestamp: new Date(Date.now() - 5 * 60000).toISOString(), // 5 minutes ago
    user: {
      name: "John Doe",
    },
  },
  {
    id: "2",
    type: "user",
    title: "Profile updated",
    description: "User profile information has been updated",
    timestamp: new Date(Date.now() - 25 * 60000).toISOString(), // 25 minutes ago
    user: {
      name: "Jane Smith",
    },
  },
  {
    id: "3",
    type: "warning",
    title: "Payment processing delayed",
    description: "Order #1234 payment is pending",
    timestamp: new Date(Date.now() - 45 * 60000).toISOString(), // 45 minutes ago
  },
  {
    id: "4",
    type: "success",
    title: "Order completed",
    description: "Order #1233 has been successfully delivered",
    timestamp: new Date(Date.now() - 90 * 60000).toISOString(), // 1.5 hours ago
  },
  {
    id: "5",
    type: "system",
    title: "System maintenance",
    description: "Scheduled maintenance completed successfully",
    timestamp: new Date(Date.now() - 120 * 60000).toISOString(), // 2 hours ago
  },
]);

// Quick actions
const quickActions = ref<QuickAction[]>([
  {
    id: "1",
    label: t("dashboard.quickActions.newUser"),
    description: t("dashboard.quickActions.newUserDesc"),
    icon: "lucide:user-plus",
    to: "/auth/register",
  },
  {
    id: "2",
    label: t("dashboard.quickActions.viewReports"),
    description: t("dashboard.quickActions.viewReportsDesc"),
    icon: "lucide:bar-chart",
    onClick: () => {
      console.log("View reports clicked");
    },
  },
  {
    id: "3",
    label: t("dashboard.quickActions.settings"),
    description: t("dashboard.quickActions.settingsDesc"),
    icon: "lucide:settings",
    onClick: () => {
      console.log("Settings clicked");
    },
  },
  {
    id: "4",
    label: t("dashboard.quickActions.exportData"),
    description: t("dashboard.quickActions.exportDataDesc"),
    icon: "lucide:download",
    onClick: () => {
      console.log("Export data clicked");
    },
  },
]);
</script>

<template>
  <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="space-y-8">
      <!-- Header -->
      <div>
        <h1 class="text-3xl font-bold text-foreground">
          {{ welcomeMessage }}
        </h1>
        <p class="mt-2 text-muted-foreground">
          {{ $t("dashboard.overview") }}
        </p>
      </div>

      <!-- Stats Grid -->
      <div class="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <DpStatsCard
          v-for="stat in stats"
          :key="stat.title"
          :title="stat.title"
          :value="stat.value"
          :change="stat.change"
          :change-label="stat.changeLabel"
          :icon="stat.icon"
          :icon-color="stat.iconColor"
          :trend="stat.trend"
        />
      </div>

      <!-- Chart Section -->
      <div>
        <div class="mb-4">
          <h2 class="text-2xl font-bold text-foreground">
            {{ $t("dashboard.charts.title") }}
          </h2>
          <p class="text-sm text-muted-foreground">
            {{ $t("dashboard.charts.description") }}
          </p>
        </div>
        <DpChart :option="chartOption" height="400px" />
      </div>

      <!-- Two Column Grid -->
      <div class="grid gap-6 lg:grid-cols-2">
        <!-- Activity Feed -->
        <DpActivityFeed
          :activities="activities"
          :max-items="5"
          :empty-message="$t('dashboard.activity.empty')"
        >
          <template #title>{{ $t("dashboard.activity.title") }}</template>
          <template #footer>
            <button
              class="text-sm font-medium text-primary-600 hover:text-primary-700 dark:text-primary-400 dark:hover:text-primary-300 transition-colors"
            >
              {{ $t("dashboard.activity.viewAll") }}
            </button>
          </template>
        </DpActivityFeed>

        <!-- Quick Actions -->
        <DpQuickActions
          :actions="quickActions"
          :columns="2"
          :title="$t('dashboard.quickActions.title')"
          @action-click="(action) => console.log('Action clicked:', action)"
        />
      </div>
    </div>
  </main>
</template>
