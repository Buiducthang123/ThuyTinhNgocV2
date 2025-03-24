<template>
    <div>
        <div class="mb-6">
            <h3 class="text-2xl mb-3">Thông tin tài khoản</h3>
            <p v-if="user?.status == EUser.NOT_ACTIVATED" class="text-base text-yellow-600 flex items-center gap-1 mt-2">
                <Icon name="i-ep-warning" />
                Email của bạn chưa quản trị viên phê duyệt !
            </p>
        </div>
        <section class="bg-white p-6 rounded-lg">
            <div class=" grid grid-cols-12 gap-6">
                <div class="col-span-7 border-r">

                    <a-form class="pr-6" :model="formUserUpdate" ref="updateUserForm" :label-col="labelCol"
                        @finish="handleUpdateUser">
                        <div class="flex gap-10">
                            <UploadImg @handle-change-image="handleChangeImage">
                                <template #main>
                                    <div v-if="!formUserUpdate.avatar"
                                        class="h-28 w-28 border-4 bg-blue-50 rounded-full border-blue-200 relative flex items-center justify-center">
                                        <Icon class="text-5xl text-blue-500" name="i-clarity-avatar-line" />
                                        <div class="absolute right-0 bottom-3 w-12 bg-gray-600">
                                            <Icon class="text-2xl text-white" name="" />
                                            <div
                                                class="absolute -right-2 bottom-0 w-6 h-6 flex justify-center items-center cursor-pointer rounded-full bg-gray-500">
                                                <Icon class="text-xl text-white"
                                                    name="i-material-symbols-light-edit-outline" />
                                            </div>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <div class="relative cursor-pointer">
                                            <NuxtImg :src="formUserUpdate.avatar"
                                                class="h-28 min-w-28 rounded-full object-cover border-4 border-blue-200" />
                                            <div class="absolute right-0 bottom-3 w-12 bg-gray-600">
                                                <Icon class="text-2xl text-white" name="" />
                                                <div
                                                    class="absolute -right-1 bottom-1 w-6 h-6 flex justify-center items-center cursor-pointer rounded-full bg-gray-500">
                                                    <Icon class="text-xl text-white"
                                                        name="i-material-symbols-light-edit-outline" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </template>
                            </UploadImg>
                            <div class="w-full">
                                <a-form-item name="fullName"
                                    :rules="[{ required: true, message: 'Vui lòng nhập họ tên của bạn' }]">
                                    <template #label>
                                        <span class="font-semibold">Họ và tên</span>
                                    </template>
                                    <a-input class="w-full" v-model:value="formUserUpdate.fullName" />
                                </a-form-item>

                                <a-form-item name="email">
                                    <template #label>
                                        <span class="font-semibold">Email</span>
                                    </template>
                                    <a-input :value="user?.email" disabled class="disabled:text-black" />
                                    <p class="text-xs text-yellow-600 flex items-center gap-1 mt-2"
                                        v-if="!user?.email_verified_at">
                                        <Icon name="i-ep-warning" />
                                        Email của bạn chưa được xác minh !
                                    </p>

                                    <p class="text-xs text-green-600 flex items-center gap-1 mt-2" v-else>
                                        <Icon name="i-ep-checkmark" />
                                        Email của bạn đã được xác minh !
                                    </p>

                                </a-form-item>

                            </div>
                        </div>
                        <div v-if="user?.role && user.role.name.toLowerCase() === 'company'">
                            <a-form-item name="company_name">
                                <template #label>
                                    <span class="font-semibold">Tên công ty</span>
                                </template>
                                <a-input disabled class="disabled:text-black"
                                    v-model:value="formUserUpdate.company_name" />
                            </a-form-item>
                            <a-form-item name="company_address">
                                <template #label>
                                    <span class="font-semibold">Địa chỉ: </span>
                                </template>
                                <a-input v-model:value="formUserUpdate.company_address" />
                            </a-form-item>
                            <a-form-item name="company_phone_number">
                                <template #label>
                                    <span class="font-semibold">SDT công ty</span>
                                </template>
                                <a-input v-model:value="formUserUpdate.company_phone_number" />
                            </a-form-item>

                            <a-form-item>
                                <template #label>
                                    <span class="font-semibold">Mã số thuế</span>
                                </template>
                                <a-input disabled class="disabled:text-black" v-model:value="user.company_tax_code" />
                            </a-form-item>

                            <a-form-item>
                                <template #label>
                                    <span class="font-semibold">Người đại diện</span>
                                </template>
                                <a-input disabled class="disabled:text-black"
                                    v-model:value="user.contact_person_name" />
                            </a-form-item>

                            <a-form-item>
                                <template #label>
                                    <span class="font-semibold">Chức vụ</span>
                                </template>
                                <a-input disabled class="disabled:text-black"
                                    v-model:value="user.contact_person_position" />
                            </a-form-item>

                            <a-form-item>
                                <template #label>
                                    <span class="font-semibold">Số CCCD</span>
                                </template>
                                <a-input disabled class="disabled:text-black"
                                    v-model:value="user.representative_id_card" />
                            </a-form-item>

                            <a-form-item v-if="user.representative_id_card_date">
                                <template #label>
                                    <span class="font-semibold">Ngày cấp</span>
                                </template>
                                <a-input disabled class="disabled:text-black"
                                    :value="user.representative_id_card_date.toString()" />
                            </a-form-item>



                        </div>

                        <a-form-item>
                            <div class="text-end w-full">
                                <a-button class="" type="primary" html-type="submit">Cập nhật</a-button>
                            </div>
                        </a-form-item>
                    </a-form>
                </div>
                <div class="col-span-5">
                    <h6 class="mb-4 text-lg">Bảo mật</h6>
                    <div class="mt-4 space-y-6">
                        <div class="flex justify-between items-center">
                            <div class="space-x-2 flex items-center">
                                <Icon name="i-carbon-password" />
                                <span>Đổi mật khẩu</span>
                            </div>
                            <a-button class="border-blue-500 text-blue-500">Thay đổi</a-button>
                        </div>

                        <div class="flex justify-between items-center">
                            <div class="space-x-2 flex items-center">
                                <Icon name="i-carbon-password" />
                                <span>Yêu cầu xóa tài khoản</span>
                            </div>
                            <a-button html-type="submit" class="border-blue-500 text-blue-500">Yêu cầu</a-button>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</template>

<script setup lang="ts">
import { EUser } from '~/enums/user.enum';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const accessToken = computed(() => authStore.accessToken);
const updateUserForm = ref();
const labelCol = { style: { width: '120px', } };


interface FormUserUpdate {
    fullName: string;
    company_name?: string;
    company_address?: string;
    company_phone_number?: string;
    avatar?: File | string | any;
}

const formUserUpdate = reactive<FormUserUpdate>({
    fullName: user.value?.full_name ?? '',
    // email: user.value?.email ?? '',
    company_name: user.value?.company_name,
    company_address: user.value?.company_address,
    company_phone_number: user.value?.company_phone_number,
    avatar: user.value?.avatar,
});

watch(user, (newVal) => {
    if (newVal) {
        formUserUpdate.fullName = newVal.full_name;
        formUserUpdate.avatar = newVal.avatar;
        formUserUpdate.company_name = newVal.company_name;
        formUserUpdate.company_address = newVal.company_address;
        formUserUpdate.company_phone_number = newVal.company_phone_number;

    }
});

const handleChangeImage = (url: string) => {
    console.log(url);
    formUserUpdate.avatar = url;
    console.log(formUserUpdate.avatar);

};

const handleUpdateUser = async () => {
    await updateUserForm.value.validate();
    await $fetch('/user/update-me', {
        method: 'patch',
        body: formUserUpdate,
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
            'Authorization': `Bearer ${accessToken.value}`,
            'Accept': 'application/json',
        },
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Cập nhật thành công');
            }
            else {
                message.error('Cập nhật thất bại');
            }
        }
    });


}
</script>

<style scoped></style>