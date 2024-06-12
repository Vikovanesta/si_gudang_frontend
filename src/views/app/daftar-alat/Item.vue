// TODO: image, add functionality to add to cart
<script setup lang="ts">
import tabsConsole from '@images/cards/tabs-console.png';

const props = defineProps({
  id: Number,
  name: String,
  stock: Number,
  maxStock: Number,
  imageUrl: String,
  warehouse: {
    type: Object,
    default: () => ({}),
  },
  material: {
    type: Object,
    default: () => ({}),
  },
});

const warehouseName = ref(props.warehouse.name);
const materialName = ref(props.material.name);
</script>

<template>
  <VCard class="d-flex flex-row align-items-center">
    <!-- Trophy -->
    <VImg
      :src="tabsConsole"
      class="trophy ms-4"
    />

    <VCardText class="flex-1">
      <div class="mb-3">
        <h5 class="text-h4 text-wrap">
          {{ name }}
        </h5>
        <div class="text-subtitle-1">
          {{ warehouseName }}
        </div>
      </div>
      <h4 class="text-h5">
        Material: <b>{{ materialName }}</b>
      </h4>
      <div class="text-h5 mb-3">
        Tersedia: <b>{{ stock }}</b>
      </div>
      <a href="#"> <VIcon icon="mdi-cart-plus"></VIcon> TAMBAH KE KERANJANG</a>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.v-card .trophy {
  inline-size: 1rem;
}

</style>
