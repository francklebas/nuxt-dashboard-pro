<script setup lang="ts">
import DpCard from "./DpCard.vue";
import DpBadge from "./DpBadge.vue";
import DpButton from "./DpButton.vue";
import { Icon } from "#components";

export interface PricingFeature {
  text: string;
  included: boolean;
}

export interface DpPricingCardProps {
  title: string;
  description: string;
  price: string;
  period?: string;
  features: PricingFeature[];
  buttonText: string;
  buttonVariant?: "primary" | "secondary" | "outline" | "ghost";
  popular?: boolean;
  badgeText?: string;
}

const props = withDefaults(defineProps<DpPricingCardProps>(), {
  period: "month",
  buttonVariant: "outline",
  popular: false,
  badgeText: "Most Popular",
});

const emit = defineEmits<{
  click: [];
}>();

const handleClick = () => {
  emit("click");
};
</script>

<template>
  <div class="relative">
    <!-- Popular badge -->
    <div
      v-if="popular"
      class="absolute -top-4 left-1/2 -translate-x-1/2 z-10"
    >
      <DpBadge variant="primary" size="md">
        {{ badgeText }}
      </DpBadge>
    </div>

    <!-- Card -->
    <DpCard
      variant="bordered"
      padding="lg"
      :hover="!popular"
      :class="[
        'h-full flex flex-col',
        popular
          ? 'border-primary shadow-xl scale-105 bg-gradient-to-b from-background to-muted/20'
          : 'hover:border-primary/50',
      ]"
    >
      <!-- Header -->
      <div class="mb-6">
        <h3 class="text-2xl font-bold text-foreground mb-2">{{ title }}</h3>
        <p class="text-sm text-muted-foreground">{{ description }}</p>
      </div>

      <!-- Price -->
      <div class="mb-8">
        <div class="flex items-baseline gap-2">
          <span class="text-5xl font-bold text-foreground">{{ price }}</span>
          <span class="text-muted-foreground">/ {{ period }}</span>
        </div>
      </div>

      <!-- CTA Button -->
      <div class="mb-8">
        <DpButton
          :variant="popular ? 'primary' : buttonVariant"
          size="lg"
          class="w-full"
          @click="handleClick"
        >
          {{ buttonText }}
        </DpButton>
      </div>

      <!-- Features list -->
      <div class="space-y-4 flex-1">
        <div
          v-for="(feature, index) in features"
          :key="index"
          class="flex items-start gap-3"
        >
          <Icon
            :name="feature.included ? 'lucide:check' : 'lucide:x'"
            class="w-5 h-5 mt-0.5 flex-shrink-0"
            :class="
              feature.included
                ? 'text-green-500'
                : 'text-muted-foreground/50'
            "
          />
          <span
            class="text-sm"
            :class="
              feature.included
                ? 'text-foreground'
                : 'text-muted-foreground line-through'
            "
          >
            {{ feature.text }}
          </span>
        </div>
      </div>
    </DpCard>
  </div>
</template>
