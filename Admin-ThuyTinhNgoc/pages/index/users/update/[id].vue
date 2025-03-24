<template>
    <div class="px-10 py-10 space-y-6">
        <div class="flex gap-2 items-center">
            <Icon name="i-material-symbols-arrow-back-ios" class="cursor-pointer px-3" @click="navigateTo('/users')" />
            <h3 class="font-bold text-xl">Chỉnh sửa thông tin tài khoản</h3>
        </div>
        <div class="flex max-w-4xl justify-between">
            <a-form :model="formUpdateUser" name="formUpdateUser" ref="formRefUpdateUser" :label-col="labelCol"
                labelAlign="left" class="w-8/12" :rules="rules" @finish="handleUpdate">
                <a-form-item label="Tên đầy đủ" name="fullName">
                    <a-input v-model:value="formUpdateUser.fullName" />
                </a-form-item>

                <a-form-item label="Email" name="email">
                    <a-input v-model:value="formUpdateUser.email" />
                </a-form-item>

                <a-form-item label="Vai trò" name="role">
                    <a-select v-model:value="formUpdateUser.role" style="width: 100%">
                        <a-select-option v-for="role in roles" :key="role.id" :value="role.id">{{ role.name
                            }}</a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Trạng thái" name="status">
                    <a-radio-group v-model:value="formUpdateUser.status">
                        <a-radio v-for="(value, key) in AccountStatusText" :key="key" :value="key">{{ value }}</a-radio>
                    </a-radio-group>
                </a-form-item>

                <div v-if="formUpdateUser.role == companyRoleID">
                    <a-form-item label="Tên công ty" name="companyName">
                        <a-input v-model:value="formUpdateUser.companyName" placeholder="" />
                    </a-form-item>

                    <a-form-item label="Địa chỉ công ty" name="companyAddress">
                        <a-input v-model:value="formUpdateUser.companyAddress" placeholder="" />
                    </a-form-item>

                    <a-form-item label="Số điện thoại công ty" name="companyPhoneNumber">
                        <a-input v-model:value="formUpdateUser.companyPhoneNumber" placeholder="" />
                    </a-form-item>

                    <a-form-item label="Mã số thuế công ty" name="companyTaxCode">
                        <a-input v-model:value="formUpdateUser.companyTaxCode" placeholder="" />
                    </a-form-item>

                    <a-form-item label="Người đại diện" name="contactPersonName">
                        <a-textarea v-model:value="formUpdateUser.contactPersonName" placeholder="" />
                    </a-form-item>

                    <a-form-item label="Số CMND người đại diện" name="representativeIdCard">
                        <a-input v-model:value="formUpdateUser.representativeIdCard" placeholder="" />
                    </a-form-item>

                    <a-form-item label="Ngày cấp CMND" name="representativeIdCardDate" >
                        <a-date-picker v-model:value="formUpdateUser.representativeIdCardDate" placeholder="" value-format="DD-MM-YYYY" />
                    </a-form-item>
                </div>

                <a-form-item class="mt-10">
                    <a-button type="primary" html-type="submit" size="large">Lưu lại</a-button>
                </a-form-item>
            </a-form>
            <div>
                <NuxtImg :src="formUpdateUser?.avatar" alt="Profile" width="200" height="200"
                    class="object-cover aspect-square" />
                <UploadImg @handle-change-image="handleChangeImage">
                    <template #main>
                        <a-button type="primary" class="mt-4">Thay đổi ảnh</a-button>
                    </template>
                </UploadImg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs, { Dayjs } from 'dayjs';
import { AccountStatusText } from '~/enums/accountStatus.enum';
import type { IRole } from '~/interfaces/role';
import type { IUser } from '~/interfaces/user';
import type { Rule } from 'ant-design-vue/es/form';

const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);
const config = useRuntimeConfig();
const route = useRoute();

const { data: userData } = await useFetch<IUser>('/api/user/'+route.params.id, {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    baseURL: config.public.baseURLAPI
})

const { data: roles } = await useFetch<IRole[]>('/api/roles', {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    baseURL: config.public.baseURLAPI
})

const formUpdateUser = reactive({
    fullName: userData.value?.full_name || '',
    email: userData.value?.email || '',
    role: userData.value?.role_id || '',
    status: userData.value?.status || '',
    avatar: userData.value?.avatar || '',
    companyName: userData.value?.company_name,
    companyAddress: userData.value?.company_address,
    companyPhoneNumber: userData.value?.company_phone_number,
    companyTaxCode: userData.value?.company_tax_code,
    contactPersonName: userData.value?.contact_person_name,
    representativeIdCard: userData.value?.representative_id_card,
    representativeIdCardDate: userData.value?.representative_id_card_date
    ? dayjs(userData.value.representative_id_card_date, 'DD-MM-YYYY').format('DD-MM-YYYY')
    : dayjs().startOf('day') as any,
    contactPersonPosition: userData.value?.contact_person_position,
})

const labelCol = { style: { width: '200px' } };

const formRefUpdateUser = ref();

const companyRoleID = computed(() => {
    const adminRole = roles.value ? roles.value.find(role => role.name === 'company') : null;
    return adminRole ? adminRole.id : null;
});

const rules: Record<string, Rule[]> = reactive({
    fullName: [
        { required: true, message: 'Vui lòng nhập tên đầy đủ', trigger: 'blur' },
        { max: 255, message: 'Tên đầy đủ không được vượt quá 255 ký tự', trigger: 'blur' }
    ],

    role: [
        { required: true, message: 'Vui lòng chọn vai trò', trigger: 'change' }
    ],

    email: [
        { required: true, message: 'Vui lòng nhập email', trigger: 'blur' },
        { type: 'email', message: 'Email không hợp lệ', trigger: 'blur' }
    ],

    status: [
        { required: true, message: 'Vui lòng chọn trạng thái', trigger: 'change' }
    ],
})

if (formUpdateUser.role == companyRoleID.value) {
    Object.assign(rules,
        {
            companyName: [
                { required: true, message: 'Vui lòng nhập tên công ty', trigger: 'blur' },
                { max: 255, message: 'Tên công ty không được vượt quá 255 ký tự', trigger: 'blur' }
            ],
            companyAddress: [
                { required: true, message: 'Vui lòng nhập địa chỉ công ty', trigger: 'blur' },
                { max: 255, message: 'Địa chỉ công ty không được vượt quá 255 ký tự', trigger: 'blur' }
            ],
            companyPhoneNumber: [
                { required: true, message: 'Vui lòng nhập số điện thoại công ty', trigger: 'blur' },
                { max: 255, message: 'Số điện thoại công ty không được vượt quá 255 ký tự', trigger: 'blur' }
            ],
            companyTaxCode: [
                { required: true, message: 'Vui lòng nhập mã số thuế công ty', trigger: 'blur' },
                { max: 255, message: 'Mã số thuế công ty không được vượt quá 255 ký tự', trigger: 'blur' }
            ],
            contactPersonName: [
                { required: true, message: 'Vui lòng nhập tên người đại diện', trigger: 'blur' },
                { max: 255, message: 'Tên người đại diện không được vượt quá 255 ký tự', trigger: 'blur' }
            ],
        }
    )
}

watch(() => formUpdateUser.role, async (newVal) => {
    if (formUpdateUser.role == newVal) {
        Object.assign(rules,
            {
                companyName: [
                    { required: true, message: 'Vui lòng nhập tên công ty', trigger: 'blur' },
                    { max: 255, message: 'Tên công ty không được vượt quá 255 ký tự', trigger: 'blur' }
                ],
                companyAddress: [
                    { required: true, message: 'Vui lòng nhập địa chỉ công ty', trigger: 'blur' },
                    { max: 255, message: 'Địa chỉ công ty không được vượt quá 255 ký tự', trigger: 'blur' }
                ],
                companyPhoneNumber: [
                    { required: true, message: 'Vui lòng nhập số điện thoại công ty', trigger: 'blur' },
                    { max: 255, message: 'Số điện thoại công ty không được vượt quá 255 ký tự', trigger: 'blur' }
                ],
                companyTaxCode: [
                    { required: true, message: 'Vui lòng nhập mã số thuế công ty', trigger: 'blur' },
                    { max: 255, message: 'Mã số thuế công ty không được vượt quá 255 ký tự', trigger: 'blur' }
                ],
                contactPersonName: [
                    { required: true, message: 'Vui lòng nhập tên người đại diện', trigger: 'blur' },
                    { max: 255, message: 'Tên người đại diện không được vượt quá 255 ký tự', trigger: 'blur' }
                ],
            }
        )

    }
})

const handleUpdate = async () => {
    await formRefUpdateUser.value.validate()

    if (formUpdateUser.role != companyRoleID.value) {
        formUpdateUser.representativeIdCardDate = null
    }

    await $fetch(`/api/user/` + route.params.id, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken.value}`
        },
        baseURL: config.public.baseURLAPI,
        body: formUpdateUser,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Cập nhật thông tin tài khoản thành công')
            } else {
                message.error('Cập nhật thông tin tài khoản thất bại')
            }
        },

    })
}

const handleChangeImage = (url: string) => {
    formUpdateUser.avatar = url
}

</script>

<style scoped></style>