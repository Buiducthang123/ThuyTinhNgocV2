<template>
    <a-breadcrumb class="px-4 mb-2 text-base cursor-pointer flex py-2">
        <template #separator><span style="color: red">></span></template>
        <a-breadcrumb-item :href="currentPage?.path">Trang chủ</a-breadcrumb-item>
        <a-breadcrumb-item >{{ currentPage?.title }}</a-breadcrumb-item>
    </a-breadcrumb>
    <div class="grid grid-cols-12 pb-4 bg-white p-4">
        <div class="col-span-2 ">
            <div class="flex gap-4 items-center">
                <NuxtImg v-if="user?.avatar" :src="user?.avatar" class="w-10 h-10 rounded-full" />
                <a-avatar v-else size="large" class="bg-blue-600">{{ user?.full_name.charAt(0)}}</a-avatar>
                <div>
                    <h3 class="text-lg text-gray-500">Tài khoản của</h3>
                    <p class="text-base font-semibold ">{{ user?.email }}</p>
                </div>
            </div>
            <ul class="mt-6">
                <li v-for="item in optionsNav" :key="item.id" 
                    class="py-3 my-1 bg flex items-center gap-2 cursor-pointer rounded-lg hover:text-black hover:bg-gray-200 transition-all" 
                    :class="route.path===item.path ?'text-black bg-gray-200':'text-gray-500'"
                    @click="navigateTo(item.path)">
                    <div class="w-10 flex items-center justify-center">
                        <Icon size="20px" :name="item.icon"/>
                    </div>
                    <span class="text-base ">{{ item.title }}</span>
                </li>
            </ul>
        </div>
        <div class="col-span-9 pl-10">
            <div class="border-l border-gray-200 pl-4 min-h-[60vh]">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

const authStore = useAuthStore();

const user = computed(() => authStore.user);

const route = useRoute();

const optionsNav = [
    {
        id: 1,
        title: 'Thông tin tài khoản',
        icon: 'i-material-symbols-person',
        path: '/customer',
    },
    {
        id: 2,
        title: 'Đơn hàng của tôi',
        icon: 'i-material-symbols-checked-bag-rounded',
        path: '/customer/orders',
    },
    {
        id: 3,
        title: 'Sổ địa chỉ',
        icon: 'i-material-symbols-location-on',
        path: '/customer/address',
    },
    {
        id: 4,
        title: 'Thông tin thanh toán',
        icon: 'i-material-symbols-credit-card-outline',
        path: '/customer/payment',
    },

];

const currentPage = ref();

onMounted(() => {
    optionsNav.forEach((item, index) => {
        if (route.path === item.path) {
            currentPage.value = item;
        }
    });
});
</script>

<style scoped></style>