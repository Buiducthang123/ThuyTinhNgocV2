<template>
    <div class="px-6 py-10">
        <div class=" text-xl font-medium mb-6 flex items-center cursor-pointer " @click="navigateTo('/categories')">
           <Icon name="i-material-symbols-arrow-back-ios"></Icon>
           <span> Quay lại trang danh sách danh mục</span>
        </div>
        <h3 class="font-bold text-xl mb-6">Chỉnh sửa danh mục</h3>
        <div v-if="category" class="text-lg">
            <div class="flex gap-10">
                <a-form class="w-2/3" :model="formUpdateCategory" name="updateCategory" 
                layout="vertical" ref="formRefUpdateCategory" :rules="rules"
                @finish="handleUpdateCategory"
                >
                    <a-form-item label="Tên danh mục" required name="name">
                        <a-input v-model:value="formUpdateCategory.name" />
                    </a-form-item>
                    <a-form-item label="Slug" required name="slug">
                        <a-input v-model:value="formUpdateCategory.slug" />
                    </a-form-item>

                    <a-form-item>
                        <template #label>
                            <div class="flex items-center gap-2">
                                <span>Đặt làm danh mục con của danh mục</span>
                                <a-tooltip placement="topRight">
                                    <template #title>
                                        <span>Bạn chỉ có thể thêm danh mục cha nếu danh mục này không chưa danh mục
                                            con</span>
                                    </template>
                                    <Icon class="cursor-pointer" name="i-material-symbols-info-outline-rounded" />
                                </a-tooltip>
                            </div>
                        </template>
                        <a-select v-model:value="formUpdateCategory.parent_id">
                            <a-select-option :value="null">Chưa chọn danh mục cha</a-select-option>
                            <a-select-option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name
                                }}</a-select-option>
                        </a-select>
                    </a-form-item>
                    <div v-html="formUpdateCategory.description">

                    </div>
                    <a-form-item label="Mô tả" name="">
                        <CkEditor v-model="formUpdateCategory.description" />
                    </a-form-item>

                    <!--
                        <a-form-item label="Chọn danh mục con">
                            <a-select v-model:value="formUpdateCategory.children" mode="multiple">
                                <a-select-option :value="[]">Chưa chọn danh mục con</a-select-option>
                                <a-select-option v-for="item in categoriesChildren" :key="item.id" :value="item.id">{{
                                    item.name
                                    }}</a-select-option>
                            </a-select>
                        </a-form-item>

                    -->
                    

                    <div class="font-medium">
                        <span class="block mb-4">Vị trí danh mục:</span>
                        <div class="flex gap-4">
                            <span v-if="categoriesData?.find(item => item.id === formUpdateCategory.parent_id)?.name">
                                {{ categoriesData?.find(item => item.id === formUpdateCategory.parent_id)?.name }}
                            </span>

                            <span v-if="categoriesData?.find(item => item.id === formUpdateCategory.parent_id)?.name" class="text-gray-500">></span>

                            <span class="text-blue-500">
                                {{ categoriesData?.find(item => item.id === category?.id)?.name }}
                            </span>

                            <span class="text-gray-500">></span>
                            
                            <ul>
                                <li v-for="item in formUpdateCategory.children" :key="item">
                                    {{ categoriesData?.find(category => category.id === item)?.name }}
                                </li>
                            </ul>
                        </div>
                    </div>

                    <a-form-item class="mt-10">
                        <a-button html-type="submit" type="primary" >Lưu lại</a-button>
                    </a-form-item>
                </a-form>
                <div>
                    <a-image height="300px" :src="formUpdateCategory.avatar" />
                    <UploadImg @handle-change-image="handleChanegAvatar">
                        <template #main>
                            <div class="text-center">
                                <a-button>Thay đổi ảnh</a-button>
                            </div>
                        </template>
                    </UploadImg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import type { Rule } from 'ant-design-vue/es/form';
import UploadImg from '~/components/UploadImg.vue';
import type { ICategory } from '~/interfaces/category';

const formRefUpdateCategory = ref()
const route = useRoute()
const query = reactive({
    'load[]': ['parent', 'children', , 'children.children', 'children.children.children']
})
const { data: category, error } = await useFetch<ICategory>('/api/categories/' + route.params.slug, {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query
})

const categoriesQuery = reactive({
    filter: {
        level: 'all',
        name: ''
    },
})

const { data: categoriesData } = await useFetch<ICategory[]>('/api/categories', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    query: categoriesQuery
})

const formUpdateCategory = reactive({
    name: category?.value?.name,
    avatar: category?.value?.avatar ?? '',
    parent_id: category?.value?.parent_id,
    description: category?.value?.description ?? '' as String,
    slug: category?.value?.slug,
    children: category?.value?.children?.map(item => item.id)
})

const categories = computed(() => {
    return categoriesData?.value?.filter(item => item.id !== category?.value?.id)
})

const categoriesChildren = computed(() => {
    return categoriesData?.value?.filter(item => item.id !== category?.value?.id && item.id !== formUpdateCategory.parent_id)
})

const handleChanegAvatar = (url: string) => {
    formUpdateCategory.avatar = url
}

//validate form

const rules:Record<string, Rule[]> = {
    name: [
        { required: true, message: 'Vui lòng nhập tên danh mục', trigger: 'blur' },
        { min: 3, message: 'Tên danh mục phải có ít nhất 3 ký tự', trigger: 'blur' }
    ],
    slug: [
        { required: true, message: 'Vui lòng nhập slug', trigger: 'blur' },
        { min: 3, message: 'Slug phải có ít nhất 3 ký tự', trigger: 'blur' },
        { pattern: /^[a-z0-9-]+$/, message: 'Slug chỉ chứa ký tự thường, số và dấu gạch ngang', trigger: 'blur' }
    ]
}

//call api update category

const authStore = useAuthStore()

const accessToken = computed(() => authStore.accessToken)

const handleUpdateCategory = async () =>{
    await formRefUpdateCategory.value.validate()    
    await $fetch('/api/categories/' + category?.value?.id, {
        baseURL: useRuntimeConfig().public.baseURLAPI,
        method: 'patch',
        headers:{
            'Authorization': 'Bearer ' + accessToken.value
        },
        body: formUpdateCategory,
        onResponse:({response}) => {
            if(response.ok){
                message.success('Cập nhật danh mục thành công')
            }
            else{
                message.error(response._data.message ?? 'Cập nhật danh mục thất bại')
            }
        }
    })
}
</script>

<style scoped></style>