<template>
    <NuxtLayout name="default">
        <section class="p-3">
            <p class="breadcrumb-item cursor-pointer flex items-center p-3 bg-white mb-3 font-medium">
                <Icon name="i-material-symbols-home-rounded" class="text-gray-500 text-xl" />
                <a @click="navigateTo('/')">Trang chủ</a>
            </p>

            <section class="">
                <Filter :filter="productQuery" />
            </section>
            <hr>

            <section class=" bg-white p-6 mt-4">
                <div class="grid grid-cols-12 gap-x-4 gap-y-8">
                    <ProductCard v-for="product in products?.data" :key="product.id" :product="product" class="col-span-3" />
                </div>
                <div class="mt-10 text-end">
                    <a-pagination v-model:current="productQuery.page" :total="products?.total" show-less-items />
                </div>
            </section>
        </section>
    </NuxtLayout>
</template>

<script setup lang="ts">
import type { IProduct } from '~/interfaces/product';
import type { IResponsePagination } from '~/interfaces/response';

const searchStore = useSearchStore();

const searchKey = computed(() => searchStore.searchKey);

const apiUrl = '/products';

const route = useRoute();

const productQuery = reactive({
    'with[]': [ 'category', 'discountTiers'],
    page: 1,
    sort: 'all',
    rating: 'all',
    paginate: 12,
    filter: {
        priceFrom: 0,
        priceTo: 10000000,
        is_sale: 1,
    },
    search: {
        title: ''
    }
});

watch(() => route.query.q || '', async (newVal) => {
    if (newVal) {
        productQuery.search.title = typeof newVal === 'string' ? newVal : '';
    }
    else {
        productQuery.search.title = '';
    }
});

const { data: products } = await useFetch<IResponsePagination<IProduct>>(apiUrl, {
    method: 'GET',
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    onResponse: ({ response }) => {
        if (response.ok) {
            console.log(response._data);
        }
        else {
            console.log(response);
        }
    },
    query: productQuery,
    watch: [searchKey]
});

useHead({
    title: 'Tìm kiếm sản phẩm',
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'This is my amazing site, let me tell you all about it.' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/images/icon-logo.png' }],
});


</script>

<style scoped></style>