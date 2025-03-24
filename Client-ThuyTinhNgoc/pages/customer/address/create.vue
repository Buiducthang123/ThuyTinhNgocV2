<template>
    <div>
        <div class="flex items-center gap-2 mb-4 ">
            <Icon class="text-lg cursor-pointer" name="i-material-symbols-arrow-back-ios"  @click="navigateTo('/customer/address')" />
            <h6 class="text-lg">Tạo sổ địa chỉ</h6>
        </div>
        <div class="bg-white p-6 rounded-lg">
            <a-form :model="formCreateAddress" ref="formRef" class="max-w-xl" :label-col="{ style: { width: '150px' } }"
                label-align="left">
                <a-form-item label="Tên người nhận" name="receiver_name"
                    :rules="[{ required: true, message: 'Vui lòng nhập tên người nhận' }]">
                    <a-input v-model:value="formCreateAddress.receiver_name" />
                </a-form-item>
                <a-form-item label="Số điện thoại" name="receiver_phone_number"
                    :rules="[{ required: true, message: 'Vui lòng nhập số điện thoại' }]">
                    <a-input v-model:value="formCreateAddress.receiver_phone_number" />
                </a-form-item>
                <a-form-item label="Tỉnh/Thành phố" name="province" :rules="[
                    { validator: checkProvince, trigger: 'change' }
                ]">
                    <a-select ref="select" v-model:value="formCreateAddress.province.ProvinceID"
                        @change="handleChangeProvince">
                        <a-select-option :value="-1">Chọn tỉnh</a-select-option>
                        <a-select-option v-if="provinceData" v-for="province in provinceData?.data?.data"
                            :key="province.ProvinceID" :value="province.ProvinceID">
                            {{ province.ProvinceName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Quận/Huyện" name="district"
                    :rules="[
                        { validator: checkDistrict, trigger: 'change' }
                    ]">
                    <a-select ref="select" v-model:value="formCreateAddress.district.DistrictID"
                        @change="handleChangeDistrict">
                        <a-select-option :value="-1">Chọn quận/huyện</a-select-option>
                        <a-select-option v-if="districtData" v-for="district in districtData?.data?.data"
                            :key="district.DistrictID" :value="district.DistrictID">
                            {{ district.DistrictName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Phường/Xã" name="ward"
                    :rules="[
                        { validator: checkWard, trigger: 'change' }
                    ]">
                    <a-select ref="select" v-model:value="formCreateAddress.ward.WardCode" @change="handleChangeWard">
                        <a-select-option :value="''">Chọn phường/xã</a-select-option>
                        <a-select-option v-if="wardData" v-for="ward in wardData?.data?.data" :key="ward.WardCode"
                            :value="ward.WardCode">
                            {{ ward.WardName }}
                        </a-select-option>
                    </a-select>
                </a-form-item>

                <a-form-item label="Địa chỉ cụ thể" name="specific_address"
                    :rules="[{ required: true, message: 'Vui lòng nhập địa chỉ cụ thể' }]">
                    <a-input v-model:value="formCreateAddress.specific_address" />
                </a-form-item>

                <a-form-item>
                    <a-radio-group v-model:value="formCreateAddress.is_default" class="flex">
                        <a-radio value="1">Đặt làm địa chỉ mặc định</a-radio>
                    </a-radio-group>
                </a-form-item>

                <a-form-item>
                    <div class="text-end">
                        <a-popconfirm title="Bạn có chắc chắn muốn lưu lại sổ địa chỉ này không?" ok-text="Có"
                            cancel-text="Không" @confirm="handleCreateAddress()">
                            <a-button type="primary">Lưu lại</a-button>
                        </a-popconfirm>
                    </div>

                </a-form-item>

            </a-form>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { IDistrict } from '~/interfaces/district';
import type { IProvince } from '~/interfaces/province';
import type { IWard } from '~/interfaces/ward';
import type { Rule } from 'ant-design-vue/es/form';

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const { getUser } = authStore;

const { data: provinceData } = useFetch<{ data: { data: IProvince[] } }>('/api/GHN/get_provinces', { method: 'GET' });

const formRef = ref();

interface IFormCreateAddress {
    receiver_name: string,
    receiver_phone_number: string,
    province: IProvince,
    district: IDistrict,
    ward: IWard,
    specific_address: string,
    is_default: boolean
}

const formCreateAddress = reactive<IFormCreateAddress>({
    receiver_name: '',
    receiver_phone_number: '',
    province: {
        ProvinceID: -1,
        ProvinceName: '',
        CountryID: 1,
        Code: '',
        NameExtension: [],
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
        NameExtension: [],
        Type: -1,
        SupportType: -1
    },
    ward: {
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
    },
    specific_address: '',
    is_default: false
})

const handleChangeProvince = (value: any) => {
    provinceData.value?.data?.data?.find((province: IProvince) => {
        if (province.ProvinceID == value) {
            formCreateAddress.province = Object.assign({}, province);
            formCreateAddress.district = {
                DistrictID: -1,
                DistrictName: '',
                ProvinceID: 0,
                Code: '',
                NameExtension: [],
                Type: -1,
                SupportType: -1
            };
            formCreateAddress.ward = {
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
            provinceId.value = province.ProvinceID;
            console.log(formCreateAddress.province);
        }
    })
}

const provinceId = ref(-1);

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
            formCreateAddress.district = Object.assign({}, district);
            formCreateAddress.ward = {
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
            districtId.value = district.DistrictID;
        }
    })
}

const districtId = ref(-1);

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
            formCreateAddress.ward = Object.assign({}, ward);
        }
    })
}

//custom validate

const checkProvince = async (_rule: Rule, value: any) => {
    if (!value.ProvinceID) {
        return Promise.reject('Vui lòng chọn tỉnh');
    }
    if (value.ProvinceID == -1) {
        return Promise.reject('Vui lòng chọn tỉnh');
    }
    return Promise.resolve();
}

const checkDistrict = async (_rule: Rule, value: any) => {
    if (!value.DistrictID) {
        return Promise.reject('Vui lòng chọn quận/huyện');
    }
    if (value.DistrictID == -1) {
        return Promise.reject('Vui lòng chọn quận/huyện');
    }
    return Promise.resolve();
}

const checkWard = async (_rule: Rule, value: any) => {
    if (!value.WardCode) {
        return Promise.reject('Vui lòng chọn phường/xã');
    }
    if (value.WardCode == '') {
        return Promise.reject('Vui lòng chọn phường/xã');
    }
    return Promise.resolve();
}

const handleCreateAddress = async () => {
    await formRef.value.validate();

    await $fetch('shipping-addresses', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${accessToken.value}`
        },
        body: formCreateAddress,
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        onResponse:({response}) => {
            if(response.ok){
                getUser();
                message.success('Tạo sổ địa chỉ thành công');
            }

            else{
                message.error('Tạo sổ địa chỉ thất bại');
            }
        }
    });
}
</script>

<style scoped></style>