<template>
    <div class="px-6 py-10">
        <h3 class="font-bold text-xl mb-6">Quản lý sách</h3>
        <a-table :columns="columns" :dataSource="products?.data ?? []" rowKey="id" bordered :pagination="false" >
            <template #bodyCell="{ column, record }">
                <template v-if="column.dataIndex === 'id'">
                    <span>{{ record.id }}</span>
                </template>  
                <template v-if="column.dataIndex === 'category'">
                    <span>{{ record.category.name }}</span>
                </template>

                <template v-if="column.dataIndex === 'is_sale'">
                    <a-tag :color="record.is_sale ? 'green' : 'red'">{{ record.is_sale ? 'Đang bán' : 'Ngừng bán'
                        }}</a-tag>
                </template>

                <template v-if="column.dataIndex === 'price'">
                    <span>{{ formatCurrency(record.price) }}</span>
                </template>

                <template v-if="column.dataIndex === 'discount'">
                    <span>{{ record.discount }}%</span>
                </template>

                <template v-if="column.dataIndex === 'action'">
                    <div class="flex gap-2">
                        <a-button type="primary" @click="navigateTo('/products/' + record.id)">Xem Chi tiết</a-button>
                        <a-button @click="navigateTo('/products/' + record.id + '/edit')">Sửa</a-button>
                        <a-popconfirm
                            title="Bạn có chắc chắn muốn xóa, nó có thể ảnh hưởng tới danh mục và sản phẩm cũng sẽ bị xóa"
                            ok-text="Có" cancel-text="Không" @confirm="">
                            <a-button type="link" danger>Xóa</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </template>
            <template #title>
                <div class="mb-4">
                    <a-button type="primary" @click="navigateTo('/products/create')">Thêm mới</a-button>
                    <div class="my-4 flex items-center gap-2">
                        <h6 class=" text-base
                            font-medium">Danh sách sản phẩm</h6>
                        <Icon class="text-lg cursor-pointer" @click="handleRefresh" name="i-mingcute-refresh-2-fill" />
                    </div>

                    <div class="flex gap-x-10">
                        <div class="space-x-6">
                            <a-input-search v-model:value="search"
                                placeholder="Tìm kiếm theo tên sản phẩm" style="width: 350px"
                                enter-button @search="() => {
                                    loading = true;
                                    console.log(search);

                                    query.search.title = search;
                                }" />
                        </div>

                        <div class="flex gap-2 items-center">
                            <span class="">Sắp xếp theo: </span>
                            <a-select v-model:value="query.sort" style="width: 200px" placeholder="Sắp xếp">
                                <a-select-option value="all">Sắp xếp</a-select-option>
                                <a-select-option value="new">Sản phẩm mới nhất</a-select-option>
                                <a-select-option value="old">Sản phẩm cũ nhất</a-select-option>
                                <a-select-option value="price_asc">Giá tăng dần</a-select-option>
                                <a-select-option value="price_desc">Giá giảm dần</a-select-option>
                                <a-select-option value="discount_asc">Giảm giá tăng dần</a-select-option>
                                <a-select-option value="discount_desc">Giảm giá giảm dần</a-select-option>
                                <a-select-option value="name_az">Tên A-Z</a-select-option>
                                <a-select-option value="name_za">Tên Z-A</a-select-option>
                            </a-select>
                        </div>

                        

                        <div class="flex gap-2 items-center">
                            <span>Trạng thái bán: </span>
                            <a-select v-model:value="query.filter.is_sale" style="width: 200px"
                                placeholder="Trạng thái bán">
                                <a-select-option value="all">Tất cả</a-select-option>
                                <a-select-option value="1">Đang bán</a-select-option>
                                <a-select-option value="0">Ngừng bán</a-select-option>
                            </a-select>
                        </div>
                    </div>
                </div>
            </template>

            <template #expandedRowRender="{ record }">
                <div>
                    <span class="block font-medium mb-6">Mô tả </span>
                    <div v-html="record.description" />
                </div>
            </template>

            <template #footer>
                <div class="flex justify-end w-full">
                    <a-pagination v-model:current="query.page" :total="products?.total"
                        :showSizeChanger="false" />
                </div>
            </template>

        </a-table>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product';
import type { IResponsePagination } from '~/interfaces/response';


const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const query = reactive({
    'with[]': [ 'category'],
    'paginate': 10,
    page: 1,
    search: {
        title: '',
    },
    sort: 'new',
    filter: {
        is_sale: 'all',
    }
});

const { data: products, refresh: refreshProducts } = await useFetch<IResponsePagination<IProduct[]>>('api/products', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    query,
});

const search = ref('');

const loading = ref(false);

const columns = [
    {
        'title': 'ID',
        'dataIndex': 'id',
        'key': 'id',
    },
    {
        'title': 'Tên sản phẩm',
        'dataIndex': 'title',
        'key': 'title',
    },
    {
        'title': 'Danh mục',
        'dataIndex': 'category',
        'key': 'category',
    },
    {
        'title': 'Số lượng',
        'dataIndex': 'quantity',
        'key': 'quantity',
    },
    {
        'title': 'Giảm giá',
        'dataIndex': 'discount',
        'key': 'discount',
    },
    {
        'title': 'Giá gốc',
        'dataIndex': 'price',
        'key': 'price',
    },
    {
        'title': 'Trạng thái bán',
        'dataIndex': 'is_sale',
        'key': 'is_sale',
    },
    {
        'title': 'Hành động',
        'dataIndex': 'action',
        'key': 'action',
    }
]

const handleRefresh = () => {
    // loading.value = true;
    query.page = 1;
    search.value = '';
    query.search.title = '';
    query.sort = 'new';
    query.filter.is_sale = 'all';
    refreshProducts();
}

</script>

<style scoped>

</style>