<template>
    <div class="px-6 py-10">
        <div class=" text-xl font-medium mb-6 flex items-center cursor-pointer " @click="navigateTo('/categories')">
           <Icon name="i-material-symbols-arrow-back-ios"></Icon>
           <span> Quay lại trang danh sách danh mục</span>
        </div>
        <h3 class="font-bold text-xl mb-6">Chi tiết danh mục</h3>
        <div v-if="category" class="text-lg">

            <div class="flex gap-10">
                <div class="flex flex-col gap-4">
                    <div>
                        <span class="font-bold">ID:</span> {{ category.id }}
                    </div>
                    <div>
                        <span class="font-bold">Slug:</span> {{ category.slug }}
                    </div>
                    <div>
                        <span class="font-bold">Tên danh mục:</span> {{ category.name }}
                    </div>
                    <div>
                        <span class="font-bold">Mô tả:</span> {{ category.description }}
                    </div>
                    <p class="font-bold">Số lượng sản phẩm: {{ category.quantity_product ?? 0 }}</p>
                    <div v-if="category.parent_id != null">
                        <span class="font-bold">Danh mục con của danh mục: </span>
                        <span> {{ category.parent ?
                            category.parent.name : 'Không có' }}</span>
                    </div>
                </div>
                <div>
                    <span class="font-bold block">Ảnh đại diện danh mục:</span>
                    <a-image height="200px" :src="category.avatar" :alt="category.name" class="" />
                </div>
            </div>

            <div class="my-4" v-if="category.children && category.children?.length > 0">
                <ul>
                    <span class="font-bold block mb-6">
                        Danh mục con:
                    </span>
                    <li v-for="item in category.children" class="space-y-3">
                        <div class="space-x-6 mb-6">
                            <span>
                                - {{ item.name }}
                            </span>
                            <a-button type="primary">Xem chi tiết danh mục con</a-button>
                        </div>
                    </li>
                </ul>
            </div>

            <section class="mt-10" v-if="productInCategory?.data && productInCategory.data.length>0">
                <a-table :columns="productTableColumn" :data-source="productInCategory?.data" bordered :pagination="false"
                    :row-key="record => record.id">
                    <template #bodyCell="{ column, record }">
                        <template v-if="column.dataIndex === 'avatar'">
                            <a-image :width="100" :src="record.cover_image" />
                        </template>
                       
                        <template v-if="column.dataIndex === 'action'">
                            <a-button type="primary" :href= "'/products/'+ record.id" target="blank">Xem chi tiết</a-button>
                        </template>
                    </template>
                    <template #title>
                        <div>
                            <h6 class=" text-base font-medium">Danh sách sản phẩm trong danh mục {{ category.name }}</h6>
                        </div>
                    </template>

                    <template #footer>
                        <div class="flex justify-end w-full">
                            <a-pagination v-model:current="productInCategoryQuery.page" :total="productInCategory?.total"
                                show-less-items />
                        </div>
                    </template>
                </a-table>
            </section>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product';
import type { ICategory } from '~/interfaces/category';
import type { IResponsePagination } from '~/interfaces/response';

const route = useRoute()
const query = reactive({
    'load[]': ['parent', 'children']
})
const { data: category, error } = await useFetch<ICategory>('/api/categories/' + route.params.slug, {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query
})

const productInCategoryQuery = reactive({
    paginate: 10,
    filter: {
        category_id: category?.value?.id
    },
    page: 1,
})

const { data: productInCategory, error: errorProductInCategory } = await useFetch<IResponsePagination<IProduct>>('/api/products', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query: productInCategoryQuery
})

const productTableColumn = [
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
        width: '10%'
    },
    {
        title: 'Tên sản phẩm',
        dataIndex: 'title',
        key: 'title',
        width: '30%'
    },
    {
        title: 'Ảnh',
        dataIndex: 'avatar',
        key: 'avatar',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
        width: '20%'
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
    }
]

</script>

<style scoped></style>