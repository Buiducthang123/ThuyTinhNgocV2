<template>
    <div class="min-h-screen">
        <h6 class="text-xl font-medium py-4">Giỏ hàng</h6>
        <div class="flex gap-4">
            <div class="w-3/4">
                <a-table :columns="columns" bordered :data-source="sortItemSelect ?? []" :row-key="record => record.id"
                    :pagination="false" :row-selection="{
                        // selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange, getCheckboxProps: (record) => ({
                        //     disabled: record.quantity === 0, // Disable checkbox if quantity is 0
                        // }),
                        selectedRowKeys: state.selectedRowKeys, onChange: onSelectChange,
                    }">
                    <template #bodyCell="{ record, column }">
                        <template v-if="column.dataIndex === 'title'">
                            <div class="gap-4 flex ">
                                <a-image class="object-cover" :width="100" :height="150" :src="record.cover_image" />
                                <div class="w-56">
                                    <h6 class="text-xl font-medium line-clamp-2">{{ record.title }}</h6>
                                    <p class="line-clamp-2" v-html="record.short_description"></p>
                                    <p v-if="record.quantity && record.quantity > 0">Số lượng trong kho : {{
                                        record.quantity }}</p>
                                    <p v-else class="text-red-500 mt-2 text-sm">Sản phẩm này đã hết hàng !</p>
                                </div>
                            </div>
                        </template>

                        <template v-if="column.dataIndex === 'price'">
                            <div class="">
                                <div class="space-x-4">
                                    <span class="text-red-500 text-xl font-medium">{{
                                        formatCurrency(calculatePrice(record as IShoppingCardItem))
                                    }}</span>
                                    <del>{{ formatCurrency(record.price)
                                        }}</del>
                                </div>
                                <div class="text-center text-nowrap">
                                    <a-badge v-if="record.isApplyingDiscount" status="success"
                                        text="Đã áp dụng chiết khấu" class="mx-auto" />
                                </div>
                            </div>
                            <div v-if="user?.role?.name.toLowerCase() !== 'company'">
                                <span>Giảm: </span>
                                <span class="text-green-500 font-medium">{{ record.discount }}%</span>
                            </div>
                        </template>

                        <template v-if="column.dataIndex === 'quantity'">
                            <div class="flex gap-4">
                                <a-button class="border" @click="decreaseQuantity(record)">-</a-button>
                                <a-input v-model:value="record.pivot.quantity" :min="1" :max="10" @change="" />
                                <a-button class="border" @click="increaseQuantity(record)">+</a-button>
                            </div>
                        </template>

                        <template v-if="column.dataIndex === 'discount'">
                            <span>{{ record.isApplyingDiscount ? 0 : record.discount }}%</span>
                        </template>

                        <template v-if="column.dataIndex === 'total_price'">
                            {{ user?.role?.name === 'company' ? formatCurrency((calculatePrice(record as
                                IShoppingCardItem) as number) * record.pivot.quantity)
                                : formatCurrency(record.price * (100 - record.discount) / 100 * (record?.pivot?.quantity ??
                                    0)) }}
                        </template>

                        <template v-if="column.dataIndex === 'action'">
                            <div class="flex items-center gap-6">
                                <!--
                                    <a-button type="primary">Mua ngay</a-button>
                                -->
                                <a-popconfirm title="Bạn có muốn xóa sản phẩm này ra khỏi giỏ hàng ?" ok-text="Có"
                                    cancel-text="Không" @confirm="handleDelete(record.pivot.product_id)">
                                    <Icon class="text-2xl" name="i-material-symbols-delete-outline" />
                                </a-popconfirm>
                            </div>
                        </template>
                    </template>
                </a-table>
            </div>

            <div class="w-1/4 space-y-4">
                <div class="space-y-4">
                    <div class="flex justify-between p-4 bg-white">
                        <h6 class="">Giao hàng tới: </h6>
                        <span class="cursor-pointer text-blue-500 font-medium">Thay đổi</span>
                    </div>
                    <div class="border p-4 bg-white" v-if="defaultAddress">
                        <p class="font-medium">{{ defaultAddress?.receiver_name }}</p>
                        <p>{{ defaultAddress?.receiver_phone_number }}</p>
                        <p>{{ defaultAddress?.specific_address }}</p>
                        <p>{{ defaultAddress?.ward?.WardName }}, {{ defaultAddress?.district?.DistrictName }}, {{
                            defaultAddress?.province?.ProvinceName }}</p>
                    </div>
                    <div v-else class="flex justify-center items-center gap-2 bg-white p-4 
                                        cursor-pointer text-blue-500 font-medium"
                        @click="navigateTo('/customer/address')">
                        <Icon name="i-material-symbols-add" />
                        <span>Thêm địa chỉ nhận hàng</span>
                    </div>
                </div>

                <div class="bg-white p-4">
                    <div class="space-y-4">
                        <div class="flex justify-between">
                            <span>Tổng tiền hàng: </span>
                            
                            <span class="font-bold">{{ formatCurrency(totalPriceItemSelect) }}</span>
                        </div>

                        <div class="flex justify-between">
                            <span>Giảm giá: </span>

                            <span class="text-green-500 font-bold"> - {{ formatCurrency((totalItemSelectDiscount)
                            )
                                }}</span>
                        </div>

                        <div class="flex justify-between">
                            <span>Tiền hàng:</span>
                            <span class="text-green
                                -500 font-bold"> {{ formatCurrency(totalItemSelectDiscount) }}</span>
                        </div>

                        <div class="flex justify-between">
                            <span>Phí vận chuyển:</span>
                            <span class="text-green-500 font-bold"> {{ formatCurrency(totalShippingFee) }}</span>
                        </div>

                    </div>
                    <hr class="mb-6 mt-4">

                    <div class="flex justify-between items-start">
                        <span>Tổng cộng: </span>
                        <span class="text-xl font-medium text-red-600">{{ formatCurrency(totalPriceItemSelect +
                            totalShippingFee)
                            }}</span>
                    </div>

                    <div class="text-end mt-4 text-green-600">
                        <span>Tiết kiệm: </span>
                        <span>{{ formatCurrency(totalItemSelectDiscount) }}</span>
                    </div>

                    <!--Chọn hình thức thanh toán-->
                    <div class="flex flex-col gap-4 mt-4">
                        <h6 class="text-lg font-medium">Chọn hình thức thanh toán</h6>
                        {{ }}
                        <a-radio-group v-model:value="formCreateOrder.payment_method">
                            <a-radio v-for="(item, key) in paymentOptions" :key="item" :value="key"
                                class="block my-2">{{
                                    item
                                }}</a-radio>
                        </a-radio-group>
                    </div>

                    <!--Ghi chú-->
                    <div class="flex flex-col gap-4 mt-4">
                        <h6 class="text-lg font-medium">Ghi chú</h6>
                        <a-textarea v-model:value="formCreateOrder.note" :rows="4" placeholder="Ghi chú cho đơn hàng" />
                    </div>

                    <a-popconfirm :disabled="totalQuantity <= 0" title="Bạn có chắc chắn muốn mua sản phẩm này ?"
                        ok-text="Có" cancel-text="Không" @confirm="handlePurchase">
                        <button class="w-full p-2 mt-6 cursor-pointer bg-red-500 text text-white font-medium text-lg"
                            :class="{ 'cursor-not-allowed bg-red-300': totalQuantity <= 0 }"
                            :disabled="totalQuantity <= 0">
                            Mua
                            hàng ({{
                                itemProductSelect.length ?? 0 }})</button>
                    </a-popconfirm>


                    <p class="text-sm font-medium text-center mt-4 ">Mua thêm <span class="text-green-600">{{ 10 -
                        totalQuantity
                            }}</span> sản phẩm để được
                        <span class="text-green-600">free
                            ship</span>
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
definePageMeta({
    layout: 'default',
});

import { reactive, computed } from 'vue';
import { useFetch } from '#app';
import { useAuthStore } from '~/stores/auth';
import type { IShoppingCardItem } from '~/interfaces/shopping_card';
import { EPaymentMethod, EPaymentMethodText } from '~/enums/payment-method.enum';

const authStore = useAuthStore();
const access_token = computed(() => authStore.accessToken);
const user = computed(() => authStore.user);
const defaultAddress = computed(() => user.value?.shipping_addresses?.find((address) => address.is_default) ?? null);

const { data: shoppingCart, refresh: refreshShoppingCart } = await useFetch<IShoppingCardItem[]>('/shopping-carts', {
    method: 'GET',
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    headers: {
        Authorization: `Bearer ${access_token.value}`
    },
    transform: (data) => {
        data.forEach((item) => {
            item.isApplyingDiscount = false;
        });
        return data;
    }
});

const columns = [
    {
        title: 'Tên sản phẩm',
        dataIndex: 'title',
        key: 'product_name',
    },
    {
        title: 'Số lượng',
        dataIndex: 'quantity',
        key: 'quantity',
        width: '25%'
    },
    {
        title: 'Giá',
        dataIndex: 'price',
        key: 'price',
        width: '150px'
    },
    {
        title: 'Giảm giá',
        dataIndex: 'discount',
        key: 'discount',
    },
    {
        title: 'Thành tiền',
        dataIndex: 'total_price',
        key: 'total_price',
    },
    {
        title: 'Hành động',
        dataIndex: 'action',
        key: 'action',
    },
];

const state = reactive<{
    selectedRowKeys: (string | number)[];
    loading: boolean;
}>({
    selectedRowKeys: [],
    loading: true,
});

const onSelectChange = (selectedRowKeys: (string | number)[]) => {
    if (user.value?.shipping_addresses?.length === 0) {
        message.error('Vui lòng thêm địa chỉ nhận hàng');
        return;
    }

    //Kiểm tra sản phẩm chọn có hết hàng không nếu có thì bỏ chọn

    state.selectedRowKeys = selectedRowKeys;
};

const rowSelection = {
    selectedRowKeys: state.selectedRowKeys,
    onChange: onSelectChange,
    getCheckboxProps: (record: IShoppingCardItem) => ({
        disabled: record.quantity === 0, // Disable checkbox if quantity is 0
    }),
};

const handleDelete = async (id: number) => {
    await $fetch(`/shopping-carts/${id}`, {
        method: 'DELETE',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
            Authorization: `Bearer ${access_token.value}`
        },
        onResponse: ({ response }) => {
            if (response.ok) {
                refreshShoppingCart();
            } else {
                console.log(response);
            }
        }
    });
};

const decreaseQuantity = (record: any) => {
    if (record.pivot.quantity > 1) {
        record.pivot.quantity--;
    }
};

const increaseQuantity = (record: any) => {
    if (record.pivot.quantity < 10) {
        record.pivot.quantity++;
    }
};

//item selected 

const itemProductSelect = computed(() => {
    return shoppingCart?.value?.filter((item) => state.selectedRowKeys.includes(item.id)) ?? [];
});

//tống tiền item selected chưa giảm giá
const totalPriceItemSelect = computed(() => {
    if (user.value?.role?.name.toLowerCase() != 'company') {
        return itemProductSelect.value.reduce((total, item) => total + item.price * (100 - item.discount) / 100 * (item?.pivot?.quantity ?? 0), 0);
    }
    return itemProductSelect.value.reduce((total, item) => total + calculatePrice(item) * (item?.pivot?.quantity ?? 0), 0);
});

//tống tiền item selected đã giảm giá
const totalItemSelectDiscount = computed(() => {
    if (user.value?.role?.name.toLowerCase() == 'company' && itemProductSelect.value.length > 0) {
        return itemProductSelect.value.reduce((total, item) => {
            if (item.isApplyingDiscount) {
                return 0;
            }
            return Number(total) + item.price * (item.discount) / 100 * (item?.pivot?.quantity ?? 0);
        }, 0);
    }
    return itemProductSelect.value.reduce((total, item) => total + item.price * (item.discount) / 100 * (item?.pivot?.quantity ?? 0), 0);
});

// sắp xếp hiển thịthị item được chọn hiện lên đầu
const sortItemSelect = computed(() => {
    return shoppingCart?.value?.sort((a, b) => {
        if (state.selectedRowKeys.includes(a.id) && !state.selectedRowKeys.includes(b.id)) {
            return -1;
        }
        if (!state.selectedRowKeys.includes(a.id) && state.selectedRowKeys.includes(b.id)) {
            return 1;
        }
        return 0;
    });
});

const totalShippingFee = ref(0);
const totalWeight = computed(() => itemProductSelect.value.reduce((total, item) => total + item.weight * (item?.pivot?.quantity ?? 0), 0));
const totalQuantity = computed(() => itemProductSelect.value.reduce((total, item) => total + (item?.pivot?.quantity ?? 0), 0));
const totalHeight = computed(() => itemProductSelect.value.reduce((total, item) => total + item.height * (item?.pivot?.quantity ?? 0), 0));
const totalLength = computed(() => Math.max(...itemProductSelect.value.map(item => item.dimension_length)));
const totalWidth = computed(() => Math.max(...itemProductSelect.value.map(item => item.dimension_width)));

const formGetShippingFee = reactive({
    'shop_id': 194655,
    "service_id": 53321,
    // "insurance_value": 500000,
    "coupon": null,
    "to_district_id": defaultAddress.value?.district?.DistrictID,
    "to_ward_code": defaultAddress.value?.ward?.WardCode,
    "service_type_id": 2,
    "height": 0,
    "length": 0,
    "weight": 0,
    "width": 0,
})

const formGetService = reactive({
    "shop_id": 194655,
    "from_district": 1490,
    "to_district": defaultAddress.value?.district?.DistrictID,
})

const handleGetShippingFee = async () => {
    await $fetch('/api/GHN/shipping_fee', {
        method: 'POST',
        body: formGetShippingFee,
        onResponse: ({ response }) => {
            if (response.ok) {
                totalShippingFee.value =  Math.ceil(response._data.data.total / 1000) * 1000;
            }
        }
    })
}

const handleGetService = async () => {
    await $fetch('/api/GHN/get_service', {
        method: 'POST',
        body: formGetService
    })
}


watch(() => itemProductSelect.value, () => {
    if (itemProductSelect.value.length > 0) {
        formGetShippingFee.height = Math.ceil(totalHeight.value);
        formGetShippingFee.length = Math.ceil(totalLength.value);
        formGetShippingFee.weight = Math.ceil(totalWeight.value);
        formGetShippingFee.width = Math.ceil(totalWidth.value);

        if (totalQuantity.value < 10) {
            handleGetShippingFee();
            handleGetService();
        }
        else {
            totalShippingFee.value = 0;
        }
    }
}, { immediate: true });

watch(totalQuantity, async (newValue) => {
    if (newValue >= 10) {
        totalShippingFee.value = 0;
    }
    else {
        handleGetShippingFee();
        handleGetService();
    }
})

watch(() => defaultAddress.value, () => {
    if (defaultAddress.value) {
        formGetShippingFee.to_district_id = defaultAddress.value.district?.DistrictID;
        formGetShippingFee.to_ward_code = defaultAddress.value.ward?.WardCode;
    }
}, { immediate: true });

//Mua hàng

const paymentOptions = EPaymentMethodText;

const itemSelectSubmit = computed(() => {
    return itemProductSelect.value.map((item) => {
        return {
            product_id: item.id,
            quantity: item.pivot?.quantity ?? 0,
            price: item.price,
            discount: item.discount
        }
    })
})

import type { IShippingAddress } from '~/interfaces/shipping_address';

interface IFormCreateOrder {
    payment_method: string;
    items: any,
    note: string;
    shipping_address: IShippingAddress | undefined;
}

const formCreateOrder = reactive<IFormCreateOrder>({
    payment_method: EPaymentMethod.COD.toString(),
    items: itemSelectSubmit,
    note: '',
    shipping_address: undefined,
})

//Kiểm tra số lượng mua 1 sản phẩm có vượt quá số lượng sản phẩm của product không

const handleCheckQuantity = () => {
    return itemProductSelect.value.every(item => {
        if ((item.pivot?.quantity ?? 0) > (item?.quantity ?? 0)) {
            message.error(`Số lượng sản phẩm ${item.title} không đủ `);
            return false; // Dừng nếu điều kiện không thỏa mãn
        }
        return true;
    });
};

const handlePurchase = async () => {
    formCreateOrder.shipping_address = defaultAddress.value ?? undefined;

    let checkQuantity = handleCheckQuantity();

    if (!checkQuantity) {
        return;
    }

    await $fetch('/orders', {
        method: 'POST',
        body: formCreateOrder,
        headers: {
            Authorization: `Bearer ${access_token.value}`
        },
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        onResponse: ({ response }) => {
            if (response.ok) {
                if (formCreateOrder.payment_method === EPaymentMethod.BANK_TRANSFER.toString()) {
                    window.location.href = response._data;
                }
                else {
                    message.success('Đặt hàng thành công, vui lòng chờ xác nhận từ admin');
                    refreshShoppingCart();
                }
            }
            else {
                message.error(response._data.message || 'Có lỗi xảy ra vui lòng thử lại sau');
            }
        }
    })

}


const calculatePrice = (record: IShoppingCardItem) => {
    if (user.value?.role?.name === 'company' && record.pivot?.quantity) {
        const quantity = record.pivot?.quantity;
        const discountTier = (record?.discount_tiers ?? [])
            .filter(tier => quantity >= tier.minimum_quantity)
            .sort((a, b) => b.minimum_quantity - a.minimum_quantity)[0];

        if (discountTier) {
            record.isApplyingDiscount = true;
            return (discountTier.price);
        }
    }
    record.isApplyingDiscount = false;
    return (record.price * (100 - record.discount) / 100);
};

</script>

<style scoped></style>