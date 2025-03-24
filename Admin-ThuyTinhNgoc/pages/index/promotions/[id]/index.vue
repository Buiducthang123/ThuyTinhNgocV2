<template>
    <div class="px-10 py-10">
        <div class="flex items-center mb-6 gap-2">
            <h3 class="font-bold text-xl">Chi tiết chương trình khuyến mãi</h3>
        </div>

        <div  v-if="promotion" class="flex flex-nowrap gap-10">
            <div class="max-w-[600px] w-1/2">
                <div class="space-y-6">
                    <div class="mb-4">
                        <label class="font-semibold block mb-2">Tiêu đề</label>
                        <p>{{ promotion?.title }}</p>
                    </div>

                    <div class="mb-4">
                        <label class="font-semibold block mb-2">Slug</label>
                        <p>{{ promotion?.slug }}</p>
                    </div>

                    <div class="mb-4">
                        <label class="font-semibold block mb-2">Hình ảnh</label>
                        <NuxtImg
                            :src="promotion?.image || 'https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg'"
                            :width="200" class="border" />
                    </div>

                    <div class="mb-4">
                        <label class="font-semibold block mb-2">Mô tả</label>
                        <p>{{ promotion?.description || 'Không có mô tả' }}</p>
                    </div>

                    <div class="mb-4">
                        <label class="font-semibold block mb-2">Giảm giá</label>
                        <p>{{ promotion?.discount }}%</p>
                    </div>

                    <div class="mb-4" v-if="promotion?.start_date && promotion?.end_date">
                        <label class="font-semibold block mb-2">Thời gian áp dụng</label>
                        <p>{{ dayjs(promotion.start_date).format('DD/MM/YYYY HH:mm') }} - {{
                            dayjs(promotion.end_date).format('DD/MM/YYYY HH:mm') }}</p>
                    </div>

                    <div class="mb-4">
                        <label class="font-semibold block mb-2">Trạng thái</label>
                        <a-tag v-if="dayjs().isBefore(promotion?.start_date)" color="blue" class="text-xl">Sắp diễn
                            ra</a-tag>
                        <a-tag v-else-if="dayjs().isAfter(promotion?.end_date)" color="red" class="text-xl">Đã kết
                            thúc</a-tag>
                        <a-tag v-else color="green" class="text-xl">Đang diễn ra</a-tag>
                    </div>

                    <div>
                        <a-button type="primary" @click="navigateTo('/promotions/'+promotion?.id+'/edit')">Chỉnh sửa</a-button>
                    </div>
                </div>
            </div>

            <div class="w-1/2">
                <h6 class="mb-6 font-semibold">sản phẩm áp dụng khuyến mãi:</h6>
                <div v-if="promotion?.products?.length" class="border p-4 max-h-[70vh] overflow-y-scroll">
                    <div v-for="product in promotion.products" :key="product.id" class="flex w-full gap-4 my-2">
                        <div class="w-full">
                            <div class="flex items-center gap-2">
                                <NuxtImg :src="product.cover_image" class="mr-2 rounded-full h-12 w-12" />
                                <div>
                                    <span class="font-medium">{{ product.title }}</span>
                                    <p class="text-gray-500">Giá gốc: {{ formatCurrency(product.price) }}</p>
                                    <p class="text-gray-500">Giảm giá: {{ promotion.discount }}%</p>
                                    <p class="text-gray-500">Giá bán: {{ formatCurrency(product.price * (100 -
                                        promotion.discount) / 100) }}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div v-else class="border p-4">
                    <a-empty description="Chưa có sản phẩm nào được áp dụng"></a-empty>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import type { IPromotion } from '~/interfaces/promotion';

const route = useRoute();

const promotionQuery = reactive({
    
});

const { data: promotion } = await useFetch<IPromotion>(`/api/promotions/${route.params.id}`, {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query: promotionQuery,
});

</script>