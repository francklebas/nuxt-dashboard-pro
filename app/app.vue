<script lang="ts" setup>
import DpButton from "@ui/DpButton.vue";

function log(message: string): string {
  console.log(message);
  return message;
}

// Set a default document title so E2E can assert it
useHead({
  title: "Dashboard",
});
</script>

<template>
  <div>
    <NuxtRouteAnnouncer />
    <nav class="p-4 border-b">
      <a href="/" class="font-semibold">Home</a>
    </nav>
    <DpButton @click="log('coucou')">Hello world</DpButton>
  </div>
</template>
