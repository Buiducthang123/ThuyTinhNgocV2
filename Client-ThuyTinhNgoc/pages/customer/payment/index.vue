<template>
    <div>
        <div class="px-4">
            <h3 class="text-2xl mb-6">Thông tin thanh toán</h3>

            <a-table :columns="myPaymentTableColumn" :dataSource="myPaymentData?.data" :pagination="false" bordered>

                <template #title>
                    <div class="flex gap-2 items-center">
                        <h4 class="text-lg font-semibold">Danh sách thanh toán</h4>
                        <Icon name="i-mingcute-refresh-2-line" class="text-xl cursor-pointer" @click="handleRefresh()" />
                    </div>
                    <div class="flex gap-10 items-center my-4">
                        <div>
                            <span>
                                Sắp xếp theo:
                            </span>
                            <a-select v-model:value="myPaymentQuery.sort" style="width: 150px">
                                <a-select-option value="new">Mới nhất</a-select-option>
                                <a-select-option value="old">Cũ nhất</a-select-option>
                            </a-select>
                        </div>

                        <div>
                            <span>
                                Loại thanh toán:
                            </span>
                            <a-select v-model:value="myPaymentQuery.filter.transaction_type" style="width: 200px">
                                <a-select-option value="all">Tất cả</a-select-option>
                                <a-select-option :value="EPaymentTransactionType.DEPOSIT">{{
                                    EPaymentTransactionTypeText[EPaymentTransactionType.DEPOSIT] }}</a-select-option>
                                <a-select-option :value="EPaymentTransactionType.REFUND">{{
                                    EPaymentTransactionTypeText[EPaymentTransactionType.REFUND] }} </a-select-option>
                            </a-select>
                        </div>
                    </div>
                </template>
                <template #bodyCell="{ record, column }">
                    <span v-if="column.key === 'created_at'">
                        {{ dayjs(record.created_at).format('DD/MM/YYYY') }}
                    </span>
                    <template v-if="column.key === 'amount'">
                        <span>{{ formatCurrency(record.amount) }}</span>
                    </template>

                    <template v-if="column.key === 'transaction_type'">
                        <span>{{ EPaymentTransactionTypeText[record.transaction_type as EPaymentTransactionType]
                            }}</span>
                    </template>
                </template>

            </a-table>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IResponsePagination } from '~/interfaces/response';
import dayjs from '#build/dayjs.imports.mjs';
import type { IPayment } from '~/interfaces/Payment';
import { EPaymentTransactionType, EPaymentTransactionTypeText } from '~/enums/PaymentTransactionType';

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const myPaymentQuery = reactive({
    paginate: 10,
    page: 1,
    sort: 'new',
    filter: {
        transaction_type: 'all',
    }

})

const { data: myPaymentData, refresh } = await useFetch<IResponsePagination<IPayment>>('/my-payments', {
    method: 'GET',
    headers: {
        Authorization: `Bearer ${accessToken.value}`,
    },
    params: myPaymentQuery,
    baseURL: useRuntimeConfig().public.apiBaseUrl,
});

const myPaymentTableColumn = [
    {
        title: 'Mã đơn hàng',
        dataIndex: 'id',
        key: 'id',
    },
    {
        title: 'Ngày tạo',
        dataIndex: 'created_at',
        key: 'created_at',
    },
    {
        title: 'Tổng tiền',
        dataIndex: 'amount',
        key: 'amount',
    },
    {
        title: 'Loại thanh toán',
        dataIndex: 'transaction_type',
        key: 'transaction_type',
    },
    // {
    //     title: 'Hành động',
    //     dataIndex: 'action',
    //     key: 'action',
    // },
]

const handleRefresh = async() => {
    myPaymentQuery.page = 1;
    myPaymentQuery.sort = 'new';
    myPaymentQuery.filter.transaction_type = 'all';
    await refresh();
}

</script>

<style scoped></style>