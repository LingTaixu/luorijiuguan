<template>
  <div class="home">
    <slot />
    <SpeedInsights />
  </div>
</template>

<script setup lang="ts">
import { SpeedInsights } from "@vercel/speed-insights/nuxt"
</script>

<style scoped>
.home {
  width: 100vw;
  height: 100vh;
}
</style>