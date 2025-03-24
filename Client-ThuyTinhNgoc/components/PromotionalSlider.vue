<template>
    <a-carousel v-if="promotionData?.data && promotionData?.data.length>0" arrows :slides-to-show="promotionData?.data?.length ? Math.min(promotionData.data.length, 2) : 0"
        class="carousel mb-10" dots-class="slick-dots">
        <template #prevArrow>
            <div class="custom-slick-arrow" style="left: 10px; z-index: 1">
                <left-circle-outlined />
            </div>
        </template>
        <template #nextArrow>
            <div class="custom-slick-arrow" style="right: 10px">
                <right-circle-outlined />
            </div>
        </template>
        {{  }}
        <div v-for="promotion in promotionData?.data" :key="promotion.id">
            <div class="rounded-lg overflow-hidden mr-6 bg-white flex gap-6 cursor-pointer p-4" @click="redirectToPromotion(promotion)">
                <div class="w-1/3 min-w-[200px] my-auto h-full">
                    <div class="relative overflow-hidden">
                        <div class="w-full h-48 relative blur-lg bg-center bg-no-repeat" :style="{
                            backgroundImage: `url(${promotion.image})`
                        }">
                        </div>
                        <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <NuxtImg v-if="promotion.image" class="mx-auto rounded-lg overflow-hidden" alt=""
                                :src="promotion.image" />
                            <nuxt-img v-else class="mx-auto rounded-lg overflow-hidden" alt=""
                                src="https://via.placeholder.com/200" />
                        </div>
                    </div>
                </div>
                <div class=" text-start space-y-2">
                    <h6 class="text-xl text-wrap font-semibold line-clamp-1 ">{{ promotion.title }}</h6>
                    <!--
                    <p class="line-clamp-3">{{ promotion.description }}</p>
                    -->
                    <p class="text-base font-medium">Giảm ngay:
                        <span class="inline-block text-xl italic text-white bg-red-500 px-2 rounded-lg">
                            {{ promotion.discount }}%
                        </span>
                        <span>
                            cho tất cả sản phẩm
                        </span>
                    </p>
                    <div class="text-base font-medium">
                        <span>Bắt đầu từ:</span>
                        <span class="block">
                            {{ dayjs(promotion.start_date).format('HH:mm') }} ngày
                            {{ dayjs(promotion.start_date).format('DD-MM-YYYY') }}
                        </span>

                        <span>
                            {{ dayjs(promotion.end_date).format('HH:mm') }} ngày
                            {{ dayjs(promotion.end_date).format('DD-MM-YYYY') }}

                        </span>
                    </div>
                    <div class="flex items-center gap-4">
                        <a class=" block text-blue-600 text-lg font-medium italic cursor-pointer">Vào xem ngay >></a>
                        <!--
                            kiểm tra sự kiện sắp diễn ra hay đã diễn ra 
                        -->
                        <div class="text-base font-medium text-red-500">
                            <span class="block text-lg">{{ 
                                    (dayjs().isAfter(dayjs(promotion.start_date)) && dayjs().isBefore(dayjs(promotion.end_date)))
                                    ? 'Đang diễn ra' : 'Sắp diễn ra'
                                }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

    </a-carousel>

</template>
<script lang="ts" setup>
import dayjs from '#build/dayjs.imports.mjs';
import { LeftCircleOutlined, RightCircleOutlined } from '@ant-design/icons-vue';
import type { IPromotion } from '~/interfaces/promotion';
import type { IResponsePagination } from '~/interfaces/response';

const promotionQuery = reactive({
    paginate: 10,
    filter: {
        start_date: dayjs().format('DD-MM-YYYY HH:mm:ss'),
    }
})

const { data: promotionData } = await useFetch<IResponsePagination<IPromotion>>('/promotions', {
    method: 'GET',
    headers: {
        'Content-Type': 'application/json',
    },
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    query: promotionQuery,
});


const redirectToPromotion = (promotion: IPromotion) => {
    //kiểm tra sự kiện có đang diễn ra không
    if (dayjs().isAfter(dayjs(promotion.start_date)) && dayjs().isBefore(dayjs(promotion.end_date))) {
        navigateTo('/promotion/' + (promotion.slug ? promotion.slug : promotion.id.toString()));
    }
    else{
        message.warning('Sự kiện trong thời gian không hoạt động')
    }
}


</script>
<style>
/* For demo */
.slick-slide {
    text-align: center;
    height: 192px;
    /* line-height: 160px; */
    overflow: hidden;
}

.slick-arrow.custom-slick-arrow {
    width: 35px;
    height: 35px;
    background-color: #000000;
    border-radius: 50%;
    font-size: 35px;
    color: #ffffff;
    transition: ease all 0.3s;
    opacity: 0.3;
    z-index: 1;
}

.slick-arrow.custom-slick-arrow:before {
    display: none;
}

.slick-arrow.custom-slick-arrow:hover {
    color: #ffffff;
    opacity: 0.5;
}

.slick-slide h3 {
    color: #fff;
}

.slick-dots.slick-dots-bottom {
    bottom: -20px;
}

:where(.css-dev-only-do-not-override-17yhhjv).ant-carousel .slick-dots li.slick-active button {
    background-color: #207cd3 !important;
}

:where(.css-dev-only-do-not-override-17yhhjv).ant-carousel .slick-dots li button {
    background-color: #7c8191 !important;
}
</style>