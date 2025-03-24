<template>
    <NuxtLayout>
        <div v-if="promotion && Object.keys(promotion).length !== 0">
            <NuxtImg src="images/promotion-bg.jpeg" class="w-full mt-4" alt="promotion" />
            <div class="bg-white shadow-lg mt-4 p-10">
                <div class="">
                    <h1
                        class="text-xl font-bold mt-10 text-center p-10 bg-blue-500 w-fit mx-auto text-white rounded-full">
                        {{
                            promotion?.title }}</h1>
                    <div class="text-center mt-4">
                        Thời gian
                        <span class="text-lg font-semibold">
                            {{ dayjs(promotion.start_date).format('HH:mm') }} ngày
                            {{ dayjs(promotion.start_date).format('DD-MM-YYYY') }}
                        </span>
                        đến
                        <span class="text-lg font-semibold">
                            {{ dayjs(promotion.end_date).format('HH:mm') }} ngày
                            {{ dayjs(promotion.end_date).format('DD-MM-YYYY') }}

                        </span>
                    </div>
                    <div class="text-center mt-4">
                        Giảm ngay:
                        <span class="inline-block text-xl italic text-white bg-red-500 px-2 rounded-lg">
                            {{ promotion.discount }}%
                        </span>
                        <span>
                            cho tất cả sản phẩm
                        </span>
                    </div>
                    <p class="mt-4 text-center">{{ promotion?.description }}</p>
                </div>

                <section>
                    <h6 class="text-xl font-medium mt-10">Danh sách sản phẩm áp dụng:</h6>

                    <div v-if="promotion.products && promotion.products.length > 0"
                        class="grid grid-cols-12 gap-x-4 gap-y-8 mt-10">
                        <ProductCard v-for="product in promotion.products" :key="product.id" :product="product" class="col-span-3" />
                    </div>
                    <div v-else>
                        <a-empty description="Không có sản phẩm nào được áp dụng khuyến mãi"></a-empty>
                    </div>
                </section>
            </div>
        </div>
        <a-result v-else status="404" title="Không tìm thấy khuyến mãi" />
    </NuxtLayout>
</template>

<script setup lang="ts">
import dayjs from '#build/dayjs.imports.mjs';
import type { IPromotion } from '~/interfaces/promotion';

definePageMeta({
    layout: 'default',
});

const promotionQuery = reactive({
    'with[]': ['products']
})

const route = useRoute();


const { data: promotion } = await useFetch<IPromotion>('/promotions/' + route.params.slug, {
    method: 'GET',
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    query: promotionQuery
});
</script>

<style scoped></style>