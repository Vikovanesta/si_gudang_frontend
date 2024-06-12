<script setup lang="ts">
import Item from '@/views/app/daftar-alat/Item.vue';

definePage({
  meta: {
    subject: 'Academic',
  }
})

const items = [
  {
    id: 1,
    name: 'Tang',
    stock: 10,
    maxStock: 20,
    imageUrl: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
    warehouse: {
      id: 1,
      name: 'Gudang A',
    },
    material: {
      id: 1,
      name: 'Besi',
    },
  },
  {
    id: 2,
    name: 'Gergaji',
    stock: 5,
    maxStock: 10,
    imageUrl: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
    warehouse: {
      id: 1,
      name: 'Gudang A',
    },
    material: {
      id: 2,
      name: 'Kayu',
    },
  },
  {
    id: 3,
    name: 'Baut',
    stock: 15,
    maxStock: 30,
    imageUrl: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
    warehouse: {
      id: 2,
      name: 'Gudang A',
    },
    material: {
      id: 3,
      name: 'Besi',
    },
  },
  {
    id: 4,
    name: 'Paku',
    stock: 20,
    maxStock: 40,
    imageUrl: 'https://cdn.vuetifyjs.com/images/cards/cooking.png',
    warehouse: {
      id: 2,
      name: 'Gudang A',
    },
    material: {
      id: 3,
      name: 'Besi',
    },
  },
]

</script>

<template>
  <VRow class="match-height">
    <!-- 👉 Award -->
    <VCol
      v-for="item in items"
      :key="item.id"
      cols="12"
      md="6"
      sm="12"
    >
      <Item v-bind="item" />
    </VCol>

  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
