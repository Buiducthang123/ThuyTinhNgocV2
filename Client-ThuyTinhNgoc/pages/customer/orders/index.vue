<template>
    <div>
        <div class="px-4">
            <h3 class="text-2xl mb-6">Đơn hàng của tôi</h3>
            <div>
                <a-radio-group v-model:value="orderQuery.filter.status" button-style="solid">
                    <a-radio-button value="0">Tất cả</a-radio-button>
                    <a-radio-button v-for="(item, key) in OrderStatusText" :key="key"
                        :value="Number.parseInt(key.toString())">
                        {{ item }}
                    </a-radio-button>
                </a-radio-group>
            </div>
        </div>
        <section class="p-4 rounded-lg">
            <div v-if="orderData?.data && orderData.data.length > 0">
                <div v-for="order in orderData?.data" :key="order.id" class=" my-4 bg-white p-5 border-gray-200 py-4">
                    <div class="space-y-4">
                        <div class="flex justify-between w-full">
                            <div class="text-lg font-semibold">Mã đơn hàng: {{ order.id }}</div>
                            <a-tag class="text-lg font-medium">{{ EPaymentMethodText[order.payment_method as
                                EPaymentMethod] }}</a-tag>
                            <span class="text-lg font-semibold uppercase text-red-500">
                                {{ OrderStatusText[order.status as OrderStatus] }}
                            </span>
                        </div>
                        <hr>
                        <h6 class="font-bold">Danh sách sản phẩm: </h6>
                        <div v-for="item in order.order_items" :key="item.id">
                            <div class="flex justify-between">
                                <div class="flex gap-4">
                                    <img :src="item.product?.cover_image" alt="" class="w-20 h-20 object-cover">
                                    <div class="space-y-2">
                                        <div class="text-lg font-semibold">{{ item.product?.title }}
                                            <a class="text-blue-600 text-xs" target="_blank"
                                                :href="'/product/' + item.product?.slug">Xem chi tiết sản phẩm</a>

                                        </div>
                                        <div class="text-base font-semibold">Số lượng mua: {{ item.quantity }}</div>
                                        <div class="text-base font-semibold">Tổng tiền:
                                            <span class="text-red-500"> {{ formatCurrency((item.price * (100 -
                                                item.discount )/100)* item.quantity) }}</span>
                                        </div>
                                    </div>
                                </div>
                                <div class="flex items-start gap-4">
                                    <div class="flex items-center gap-2">
                                        <del class="text-gray-500">{{ formatCurrency(item.product?.price) }}</del>

                                        <div class="text-lg font-semibold text-red-500">{{ formatCurrency(item.price *
                                            (100 - item.discount)/100) }}</div>
                                    </div>
                                </div>
                            </div>
                            <div v-if="order.status === OrderStatus.DELIVERED" class="mt-5 text-end">
                                <a-button v-if="!checkProductInReviews(order,item.product_id)" danger @click="() => {
                                    productId = item.product_id;
                                    orderId = order.id;
                                    isOpenModalReview = true;
                                }">Đánh giá ngay</a-button>

                                <div v-else class="text-red-500">
                                    <a-button disabled danger>Cảm ơn bạn đã đánh giá sản phẩm</a-button>
                                </div>

                            </div>
                            <hr class="my-4">

                        </div>
                        <div class="flex justify-between">
                            <div>
                                <div class="text-base font-semibold">Ngày đặt hàng: <span class="text-red-500">{{
                                    dayjs(order.created_at).format('DD/MM/YYYY') }}</span>
                                </div>
                                <!--Địa chỉ-->
                                <div>
                                    <div class="text-base font-semibold">Địa chỉ nhận hàng: </div>
                                    <div class="text-sm font-semibold">Tên người nhận: <span class="text-gray-600">{{
                                        order.shipping_address?.receiver_name }}</span></div>
                                    <div class="text-sm font-semibold">Số điện thoại: <span class="text-gray-600">{{
                                        order.shipping_address?.receiver_phone_number }}</span></div>
                                    <div class="text-sm font-semibold">Địa chỉ: <span class="text-gray-600">{{
                                        order.shipping_address?.specific_address }}</span>, <span
                                            class="text-gray-600">{{
                                                order.shipping_address.ward.WardName }}</span>, <span
                                            class="text-gray-600">{{
                                                order.shipping_address.district.DistrictName }}</span>, <span
                                            class="text-gray-600">{{
                                                order.shipping_address.province.ProvinceName }}</span></div>
                                </div>
                            </div>
                            <div>
                                <!--Tính thanh toán-->
                                <div class=" font-semibold">Phí vận chuyển: <span class="text-red-500">{{
                                    formatCurrency(order.shipping_fee) }}</span></div>

                                <div>
                                    <div class=" font-semibold">Tiền hàng: <span class="text-red-500">{{
                                        formatCurrency(order.order_items?.reduce
                                            ((total, item) => total + (item.price * (100 - item.discount) / 100) *
                                            item.quantity, 0)) }}
                                        </span>
                                    </div>
                                </div>

                                <hr class="my-4">
                                <div class=" font-semibold">Tổng thanh toán: <span class="text-red-500">{{
                                    formatCurrency(order.final_amount) }}</span></div>
                            </div>
                        </div>
                        <div v-if="order.status === OrderStatus.PENDING" class="flex justify-start mt-10">
                            <a-popconfirm
                                title="Bạn có chắc chắn muốn hủy đơn hàng này không? Nếu bạn đã thanh toán số tiền sẽ được hoàn trả lại !"
                                ok-text="Có" cancel-text="Không"
                                @confirm="handleCancelOrder(order.id, OrderStatus.REQUEST_CANCEL)">
                                <a-button type="primary" danger>Yêu cầu hủy đơn hàng</a-button>
                            </a-popconfirm>
                        </div>

                        <div v-if="order.status === OrderStatus.REQUEST_CANCEL" class="flex justify-start mt-10">
                            <a-popconfirm title="Bạn tiếp tục muốn mua lại đơn hàng?" ok-text="Có" cancel-text="Không"
                                @confirm="handleCancelOrder(order.id, OrderStatus.PENDING)">
                                <a-button type="primary" danger>HỦy bỏ yêu cầu hủy</a-button>
                            </a-popconfirm>
                        </div>
                    </div>
                </div>
            </div>
            <div v-else class="mt-6">
                <a-empty description="Không có đơn hàng nào "></a-empty>
            </div>
        </section>
        <ReviewCreateModal v-if="isOpenModalReview" :open="isOpenModalReview" @close="handleClose" :product_id="productId" :order_id="orderId" />
    </div>
</template>

<script setup lang="ts">
import dayjs from '#build/dayjs.imports.mjs';
import ReviewCreateModal from '~/components/ReviewCreateModal.vue';
import { OrderStatus, OrderStatusText } from '~/enums/orderStatus.enum';
import { EPaymentMethodText, type EPaymentMethod } from '~/enums/payment-method.enum';
import type { IOder } from '~/interfaces/order';
import type { IResponsePagination } from '~/interfaces/response';

const isOpenModalReview = ref(false);

const productId = ref(0);

const orderId = ref(0);

const handleClose = () => {
    isOpenModalReview.value = false;
};

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const orderQuery = reactive({
    page: 1,
    paginate: 10,
    filter: {
        status: OrderStatus.PENDING
    },
    'with[]': ['orderItems', 'orderItems.product','reviews']
});

const { data: orderData, refresh: refreshOrder } = await useFetch<IResponsePagination<IOder>>('/my-orders', {
    method: 'GET',
    query: orderQuery,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    baseURL: useRuntimeConfig().public.apiBaseUrl
});

const handleCancelOrder = async (orderId: number, status: number) => {
    await $fetch(`/order/${orderId}/cancel`, {
        method: 'post',
        headers: {
            Authorization: `Bearer ${accessToken.value}`
        },
        body: {
            status: status
        },
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Yêu cầu hủy đơn hàng thành công');
                refreshOrder();
            }
            else {
                message.error(response._data.message || 'Yêu cầu hủy đơn hàng thất bại');
            }
        }
    });

};
//Kiểm tra idid product có trong danh sách review order không
const checkProductInReviews = (order: IOder, product_id:number) => {
    let check = false;
    order.reviews?.forEach(review => {
        if(review.product_id === product_id){
            check = true;
        }
    });
    return check;
}

</script>

<style scoped></style>