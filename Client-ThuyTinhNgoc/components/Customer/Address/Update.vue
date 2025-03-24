<template>
    <a-modal
        v-model:open="props.visible"
        title="Cập nhật địa chỉ"
        @ok="handleUpdateAddress"
        @cancel="handleCancel"
    >
        <a-form :model="formUpdateAddress" ref="formRef" class="max-w-xl" :label-col="{ style: { width: '150px' } }" label-align="left">
            <a-form-item label="Tên người nhận" name="receiver_name" :rules="[{ required: true, message: 'Vui lòng nhập tên người nhận' }]">
                <a-input v-model:value="formUpdateAddress.receiver_name" />
            </a-form-item>
            <a-form-item label="Số điện thoại" name="receiver_phone_number" :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại' }]">
                <a-input v-model:value="formUpdateAddress.receiver_phone_number" />
            </a-form-item>
            <a-form-item label="Tỉnh/Thành phố" name="province" :rules="[ { validator: checkProvince, trigger: 'change' } ]">
                <a-select ref="select" v-model:value="formUpdateAddress.province.ProvinceID" @change="handleChangeProvince">
                    <a-select-option :value="-1">Chọn tỉnh</a-select-option>
                    <a-select-option v-if="provinceData" v-for="province in provinceData?.data?.data" :key="province.ProvinceID" :value="province.ProvinceID">
                        {{ province.ProvinceName }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="Quận/Huyện" name="district" :rules="[ { validator: checkDistrict, trigger: 'change' } ]">
                <a-select ref="select" v-model:value="formUpdateAddress.district.DistrictID" @change="handleChangeDistrict">
                    <a-select-option :value="-1">Chọn quận/huyện</a-select-option>
                    <a-select-option v-if="districtData" v-for="district in districtData?.data?.data" :key="district.DistrictID" :value="district.DistrictID">
                        {{ district.DistrictName }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="Phường/Xã" name="ward" :rules="[ { validator: checkWard, trigger: 'change' } ]">
                <a-select ref="select" v-model:value="formUpdateAddress.ward.WardCode" @change="handleChangeWard">
                    <a-select-option :value="''">Chọn phường/xã</a-select-option>
                    <a-select-option v-if="wardData" v-for="ward in wardData?.data?.data" :key="ward.WardCode" :value="ward.WardCode">
                        {{ ward.WardName }}
                    </a-select-option>
                </a-select>
            </a-form-item>
            <a-form-item label="Địa chỉ cụ thể" name="specific_address" :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]">
                <a-input v-model:value="formUpdateAddress.specific_address" />
            </a-form-item>
            <a-form-item>
                <a-radio-group v-model:value="formUpdateAddress.is_default" class="flex">
                    <a-radio :value="true">Đặt làm địa chỉ mặc định</a-radio>
                </a-radio-group>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">
import type { IDistrict } from '~/interfaces/district';
import type { IProvince } from '~/interfaces/province';
import type { IWard } from '~/interfaces/ward';
import type { Rule } from 'ant-design-vue/es/form';
import type { IShippingAddress } from '~/interfaces/shipping_address';

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const { getUser } = useAuthStore();

const props = defineProps({
    visible: Boolean,
    address: Object as PropType<IShippingAddress|any>
});

const emit = defineEmits(['update:visible','handleCloseModalUpdate']);

const formRef = ref();

interface IFormUpdateAddress {
    // id: number;
    receiver_name: string;
    receiver_phone_number: string;
    province: IProvince;
    district: IDistrict;
    ward: IWard;
    specific_address: string;
    is_default: boolean;
}

const formUpdateAddress = reactive<IFormUpdateAddress>({
    receiver_name: '',
    receiver_phone_number: '',
    province: {
        ProvinceID: -1,
        ProvinceName: '',
        CountryID: 1,
        Code: '',
        NameExtension: [] as string[],
        IsEnable: 0,
        RegionID: 0,
        RegionCPN: 0,
        UpdatedBy: 0,
        CreatedAt: '',
        UpdatedAt: '',
        CanUpdateCOD: false,
        Status: 0
    },
    district: {
        DistrictID: -1,
        DistrictName: '',
        ProvinceID: 0,
        Code: '',
        NameExtension: [] as string[],
        Type: -1,
        SupportType: -1
    },
    ward: {
        WardCode: '',
        DistrictID: -1,
        WardName: '',
        NameExtension: [] as string[],
        SupportType: -1,
        IsEnable: 0,
        CanUpdateCOD: false,
        PickType: 0,
        DeliverType: 0,
        UpdatedBy: 0,
        CreatedAt: '',
        UpdatedAt: ''
    },
    specific_address: '',
    is_default: false
});

watch(() => props.address, (newAddress) => {
    if (newAddress) {
        Object.assign(formUpdateAddress, newAddress);
        console.log(formUpdateAddress);
        
    }
}, { immediate: true });

const { data: provinceData } = useFetch<{ data: { data: IProvince[] } }>('/api/GHN/get_provinces', { method: 'GET' });

const provinceId = ref(-1);
const districtId = ref(-1);

const handleChangeProvince = (value: any) => {
    provinceData.value?.data?.data?.find((province: IProvince) => {
        if (province.ProvinceID == value) {
            formUpdateAddress.province = Object.assign({}, province);
            formUpdateAddress.district = {
                DistrictID: -1,
                DistrictName: '',
                ProvinceID: 0,
                Code: '',
                NameExtension: [],
                Type: -1,
                SupportType: -1
            };
            formUpdateAddress.ward = {
                WardCode: '',
                DistrictID: -1,
                WardName: '',
                NameExtension: [],
                SupportType: -1,
                IsEnable: 0,
                CanUpdateCOD: false,
                PickType: 0,
                DeliverType: 0,
                UpdatedBy: 0,
                CreatedAt: '',
                UpdatedAt: ''
            };
            formUpdateAddress.specific_address = ''; // Reset specific address
            provinceId.value = province.ProvinceID;
            districtId.value = -1; // Reset districtId when province changes
        }
    })
}

const { data: districtData } = await useFetch<{ data: { data: IDistrict[] } }>('/api/GHN/get_districts', { 
    method: 'POST',
    body: {
        province_id: provinceId
    },
    watch: [provinceId]
});

const handleChangeDistrict = (value: any) => {
    districtData.value?.data?.data?.find((district: IDistrict) => {
        if (district.DistrictID == value) {
            formUpdateAddress.district = Object.assign({}, district);
            formUpdateAddress.ward = {
                WardCode: '',
                DistrictID: -1,
                WardName: '',
                NameExtension: [],
                SupportType: -1,
                IsEnable: 0,
                CanUpdateCOD: false,
                PickType: 0,
                DeliverType: 0,
                UpdatedBy: 0,
                CreatedAt: '',
                UpdatedAt: ''
            };
            formUpdateAddress.specific_address = ''; // Reset specific address
            districtId.value = district.DistrictID;
        }
    })
}

const { data: wardData } = await useFetch<{ data: { data: IWard[] } }>('/api/GHN/get_wards', { 
    method: 'POST',
    body: {
        district_id: districtId
    },
    watch: [districtId]
});

const handleChangeWard = (value: any) => {
    wardData.value?.data?.data?.find((ward: IWard) => {
        if (ward.WardCode == value) {
            formUpdateAddress.ward = Object.assign({}, ward);
            formUpdateAddress.specific_address = ''; // Reset specific address
        }
    })
}

// Custom validation functions
const checkProvince = async (_rule: Rule, value: any) => {
    if (!value.ProvinceID || value.ProvinceID == -1) {
        return Promise.reject('Vui lòng chọn tỉnh');
    }
    return Promise.resolve();
}

const checkDistrict = async (_rule: Rule, value: any) => {
    if (!value.DistrictID || value.DistrictID == -1) {
        return Promise.reject('Vui lòng chọn quận/huyện');
    }
    return Promise.resolve();
}

const checkWard = async (_rule: Rule, value: any) => {
    if (!value.WardCode || value.WardCode == '') {
        return Promise.reject('Vui lòng chọn phường/xã');
    }
    return Promise.resolve();
}

const handleUpdateAddress = async () => {
    await formRef.value.validate();

    await $fetch(`shipping-addresses/${props.address?.id}`, {
        method: 'PATCH',
        headers: {
            'Authorization': `Bearer ${accessToken.value}`
        },
        body: formUpdateAddress,
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        onResponse:({response}) => {
            if(response.ok){
                getUser();
                message.success('Cập nhật địa chỉ thành công');
            } else {
                message.error('Cập nhật địa chỉ thất bại');
            }

            emit('handleCloseModalUpdate');
            
        }
    });
}

const handleCancel = () => {
    formRef.value.resetFields();
    emit('update:visible', false);
}
</script>

<style scoped></style>