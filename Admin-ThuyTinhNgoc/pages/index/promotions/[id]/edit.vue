<template>
    <div class="px-10 py-10">
        <div class="flex items-center mb-6 gap-2">
            <h3 class="font-bold text-xl">Chỉnh sửa chương trình khuyến mãi</h3>
        </div>

        <div class="flex flex-nowrap gap-10">
            <div class="max-w-[600px] w-1/2">
                <a-form :model="formEdit" @finish="handleUpdatePromotion" :rules="rules">
                    <a-form-item label="Tiêu đề" required name="title">
                        <a-input v-model:value="formEdit.title" placeholder="Nhập tiêu đề" />
                    </a-form-item>

                    <a-form-item label="Slug" required name="slug">
                        <a-input v-model:value="formEdit.slug" placeholder="Nhập slug" />
                    </a-form-item>

                    <a-form-item label="Hình ảnh" required name="image">
                        <!-- ảnh fake placeholder-->
                        <NuxtImg
                            :src="formEdit.image ? formEdit.image : 'https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg'"
                            :width="200" class="border" />
                        <UploadImg v-model="formEdit.image" @handle-change-image="handleUploadCoverImage">
                            <template #main>
                                <a-button class="mt-4" type="primary">Chọn ảnh</a-button>
                            </template>
                        </UploadImg>
                    </a-form-item>

                    <a-form-item label="Mô tả">
                        <a-textarea v-model:value="formEdit.description" placeholder="Nhập mô tả" />
                    </a-form-item>

                    <a-form-item label="Giảm giá (%)" required name="discount">
                        <a-input-number v-model:value="formEdit.discount" min="0" max="100" />
                    </a-form-item>

                    <a-form-item label="Ngày bắt đầu" required name="start_date">
                        <a-date-picker show-time v-model:value="formEdit.start_date" style="width: 100%"
                            format="DD/MM/YYYY HH:mm" value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]" />
                    </a-form-item>

                    <a-form-item label="Ngày kết thúc" required name="end_date">
                        <a-date-picker show-time v-model:value="formEdit.end_date" style="width: 100%"
                            format="DD/MM/YYYY HH:mm" value-format="YYYY-MM-DDTHH:mm:ss.SSS[Z]" />
                    </a-form-item>

                    <a-form-item>
                        <a-button type="primary" html-type="submit">Cập nhật</a-button>
                    </a-form-item>
                </a-form>
            </div>
            <div class="w-1/2">
                <h6 class="mb-6">Chọn sản phẩm áp dụng cho chương trình: </h6>
                <!--search-->
                <div class="flex gap-10 mb-6">
                    <a-input v-model:value="allProductSearch" placeholder="Tìm kiếm sản phẩm" />
                    <a-button type="primary" @click="handleSearchTitleAllProduct">Tìm kiếm</a-button>
                </div>
                <a-checkbox-group v-model:value="formEdit.items" class="w-full">
                    <div ref="refScrollContainer" class="max-h-[40vh] overflow-y-scroll w-full border p-4"
                        @scroll="handleScroll">
                        <div v-for="product in (productQuery.search.title != ''? allProductsAfterSearch : allProducts)" :key="product.id" class="flex w-full gap-4 my-2">
                            <a-checkbox :value="product.id">
                            </a-checkbox>
                            <div class="w-full">
                                <div class="flex items-center gap-2">
                                    <NuxtImg :src="product.cover_image" class="mr-2 rounded-full h-12 w-12" />
                                    <div>
                                        <span>{{ product.title }}</span>
                                        <p class="text-gray-500">Giá gốc: {{ formatCurrency(product.price) }}</p>
                                        <p class="text-gray-500">Giảm giá hiện tại: {{ product.discount }}%</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </a-checkbox-group>
                <p class="mt-4 text-yellow-600">Chú ý: Giá giảm sẽ được áp dụng theo chương trình khuyến mãi</p>

                <h6 class="my-4">sản phẩm được chọn áp dụng khuyến mãi:</h6>
                <div v-if="formEdit.items.length > 0" class="mt-4 border p-4 max-h-[40vh] overflow-y-scroll">
                    <div v-for="product in productApplyPromotion" :key="product.id" class="flex w-full gap-4 my-2">
                        <div class="w-full">
                            <div class="flex items-center gap-2">
                                <NuxtImg :src="product.cover_image" class="mr-2 rounded-full h-12 w-12" />
                                <div>
                                    <span>{{ product.title }}</span>
                                    <p class="text-gray-500">Giá gốc: {{ formatCurrency(product.price) }}</p>
                                    <p class="text-gray-500">Giảm giá hiện tại: {{ formEdit.discount }}%</p>
                                    <p class="text-gray-500">Giá bán hiện tại: {{ formatCurrency(product.price * (100 -
                                        formEdit.discount) / 100) }}</p>
                                </div>
                            </div>
                        </div>
                        <Icon name="i-material-symbols-delete-outline-rounded" class="cursor-pointer text-3xl"
                            @click="handleDeleteProductApplyPromotion(product.id)" />
                    </div>
                </div>
                <div v-else class="border p-4">
                    <a-empty description="Chưa có sản phẩm nào được chọn"></a-empty>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import dayjs, { Dayjs } from 'dayjs';
import type { IProduct } from '~/interfaces/product';
import type { IPromotion } from '~/interfaces/promotion';
import type { IResponsePagination } from '~/interfaces/response';

const route = useRoute()

const authStore = useAuthStore();

const accessToken = computed(() => authStore.accessToken);

const promotionQuery = reactive({
    'with[]': ['products']
})

const { data: promotion, error } = await useFetch<IPromotion>(`/api/promotions/${route.params.id}`, {
    method: 'GET',
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query: promotionQuery,
})

interface IFormEdit {
    title: string;
    slug: string;
    image: string;
    description?: string;
    discount: number;
    start_date: Dayjs | string;
    end_date: Dayjs | string;
    items: number[];
}

const formEdit = reactive<IFormEdit>({
    title: promotion.value?.title ?? '',
    slug: promotion.value?.slug ?? '',
    image: promotion.value?.image ?? '',
    description: promotion.value?.description,
    discount: promotion.value?.discount ?? 0,
    start_date: promotion.value?.start_date ? dayjs(promotion.value?.start_date).tz('Asia/Ho_Chi_Minh').locale('vi').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : '',
    end_date: promotion.value?.end_date ? dayjs(promotion.value?.end_date).tz('Asia/Ho_Chi_Minh').locale('vi').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]') : '',
    items: promotion.value?.products?.map(item => item.id) || []
});

const rules: Record<string, Rule[]> = {
    title: [{ required: true, message: 'Tiêu đề không được để trống', trigger: 'blur' }],
    slug: [
        { required: true, message: 'Slug không được để trống', trigger: 'blur' },
        { pattern: /^[a-z0-9-]+$/, message: 'Slug không hợp lệ', trigger: 'blur' },
    ],
    image: [{ required: true, message: 'Hình ảnh không được để trống', trigger: 'blur' }],
    discount: [
        { required: true, message: 'Giảm giá không được để trống', trigger: 'blur' }

    ],
    start_date: [{ required: true, message: 'Ngày bắt đầu không được để trống' }],
    end_date: [{ required: true, message: 'Ngày kết thúc không được để trống', trigger: 'blur' }],
};

const handleUploadCoverImage = (image: string) => {
    formEdit.image = image;
}

const allProducts = ref<IProduct[]>([]);

const productQuery = reactive({
    page: 1,
    paginate: 10,
    filter: {
        promotion_null: false
    },
    search: {
        title: ''
    }
});

const allProductSearch = ref('')

const handleSearchTitleAllProduct = () => {
    productQuery.search.title = allProductSearch.value;

}

const allProductsAfterSearch = ref<IProduct[]>([]);

const { data: products, refresh: refreshProducts } = await useFetch<IResponsePagination<IProduct>>('api/products', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    headers: {
        Authorization: `Bearer ${accessToken.value}`
    },
    query: productQuery,
    onResponse: ({ response }) => {
        if (response.ok) {
            allProducts.value = [...allProducts.value, ...(response._data.data ?? [])];
            if(productQuery.search.title != ''){
                allProductsAfterSearch.value = response._data.data ?? [];
            }
        }
    }
});

const productApplyPromotion = computed(() => {
    return allProducts.value.filter(product => formEdit.items.includes(product.id));
});

const handleScroll = (e: Event) => {
    const target = e.target as HTMLDivElement;
    if (target.scrollTop + target.clientHeight >= target.scrollHeight) {
        productQuery.page++;
        refreshProducts();
    }
};


const handleUpdatePromotion = async () => {
    await $fetch(`/api/promotions/${route.params.id}`, {
        method: 'PATCH',
        baseURL: useRuntimeConfig().public.baseURLAPI,
        headers: {
            Authorization: `Bearer ${accessToken.value}`
        },
        body: formEdit,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Cập nhật chương trình khuyến mãi thành công');
                navigateTo('/promotions');
            }
            else {
                message.error('Cập nhật chương trình khuyến mãi thất bại');
            }
        }
    });
};

const handleDeleteProductApplyPromotion = (id: number) => {
    formEdit.items = formEdit.items.filter(item => item !== id);
};

</script>

<style scoped>
.px-6 {
    padding-left: 1.5rem;
    padding-right: 1.5rem;
}

.py-10 {
    padding-top: 2.5rem;
    padding-bottom: 2.5rem;
}
</style>