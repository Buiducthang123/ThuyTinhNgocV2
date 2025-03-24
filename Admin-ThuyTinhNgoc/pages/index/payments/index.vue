<template>
    <div class="px-6 py-10">
        <div class="flex items-center mb-6 gap-2">
            <h3 class="font-bold text-xl">Quản lý thanh toán </h3>
            <Icon class="text-xl cursor-pointer" name="i-tabler-refresh" @click="" />


        </div>
        <a-table :columns="columns" :data-source="paymentData?.data" rowKey="id" :pagination="false">
            <template #title>
                <div class="flex justify-between items-center">
                    <div>
                        <span>Sắp xếp: </span>
                        <a-select v-model:value="paymentQuery.sort" style="width: 200px">
                            <a-select-option value="all">Tất cả</a-select-option>
                            <a-select-option value="asc">Tăng dần</a-select-option>
                            <a-select-option value="desc">Giảm dần</a-select-option>
                        </a-select>
                    </div>
                    <div class="flex gap-4 items-center">
                        <span>Lọc theo: </span>
                        <a-select v-model:value="paymentQuery.filter.transaction_type" style="width: 200px">
                            <a-select-option value="all">Tất cả</a-select-option>
                            <a-select-option :value="EPaymentTransactionType.DEPOSIT">{{ EPaymentTransactionTypeText[EPaymentTransactionType.DEPOSIT] }}</a-select-option>
                            <a-select-option :value="EPaymentTransactionType.REFUND">{{ EPaymentTransactionTypeText[EPaymentTransactionType.REFUND] }}</a-select-option>
                        </a-select>
                    </div>
                    <div>
                        <a-pagination
                            :total="paymentData?.total"
                            :current="paymentData?.current_page"
                            :pageSize="paymentData?.per_page"
                            @change="paymentQuery.page = $event"
                        />
                    </div>
                </div>
            </template>

            <template #bodyCell="{ record, column }">
                <template v-if="column.dataIndex === 'created_at'">
                    {{ dayjs(record.order.tr).format('DD/MM/YYYY') }}
                </template>

                <template v-if="column.dataIndex === 'order'">
                    {{ record.order.id }}
                </template>

                <template v-if="column.dataIndex === 'transaction_type'">
                    <a-tag>
                        {{ EPaymentTransactionTypeText[record.transaction_type as EPaymentTransactionType] }}
                    </a-tag>
                </template>

                <template v-if="column.dataIndex === 'user'">
                    <div class="flex gap-4 items-center">
                        <a-avatar :src="record.user.avatar" />
                        <span>{{ record.user.email }}</span>
                    </div>
                </template>

                <template v-if="column.dataIndex == 'action'">
                   <a class="text-blue-600" target="_blank" :href="`/orders/${record.order.id}`">
                        Xem chi tiết đơn hàng
                   </a>
                </template>

            </template>
        </a-table>
    </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs';
import { EPaymentTransactionType, EPaymentTransactionTypeText } from '~/enums/PaymentTransactionType';
import type { IPayment } from '~/interfaces/Payment';
import type { IResponsePagination } from '~/interfaces/response';

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const columns = ref([
    {
        title: 'ID',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Mã đơn hàng',
        dataIndex: 'order',
        key: 'order',
    },
    {
        title: 'Người thanh toán',
        dataIndex: 'user',
        key: 'user',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        key: 'created_at',
    },
    {
        title: 'Loại thanh toán',
        dataIndex: 'transaction_type',
        key: 'transaction_type',
    },
    {
        title: 'Hành động',
        key: 'action',
        dataIndex: 'action',
    },
]);

const paymentQuery = reactive({
    page: 1,
    paginate: 10,
    sort: 'desc',
    filter: {
        transaction_type: 'all',
    },
});

const { data: paymentData } = await useFetch<IResponsePagination<IPayment[]>>('/api/payments', {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${accessToken.value}`,
    },
    params: paymentQuery,
    baseURL: useRuntimeConfig().public.baseURLAPI,
});
</script>

<style scoped></style>