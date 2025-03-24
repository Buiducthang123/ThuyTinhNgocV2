<template>
  <NuxtLayout name="default">
    <AccountNotActiveNoti v-if="user?.status === EUser.NOT_ACTIVATED" />
    <NuxtLayout name="home" v-else>
      <section class="">
        <section>
          <PromotionalSlider />
        </section>

        <section class="">
          <ExploreCategory />
        </section>

        <section class="">
          <Filter :filter="productQuery" />
        </section>
        <hr>

        <section v-if="products?.data && products.data.length>0" class=" bg-white p-6 mt-4">
          <div class="grid grid-cols-12 gap-x-4 gap-y-8">
            <ProductCard v-for="product in products?.data" :key="product.id" :product="product" class="col-span-3" />
          </div>
          <div class="mt-10 text-end">
            <a-pagination v-model:current="productQuery.page" :total="products?.total" show-less-items />
          </div>
        </section>
        <section v-else class="bg-white p-6 mt-4">
            <a-result status="404" title="Chưa có sản phẩm nào trong danh mục" />
        </section>
      </section>
    </NuxtLayout>
  </NuxtLayout>
</template>

<script setup lang="ts">
import AccountNotActiveNoti from '~/components/AccountNotActiveNoti.vue';
import { EUser } from '~/enums/user.enum';
import type { IProduct } from '~/interfaces/product';
import type { IResponsePagination } from '~/interfaces/response';

const route = useRoute();

const categoryStore = useCategoryStore();
const categories = computed(() => categoryStore.categories);
const currentCategory = computed(() => {
  return categories.value?.find(cate => cate.slug === route.params.slug || cate.id.toString() === route.params.slug);
});

const productQuery = reactive({
  'with[]': ['category', 'discountTiers'],
  page: 1,
  sort: 'all',
  rating: 'all',
  paginate: 12,
  filter: {
    priceFrom: 0,
    priceTo: 10000000,
    is_sale: 1,
  }
});

const authStore = useAuthStore();

const user = computed(() => authStore.user);

const apiUrl = route.params.slug ? `/products/category/${currentCategory.value?.id}` : '/products';

const { data: products } = await useFetch<IResponsePagination<IProduct>>(apiUrl, {
  method: 'GET',
  baseURL: useRuntimeConfig().public.apiBaseUrl,
  onResponse: ({ response }) => {
    if (response.ok) {
      console.log(response._data);
    }
    else {
      console.log(response);
    }
  },
  query: productQuery
});

useHead({
  title: 'Thuỷ Tinh Ngọc USA-HomeSet - Uy Tín - Chất Lượng - Giá Rẻ',
  description: 'Thuỷ Tinh Ngọc USA-HomeSet - Uy Tín - Chất Lượng - Giá Rẻ',
  meta: [
    { charset: 'utf-8' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1' },
    { hid: 'description', name: 'description', content: 'This is my amazing site, let me tell you all about it.' },
  ],
  link: [{ rel: 'icon', type: 'image/x-icon', href: '/images/icon-logo.png' }],
});

</script>

<style scoped></style>