<template>
  <NuxtLayout name="default">
    <div v-if="isVerify" class="flex justify-center items-center h-[60vh] mt-6">
      <div class="text-center space-y-6">
        <a-result status="success" title="Xác thực thành công"
          sub-title="Tài khoản của bạn đã được xác thực thành công." />
        <a-button type="primary" @click="navigateTo('/')">Quay lại trang chủ</a-button>
      </div>
    </div>

    <div v-else class="flex justify-center items-center h-[60vh] mt-6">
      <div class="text-center space-y-6">
        <a-result status="error" title="Xác thực thất bại"
          sub-title="Có lỗi xảy ra trong quá trình xác thực tài khoản của bạn." />
        <a-button type="primary" @click="">Gửi lại email xác thực</a-button>
      </div>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">

const authStore = useAuthStore();
const isVerify = computed(() => authStore.user?.email_verified_at != null);
</script>

<style scoped></style>