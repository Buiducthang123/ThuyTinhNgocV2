<template>
    <div class="px-6 py-10">
        <h3 class="font-bold text-xl mb-6">Quản lý đánh giá</h3>
        <a-table :columns="ColumnSTableReview" :dataSource="reviewData?.data ?? []" rowKey="id">
            <template #title>
                <div class="flex items-center gap-20">
                    <div class="flex items-center gap-10">
                        <span>Sắp xếp: </span>
                        <a-select v-model:value="reviewQuery.sort" style="width: 200px">
                            <a-select-option value="new">Mới nhất</a-select-option>
                            <a-select-option value="old">Cũ nhất</a-select-option>
                        </a-select>
                    </div>

                    <div class="flex items gap-5 items-center ">
                        <span>Đánh giá: </span>
                        <a-select v-model:value="reviewQuery.filter.rating" style="width: 300px">
                            <a-select-option value="">Tất cả</a-select-option>
                            <a-select-option value="1">1 sao</a-select-option>
                            <a-select-option value="2">2 sao</a-select-option>
                            <a-select-option value="3">3 sao</a-select-option>
                            <a-select-option value="4">4 sao</a-select-option>
                            <a-select-option value="5">5 sao</a-select-option>
                        </a-select>

                    </div>
                </div>
            </template>
            <template #bodyCell="{ record, column }">
                <template v-if="column.dataIndex == 'user'">
                    <a-avatar :src="record.user.avatar" />
                    <span class="ml-2">{{ record.user.full_name }}</span>
                </template>

                <template v-else-if="column.dataIndex == 'product'">
                    <a-avatar :src="record.product.cover" />
                    <span class="ml-2">{{ record.product.title }}</span>
                </template>

                <template v-else-if="column.dataIndex == 'action'">
                    <a-space>
                        <a-button danger @click="handleDeleteContentReview(record.id)">Xóa nội dung đánh giá</a-button>
                    </a-space>
                </template>

            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import type { IResponsePagination } from '~/interfaces/response';
import type { IReview } from '~/interfaces/review';


const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const ColumnSTableReview = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',

    },
    {
        title: 'Người đánh giá',
        dataIndex: 'user',
        key: 'user',

    },
    {
        title: 'Sản phẩm',
        dataIndex: 'product',
        key: 'product',
    },
    {
        title: 'Đánh giá',
        dataIndex: 'rating',
        key: 'rating',
    },
    {
        title: 'Nhận xét',
        dataIndex: 'comment',
        key: 'comment',
        width: '350px'
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
    },
];

const reviewQuery = reactive({
    page: 1,
    paginate: 10,
    sort: 'new',
    filter: {
        rating: '',
    },
    'with[]': ['user', 'product'],
});

const { data: reviewData, refresh:reviewDataRefresh } = await useFetch<IResponsePagination<IReview[]>>('/api/reviews', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken.value}`,
    },
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query: reviewQuery,
});

const handleDeleteContentReview = async (id: number) => {
    await $fetch(`/api/reviews/${id}`, {
        method: 'patch',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.value}`,
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        body: {
            comment: '',
        },
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Xóa nội dung thành công');
                reviewDataRefresh();
            }
            else {
                message.error('Xóa đánh giá không thành công');
            }
        },
    });
    reviewDataRefresh();
};
</script>

<style scoped></style>