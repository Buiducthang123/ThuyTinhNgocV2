<template>
  <div class="px-10 py-10">
    <div class="flex items-center mb-6 gap-2">
      <h3 class="font-bold text-xl">Tạo mới chương trình khuyến mãi</h3>
    </div>

    <div class="flex flex-nowrap gap-10">
      <div class="max-w-[600px] w-1/2">
        <a-form :model="formCreate" @finish="handleSubmit" :rules="rules">
          <a-form-item label="Tiêu đề" required name="title">
            <a-input v-model:value="formCreate.title" placeholder="Nhập tiêu đề" />
          </a-form-item>

          <a-form-item label="Slug" required name="slug">
            <a-input v-model:value="formCreate.slug" placeholder="Nhập slug" />
          </a-form-item>

          <a-form-item label="Hình ảnh" required name="image">
            <!-- ảnh fake placeholder-->
            <NuxtImg
              :src="formCreate.image ? formCreate.image : 'https://www.shutterstock.com/image-vector/image-icon-trendy-flat-style-600nw-643080895.jpg'"
              :width="200" class="border" />
            <UploadImg v-model="formCreate.image" @handle-change-image="handleUploadCoverImage">
              <template #main>
                <a-button class="mt-4" type="primary">Chọn ảnh</a-button>
              </template>
            </UploadImg>
          </a-form-item>

          <a-form-item label="Mô tả">
            <a-textarea v-model:value="formCreate.description" placeholder="Nhập mô tả" />
          </a-form-item>

          <a-form-item label="Giảm giá (%)" required name="discount">
            <a-input-number v-model:value="formCreate.discount" min="0" max="100" />
          </a-form-item>

          <a-form-item label="Ngày bắt đầu" required name="start_date">
            <a-date-picker show-time v-model:value="formCreate.start_date" style="width: 100%"
              format="DD/MM/YYYY HH:mm" />
          </a-form-item>

          <a-form-item label="Ngày kết thúc" required name="end_date">
            <a-date-picker show-time v-model:value="formCreate.end_date" style="width: 100%"
              format="DD/MM/YYYY HH:mm" />
          </a-form-item>

          <a-form-item>
            <a-button type="primary" html-type="submit">Tạo mới</a-button>
          </a-form-item>
        </a-form>
      </div>
      <div class="w-1/2">
        <h6 class="mb-6">Chọn sản phẩm áp dụng cho chương trình: </h6>
        <div class="flex gap-10 mb-6">
                    <a-input v-model:value="allProductSearch" placeholder="Tìm kiếm sản phẩm" />
                    <a-button type="primary" @click="handleSearchTitleAllProduct">Tìm kiếm</a-button>
                </div>
        <a-checkbox-group v-model:value="formCreate.items" class="w-full">
          <div ref="refScrollContainer" class="max-h-[40vh] overflow-y-scroll w-full border p-4" @scroll="handleScroll">
            <div v-for="product in allProducts" :key="product.id" class="flex w-full gap-4 my-2">
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
        <!--sản phẩm được chọn áp dụng khuyến mãi theo formDiscount-->
        <div v-if="formCreate.items.length > 0" class="mt-4 border p-4 max-h-[40vh] overflow-y-scroll">
          <div v-for="product in productApplyPromotion" :key="product.id" 
            class="flex w-full items-center gap-4 my-2">
            <div class="w-full">
              <div class="flex items-center gap-2">
                <NuxtImg :src="product.cover_image" class="mr-2 rounded-full h-12 w-12" />
                <div>
                  <span>{{ product.title }}</span>
                  <p class="text-gray-500">Giá gốc: {{ formatCurrency(product.price) }}</p>
                  <p class="text-gray-500">Giảm giá hiện tại: {{ formCreate.discount }}%</p>
                  <p class="text-gray-500">Giá bán hiện tại: {{ formatCurrency(product.price * (100 - formCreate.discount )/100) }}%</p>
                </div>
              </div>
            </div>
            <Icon name="i-material-symbols-delete-outline-rounded" class="cursor-pointer text-3xl" @click="handleDeleteProductApplyPromotion(product.id)"/>
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
import { reactive, computed } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { message } from 'ant-design-vue';
import type { IResponsePagination } from '~/interfaces/response';
import type { IProduct } from '~/interfaces/product';
import type { Rule } from 'ant-design-vue/es/form';

const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

interface IFormCreate {
  title: string;
  slug: string;
  image: string;
  description?: string;
  discount: number;
  start_date: string;
  end_date: string;
  status: string;
  items: number[];
}

const formCreate = reactive<IFormCreate>({
  title: '',
  slug: '',
  image: '',
  description: '',
  discount: 0,
  start_date: '',
  end_date: '',
  status: 'active',
  items: [],
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
  start_date: [{ required: true, message: 'Ngày bắt đầu không được để trống'}],
  end_date: [{ required: true, message: 'Ngày kết thúc không được để trống', trigger: 'blur' }],
  // status: [{ required: true, message: 'Trạng thái không được để trống', trigger: 'blur' }],
};

const handleSubmit = async () => {
  await $fetch('/api/promotions', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken.value}`,
    },
    baseURL: useRuntimeConfig().public.baseURLAPI,
    body: formCreate,
    onResponse: ({ response }) => {
      if (response.ok) {
        message.success('Tạo mới chương trình khuyến mãi thành công');
        navigateTo('/promotions');
      }
      else {
        message.error('Tạo mới chương trình khuyến mãi thất bại');
      }

    }
  });

};

const handleUploadCoverImage = (url: string) => {
  formCreate.image = url;
};

const allProducts = ref<IProduct[]>([]);

const productQuery = reactive({
  page: 1,
  paginate: 10,
  'with[]': ['authors'],
  filter:{
    promotion_null: true
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

const refScrollContainer = ref<HTMLElement | null>(null);
const handleScroll = () => {
  if (refScrollContainer.value) {

    const { scrollTop, clientHeight, scrollHeight } = refScrollContainer.value;
    if (scrollTop + clientHeight >= scrollHeight) {


      let max = Math.ceil((products?.value?.total ?? 0) / (products?.value?.per_page ?? 1));
      console.log('max', max);
      if (productQuery.page < max) {
        productQuery.page++;
      }
      console.log('productQuery.page', productQuery.page);


    }
  }
};

const productApplyPromotion = computed(() => {
  return allProducts.value.filter(product => formCreate.items.includes(product.id));
});

const handleDeleteProductApplyPromotion = (id: number) => {
  formCreate.items = formCreate.items.filter(item => item !== id);
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