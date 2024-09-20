<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const title = ref(route.meta.title)
useSeoMeta({
  title: '落日酒馆',
  ogTitle: '落日酒馆',
  description: '落日酒馆',
  ogDescription: '落日酒馆',
})
useHead({
  title: '落日-' + title.value
})
</script>