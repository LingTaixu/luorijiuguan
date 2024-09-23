<template>
  <div class="w-auto h-auto">
    <slot />
    <SpeedInsights />
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
</script>

<style scoped></style>