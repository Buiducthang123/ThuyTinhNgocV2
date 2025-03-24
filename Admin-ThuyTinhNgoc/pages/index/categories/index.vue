<template>
    <div class="px-6 py-10">
        <h3 class="font-bold text-xl mb-6">Quản lý danh mục</h3>
        <a-table :columns="columns" :data-source="data ? data?.data : []" :loading="loading" bordered
            :pagination="false"
            :row-key="record => record.id">
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'avatar'">
                    <a-image :width="100" :src="record.avatar" />
                </template>

                <template v-else-if="column.dataIndex === 'parent_id'">
                    <span v-if="record.parent_id === null">Chưa có danh mục cha</span>
                    <span v-else>{{ record.parent?.name }}</span>
                </template>
                <template v-if="column.dataIndex === 'action'">
                    <div class="flex gap-2">
                        <a-button type="primary" @click="navigateTo('/categories/' + record.id)">Xem Chi tiết</a-button>
                        <a-button @click="navigateTo('categories/' + record.id + '/edit')">Sửa</a-button>
                        <a-popconfirm
                            title="Bạn có chắc chắn muốn xóa, nó có thể ảnh hưởng tới danh mục và sản phẩm cũng sẽ bị xóa"
                            ok-text="Có" cancel-text="Không" @confirm="handleDelete(record.id)">
                            <a-button type="link" danger>Xóa</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </template>
            <template #expandedRowRender="{ record }">
                <div>
                    <span class="block font-medium mb-6">Chi tiết mô tả: </span>
                    <div v-html="record.description" />
                </div>
            </template>

            <template #title>
                <div>
                    <a-button type="primary" @click="navigateTo('/categories/create')">Thêm mới</a-button>
                    <div class="my-4 flex items-center gap-2">
                        <h6 class=" text-base
                            font-medium">Danh sách các danh mục</h6>
                        <Icon class="text-lg cursor-pointer" @click="" name="i-mingcute-refresh-2-fill" />
                    </div>

                    <div class="flex gap-x-10">
                        <div class="space-x-6">
                            <a-input-search v-model:value="search" placeholder="Tìm kiếm" style="width: 300px"
                                enter-button @search="() => {
                                    loading = true;
                                    query.filter.name = search;
                                }" />

                            <a-select v-model:value="query.filter.level" style="width: 200px" placeholder="Chọn cấp độ">
                                <a-select-option value="all">Tất cả danh mục</a-select-option>
                                <a-select-option value="parent">Danh mục cha</a-select-option>
                                <a-select-option value="child">Danh mục con</a-select-option>
                            </a-select>

                        </div>
                    </div>
                </div>
            </template>

            <template #footer>
                <div class="flex justify-end">
                    <a-pagination v-model:current="query.page" :total="data?.total" :pageSize="data?.per_page"
                    />
                </div>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import type { ICategory } from '~/interfaces/category';
import type { IResponsePagination } from '~/interfaces/response';

const loading = ref(false);
const search = ref('');
const config = useRuntimeConfig()

const columns = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: 100,
    },
    {
        title: 'Tên danh mục',
        dataIndex: 'name',
        key: 'name',
    },
    {
        title: 'Danh mục con của danh mục',
        dataIndex: 'parent_id',
        key: 'parent_id',
    },
    {
        title: 'Slug',
        dataIndex: 'slug',
        key: 'slug',
    },
    // {
    //     title: 'Mô tả',
    //     dataIndex: 'description',
    //     key: 'description',
    // },
    {
        title: 'Action',
        dataIndex: 'action',
        key: 'action',
    },
];

const query = reactive({
    page: 1,
    paginate: 10,
    filter: {
        level: 'all',
        name: '',
    },
    with: ['parent'],
});

const { data, refresh: refreshCate } = await useFetch<IResponsePagination<ICategory[]>>('/api/categories', {
    method: 'GET',
    baseURL: config.public.baseURLAPI,
    query,
    onResponse: ({ response }) => {
        loading.value = false;
    }
});

const handleRefresh = () => {
    loading.value = true;
    refreshCate();
};

//xóa danh mục

const authSotre = useAuthStore();
const accessToken = computed(() => authSotre.accessToken);

const handleDelete = async (id: number) => {
    await $fetch('/api/categories/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + accessToken.value
        },
        baseURL: config.public.baseURLAPI,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Xóa danh mục thành công');
                handleRefresh();
            }
            else {
                message.error(response._data.message || 'Xóa danh mục thất bại');
            }

        }
    });
};
</script>

<style scoped></style>