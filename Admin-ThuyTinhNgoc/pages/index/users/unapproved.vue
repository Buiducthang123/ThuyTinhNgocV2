<template>
    <div class="px-6 py-10">
        <h3 class="font-bold text-xl">Tài khoản chưa được duyệt</h3>
        <a-table class="mt-8" :data-source="data ? data.data : []" :columns="columns" :pagination="pagination" bordered
            :loading="loading">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'role'">
                    <a-tag color="blue">{{ record.role.name }}</a-tag>
                </template>

                <template v-else-if="column.dataIndex === 'status'">
                    <a-tag :color="record.status == AccountStatus.ACTIVE ? 'green' : 'red'">
                        {{ AccountStatusText[record.status as AccountStatus] }}
                    </a-tag>
                </template>

                <template v-if="column.dataIndex === 'action'">
                    <a-space>
                        <a-popconfirm title="Phê duyệt tài khoản này ?" @confirm="handleUpdate">
                            <a-button type="primary" @click="()=>{
                                accountSelected = record as IUser
                            }">Phê duyệt</a-button>
                        </a-popconfirm>
                        <a-button danger>Xóa</a-button>
                    </a-space>
                </template>
            </template>
            <template #title>
                <div>
                    <div class="my-4 flex items-center gap-2">
                        <h6 class=" text-base font-medium">Danh sách tài khoản</h6>
                        <Icon class="text-lg cursor-pointer" @click="handleRefresh()"
                            name="i-mingcute-refresh-2-fill" />
                    </div>
                    <div class="flex gap-x-10">
                        <div class="">
                            <a-input-search v-model:value="search" placeholder="Tìm kiếm theo tên hoặc email"
                                style="width: 300px" enter-button @search="handleSearch" />
                        </div>

                        <a-select v-model:value="params.role" style="width: 200px">
                            <a-select-option value="">Tất cả vai trò</a-select-option>
                            <a-select-option value="user">Người dùng cá nhân</a-select-option>
                            <a-select-option value="admin">Quản trị viên</a-select-option>
                        </a-select>
                    </div>
                </div>
            </template>
            <template #expandedRowRender="{ record }">
                <div>
                    <h6 class="text-sm font-bold mb-6">Thông tin chi tiết</h6>
                    <div class="flex items-start gap-6">
                        <!-- Hiển thị Avatar -->
                        <div class="h-20 w-20 min-w-20 rounded-full overflow-hidden border-4 border-blue-300">
                            <NuxtImg v-if="record.avatar" class="object-cover h-full w-full" :src="record.avatar"
                                alt="Avatar của {{ record.full_name }}" />
                        </div>

                        <!-- Hiển thị thông tin -->
                        <div class="w-full space-y-2">
                            <h6 class="text-xl font-semibold">{{ record.full_name }}</h6>
                            <p class="text-gray-500"><strong>Email:</strong> {{ record.email }}</p>
                            <p v-if="record.role?.name" class="text-gray-500"><strong>Vai trò:</strong> {{
                                record.role.name }}</p>
                            <hr>
                            <div v-if="record.role?.name == 'company'" class="flex justify-between mt-4">
                                <div class="space-y-2">
                                    <p class="text-gray-500">
                                        <strong>Công ty:</strong> {{ record.company_name }}
                                    </p>
                                    <p class="text-gray-500">
                                        <strong>Địa chỉ công ty:</strong> {{ record.company_address }}
                                    </p>

                                    <p class="text-gray-500"><strong>Trạng thái:</strong>
                                        <a-tag color="green">
                                            {{ AccountStatusText[record.status as AccountStatus] }}
                                        </a-tag>
                                    </p>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-gray-500">
                                        <strong>Mã số thuế:</strong> {{ record.company_tax_code }}
                                    </p>
                                    <p class="text-gray-500">
                                        <strong>Số điện thoại công ty:</strong> {{ record.company_phone_number }}
                                    </p>
                                </div>
                                <div class="space-y-2">
                                    <p class="text-gray-500">
                                        <strong>Người đại diện:</strong> {{ record.contact_person_name }}
                                    </p>

                                    <p class="text-gray-500">
                                        <strong>Số căn cước công dân:</strong> {{ record.representative_id_card }}
                                    </p>

                                    <p class="text-gray-500">
                                        <strong>Ngày tạo căn cước:</strong> {{ record.representative_id_card_date }}
                                    </p>

                                    <p class="text-gray-500">
                                        <strong>Chức vụ:</strong> {{ record.contact_person_position }}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

            </template>
            <template #expandColumnTitle>
                <span style="color: red">Thêm</span>
            </template>

        </a-table>
    </div>
</template>

<script setup lang="ts">
import { AccountStatus, AccountStatusText } from '~/enums/accountStatus.enum';
import type { IResponsePagination } from '~/interfaces/response';
import type { IUser } from '~/interfaces/user';

const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const loading = ref(false);

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Tên đầy đủ',
        dataIndex: 'full_name',
        key: 'full_name',
    },
    {
        title: 'Email',
        dataIndex: 'email',
        key: 'email',
    },
    {
        title: 'Vai trò',
        dataIndex: 'role',
        key: 'role',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Hành động',
        key: 'action',
        dataIndex: 'action',
    },
];

const search = ref('');

const params = ref({
    paginate: 10,
    status: AccountStatus.NOT_ACTIVE,
    'with[]': 'role',
    page: 1,
    search: '',
    role: '',
});


const { data, error, refresh } = await useFetch<IResponsePagination<IUser[]>>('/api/users', {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken.value}`
    },
    baseURL: useRuntimeConfig().public.baseURLAPI,
    onResponse: ({ response }) => {
        loading.value = false;
    },
    params: params,
    watch: [params],
});

const pagination = computed(() => ({
    total: data && data.value ? data.value.total : 0,
    current: data && data.value ? data.value.current_page : 1,
    pageSize: data && data.value ? data.value.per_page : 10,
}));

const handleSearch = () => {
    params.value.search = search.value;
    loading.value = true;
}

const handleRefresh = () => {
    refresh();
    params.value.search = '';
    search.value = '';
}

const accountSelected = ref<IUser>();

const config = useRuntimeConfig();

const handleUpdate = async () => {

    if (!accountSelected.value) {
        return;
    }
    await $fetch(`/api/user/` + accountSelected.value.id, {
        method: 'PATCH',
        headers: {
            Authorization: `Bearer ${accessToken.value}`
        },
        baseURL: config.public.baseURLAPI,
        body: {
            status: AccountStatus.ACTIVE
        },
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Cập nhật thông tin tài khoản thành công')
                handleRefresh()
            } else {
                message.error('Cập nhật thông tin tài khoản thất bại')
            }
        },

    })
}
</script>

<style scoped></style>