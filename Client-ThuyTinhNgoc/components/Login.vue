<template>
    <a-modal v-model:open="isLoginModalOpen" :closable="false" :footer="null" class="max-w-sm">
        <div class="text-center text-base font-medium">
            <h6>Đăng nhập</h6>
        </div>
        <a-form :model="loginForm" layout="vertical" ref="formRef" @finish="handleLogin">
            <a-form-item class="mb-4" label="Email" name="email"
                :rules="[{ required: true, message: 'Vui lòng nhập email!' }]">
                <a-input placeholder="Nhập email" type="email" v-model:value="loginForm.email" />
            </a-form-item>

            <a-form-item class="mb-4" label="Mật khẩu" name="password"
                :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]">
                <a-input-password placeholder="Nhập mật khẩu" v-model:value="loginForm.password" />
            </a-form-item>

            <a-form-item class="text-center mt-8 mb-2">
                <a-button size="middle" type="ghost" class="w-full mx-auto bg-red-500 text-white hover:text-white"
                    html-type="submit">Đăng
                    nhập</a-button>
            </a-form-item>
        </a-form>

        <div class="text-center">
            <span class="text-primary cursor-pointer" @click="handleOpenRegisterModal">Đăng ký tài khoản</span>
        </div>

        <div class="text-center mt-4">
            <!--Đăng nhập băngf GG-->
            <span class="text-primary cursor-pointer" @click="handleLoginWithGoogle">Đăng nhập bằng Google</span>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
import type { IUser } from '~/interfaces/user';


const formRef = ref();
const authModal = useAuthModal();
const { isLoginModalOpen, closeLoginModal, openRegisterModal } = authModal;

const authStore = useAuthStore();
const { setUser, setAccessToken } = authStore;

interface LoginFormData {
    email: string;
    password: string;
}

interface LoginResponse {
    token: string;
    user: IUser;
    message: string;
}

const loginForm = reactive<LoginFormData>({
    email: '',
    password: '',
});

const handleOpenRegisterModal = () => {
    closeLoginModal();
    openRegisterModal();
};

const handleLogin = async () => {
    try {
        await formRef.value.validate();
        await $fetch<LoginResponse>('login', {
            method: 'POST',
            body: loginForm,
            baseURL: useRuntimeConfig().public.apiBaseUrl,
            onResponse: ({ response }) => {
                if (response.ok) {
                    message.success('Đăng nhập thành công');
                    setUser(response._data.user);
                    setAccessToken(response._data.token);
                    closeLoginModal();
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
const router = useRouter();

const handleLoginWithGoogle = async () => {
    try {
        await $fetch('login/google', {
            method: 'GET',
            baseURL: useRuntimeConfig().public.apiBaseUrl,
            onResponse: ({ response }) => {
                if (response.ok) {
                    window.open(response._data, 'name', 'width=800,height=600')
                    closeLoginModal();
                    window.addEventListener('message', (event) => {
                        if (event.origin !== 'http://localhost:3000') return;

                        const { token } = event.data;
                        if (token) {
                            // Lưu token và chuyển hướng người dùng
                            // localStorage.setItem('token', token);
                            message.success('Đăng nhập thành công');
                            closeLoginModal();
                            router.push('/');
                        }
                    }, { once: true });
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
</script>