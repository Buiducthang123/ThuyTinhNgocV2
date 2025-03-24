<template>
    <div class="px-6 py-10">
        <div class="flex items-center mb-6 gap-2">
            <h3 class="font-bold text-xl">Quản lý đơn hàng </h3>
            <Icon class="text-xl cursor-pointer" name="i-tabler-refresh" @click="handleRefresh" />
        </div>
        <a-table :columns="columns" :dataSource="orders?.data ?? []" rowKey="id" bordered>

            <template #title>
                <div>
                    <a-button type="primary">Tạo đơn hàng</a-button>
                </div>

                <div class="mt-5 flex items-center gap-10">
                    <div>
                        <span class="text-base font-medium mr-2">Sắp xếp : </span>
                        <a-select v-model:value="orderQuery.sort" style="width: 200px">
                            <a-select-option value="new">Mới nhất</a-select-option>
                            <a-select-option value="old">Cũ nhất</a-select-option>
                            <a-select-option value="price_asc">Tổng tiền tăng dần</a-select-option>
                            <a-select-option value="price_desc">Tổng tiền giảm dần</a-select-option>
                        </a-select>
                    </div>

                    <div>
                        <span class="text-base font-medium mr-2">Hiển thị : </span>
                        <a-select v-model:value="orderQuery.paginate" style="width: 100px">
                            <a-select-option value="10">10</a-select-option>
                            <a-select-option value="20">20</a-select-option>
                            <a-select-option value="50">50</a-select-option>
                        </a-select>
                    </div>

                    <div>
                        <span class="text-base font-medium mr-2">Trạng thái : </span>
                        <a-select v-model:value="orderQuery.filter.status" style="width: 200px">
                            <a-select-option value="0">Tất cả</a-select-option>
                            <a-select-option v-for="(item, key) in OrderStatusText" :key="key" :value="key">
                                {{ item }}
                            </a-select-option>

                        </a-select>
                    </div>
                </div>

            </template>

            <template #bodyCell="{ record, column }">

                <template v-if="column.key === 'shipping_address'">
                    <div class="space-y-2">
                        <div>
                            <span class="text-black font-medium">Tên người nhận: </span>
                            <span>{{ record.shipping_address?.receiver_name }}</span>
                        </div>
                        <div>
                            <span class="text-black font-medium">SDT: </span>
                            <span>{{ record.shipping_address?.receiver_phone_number }}</span>
                        </div>

                        <div>
                            <span class="text-black font-medium">Địa chỉ: </span>
                            <span>{{ record.shipping_address?.specific_address }}</span>
                            <span>, </span>
                            <span>{{ record.shipping_address.ward.WardName }}</span>
                            <span>, </span>
                            <span>{{ record.shipping_address.district.DistrictName }}</span>
                            <span>, </span>
                            <span>{{ record.shipping_address.province.ProvinceName }}</span>
                        </div>
                    </div>

                </template>

                <template v-if="column.key === 'created_at'">
                    {{ dayjs(record.created_at).format('DD/MM/YYYY') }}
                </template>

                <template v-if="column.key === 'total'">
                    {{ formatCurrency(record.final_amount) }}
                </template>

                <template v-if="column.key === 'status'">
                    <a-tag>
                        <span class="text-base text-gray-500"> {{ OrderStatusText[record.status as OrderStatus]
                            }}</span>
                    </a-tag>
                </template>

                <template v-if="column.key === 'payment_status'">
                    <a-tag :color="((record.transaction_id && record.ref_id && record.payment_date)||(record.status == OrderStatus.DELIVERED)) ? 'green' : 'red'">
                        {{ ((record.transaction_id && record.ref_id && record.payment_date)||(record.status == OrderStatus.DELIVERED)) ? 'Đã thanh toán' : 'Chưa thanh toán' }}
                    </a-tag>
                </template>

                <template v-if="column.key === 'payment_method'">
                    <span class="text-red-500">{{ EPaymentMethodText[record.payment_method as EPaymentMethod] }}</span>
                </template>

                <template v-if="column.key === 'action'">
                    <div class="flex gap-4 ">
                        <a-button type="primary" @click="navigateTo('/orders/' + record.id)">Xem chi tiết</a-button>

                        <a-popconfirm v-if="record.status != OrderStatus.DELIVERED" title="Bạn có chắc chắn muốn hủy đơn hàng này không?" ok-text="Có"
                            cancel-text="Không" @confirm="handleCancel(record.id)">
                            <a-button type="link" danger>Hủy đơn hàng</a-button>
                        </a-popconfirm>
                    </div>
                </template>
            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { filter } from 'lodash';
import { OrderStatus, OrderStatusText } from '~/enums/orderStatus.enum';
import { EPaymentMethod, EPaymentMethodText } from '~/enums/payment-method.enum';
import type { IOder } from '~/interfaces/order';
import type { IResponsePagination } from '~/interfaces/response';


const columns = [
    {
        title: 'Mã đơn hàng',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Địa chỉ',
        dataIndex: 'shipping_address',
        key: 'shipping_address',
    },
    {
        title: 'Ngày đặt',
        dataIndex: 'created_at',
        key: 'created_at',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'total',
        key: 'total',
    },
    {
        title: 'Phương thức thanh toán',
        dataIndex: 'payment_method',
        key: 'payment_method',
    },
    {
        title: 'Trạng thái đơn hàng',
        dataIndex: 'status',
        key: 'status',
    },
    {
        title: 'Trạng thái thanh toán',
        dataIndex: 'payment_status',
        key: 'payment_status',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
    },
];

const orderQuery = reactive({
    page: 1,
    paginate: 10,
    sort: 'old',
    filter: {
        status: '0'
    }
});

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const { data: orders, refresh: refreshOrders } = await useFetch<IResponsePagination<IOder[]>>('api/orders', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    query: orderQuery,
});

const handleCancel = async (id: number) => {
    await $fetch<IOder>(`/api/order/${id}`, {
        method: 'patch',
        headers: {
            'Authorization': `Bearer ${accessToken.value}`
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        body: {
            status: OrderStatus.CANCELLED
        },
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Cập nhật trạng thái đơn hàng thành công');
                handleRefresh();
            }
            else {
                message.error('Cập nhật trạng thái đơn hàng thất bại');
            }
        }
    });
}

const handleRefresh = () => {
    orderQuery.page = 1;
    orderQuery.paginate = 10;
    orderQuery.sort = 'old';
    orderQuery.filter.status = '0';
    refreshOrders();
}

</script>

<style scoped></style>