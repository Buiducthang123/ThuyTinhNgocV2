<template>
    <div>
        <h6 class="mb-4 text-lg">Sổ địa chỉ</h6>
        <div class="">
            <div
                class="flex py-3 border-dashed border-2 cursor-pointer bg-white justify-center items-center gap-2 h-full"
                @click="navigateTo('address/create')">
                <Icon class="text-primary" name="i-material-symbols-add-2" />
                <span class="text-primary">Thêm địa chỉ mới</span>
            </div>
            <div v-for="address in sortedAddresses" :key="address.id">
                <div class="bg-white p-6 rounded-lg mt-4">
                    <div class="flex justify-between">
                        <div>
                            <div class=" flex items-center gap-4">
                                <span class="font-semibold">{{ address.receiver_name }}</span>

                                <div v-if="address.is_default" class="flex items-center gap-2 text-green-500">
                                    <Icon class="cursor-pointer" name="i-material-symbols-light-check-circle-outline" />
                                    <span class="">Địa chỉ mặc định</span>
                                </div>
                            </div>
                            <div>{{ address.receiver_phone_number }}</div>
                            <div>{{ address.specific_address }}</div>
                            <div>{{ address.ward.WardName }}, {{ address.district.DistrictName }}, tỉnh {{
                                address.province.ProvinceName }}</div>
                        </div>
                        <div class="">
                            <div class="flex items-center justify-start space-x-6">
                                <a-button class="text-primary flex items-center gap-2"
                                    @click="handleOpenModalUpdate(address)">
                                    <Icon class="text-primary cursor-pointer" name="i-material-symbols-edit" />
                                    Sửa
                                </a-button>

                                <a-popconfirm v-if="!address.is_default" title="Bạn có chắc chắn muốn xóa địa chỉ này không?" ok-text="Có"
                                    cancel-text="Không" @confirm="handleDeleteAddress(address.id)">
                                    <a-button type="link" class="text-red-500 flex items-center gap-2">
                                        <Icon class="text-red-500 cursor-pointer" name="i-material-symbols-delete" />
                                        Xóa
                                    </a-button>
                                </a-popconfirm>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <CustomerAddressUpdate v-model:open="isOpenModalUpdate" :address="shippingAddressSelected"
        @handle-close-modal-update="handleCloseModalUpdate" />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import type { IShippingAddress } from '~/interfaces/shipping_address';
const authStore = useAuthStore();
const user = computed(() => authStore.user);
const { getUser } = authStore;
// Computed property to sort addresses
const sortedAddresses = computed(() => {
    if (!user.value || !user.value.shipping_addresses) {
        return [];
    }
    return user.value.shipping_addresses.slice().sort((a, b) => Number(b.is_default) - Number(a.is_default));
});

const shippingAddressSelected = ref<IShippingAddress | null>(null);

const isOpenModalUpdate = ref(false);

const handleOpenModalUpdate = (address: IShippingAddress) => {
    shippingAddressSelected.value = address;
    isOpenModalUpdate.value = true;
};

const handleCloseModalUpdate = () => {
    isOpenModalUpdate.value = false;
};

//xóa địa chỉ

const handleDeleteAddress = async (id: number) => {
    await $fetch('/shipping-addresses/' + id, {
        method: 'DELETE',
        headers: {
            'Authorization': 'Bearer ' + authStore.accessToken
        },
        baseURL:useRuntimeConfig().public.apiBaseUrl,
        onResponse:({response})=>{
            if(response.ok){
                getUser();
                message.success('Xóa địa chỉ thành công');
            }
            else{
                message.error('Xóa địa chỉ thất bại');
            }
        }
    });
};
</script>

<style scoped></style>