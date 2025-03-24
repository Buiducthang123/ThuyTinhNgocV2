<template>
    <div class="grid grid-cols-12">
        <div class="col-span-2 h-screen scroll-container overflow-y-scroll border bg-[#001529] text-white py-6">
            <div>
                <div class="px-4 flex items-center gap-4">
                    <NuxtImg class=" w-full" src="images/logo-v2.jpg"/>
                </div>
                <h6 class="text-lg text-center mt-5 font-medium">Thuỷ Tinh Ngọc USA-HomeSet</h6>
                <a-divider class="bg-white" />
            </div>

            <div>
                <div class="px-4">
                    <h6 class="text-gray-200 mb-4">Tài khoản: </h6>
                    <div class="flex gap-4 items-center">
                        <a-avatar class="mt-2 bg-white" size="large" :src="user?.avatar"/>
                        <div>
                            <h6 class="text-sm font-medium mb-2 cursor-pointer">{{ user?.email }}</h6>
                            <p class="text-xs">{{  user?.role?.name }}</p>
                        </div>
                    </div>
                </div>
                <a-divider class="bg-white" />
            </div>
            <a-menu id="dddddd" class="h-screen" theme="dark" v-model:openKeys="openKeys" v-model:selectedKeys="selectedKeys"
                mode="inline" :items="items" @click="handleClick"></a-menu>
        </div>

        <div class="col-span-10 h-screen overflow-y-scroll">
            <slot />
        </div>
    </div>
</template>

<script setup lang="ts">
import { reactive, ref, watch, onMounted, h } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { MailOutlined, AppstoreOutlined, SettingOutlined, UserOutlined, HomeOutlined, BookOutlined, BuildOutlined, RiseOutlined } from '@ant-design/icons-vue';
import type { MenuProps, ItemType } from 'ant-design-vue';

const authStore = useAuthStore();
const user = computed(() => authStore.user);

const selectedKeys = ref<string[]>(['']);
const openKeys = ref<string[]>(['sub1']);
const router = useRouter();
const route = useRoute();

function getItem(
    label: string,
    key: string,
    icon?: any,
    children?: ItemType[],
    type?: 'group',
): ItemType {
    return {
        key,
        icon,
        children,
        label,
        type,
    } as ItemType;
}

const items: ItemType[] = reactive([
    getItem('Trang chủ', '/', h(HomeOutlined), [
        getItem('Thống kê', '/'),
        // getItem('Item 2', '2'),
    ]),
    // Đơn đặt hàng
    getItem('Đơn đặt hàng', 'sub1', h(MailOutlined), [
        getItem('Danh sách đơn hàng', '/orders'),
        getItem('Đơn hàng yêu cầu hủy', '/orders/cancel-request'),
    ]),

    getItem('Tài khoản', 'sub2', h(UserOutlined),[
        getItem('Danh sách tài khoản', '/users'),
        getItem('Tài khoản chưa duyệt', '/users/unapproved'),
    ]),

    getItem('Sản phẩm', 'navigation-two', h(BookOutlined), [
        getItem('Danh mục', '/categories'),
        getItem('Sản phẩm', 'sub3', null, [
            getItem('Danh sách', '/products'),
        ]),
    ]),

    getItem('Quản lý chương trình khuyến mãi', 'navigation-three', h(BuildOutlined),[
        getItem('Danh sách', '/promotions'),
        getItem('Tạo mới', '/promotions/create'),
    ]),
    
    getItem('Quản lý xuất nhập sách', '/product-transactions', h(AppstoreOutlined)),

    getItem('Quản lý thanh toán', '/payments', h(RiseOutlined)),

    { type: 'divider' },

    getItem('Quản lý đánh giá', '/reviews', h(SettingOutlined)),

    getItem('Group', 'group', null, [getItem('Option 13', '13'), getItem('Option 14', '14')], 'group'),
]);

const handleClick: MenuProps['onClick'] = e => {
    console.log('click', e);
    navigateTo(e.key.toString());
};

watch(openKeys, val => {
    console.log('openKeys', val);
});

onMounted(() => {
    // Kiểm tra route hiện tại và cập nhật selectedKeys và openKeys
    const currentPath = route.path;
    selectedKeys.value = [currentPath];

    // Dựa trên cấu trúc của items, bạn có thể cập nhật openKeys tương ứng
    items.forEach((item:any) => {
        if (item && item.children) {
            item.children.forEach((child:any) => {
                if (child.key.toString() === currentPath || (child.key === '' && currentPath === '/')) {
                    openKeys.value = [item.key?.toString() || ''];
                }
                else{
                    console.log('child.key', item.key);
                    
                }
            });
        }
    });
});
</script>

<style scoped>
.scroll-container {
    overflow-y: scroll; /* Giữ chức năng cuộn */
    scrollbar-width: none; /* Ẩn thanh cuộn trên Firefox */
}

.scroll-container::-webkit-scrollbar {
    display: none; /* Ẩn thanh cuộn trên Chrome, Safari và Opera */
}
</style>