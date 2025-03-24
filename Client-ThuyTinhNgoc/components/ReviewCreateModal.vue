<template>
    <a-modal :open="props.open" @cancel="handleClose" :footer="null">
        <template #title>
            <h3 class="text-xl text-center mb-4">Đánh giá sản phẩm</h3>
        </template>
        <a-form :model="review" @finish="handleReview" layout="vertical">
            <a-form-item label="Đánh giá: ">
                <NuxtRating ratingSize="30px" :read-only="false" :rating-value="review.rating" :rating-step="1"
                @ratingSelected="(event)=>{
                    review.rating = event;
                }"
                />
            </a-form-item>
            <a-form-item label="Nhận xét:">
                <a-textarea v-model:values="review.comment" :rows="4" placeholder="Đánh giá về sản phẩm của chúng tôi" />
            </a-form-item>
            <a-form-item>
                <a-button type="primary" class="text-center" html-type="submit">Gửi đánh giá</a-button>
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script setup lang="ts">

const authStore = useAuthStore();

const user = computed(() => authStore.user);

const accessToken = computed(() => authStore.accessToken);

const props = defineProps<{
    product_id: number;
    open: boolean;
    order_id: number;
}>();

const emit = defineEmits(['close', 'submit']);

const handleClose = () => {
    emit('close');
};

const review = reactive({
    user_id: user.value?.id,
    product_id: props.product_id,
    order_id: props.order_id,
    rating: 5,
    comment: '',
});

const handleReview = async () => {
    await $fetch('/reviews', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken.value}`,
        },
        baseURL: useRuntimeConfig().public.apiBaseUrl,
        body: review,
        onResponse:({response})=>{
            if(response.ok){
                message.success('Cảm ơn bạn đã đánh giá sản phẩm');
                emit('close');
            }
            else{
                message.error('Đánh giá không thành công');
            }
        }
    });
}

</script>

<style scoped>
/* Add any necessary styles here */
</style>