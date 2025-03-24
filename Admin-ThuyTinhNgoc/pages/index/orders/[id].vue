<template>
    <div class="px-6 py-10">

        <div class="text-xl font-medium mb-6 flex items-center cursor-pointer" @click="navigateTo('/orders')">
            <Icon name="i-material-symbols-arrow-back-ios"></Icon>
            <span> Quay lại danh đơn hàng</span>
        </div>

        <h3 class="font-bold text-xl mb-6">Chi tiết đơn hàng</h3>

        <template v-if="order">
            <div class="flex gap-20">
                <div class="space-y-2 max-w-1/2 ">
                    <h6 class="text-lg font-medium mb-4">Thông tin người đặt hàng: </h6>
                    <p>
                        <span class="font-medium">Người đặt hàng: </span>
                        <span>{{ order.user?.full_name }}</span>
                    </p>
                    <p>
                        <span class="font-medium">Email: </span>
                        <span>{{ order.user?.email }}</span>
                    </p>

                    <div>
                        <span class="block font-medium mb-3">Ảnh đại diện: </span>
                        <a-image v-if="order.user?.avatar" :src="order.user.avatar" :width="100" :height="100" />
                    </div>
                </div>

                <div class="space-y-2 max-w-1/2">
                    <h6 class="text-lg font-medium mb-4">Địa chỉ đặt hàng:</h6>
                    <p>
                        <span class="font-medium">Tên người nhận: </span>
                        <span>{{ order.shipping_address?.receiver_name }}</span>
                    </p>
                    <p>
                        <span class="font-medium">SDT: </span>
                        <span>{{ order.shipping_address?.receiver_phone_number }}</span>
                    </p>

                    <p>
                        <span class="font-medium">Địa chỉ: </span>
                        <span>{{ order.shipping_address?.specific_address }}</span>
                        <span>, </span>
                        <span>{{ order.shipping_address?.ward.WardName }}</span>
                        <span>, </span>
                        <span>{{ order.shipping_address?.district.DistrictName }}</span>
                        <span>, </span>
                        <span>{{ order.shipping_address?.province.ProvinceName }}</span>
                    </p>
                </div>
            </div>

            <div class="">
                <h6 class="font-bold text-xl my-6">Thông tin chi tiết đơn hàng</h6>
                <div class="flex gap-20">
                    <div class="max-w-1/2">
                        <p>
                            <span class="font-medium">Mã đơn hàng:</span>
                            <span>{{ order.id }}</span>
                        </p>
                        <p>
                            <span class="font-medium">Ngày đặt hàng: </span>
                            <span>{{ dayjs(order.created_at).format('DD/MM/YYYY') }}</span>
                        </p>

                        <p>
                            <span class="font-medium">Tổng tiền: </span>
                            <span class="text-green-600 font-medium text-2xl">{{ formatCurrency(order.final_amount)
                                }}</span>
                        </p>
                    </div>
                    <div>
                        <p>
                            <span class="font-medium">Phí vận chuyển: </span>
                            <span class="text-green-600 font-medium text-2xl">{{ formatCurrency(order.shipping_fee)
                                }}</span>
                        </p>
                        <p class="mt-4">
                            <span class="font-medium">Trạng thái: </span>
                            <a-tag>
                                <span class="text-base text-gray-500"> {{ OrderStatusText[order.status as OrderStatus]
                                    }}</span>
                            </a-tag>
                        </p>
                    </div>
                </div>

                <h6 class="mt-6 mb-4 text-xl font-medium">Danh sách hàng: </h6>
                <a-table :columns="column" :dataSource="order?.order_items ?? []" rowKey="id" bordered
                    :pagination="false">
                    <template #bodyCell="{ record, column }">
                        <template v-if="column.key === 'product'">
                            <div class="flex items-center gap-2">
                                <NuxtImg :src="record.product?.cover_image" :alt="record.product?.title" width="100"
                                    height="100" />
                                <div>
                                    <span class="block mb-3">{{ record.product?.title }}</span>
                                    <span class="text-gray-500">Số lượng còn lại: {{ record.product.quantity }}</span>
                                </div>

                            </div>
                        </template>
                        <template v-if="column.key === 'quantity'">
                            <span>{{ record.quantity }}</span>
                        </template>
                        <template v-if="column.key === 'price'">
                            <span>{{ formatCurrency(record.price) }}</span>
                        </template>
                        <template v-if="column.key === 'total'">
                            <span>{{ formatCurrency(record.price * (100 - record.discount) / 100) }}</span>
                        </template>

                        <template v-if="column.key === 'action'">
                            <a-button type="primary" @click="navigateTo('/products/' + record.product_id)">Xem chi
                                tiết</a-button>
                        </template>
                    </template>

                </a-table>
            </div>

            <div class="mt-6">
                <h6 class="text-lg font-medium">Duyệt đơn hàng: </h6>
                <div class="flex gap-4 items-center" v-if="(order.status != OrderStatus.CANCELLED && order.payment_method == EPaymentMethod.BANK_TRANSFER) || order.payment_method == EPaymentMethod.COD">
                    <a-select size="large" class="mt-4" v-model:value="formUpdateOrder.status" style="width: 200px">
                        <a-select-option v-for="(item, key) in OrderStatusTextV2" :key="key"
                            :value="Number.parseInt(key.toString())">
                            {{ item }}
                        </a-select-option>
                    </a-select>

                    <a-popconfirm title="Bạn có chắc chắn muốn cập nhật trạng thái đơn hàng này không?" ok-text="Có" cancel-text="Không"
                        @confirm="handleUpdateStatus"
                    >
                        <a-button type="primary" class="mt-4" @click="">Xác nhận lưu</a-button>
                    </a-popconfirm>
                </div>
                <div v-else>
                    <span class="text-red-500">Đơn hàng đã được hoàn tiền, không thể cập nhật trạng thái</span>
                </div>
                <!--
                    <a-steps :current="formUpdateOrder.status" :items="stepItem" class="mt-6"></a-steps>
                -->
            </div>
        </template>

        <template v-else>
            <div class="text-red-500 flex flex-col  gap-4 items-center">
                <span>Đơn hàng không tồn tại</span>
                <a-button class="w-fit" @click="navigateTo('/orders')">Quay lại trang danh sách đơn hàng</a-button>
            </div>
        </template>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { OrderStatus, OrderStatusText, OrderStatusTextV2 } from '~/enums/orderStatus.enum';
import { EPaymentMethod } from '~/enums/payment-method.enum';
import type { IOder } from '~/interfaces/order';

const route = useRoute();

const authStore = useAuthStore();

const accessToken = ref(authStore.accessToken);

const query = reactive({
    'with[]': ['user', 'orderItems', 'orderItems.product'],
});

const { data: order, error, refresh:orderRefresh } = await useFetch<IOder>(`/api/order/${route.params.id}`, {
    method: 'GET',
    headers: {
        'Authorization': `Bearer ${accessToken.value}`
    },
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query,

});

const column = [
    {
        title: 'Mã sản phẩmphẩm',
        dataIndex: 'product_id',
        key: 'product_id',
    },
    {
        title: 'Sản phẩm',
        dataIndex: 'product',
        key: 'product',
    },
    {
        title: 'Số lượng mua',
        dataIndex: 'quantity',
        key: 'quantity',
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
    },
    {
        title: 'Thành tiền',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
    }
]

const formUpdateOrder = reactive({
    status: order?.value?.status,
});

const handleUpdateStatus = async () => {
    await $fetch<IOder>(`/api/order/${route.params.id}`, {
        method: 'patch',
        headers: {
            'Authorization': `Bearer ${accessToken.value}`
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        body: {
            status: formUpdateOrder.status
        },
        onResponse: ({response}) => {
            if(response.ok) {
                message.success('Cập nhật trạng thái đơn hàng thành công');
                orderRefresh();
            }
            else {
                message.error('Cập nhật trạng thái đơn hàng thất bại');
            }
        }
    });
}

const stepItem = [
    {
        title: 'Chờ xác nhận',
        description: 'Đơn hàng đang chờ xác nhận'
    },
    {
        title: 'Đã xác nhận',
        description: 'Đơn hàng đã được xác nhận'
    },
    {
        title: 'Đơn hàng đang được chuẩn bị',
        description: 'Đơn hàng đang được chuẩn bị',
    },
    {
        title: 'Đang giao hàng',
        description: 'Đơn hàng đang được giao',
    },
    {
        title: 'Đã giao hàng',
        description: 'Đơn hàng đã được giao',
    },

]
</script>

<style scoped></style>