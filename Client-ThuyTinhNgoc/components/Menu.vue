<template>
  <div class="bg-white ">
    <h1 class="p-4 font-semibold" v-if="route.path === '/'" >Khám phá theo danh mục</h1>
    <h1 class="p-4 font-semibold" v-else-if="currentCategory">Danh mục {{ currentCategory.name }} :</h1>
    <hr>
    <div>
      <a-collapse v-if="route.path === '/'" v-model:activeKey="activeKey" ghost>
        <a-collapse-panel  v-for="(category) in parentCategories" :key="category.id" :showArrow="false">
          <template #header>
            <a @click="navigateTo('/category/' + (category.slug ? category.slug : category.id))"
              :class="{ 'text-red-500 font-medium': isActiveCategory(category), 'hover:text-primary hover:underline font-medium': !isActiveCategory(category) }">
              {{ category.name }}
            </a>
          </template>
          <ul class="pl-4 space-y-4">
            <li v-for="(child) in category.children" :key="child.id">
              <a @click="navigateTo('/category/' + (child.slug ? child.slug : child.id))"
                :class="{ 'text-red-500 font-medium': isActiveCategory(child), 'hover:text-primary hover:underline': !isActiveCategory(child) }">
                {{ child.name }}
              </a>
            </li>
          </ul>
          <template #extra>
            <Icon :class="{ 'rotate-180': activeKey.includes(category.id + '') }" name="mdi:chevron-down" />
          </template>
        </a-collapse-panel>
      </a-collapse>

      <a-collapse v-else-if="currentCategory" v-model:activeKey="activeKey" ghost>
        <a-collapse-panel :showArrow="false" v-for="(category) in currentCategory.children" :key="category.id">
          <template #header>
            <a @click="navigateTo('/category/' + (category.slug ? category.slug : category.id))"
              :class="{ 'text-red-500 font-medium': isActiveCategory(category), 'hover:text-primary hover:underline font-medium': !isActiveCategory(category) }">
              {{ category.name }}
            </a>
          </template>
          <ul class="pl-4 space-y-4">
            <li v-for="(child) in category.children" :key="child.id">
              <a @click="navigateTo('/category/' + (child.slug ? child.slug : child.id))"
                :class="{ 'text-red-500 font-medium': isActiveCategory(child), 'hover:text-primary hover:underline': !isActiveCategory(child) }">
                {{ child.name }}
              </a>
            </li>
          </ul>
          <template #extra>
            <Icon v-if="category?.children && category.children.length > 0" :class="{ 'rotate-180': activeKey.includes(category.id + '') }" name="mdi:chevron-down" />
          </template>
        </a-collapse-panel>
      </a-collapse>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import type { ICategory } from '~/interfaces/category';

const categoryStore = useCategoryStore();
const query = reactive({
  with: ['children', 'children.children'],
});

const route = useRoute();

const activeKey = ref(['1']);

watch(activeKey, val => {
  // console.log(val);
});

// Lấy danh mục cha có parentId = null
const parentCategories = computed(() => categories.value?.filter(cate => cate.level === 0));

const isActiveCategory = (category: ICategory) => {
  return route.params.slug === category.slug || route.params.slug === category.id.toString();
};

const currentCategory = computed(() => {
  return categories.value?.find(cate => cate.slug === route.params.slug || cate.id.toString() === route.params.slug);
});

const categories = computed(() => categoryStore.categories);
onMounted(() => {
    categoryStore.handleGetCategories(query);
});


</script>

<style scoped>
.rotate-180 {
  transform: rotate(180deg);
  transition: transform 0.3s;
}
</style>