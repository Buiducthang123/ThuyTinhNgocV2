<template>
    <!--Khám phá theo danh mục-->
    <div v-if="hasCategories" class="bg-white p-4 mb-10">
      <h1 class="text-xl font-medium">Khám phá theo danh mục</h1>
      <div class="px-10">
        <div class="mt-6 flex gap-20 w-full overflow-x-auto pb-6">
          <div
            v-for="item in route.path == '/' ? parentCategories : currentCategory?.children"
            :key="item.id"
            class="space-y-2 cursor-pointer"
            @click="navigateTo('/category/' + (item.slug ? item.slug : item.id))"
          >
            <NuxtImg
              v-if="item.avatar"
              class="aspect-square rounded-full max-w-24 border"
              :src="item.avatar"
            />
            <NuxtImg
              v-else
              class="aspect-square rounded-full max-w-24 border"
              src="https://via.placeholder.com/150"
            />
            <h6 class="font-medium text-center line-clamp-2">{{ item.name }}</h6>
          </div>
        </div>
      </div>
    </div>
  </template>

<script setup lang="ts">

const route = useRoute();

const categoryStore = useCategoryStore();

const categories = computed(() => categoryStore.categories);

const currentCategory = computed(() => {
    return categories.value?.find(cate => cate.slug === route.params.slug || cate.id.toString() === route.params.slug);
});

const parentCategories = computed(() => categories.value?.filter(cate => cate.level === 0));

const hasCategories = computed(() => {
  if (route.path === '/') {
    return parentCategories.value.length > 0;
  } else {
    return (currentCategory.value?.children ?? []).length > 0;
  }
});
</script>

<style scoped></style>