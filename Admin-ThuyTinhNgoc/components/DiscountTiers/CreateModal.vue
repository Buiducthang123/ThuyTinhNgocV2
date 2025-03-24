<template>
    <div>
        <a-modal v-model:open="open" title="Thêm chiết khấu" @ok="handleOk" @cancel="handleCancel" :width="700"
            cancel-text="Hủy" ok-text="Thêm">
            <a-form layout="vertical">
                <div v-for="(tier, index) in formCreate.tiers" :key="index">
                    <h6 class="mb-2">Mức {{ index + 1 }}: </h6>
                    <div class="flex items-center gap-10 flex-nowrap w-full ">
                        <a-form-item :label="'Mua tối thiểu '" class="w-1/3">
                            <a-input-number :min="0" class="w-full" v-model:value="tier.minimum_quantity" />
                        </a-form-item>
                        <a-form-item :label="'Giá bán áp dụng (VNĐ)/sản phẩm '" class="w-1/3">
                            <a-input-number :min="0" class="w-full" v-model:value="tier.price" />
                        </a-form-item>
                        <a-button @click="removeTier(index)">Xóa</a-button>
                    </div>
                </div>
                <a-button type="dashed" @click="addTier">Thêm hàng</a-button>
            </a-form>
        </a-modal>
        <a-button type="primary" @click="open = true">Thêm chiết khấu</a-button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { message } from 'ant-design-vue';

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const emit = defineEmits(['handleRefresh']);
const props = defineProps<{
    product_id: number;
}>();
const open = ref(false);
const formCreate = ref({
    tiers: [
        { minimum_quantity: 0, price: 0 }
    ],
    product_id: props.product_id
});

const addTier = () => {
    formCreate.value.tiers.push({ minimum_quantity: 0, price: 0 });
};

const removeTier = (index: number) => {
    formCreate.value.tiers.splice(index, 1);
};

const handleOk = async () => {
    if (validateTiers()) {
        await $fetch('/api/discount-tiers/create-many', {
            method: 'POST',
            body: JSON.stringify(formCreate.value),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${accessToken.value}`
            },
            baseURL:useRuntimeConfig().public.baseURLAPI,
            onResponse: ({ response }) => {
                if (response.ok) {
                    message.success('Thêm chiết khấu thành công');
                    open.value = false;
                    emit('handleRefresh');
                }
                else {
                    message.error('Thêm chiết khấu thất bại');
                }
            }
        })
    }
};

const handleCancel = () => {
    open.value = false;
};

const validateTiers = (): boolean => {
    const tiers = formCreate.value.tiers;

    for (let i = 0; i < tiers.length; i++) {
        if (tiers[i].minimum_quantity == 0 || tiers[i].price == 0) {
            message.error(`Hàng thứ ${i + 1}: Vui lòng nhập đầy đủ thông tin.`);
            return false;
        }
    }

    const quantities = tiers.map(tier => tier.minimum_quantity);
    const prices = tiers.map(tier => tier.price);

    const hasDuplicateQuantities = new Set(quantities).size !== quantities.length;
    const hasDuplicateprices = new Set(prices).size !== prices.length;

    if (hasDuplicateQuantities) {
        message.error('Số lượng tối thiểu không được trùng nhau');
        return false;
    }

    if (hasDuplicateprices) {
        message.error('Chiết khấu không được trùng nhau');
        return false;
    }

    for (let i = 1; i < quantities.length; i++) {
        if (quantities[i] <= quantities[i - 1]) {
            message.error('Số lượng tối thiểu phải tăng dần');
            return false;
        }
    }

    // Giá bán giảm dần
    for (let i = 1; i < prices.length; i++) {
        if (prices[i] >= prices[i - 1]) {
            message.error('Chiết khấu phải giảm dần');
            return false;
        }
    }

    return true;
};
</script>

<style scoped></style>