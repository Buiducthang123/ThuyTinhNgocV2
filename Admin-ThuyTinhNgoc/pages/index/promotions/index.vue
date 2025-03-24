<template>
    <div class="px-6 py-10">
        <div class="flex items-center mb-6 gap-2">
            <h3 class="font-bold text-xl">Quản lý chương trình khuyến mãi </h3>
        </div>

        <a-table :columns="columns" :data-source="promotionData?.data" rowKey="id" :pagination="false" bordered>
            <template #bodyCell="{column, record}">
                <template v-if="column.key === 'image'">
                    <NuxtImg :src="record.image" :width="100" class="border" />
                </template>
                <template v-if="column.key == 'start_date'">
                    <!--Ngày, giờ bắt đầu -->
                    <div>
                        <span>Ngày: </span>
                        <span>{{ dayjs(record.start_date).format('DD/MM/YYYY') }}</span>
                    </div>
                    <div>
                        <span>Giờ: </span>
                        <span>{{ dayjs(record.start_date).format('HH:mm') }}</span>
                    </div>
                </template>

                <template v-if="column.key == 'end_date'">
                    <!--Ngày, giờ kết thúc -->
                    <div>
                        <span>Ngày: </span>
                        <span>{{ dayjs(record.end_date).format('DD/MM/YYYY') }}</span>
                    </div>
                    <div>
                        <span>Giờ: </span>
                        <span>{{ dayjs(record.end_date).format('HH:mm') }}</span>
                    </div>
                </template>

                <template v-if="column.key == 'status'">
                    <!--Kiểm tra thời gian của chương trình so với thời gian hiện tại-->
                    <a-tag v-if="dayjs().isBefore(record.start_date)" color="blue">Sắp diễn ra</a-tag>
                    <a-tag v-else-if="dayjs().isAfter(record.end_date)" color="red">Đã kết thúc</a-tag>
                    <a-tag v-else color="green">Đang diễn ra</a-tag>
                </template>

                <template v-if="column.key === 'action'">
                    <div class="space-x-4">
                        <a-button type="primary" size="middle" @click="navigateTo('/promotions/'+record.id)">Xem</a-button>
                        <a-button type="default" size="middle" @click="navigateTo('/promotions/'+record.id+'/edit')">Sửa</a-button>
                        <a-popconfirm title="Bạn có chắc chắn muốn xóa chương trình khuyến mãi này không?"
                            @confirm="handleDelete(record.id)">
                            <a-button danger size="middle">Xóa</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </template>

            <template #title>

                <div class="mb-6 flex gap-4 items-center">
                    <h4 class="font-medium ">Danh sách chương trình khuyến mãi</h4>
                    <Icon class="text-xl cursor-pointer" name="i-solar-refresh-bold" @click="handleRefresh"/>
                </div>
                <!--
                    <div class="flex justify-between items-center">
                        <h4 class="font-bold text-lg">Danh sách chương trình khuyến mãi</h4>
                        <a-button type="primary" @click="navigateTo('/promotions/create')">Tạo mới</a-button>
                    </div>
                -->

                <div class="flex gap-10 items-center mb-4">
                    <a-input v-model:value="searchInput" class="w-[400px]" placeholder="Tìm kiếm chương trình khuyến mãi" />

                    <div class="flex gap-4 items-center">
                        <span class=" font-medium">Lọc theo thời gian:</span>
                        <a-range-picker v-model:value="rangeTimeFilter" format="DD/MM/YYYY" />
                    </div>

                    <a-button type="primary" @click="handleSearch">Tìm kiếm</a-button>
                </div>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">

import dayjs, { Dayjs } from 'dayjs';
import type { IPromotion } from '~/interfaces/promotion';
import type { IResponsePagination } from '~/interfaces/response';
type RangeValue = [Dayjs, Dayjs];

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const promotionQuery = reactive({
    page: 1,
    paginate: 10,
    filter:{
        start_date: '',
        end_date: '',
        title: '',
    }
})

const { data: promotionData, refresh:refreshPromotions } = await useFetch<IResponsePagination<IPromotion>>('/api/promotions', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query: promotionQuery,
})

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Hình ảnh',
        dataIndex: 'image',
        key: 'image',
    },
    {
        title: 'Tên chương trình',
        dataIndex: 'title',
        key: 'title',
    },
    {
        title: 'Ngày bắt đầu',
        dataIndex: 'start_date',
        key: 'start_date',
    },
    {
        title: 'Ngày kết thúc',
        dataIndex: 'end_date',
        key: 'end_date',
    },
    {
        title: 'Trạng thái',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
        width: 250,
    }
];

const searchInput = ref<string>('');

const rangeTimeFilter = ref<RangeValue>();

const handleSearch = () => {
    if (rangeTimeFilter.value) {
        promotionQuery.filter.start_date = rangeTimeFilter.value[0].toISOString();
        promotionQuery.filter.end_date = rangeTimeFilter.value[1].toISOString();
    }
    promotionQuery.filter.title = searchInput.value;
}

const handleRefresh = () => {
    searchInput.value = '';
    rangeTimeFilter.value = undefined;
    promotionQuery.filter.start_date = '';
    promotionQuery.filter.end_date = '';
    promotionQuery.filter.title = '';
}

const handleDelete = async (id: number) => {
    await $fetch(`/api/promotions/${id}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.baseURLAPI,
        headers: {
            Authorization: `Bearer ${accessToken.value}`
        },
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Xóa chương trình khuyến mãi thành công');
                promotionQuery.page = 1;
                refreshPromotions();
            }
        }
    });
}

</script>

<style scoped></style>