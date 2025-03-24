import type { IShoppingCardItem } from "~/interfaces/shopping_card"

export const useCartStore = defineStore('cart',()=>{

    const myCart = <IShoppingCardItem[]> reactive([])

    const setCart = (cart: IShoppingCardItem[]) => {
        myCart.length = 0
        myCart.push(...cart)
    }

    const removeItem = (index: number) => {
        myCart.splice(index, 1)
    }

    const getMyCart = async(access_token:string) => {
        await $fetch<IShoppingCardItem[]>('/shopping-carts', {
            baseURL: useRuntimeConfig().public.apiBaseUrl,
            onResponse: ({ response }) => {
                if (response.ok) {
                    setCart(response._data)
                }
            },
            headers: {
                Authorization: `Bearer ${access_token}`
            }
        })
    }

    return {
        myCart,
        setCart,
        removeItem,
        getMyCart
    }

})

