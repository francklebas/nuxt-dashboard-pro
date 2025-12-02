<script setup lang="ts">
import DpNavigation from "@ui/components/DpNavigation.vue";
</script>

<template>
  <div class="min-h-screen bg-background text-foreground">
    <NuxtRouteAnnouncer />
    <DpNavigation />
    <NuxtPage />
  </div>
</template>
