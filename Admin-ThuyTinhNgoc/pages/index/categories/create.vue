<template>
  <div class="px-6 py-10">
    <div class=" text-xl font-medium mb-6 flex items-center cursor-pointer " @click="navigateTo('/categories')">
           <Icon name="i-material-symbols-arrow-back-ios"></Icon>
           <span> Quay lại trang danh sách danh mục</span>
        </div>
    <h3 class="font-bold text-xl mb-6">Tạo danh mục mới</h3>
    <div class="text-lg">
      <div class="flex gap-10">
        <a-form class="w-2/3" :model="formCreateCategory" name="createCategory" 
                layout="vertical" ref="formRefCreateCategory" :rules="rules"
                @finish="handleCreateCategory">
          <a-form-item label="Tên danh mục" required name="name">
            <a-input v-model:value="formCreateCategory.name" />
          </a-form-item>
          <a-form-item label="Slug" required name="slug">
            <a-input v-model:value="formCreateCategory.slug" />
          </a-form-item>
          
          <a-form-item>
            <template #label>
              <div class="flex items-center gap-2">
                <span>Đặt làm danh mục con của danh mục</span>
                <a-tooltip placement="topRight">
                  <template #title>
                    <span>Bạn chỉ có thể thêm danh mục cha nếu danh mục này không chưa danh mục con</span>
                  </template>
                  <Icon class="cursor-pointer" name="i-material-symbols-info-outline-rounded" />
                </a-tooltip>
              </div>
            </template>
            <a-select v-model:value="formCreateCategory.parent_id">
              <a-select-option :value="null">Chưa chọn danh mục cha</a-select-option>
              <a-select-option v-for="item in categories" :key="item.id" :value="item.id">{{ item.name }}</a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item label="Mô tả">
            <CkEditor v-model:value="formCreateCategory.description" />
          </a-form-item>

          <a-form-item class="mt-10">
            <a-button html-type="submit" type="primary">Tạo mới</a-button>
          </a-form-item>
        </a-form>
        <div>
          <a-image height="300px" :src="formCreateCategory.avatar" />
          <UploadImg @handle-change-image="handleChangeAvatar">
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
import { reactive, computed, ref } from 'vue';
import UploadImg from '~/components/UploadImg.vue';
import type { ICategory } from '~/interfaces/category';
import { useAuthStore } from '~/stores/auth';

const formRefCreateCategory = ref();
const query = reactive({
  filter: {
    level: 'all',
    name: ''
  }
});

const { data: categoriesData } = await useFetch<ICategory[]>('/api/categories', {
  baseURL: useRuntimeConfig().public.baseURLAPI,
  query
});


const formCreateCategory = reactive({
  name: '',
  avatar: '',
  parent_id: null as number | any,
  description: '',
  slug: '',
  children: []
});

const categories = computed(() => {
  return categoriesData?.value ?? [];
});

const handleChangeAvatar = (url: string) => {
  formCreateCategory.avatar = url;
};

// Validate form
const rules: Record<string, Rule[]> = {
  name: [
    { required: true, message: 'Vui lòng nhập tên danh mục', trigger: 'blur' },
    { min: 3, message: 'Tên danh mục phải có ít nhất 3 ký tự', trigger: 'blur' }
  ],
  slug: [
    { required: true, message: 'Vui lòng nhập slug', trigger: 'blur' },
    { min: 3, message: 'Slug phải có ít nhất 3 ký tự', trigger: 'blur' },
    { pattern: /^[a-z0-9-]+$/, message: 'Slug chỉ chứa ký tự thường, số và dấu gạch ngang', trigger: 'blur' }
  ]
};

// Call API to create category
const authStore = useAuthStore();
const accessToken = computed(() => authStore.accessToken);

const handleCreateCategory = async () => {
  await formRefCreateCategory.value.validate();
  await $fetch('/api/categories', {
    baseURL: useRuntimeConfig().public.baseURLAPI,
    method: 'post',
    headers: {
      'Authorization': 'Bearer ' + accessToken.value
    },
    body: formCreateCategory,
    onResponse:({response})=>{
        if(response.ok){
          message.success('Tạo danh mục thành công');
          navigateTo('/categories');
        }
        else{
          message.error(response._data.message ?? 'Có lỗi xảy ra khi tạo danh mục');
        }
    }
  });
};
</script>

<style scoped></style>