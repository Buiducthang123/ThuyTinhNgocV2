<template>
  <Loading v-if="loading" />
  <div v-else>
    <NuxtRouteAnnouncer />
    <NuxtPage/>
  </div>
</template>

<script setup lang="ts">
const loading = ref(true)
onMounted(() => {
  loading.value = false
})
</script>
