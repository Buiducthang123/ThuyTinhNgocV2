<template>
    <a-modal v-model:open="isRegisterModalOpen" @ok="handleOk" :closable="false" :footer="null" :width="700"
        :body-style="{margin: '-20px -24px'}"
        class=" p-0">
        <div class="flex">
            <div class="w-[60%] px-5 py-8">
                <div class="text-center text-base font-medium mb-8">
                    <h6>Đăng ký tài khoản</h6>
                </div>
                <a-form :model="registerForm" layout="vertical" ref="formRef" @finish="handleOk">
                    <a-form-item class="mb-4" label="Họ và tên" name="fullName"
                        :rules="[{ required: true, message: 'Vui lòng nhập họ tên!' }]">
                        <a-input placeholder="Nhập họ và tên" v-model:value="registerForm.fullName" />
                    </a-form-item>

                    <a-form-item class="mb-4" label="Email" name="email"
                        :rules="[{ required: true, message: 'Vui lòng nhập email!' }]">
                        <a-input placeholder="Nhập email" type="email" v-model:value="registerForm.email" />
                    </a-form-item>

                    <a-form-item class="mb-4" label="Mật khẩu" name="password"
                        :rules="[{ required: true, message: 'Vui lòng nhập mật khẩu!' }]">
                        <a-input-password placeholder="Nhập mật khẩu" v-model:value="registerForm.password" />
                    </a-form-item>

                    <a-form-item class="mb-4" label="Nhập lại mật khẩu" name="password_confirmation"
                        :rules="[{ required: true, message: 'Vui lòng nhập lại mật khẩu!' }]">
                        <a-input-password placeholder="Nhập lại mật khẩu" v-model:value="registerForm.password_confirmation" />
                    </a-form-item>

                    <a-form-item class="text-center mt-8 mb-2">
                        <a-button size="middle" class="w-full mx-auto bg-red-500 text-white" type="ghost" html-type="submit"
                        >Đăng ký</a-button>
                    </a-form-item>


                </a-form>
            </div>
            <div class="bg-[#9cd2ff38] w-[40%] flex flex-col justify-center">
                <img src="~assets/images/register-img-0.png"/>
                <div class="text-center space-y-4 text-primary mt-4">
                    <span class="block text-base font-bold">Mua sắm tại Tiki</span>
                    <span>Siêu ưu đãi mỗi ngày</span>
                </div>
            </div>
        </div>
    </a-modal>
</template>
<script lang="ts" setup>
import type { FormInstance } from 'ant-design-vue';
import type { IUser } from '~/interfaces/user';
const formRef = ref<FormInstance>();
const authModal = useAuthModal();
const { isRegisterModalOpen } = authModal;

interface registerFormData {
    fullName: string;
    email: string;
    password: string;
    // status: number;
    password_confirmation: string;
}

const registerForm = ref<registerFormData>({
    fullName: '',
    email: '',
    password: '',
    password_confirmation: '',
});

const handleOk = async () => {
    await formRef.value?.validate();
    await $fetch<{user:IUser, token:string, message:string}>('/register',{
        method: 'POST',
        body: registerForm.value,
        headers: {
            // 'Content-Type': 'application/json'
        },
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        onResponse:({response})=>{
            if(response.ok){
                authModal.closeRegisterModal();
                message.success('Đăng ký tài khoản thành công');
            }
            else{
                message.error(response._data.message ?? 'Đăng ký tài khoản thất bại');
            }
        }
    })
};

</script>

<style scoped>

</style>