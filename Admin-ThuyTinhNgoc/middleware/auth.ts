export default defineNuxtRouteMiddleware((to, from) => {

    // Kiểm tra xem người dùng đã đăng nhập chưa
    const authStore = useAuthStore()
    const user = computed(() => authStore.user)
    const token = computed(() => authStore.accessToken)
    const {getUser } = useAuthStore()
    if (!user.value) {
        if (token.value) {
            getUser()
            return
        }
        else{
            return navigateTo('/login')
        }

    }
    if(user.value.role?.name !== 'admin'){
        return navigateTo('/login')
    }
}
)