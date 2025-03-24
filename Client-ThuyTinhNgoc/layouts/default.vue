<template>
    <div class="h-screen overflow-y-scroll">
        <div class="text-center bg-[#EFFEF4] py-3 mb-3">
            <p class="text-green-600 text-xs font-semibold">Freeship khi đặt 10 sản phẩm, giảm với
                <span class="text-blue-500 font-bold italic"> chương trình ưu đãi </span>
            </p>
        </div>
        <div class="md:max-w-[90vw] 2xl:max-w-screen-2xl mx-auto flex justify-between gap-10">
            <div class="w-fit flex flex-col justify-center ">
                <NuxtImg class="w-36 h-12 cursor-pointer" src="images/logo-v2.jpg" @click="navigateTo('/')" />
                <h4 class="text-base mt-2 font-medium text-[#003ea1]">Tốt & Nhanh</h4>
            </div>
            <div class="w-[60%]">
                <a-input-search v-model:value="search" placeholder="Tìm kiếm sản phẩm" size="large">
                    <template #prefix>
                        <Icon class="text-xl" name="tabler:search" />
                    </template>
                    <template #enterButton>
                        <a-button @click="()=>{
                            handleUpdateSearch(search)
                            router.push({ path: '/search', query: { q: search } })
                        }">Tìm kiếm</a-button>
                    </template>
                </a-input-search>
            </div>
            <div class="h-fit ">
                <div class="flex items-center justify-end">
                    <a-button v-if="user == null" type="ghost" size="large"
                        class="flex items-center gap-2 transition-all hover:bg-[#f0f0f0]" @click="openLoginModal">
                        <Icon class="text-xl " name="tabler:home" />
                        Đăng nhập
                    </a-button>

                    <a-button v-else type="ghost" size="large"
                        class="flex items-center gap-2 transition-all hover:bg-[#f0f0f0]" @click="navigateTo('/')">
                        <Icon class="text-xl " name="tabler:home" />
                        Trang chủ
                    </a-button>

                    <a-button v-if="user == null" type="ghost" size="large"
                        class="flex items-center gap-2 transition-all hover:bg-[#f0f0f0]" @click="openLoginModal">
                        <Icon class=" text-xl " name="mdi:emoticon-happy-outline" />
                        Tài khoản
                    </a-button>

                    <a-dropdown v-else>
                        <template #overlay>
                            <a-menu class="space-y-1">
                                <a-menu-item key="1" @click="navigateTo('/customer')">
                                    Thông tin tài khoản
                                </a-menu-item>
                                <a-menu-item key="2" @click="navigateTo('/customer/orders')">
                                    Đơn hàng của tôi
                                </a-menu-item>
                                <a-menu-item key="3" @click="handleLogout(false)">
                                    Đăng xuất
                                </a-menu-item>
                            </a-menu>
                        </template>
                        <a-button type="ghost" size="large"
                            class="flex items-center gap-2 transition-all hover:bg-[#f0f0f0]">
                            <Icon class=" text-xl " name="mdi:emoticon-happy-outline" />
                            Tài khoản
                        </a-button>
                    </a-dropdown>

                    <a-badge :count="myCart.length" class="border-l-2 ml-2 pl-4 border-black cursor-pointer"
                    @click="navigateTo('/my-cart')"
                    >
                        <Icon class="text-xl" name="tdesign:cart" />
                    </a-badge>
                </div>
                <div class="flex items-center gap-2 mt-2 text-sm">
                    <Icon class="text-xl cursor-pointer" name="material-symbols:location-on-outline" />
                    <span>Giao đến: </span>
                    <ins v-if="addressDefault" class="font-medium">
                        {{ addressDefault.ward.WardName }} , {{ addressDefault.district.DistrictName }}, {{ addressDefault.province.ProvinceName }}
                    </ins>
                    <ins v-else class="font-medium">Chưa xác định</ins>
                </div>
            </div>
        </div>

        <hr class="mt-4">

        <div class="md:max-w-[90vw] 2xl:max-w-screen-2xl mx-auto flex items-center gap-10 mt-3 w-full">
            <span class="text-[#003ea1] font-bold">Cam kết</span>
            <ul class="flex">
                <li class="flex items-center gap-2 px-4 border-r-2 cursor-pointer">
                    <img width="20px" src="~/assets/images/header-g-2.png" />
                    <span class="text-sm font-medium">Freeship với 10 đơn hàng</span>
                </li>
                <li class="flex items-center gap-2 px-4 border-r-2 cursor-pointer">
                    <img width="20px" src="~/assets/images/header-g-1.png" />
                    <span class="text-sm font-medium">Hoàn 200% nếu hàng giả</span>
                </li>

                <li class="flex items-center gap-2 px-4 border-r-2 cursor-pointer">
                    <img width="20px" src="~/assets/images/header-g-3.png" />
                    <span class="text-sm font-medium">Giá siêu rẻ</span>
                </li>
            </ul>
        </div>
        <hr class="mt-3">

        <div class="bg-[#F5F5FA] pb-20">
            <div class="md:max-w-[90vw] 2xl:max-w-screen-2xl mx-auto">
                <slot class=""></slot>
            </div>
        </div>
    </div>
    <Login v-if="isLoginModalOpen" />
    <Register v-if="isRegisterModalOpen" />
</template>

<script setup lang="ts">
import type { MenuProps } from 'ant-design-vue';
import type { IShippingAddress } from '~/interfaces/shipping_address';

const search = ref('');

const authModal = useAuthModal();

const { isLoginModalOpen, isRegisterModalOpen, openLoginModal } = authModal;

const authStore = useAuthStore();

const user = computed(() => authStore.user);

const access_token = computed(()=>authStore.accessToken)

const handleMenuClick: MenuProps['onClick'] = e => {
    console.log('click', e);
};

const addressDefault = computed(() => {
    if (!user.value || !user.value.shipping_addresses) {
        return null;
    }
    return user.value.shipping_addresses.find((address: IShippingAddress) => address.is_default);
});

const cartStore = useCartStore();

const myCart = computed(() => cartStore.myCart);

onMounted(() => {
    if (access_token.value) {
        cartStore.getMyCart(access_token.value);
    }
    const searchStore = useSearchStore();
    const { handleUpdateSearch } = searchStore;
    if(!useRoute().path.startsWith('/search')){
        handleUpdateSearch('');
    }
});

const handleLogout = async(isLogoutAll:boolean) => {
    await $fetch('/logout',{
        method:'POST',
        headers:{
            'Authorization':`Bearer ${access_token.value}`
        },
        baseURL:useRuntimeConfig().public.apiBaseUrl,
        body:{
            isLogoutAll:isLogoutAll
        },
        onResponse:({response})=>{
            if(response.ok){
                authStore.setAccessToken(null);
                //load lại trang
                window.location.reload();
                message.success('Đăng xuất thành công');
            }
            else{
                message.error('Đăng xuất thất bại');
            }
        }
        
    })
};

const searchStore = useSearchStore()

const { handleUpdateSearch } = searchStore;

const router = useRouter();

</script>

<style scoped></style>