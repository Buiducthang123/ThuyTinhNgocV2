<template>
    <div v-if="status== 'success'">
        <a-result status="success" title="Đặt hàng thành công"
            sub-title="Đơn hàng của bạn đã được đặt thành công. Chúng tôi sẽ liên hệ với bạn trong thời gian sớm nhất">
            <template #extra>
                <a-button type="primary" @click="navigateTo('customer/orders')">
                    Kiểm tra đơn hàng cuả bạn
                </a-button>
            </template>
        </a-result>
    </div>

    <div v-else-if="status== 'fail'">
        <a-result status="error" title="Đặt hàng thất bại"
            sub-title="Đơn hàng của bạn đã được đặt thất bại. Vui lòng thử lại sau">
            <template #extra>
                <a-button type="primary" @click="navigateTo('/')">
                    Quay lại trang chủ
                </a-button>
            </template>
        </a-result>
    </div>

</template>

<script setup lang="ts">
const route = useRoute();

const status = route.query.status
</script>

<style scoped>
</style>