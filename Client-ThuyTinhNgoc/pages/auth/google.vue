<template>
  <div class="bg-white h-screen flex items-center justify-center">
    <div v-if="isShowLoading" class="items-center relative justify-center">
      <div class="loading">
        <span></span>
        <span></span>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div v-if="isShowLoading && !isShowError" class="text-center text-base font-medium">Đang đăng nhập</div>
      <div v-if="isShowError" class="text-center text-base font-medium">Không thể đăng nhập, có lỗi xảy ra !</div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: false,
});
const route = useRoute();
const isShowLoading = ref(true);
const isShowError = ref(false);
const authStore = useAuthStore();
const { setAccessToken, setUser } = authStore;

onMounted(async () => {
  await $fetch('user-me', {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${route.query.token}`
    },
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    onResponse: ({ response }) => {
      if (response.ok) {
        isShowLoading.value = false;
        setAccessToken(route.query.token as string);
        window.opener.location.reload(); // load lại trang cha
        window.close();
      }
      else {
        isShowError.value = true;
      }
    },

  })
})

</script>

<style scoped>
/* From Uiverse.io by satyamchaudharydev */
.loading {
  --speed-of-animation: 0.9s;
  --gap: 6px;
  --first-color: #4c86f9;
  --second-color: #49a84c;
  --third-color: #f6bb02;
  --fourth-color: #f6bb02;
  --fifth-color: #2196f3;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 200px;
  gap: 20px;
  height: 200px;
}

.loading span {
  width: 8px;
  height: 100px;
  background: var(--first-color);
  animation: scale var(--speed-of-animation) ease-in-out infinite;
}

.loading span:nth-child(2) {
  background: var(--second-color);
  animation-delay: -0.8s;
}

.loading span:nth-child(3) {
  background: var(--third-color);
  animation-delay: -0.7s;
}

.loading span:nth-child(4) {
  background: var(--fourth-color);
  animation-delay: -0.6s;
}

.loading span:nth-child(5) {
  background: var(--fifth-color);
  animation-delay: -0.5s;
}

@keyframes scale {

  0%,
  40%,
  100% {
    transform: scaleY(0.05);
  }

  20% {
    transform: scaleY(1);
  }
}
</style>