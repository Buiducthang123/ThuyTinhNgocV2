import type { IUser } from "~/interfaces/user"

export const useAuthStore = defineStore('auth',()=>{
  const user = ref<IUser | null>(null)
  const accessToken = useCookie<string|null>('access_token',{
      default: () => null,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // Giải thích: 1000ms * 60s * 60m * 24h * 7d = 1 tuần,
      watch: true
  })

  const setUser = (newUser: IUser|null) => {
    user.value = newUser
  }

  const setAccessToken = (newAccessToken: string|null) => {
    accessToken.value = newAccessToken
  }

  const getUser = async () => {
    if (!accessToken.value) {
      return
    }
    await $fetch<IUser>('/user-me', {
      headers: {
        Authorization: `Bearer ${accessToken.value}`
      },
      baseURL: useRuntimeConfig().public.apiBaseUrl,
      onResponse:({response})=>{
        if(response.ok){
          setUser(response._data)
          navigateTo('/customer/address')
        }
        else{
          setAccessToken(null)
          setUser(null)
          navigateTo('/login')
      }}
    })
  }

  return { 
    user,
    accessToken,
    setUser,
    setAccessToken,
    getUser
  }
})