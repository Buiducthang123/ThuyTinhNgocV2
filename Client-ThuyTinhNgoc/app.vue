<template>
  <NuxtLoadingIndicator />
  <LoadingPage v-if="loading" />
  <NuxtPage v-else/>
</template>
<script setup lang="ts">
const loading = ref(true);

onMounted(async () => {
  const authStore = useAuthStore();
  const { setUser } = authStore;
  const accessToken = useCookie('access_token');
  loading.value = false;

  if (accessToken) {
    await $fetch('user-me', {
      method: 'GET',
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      headers: {
        Authorization: `Bearer ${accessToken.value}`,
      },
      onResponse: ({ response }) => {
        if (response.ok) {
          setUser(response._data);
        } else {
          accessToken.value = null;
        }
      },
    });
  }
});

</script>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.4s;
}
.page-enter-from,
.page-leave-to {
  opacity: 0;
  filter: blur(1rem);
}
</style>