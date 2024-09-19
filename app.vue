<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const route = useRoute()
const title = ref(route.meta.title)
useSeoMeta({
  title: '陈碎碎',
  ogTitle: '陈碎碎',
  description: '这是我的落日酒馆',
  ogDescription: '这是我的落日酒馆',
})
useHead({
  title: '落日-' + title.value
})
</script>