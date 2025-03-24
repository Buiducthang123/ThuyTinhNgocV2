<template>
    <div class="px-6 py-10">
        <div class="text-xl font-medium mb-6 flex items-center cursor-pointer" @click="navigateTo('/products')">
            <Icon name="i-material-symbols-arrow-back-ios"></Icon>
            <span> Quay lại danh sách sản phẩm</span>
        </div>
        <div v-if="product">
            <h3 class="font-bold text-2xl mb-6">{{ product.title }}</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                    <a-image :src="product.cover_image" alt="Product Cover" class="w-full h-auto rounded-lg shadow-md" />
                </div>
                <div>
                    <p><span class="font-semibold">Danh mục:</span> {{ product?.category?.name }}</p>
                    <p><span class="font-semibold">Giá:</span> {{ formatCurrency(product.price) }}</p>
                    <p><span class="font-semibold">Giảm giá:</span> {{ product.discount }}%</p>
                    <p><span class="font-semibold">Giá bán hiện tại:</span> {{ formatCurrency(product.price * (1 -
                        product.discount / 100)) }}</p>
                    <p><span class="font-semibold">Số trang:</span> {{ product.pages }}</p>
                    <p><span class="font-semibold">Kích thước:</span> {{ product.dimension_length }} x {{
                        product.dimension_width }} cm</p>
                    <p><span class="font-semibold">Độ dày:</span> {{ product?.height }} cm</p>
                    <p><span class="font-semibold">Trọng lượng:</span> {{ product.weight }} kg</p>
                    <p><span class="font-semibold">Trạng thái:</span> <a-tag :color="product.is_sale ? 'green' : 'red'">{{
                        product.is_sale ? 'Đang bán' : 'Ngừng bán' }}</a-tag></p>
                </div>
            </div>
            <div class="mt-10">
                <p><span class="font-semibold">Mô tả ngắn:</span></p>
                <div v-html="product?.short_description" class="prose"></div>
                <p><span class="font-semibold">Mô tả:</span></p>
                <div v-html="product?.description" class="prose"></div>
            </div>

            <div class="mt-6" v-if="product.thumbnail && product.thumbnail?.length > 0">
                <h4 class="font-semibold text-xl mb-4">Ảnh minh họa thêm</h4>
                <ul class="grid grid-cols-12 gap-4">
                    <li v-for="(item, index) in product.thumbnail" :key="index" class="col-span-3">
                        <a-image :src="item" alt="Thumbnail" class="w-32 h-32 rounded-lg shadow-md" />
                    </li>
                </ul>
            </div>
            
            <div class="mt-6">
                <h6 class="text-xl font-bold">Chiết khấu áp dụng cho bán buôn</h6>
                <!-- Thêm chiết khấu cho khách hàng bán buôn -->
                <div v-if="product?.discount_tiers && product?.discount_tiers.length > 0">
                    <div class="mt-6">
                        <a-button type="primary" @click="addRow">Thêm hàng</a-button>
                        <a-table :columns="discountTiersColumns" :data-source="product.discount_tiers" bordered
                            :row-key="record => record.id">
                            <template #bodyCell="{ column, text, record }">
                                <template
                                    v-if="column.dataIndex && ['minimum_quantity', 'price'].includes(column.dataIndex as string)">
                                    <div>
                                        <a-input-number v-if="editableData[record.id]" :formatter="value =>
                                            `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')" :parser="value =>
                                                value.replace(/\$\s?|(,*)/g, '')"
                                            v-model:value="editableData[record.id][column.dataIndex as string]"
                                            style="margin: -5px 0" />
                                        <template v-else>
                                            <template v-if="column.dataIndex === 'minimum_quantity'">
                                                {{ text }}
                                            </template>
                                            <template v-else>
                                                {{ formatCurrency(text as number) }}
                                            </template>
                                        </template>
                                    </div>
                                </template>
                                <template v-if="column.dataIndex === 'operation'">
                                    <div class="editable-row-operations">
                                        <span v-if="editableData[record.id]">
                                            <div class="flex gap-6 items-center">
                                                <a-popconfirm title="Chắc chắn lưu?" @confirm="save(record.id)">
                                                    <a-button type="primary" class="">Lưu</a-button>
                                                </a-popconfirm>
                                                <a-popconfirm title="Chắc chắn hủy?" @confirm="cancel(record.id)">
                                                    <a>Hủy</a>
                                                </a-popconfirm>
                                            </div>
                                        </span>
                                        <span v-else>
                                            <a @click="edit(record.id)">Sửa</a>
                                        </span>
                                    </div>
                                </template>
                            </template>
                        </a-table>
                    </div>

                </div>
                <div v-else class="mt-10">
                    <a-empty description="Chưa có chiết khấu nào áp dụng cho sản phẩm này" />
                    <div class="text-center mt-6">
                        <DiscountTiersCreateModal :product_id="product.id" @handle-refresh="refresh" />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, computed, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/auth';
import type { IProduct, IDiscountTier } from '~/interfaces/product';
import { formatCurrency } from '~/utils/currency';
import type { UnwrapRef } from 'vue';
import { cloneDeep } from 'lodash';

const route = useRoute();
const router = useRouter();
const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const query = reactive({
    'with[]': ['category', 'discountTiers'],
});

const { data: product, refresh } = await useFetch<IProduct>(`api/products/${route.params.id}`, {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    query,
});

const navigateTo = (path: string) => {
    router.push(path);
};

const discountTiersColumns = [
    {
        title: 'Mua tối thiểu',
        dataIndex: 'minimum_quantity',
        width: '25%',
    },
    {
        title: 'Giá bán áp dụng (VNĐ)/sản phẩm',
        dataIndex: 'price',
        width: '25%',
    },
    {
        title: 'Hành động',
        dataIndex: 'operation',
    },
];

interface DataItem {
    id: number;
    product_id: number;
    minimum_quantity: number;
    price: number;
    [key: string]: any;
}

const dataSource = ref<any>(product.value ? product.value.discount_tiers : []);
const editableData: UnwrapRef<Record<string, DataItem | any>> = reactive({});

const edit = (id: number | string) => {
    editableData[id] = cloneDeep(dataSource.value?.filter((item: IDiscountTier) => Number(id) === item.id)[0]);
    console.log(editableData[id]);

};

const save = async (id: string) => {
    const item = dataSource.value?.find((item: IDiscountTier) => item.id === Number(id));
    if (item) {
        Object.assign(item, editableData[id]);
    }
    delete editableData[id];

    item.product_id = product.value?.id;

    await $fetch('/api/discount-tiers', {
        method: 'POST',
        body: JSON.stringify(item),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${accessToken.value}`
        },
        baseURL: useRuntimeConfig().public.baseURLAPI,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Lưu thành công');
            }
            else {
                message.error('Lưu thất bại');
            }
        }
    });

};

const cancel = (id: string) => {
    delete editableData[id];
};

const addRow = () => {
    let newId = Math.floor(Math.random() * 10000);
    //Kieemr tra xem id co ton tai chua trong dataSource
    while (dataSource.value.some((item: IDiscountTier) => item.id === newId)) {
        newId = Math.floor(Math.random() * 10000);
    }
    dataSource.value.push({
        id: newId,
        minimum_quantity: 0,
        price: 0,
    });
    edit(newId);
};


</script>

<style scoped>
.prose {
    max-width: none;
}

.editable-row-operations a {
    margin-right: 8px;
}
</style>