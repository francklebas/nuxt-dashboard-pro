<script setup lang="ts">
import DpPricingCard from "@ui/components/DpPricingCard.vue";
import type { PricingFeature } from "@ui/components/DpPricingCard.vue";

const { t } = useI18n();

useHead({
  title: "Pricing - Dashboard Pro",
  meta: [
    {
      name: "description",
      content:
        "Choose the perfect Nuxt dashboard template for your project. Two pricing options: Community (Free) and Commercial ($49). One-time purchase, lifetime updates.",
    },
  ],
});

// Pricing plans data
const plans = computed(() => [
  {
    title: t("pricing.community.title"),
    description: t("pricing.community.description"),
    price: "$0",
    period: t("pricing.period"),
    buttonText: t("pricing.community.cta"),
    buttonVariant: "outline" as const,
    popular: false,
    features: [
      { text: t("pricing.community.features.source"), included: true },
      { text: t("pricing.community.features.components"), included: true },
      { text: t("pricing.community.features.updates"), included: true },
      { text: t("pricing.community.features.documentation"), included: true },
      { text: t("pricing.community.features.community"), included: true },
      { text: t("pricing.community.features.commercial"), included: false },
      { text: t("pricing.community.features.support"), included: false },
    ] as PricingFeature[],
  },
  {
    title: t("pricing.commercial.title"),
    description: t("pricing.commercial.description"),
    price: "$49",
    period: t("pricing.period"),
    buttonText: t("pricing.commercial.cta"),
    buttonVariant: "primary" as const,
    popular: true,
    badgeText: t("pricing.popularBadge"),
    features: [
      { text: t("pricing.commercial.features.everything"), included: true },
      { text: t("pricing.commercial.features.commercial"), included: true },
      { text: t("pricing.commercial.features.support"), included: true },
      { text: t("pricing.commercial.features.priority"), included: true },
      { text: t("pricing.commercial.features.updates"), included: true },
      { text: t("pricing.commercial.features.templates"), included: true },
      { text: t("pricing.commercial.features.customization"), included: true },
    ] as PricingFeature[],
  },
]);

const handlePlanClick = (planTitle: string) => {
  console.log(`Selected plan: ${planTitle}`);
  // Add your logic here (e.g., navigate to checkout, open modal, etc.)
};
</script>

<template>
  <main class="min-h-screen bg-background">
    <!-- Header section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
      <div class="text-center mb-16">
        <h1 class="text-4xl sm:text-5xl font-bold text-foreground mb-4">
          {{ t("pricing.title") }}
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          {{ t("pricing.subtitle") }}
        </p>
      </div>

      <!-- Pricing cards grid -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-start max-w-5xl mx-auto"
      >
        <DpPricingCard
          v-for="(plan, index) in plans"
          :key="index"
          :title="plan.title"
          :description="plan.description"
          :price="plan.price"
          :period="plan.period"
          :features="plan.features"
          :button-text="plan.buttonText"
          :button-variant="plan.buttonVariant"
          :popular="plan.popular"
          :badge-text="plan.badgeText"
          @click="handlePlanClick(plan.title)"
        />
      </div>

      <!-- FAQ or additional info section -->
      <div class="mt-20 text-center">
        <p class="text-sm text-muted-foreground">
          {{ t("pricing.footer") }}
        </p>
      </div>
    </div>
  </main>
</template>
