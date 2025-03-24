<template>
  <ul>
    <li v-for="item in items" :key="item.id">
      {{ item.name }}
      <span v-if="item.children && item.children.length"> (Có danh mục con)</span>
      <category-tree v-if="item.children && item.children.length" :items="item.children"></category-tree>
    </li>
  </ul>
</template>

<script setup lang="ts">
import type { ICategory } from '~/interfaces/category';

defineProps<{ items: ICategory[] }>();
</script>

<style scoped></style>