<template>
    <div class="h-screen flex items-center justify-center bg-no-repeat bg-cover bg-[url('/images/login-bg.jpg')]">
        <div class="w-[420px] p-12 bg-[#ffffff]">
            <p class="text-center  mb-4  text-sm text-blue-700">Chào mừng bạn đến với trang quản trị <span class="font-bold"> Thuỷ Tinh Ngọc USA-HomeSet</span></p>
            <h6 class="text-center text-xl font-bold">Đăng nhập</h6>
            <a-form class="mt-12" :model="loginForm" ref="formRef" @finish="handleLogin">
                <a-form-item name="email" class="mb-8">
                    <a-input size="large" v-model:value="loginForm.email" placeholder="Email" class="rounded-none" />
                </a-form-item>
                <a-form-item name="password">
                    <a-input-password size="large" v-model:value="loginForm.password" placeholder="Mật khẩu" class="rounded-none" />
                </a-form-item>
                <a-form-item>
                    <a-button size="middle" type="primary" html-type="submit" class="w-full font-bold">Đăng nhập</a-button>
                </a-form-item>
            </a-form>
            <span class="block w-full text-center text-xs text-blue-500"></span>
        </div>
    </div>
</template>

<script setup lang="ts">

import type { IUser } from '~/interfaces/user';

const formRef = ref();
const loginForm = reactive({
    email: '',
    password: ''
});

interface LoginResponse {
    user: IUser;
    message: string;
    token: string;
}

const authStore = useAuthStore();

const { setUser, setAccessToken } = authStore;

const handleLogin = async () => {
    try {
        await formRef.value.validate();
        await $fetch<LoginResponse>('/api/login', {
            method: 'POST',
            body: loginForm,
            baseURL: useRuntimeConfig().public.baseURLAPI,
            onResponse: ({ response }) => {
                if (response.ok) {
                   if(response._data.user.role.name === 'admin'){
                        setUser(response._data.user);
                        setAccessToken(response._data.token);
                        message.success('Đăng nhập thành công');
                        navigateTo('/');
                    }else{
                        message.error('Bạn không có quyền truy cập');
                    }
                }
                else {
                    message.error(response._data.message ?? 'Đăng nhập thất bại');
                }
            }
        })
    } catch (error) {
        console.log('error :>> ', error);
    }
};

onBeforeMount(() => {
    if (authStore.accessToken) {
        return navigateTo('/');
    }
});
</script>

<style scoped></style>