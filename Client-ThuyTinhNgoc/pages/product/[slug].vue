<template>
    <div class="min-h-screen pt-6">

        <!--ĐƯờng dẫn-->
        <nav aria-label="breadcrumb">
            <ol class="breadcrumb">
                <li class="breadcrumb-item cursor-pointer">
                    <a @click="navigateTo('/')">Trang chủ</a>
                </li>
                <li v-for="(breadcrumb, index) in breadcrumbs" :key="breadcrumb.id"
                    class="breadcrumb-item cursor-pointer">
                    <a @click="navigateTo('/category/' + (breadcrumb.slug ? breadcrumb.slug : breadcrumb.id))">{{
                        breadcrumb.name }}</a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">{{ product?.title }}</li>
            </ol>
        </nav>

        <div class="p-4 bg-white grid grid-cols-12 gap-x-10" v-if="product">
            <div class="col-span-5">
                <a-carousel arrows dots-class="slick-dots slick-thumb">
                    <template #customPaging="{ i }">
                        <a>
                            <img :src="allImages[i]" />
                        </a>
                    </template>
                    <div v-for="(item, index) in allImages" :key="index">
                        <img :src="allImages[index]" />
                    </div>
                </a-carousel>

            </div>
            <div class="col-span-7">
                <h6 class="text-xl font-bold">{{ product?.title }}</h6>
                <div class="flex gap-3 mt-3">
                    <div class="flex">
                        <ins class="text-base font-medium mr-2">{{ product.rating }}</ins>
                        <span v-for="star in 5" :key="star" class="text-xl">
                            <Icon name="i-material-symbols-star" v-if="star <= product.rating" class="text-yellow-500" />
                            <Icon name="i-material-symbols-star-outline" v-else class="text-gray-400" />
                        </span>
                    </div>
                    <span>|</span>
                    <div class="flex items-center">
                        <ins class="text-base font-medium mr-2">{{ product.total_review }}</ins>
                        <span> Đánh giá</span>
                    </div>
                </div>
                <div class="p-4 bg-[#f1f1f1] mt-4 flex gap-4 items-center">
                    <span class="text-red-400 text-2xl">{{ formatCurrency(priceShow) }}</span>
                    <del class="text-gray-500 text-base">{{ formatCurrency(product?.price) }}</del>
                    <a-tag color="red">{{ product?.discount }} %</a-tag>
                </div>

                <div class="mt-4">
                    <span>Số lượng sản phẩm còn lại: {{ product?.quantity }}</span>
                </div>

                <!--Chọn số lượng-->
                <div class="flex items-center gap-4 mt-6">
                    <span>Số lượng mua:</span>
                    <div class="flex items-center gap-2">
                        <a-button @click="quantity > 1 ? quantity-- : null">-</a-button>
                        <a-input-number v-model:value="quantity" min="1" max="100" />
                        <a-button @click="quantity < 100 ? quantity++ : null">+</a-button>
                    </div>
                </div>

                <div class="mt-6 flex gap-4">
                    <a-button :disabled="product.quantity!=null && product?.quantity<=0" type="primary" class="rounded-0" size="large" @click="handleBuyNow">Mua ngay</a-button>
                    <a-button size="large" class="rounded-0" @click="handleAddToCart">Thêm sản phẩm vào giỏ
                        hàng</a-button>
                </div>
            </div>

            <div class="w-full col-span-12 m-10" v-if="user?.role?.name == 'company'">
                <a-table class="w-2/3 mx-auto" :columns="discountTiersColumns" :dataSource="discountTiers" bordered
                    :pagination="false" size="large">
                    <template #title>
                        <h6 class="text-xl font-medium">Bảng giá chiết khấu</h6>
                    </template>

                    <template #emptyText>
                        <a-empty description="Sản phẩm chưa áp dụng chiết khấu" />
                    </template>
                </a-table>
            </div>

            <p class="col-span-12 my-6 text-blue-600 flex items-center justify-center"><a href="#product-detail">Xem mô
                    tả sản
                    phẩm</a>
                <Icon class="text-3xl" name="i-mdi-light-chevron-down" />
            </p>
        </div>

        <!--Sản phẩm tương tự-->

        <div class="bg-white mt-6 p-10">
            <div v-if="productSimilar && productSimilar.length > 0" class="flex justify-between">
                <h6 class="text-xl font-medium mb-6">Các sản phẩm tương tự</h6>
                <span class="text-red-500 cursor-pointer">Tất cả sản phẩm ></span>
            </div>
            <div class="grid grid-cols-12 gap-4">
                <ProductCard v-for="product in productSimilar" :key="product.id" :product="product" class="col-span-3" />
            </div>
        </div>

        <div class="mt-6 bg-white p-6" id="product-detail">
            <h6 class="text-xl font-medium mb-4">Thông tin sản phẩm {{ product?.title }}</h6>
            <a-tabs>
                <a-tab-pane key="1" tab="Mô tả">
                    <div class="p- mt-4" v-html="product?.description"></div>
                </a-tab-pane>
                <a-tab-pane key="2" tab="Thông tin chi tiết">
                    <div class="p- mt-4">
                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <p class="font-semibold">Danh mục:</p>
                                <p>{{ product?.category?.name }}</p>
                            </div>
                            <div>
                                <p class="font-semibold">Số trang:</p>
                                <p>{{ product?.pages }}</p>
                            </div>
                            <div>
                                <p class="font-semibold">Kích thước: ( chiều dài x chiều rộng)</p>
                                <p>{{ product?.dimension_length }} x {{ product?.dimension_width }} </p>
                            </div>

                            <div>
                                <p class="font-semibold">Trọng lượng:</p>
                                <p>{{ product?.weight }}</p>
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
                <a-tab-pane key="3" tab="Đánh giá">
                    <div class="p-4 bg-white mt-4">
                        <div class="flex gap-4 items-center">
                            <div class="flex">
                                <ins class="text-base font-medium mr-2">{{ product?.rating }}</ins>
                                <span v-for="star in 5" :key="star" class="text-xl">
                                    <Icon name="i-material-symbols-star" v-if="star <= (product?.rating ?? 5)"
                                        class="text-yellow-500" />
                                    <Icon name="i-material-symbols-star-outline" v-else class="text-gray-400" />
                                </span>
                            </div>
                        </div>
                        <div class="mt-6">
                            <h6 class="mb-6 text-xl">Đánh giá: </h6>

                            <div v-if="reviewsInproduct?.data && reviewsInproduct.data.length > 0">
                                <div v-for="(review) in reviewsInproduct?.data" :key="review.id"
                                    class="flex gap-4 items-start my-4 shadow-lg p-4">
                                    <div>
                                        <NuxtImg v-if="review.user?.avatar" :src="review.user?.avatar"
                                            class="w-12 rounded-full aspect-square object-cover" />
                                        <NuxtImg v-else src="https://joeschmoe.io/api/v1/random" alt="Han Solo"
                                            class="w-12 rounded-lg aspect-square" />
                                    </div>
                                    <div>
                                        <a class="text-base">{{ review.user?.full_name }}</a>
                                        <div class="flex gap-2 items-center">
                                            <span v-for="star in 5" :key="star" class="text-xl">
                                                <Icon name="i-material-symbols-star" v-if="star <= review.rating"
                                                    class="text-yellow-500" />
                                                <Icon name="i-material-symbols-star-outline" v-else
                                                    class="text-gray-400" />
                                            </span>
                                        </div>

                                        <p v-if="review.comment">
                                            {{ review.comment }}
                                        </p>
                                        <p v-else>
                                            Đánh giá không có nội dung
                                        </p>

                                        <div>
                                            <a-tooltip :title="dayjs(review.created_at).format('YYYY-MM-DD HH:mm:ss')">
                                                <span>{{ dayjs(review.created_at).fromNow() }}</span>
                                            </a-tooltip>
                                        </div>

                                    </div>
                                </div>

                                <div class="mt-6 text-end">
                                    <a-pagination :total="reviewsInproduct?.total" :current="reviewsInproduct?.current_page"
                                        :pageSize="reviewsInproduct?.per_page" @change="reviewQuery.page = $event" />
                                </div>
                            </div>

                            <div v-else>
                                <a-empty description="Chưa có đánh giá nào" />
                            </div>
                        </div>
                    </div>
                </a-tab-pane>
            </a-tabs>
        </div>
    </div>
</template>

<script setup lang="ts">
import dayjs from '#build/dayjs.imports.mjs';
import { ref, reactive, computed } from 'vue';
import { useRoute } from 'vue-router';
import type { IProduct } from '~/interfaces/product';
import type { ICategory } from '~/interfaces/category';
import type { IResponsePagination } from '~/interfaces/response';
import type { IReview } from '~/interfaces/review';

const authStore = useAuthStore();
const user = computed(() => authStore.user);
const route = useRoute();
const query = reactive({
    'with[]': ['category', 'category.parent', 'reviews']
});

if (user.value?.role?.name == 'company') {
    query['with[]'].push('discountTiers');
}

const { data: product } = await useFetch<IProduct>(`/products/` + route.params.slug?.toString(), {
    method: 'get',
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    query,
});

const discountTiers = computed(() => product.value?.discount_tiers?.sort((a, b) => a.minimum_quantity - b.minimum_quantity))

//san pham tuong tu
const productSimilar = computed(() => {
    return productsInCategory.value?.data.filter((item: IProduct) => item.id !== product.value?.id);
});

// số lượng sản phẩm muốn mua
const quantity = ref(1);

const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(value);
};

const allImages = computed(() => {
    if (product.value) {
        return product.value.cover_image ? [product.value.cover_image, ...product.value.thumbnail] : product.value.thumbnail || [];
    }
    return [];
});

const productsInCategoryQuery = reactive({
    'with[]': ['category','category.parent'],
    paginate: 4
});

const { data: productsInCategory } = await useFetch<IResponsePagination<IProduct>>('/product-by-category/' + product.value?.category_id?.toString(), {
    method: 'GET',
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    query: productsInCategoryQuery,
    lazy: true,
    immediate: !!(product.value && product.value.category_id) 
});

//get review and rating

const reviewQuery = reactive({
    paginate: 5,
    page: 1,
    'with[]': ['user']
});

const { data: reviewsInproduct } = await useFetch<IResponsePagination<IReview>>('/reviews/product/' + product.value?.id, {
    method: 'GET',
    baseURL: useRuntimeConfig().public.apiBaseUrl,
    query: reviewQuery,
});

const buildBreadcrumbs = (category: ICategory | any) => {
    const breadcrumbs = [];
    let current = category;
    while (current) {
        breadcrumbs.unshift(current);
        current = current.parent;
    }
    return breadcrumbs;
};

const breadcrumbs = computed(() => {
    if (product.value && product.value.category) {
        return buildBreadcrumbs(product.value.category);
    }
    return [];
});
const cartStore = useCartStore();

const { getMyCart } = cartStore;
//add to cart
const access_token = computed(() => useAuthStore().accessToken);
const handleAddToCart = async () => {
    if (!user.value) {
        message.error('Vui lòng đăng nhập để thêm sản phẩm vào giỏ hàng');
        return;
    }
    const data = {
        product_id: product.value?.id,
        quantity: quantity.value
    };
    await $fetch('/shopping-carts', {
        method: 'POST',
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        headers: {
            Authorization: `Bearer ${access_token.value}`
        },
        body: data,
        onResponse: ({ response }) => {
            if (response.ok) {
                message.success('Thêm sản phẩm vào giỏ hàng thành công');
                if (access_token.value) {
                    getMyCart(access_token.value);
                }
            }
            else {
                message.error(response._data.message || 'Thêm sản phẩm vào giỏ hàng thất bại');
            }
        }
    });
};

// handle buy now set local storage item and quantity after that navigate to cart page

const handleBuyNow = async () => {
    
    if(!user.value){
        message.error('Vui lòng đăng nhập để mua hàng');
        return;
    }



    const data = {
        product_id: product.value?.id,
        quantity: quantity.value
    };
    localStorage.setItem('buyNow', JSON.stringify(data));
    navigateTo('/checkout/buy-now');
};

const discountTiersColumns = [
    {
        title: 'Số lượng',
        dataIndex: 'minimum_quantity',
        key: 'minimum_quantity',

    },
    {
        title: 'Giá bán (VNĐ)/sản phẩm',
        dataIndex: 'price',
        key: 'price',
    }
]

const priceShow = computed(() => {
    if (product.value) {
        if (user.value?.role?.name == 'company' && product.value.discount_tiers && product.value.discount_tiers.length > 0) {
            const discount_tiers = product.value?.discount_tiers ? JSON.parse(JSON.stringify(product.value.discount_tiers)).sort((a: any, b: any) => b.minimum_quantity - a.minimum_quantity) : [];
            if (discount_tiers && discount_tiers.length > 0) {
                const discount_tier = discount_tiers.find((tier: any) => Number(quantity.value) >= Number(tier.minimum_quantity));
                if (discount_tier) {
                    return discount_tier.price;
                }
            }
            return product.value.discount ? product.value.price * (1 - product.value.discount / 100) : product.value.price;
        }
        return product.value.discount ? product.value.price * (1 - product.value.discount / 100) : product.value.price;
    }
    return 0;
});

useHead({
    title: product.value?.title +'',
    meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'This is my amazing site, let me tell you all about it.' },
    ],
    link: [{ rel: 'icon', type: 'image/x-icon', href: '/images/icon-logo.png' }],
});


</script>

<style scoped>
/* For demo */
:deep(.slick-dots) {
    position: relative;
    height: auto;
}

:deep(.slick-slide img) {
    border: 5px solid #fff;
    display: block;
    margin: auto;
    max-width: 80%;
}

:deep(.slick-arrow) {
    display: none !important;
}

:deep(.slick-thumb) {
    bottom: 0px;
}

:deep(.slick-thumb li) {
    width: 60px;
    height: 45px;
}

:deep(.slick-thumb li img) {
    width: 100%;
    height: 100%;
    filter: grayscale(100%);
    display: block;
}

:deep .slick-thumb li.slick-active img {
    filter: grayscale(0%);
}

.breadcrumb {
    display: flex;
    flex-wrap: wrap;
    padding: 0.75rem 1rem;
    margin-bottom: 1rem;
    list-style: none;
    border-radius: 0.25rem;
}

.breadcrumb-item+.breadcrumb-item::before {
    content: ">";
    padding: 0 0.5rem;
    color: #6c757d;
}
</style>