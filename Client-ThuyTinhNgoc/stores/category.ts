import type { ICategory } from "~/interfaces/category";

export const useCategoryStore = defineStore('category', () => {
    const categories = ref<ICategory[]>([]);

    const handleSetCategories = (data: ICategory[]) => {
        categories.value = data;
    }

    // Kiểm tra route.params.slug có tồn tại trong danh sách categories không

    // Nếu có thì lấy ra category đó và gán vào currentCategory
    
    const currentCategory = ref<ICategory>();

    const handleSetCurrentCategory = (data: ICategory) => {
        currentCategory.value = data;
    }

    const handleGetCategories = async (query: any) => {
        await $fetch('/categories', {
            baseURL: useRuntimeConfig().public.apiBaseUrl,
            onResponse: ({ response }) => {
                if (response.ok) {
                    categories.value = response._data
                }
            },
            query: {
                ...query
            }
        })
    }

    const getCategory = async (id: string, query: Record<string|number, any>) => {
        let category = undefined;
        await $fetch<ICategory>(`/categories/${id}`, {
            baseURL: useRuntimeConfig().public.apiBaseUrl,
            onResponse: ({ response }) => {
                if (response.ok) {
                    category = response._data
                }
            }
        })
        return category;
    }

    return {
        categories,
        currentCategory,
        handleGetCategories,
        handleSetCategories,
        getCategory,
        handleSetCurrentCategory
    }
});