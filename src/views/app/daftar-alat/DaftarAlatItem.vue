// TODO: image
<script setup lang="ts">
import tabsConsole from '@images/cards/tabs-console.png';

const props = defineProps({
  id: Number,
  name: String,
  stock: Number,
  max_stock: Number,
  image_url: String,
  is_in_cart: Boolean,
  warehouse: {
    type: Object,
    default: () => ({}),
  },
  material: {
    type: Object,
    default: () => ({}),
  },
  category: {
    type: Object,
    default: () => ({}),
  },
});

const warehouseName = ref(props.warehouse.name);
const materialName = ref(props.material.name);
const category = ref(props.category.name);
const isInCart = ref(props.is_in_cart);
const isLoading = ref<boolean>(false)

console.log('maxStock:', props.max_stock);

const addToCart = async () => {
  isLoading.value = true
  try {
    const response = await axios.post('/me/carts', { item_id: props.id });

    console.log('Item added to cart:', response.data);
    
    isInCart.value = true;
  } catch (error) {
    console.error('Error adding item to cart:', error);
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <VCard class="d-flex flex-row align-items-center">
    <!-- Trophy -->
    <VImg
      :src="image_url || tabsConsole"
      class="trophy ms-4"
    />

    <VCardText class="flex-1">
      <div class="mb-3">
        <h5 class="text-h4 text-wrap" :id="`name-${id}`">
          {{ name }}
        </h5>
        <div class="text-subtitle-1" :id="`warehouse-${id}`">
          {{ category }}
        </div>
      </div>
      <h4 class="text-h5 font-weight-regular">
        Lokasi: <span class="font-weight-medium" :id="`material-${id}`">{{ warehouseName }}</span>
      </h4>
      <div class="text-h5 font-weight-regular mb-3">
        Tersedia: <span class="font-weight-medium" :id="`stock-${id}`">{{ stock }}</span>
      </div>
      <div style="display: inline-block;">
        <div v-if="isInCart" class="text-green cursor-default" style="block-size: 24px;" id="btn-add-to-cart">
          <VIcon icon="mdi-cart-check"></VIcon> 
          SUDAH ADA DI KERANJANG
        </div>
        <VBtn v-else @click.prevent="addToCart" variant="text" :loading="isLoading" id="btn-add-to-cart">
          <v-icon>mdi-cart-plus</v-icon>
          <span>TAMBAH KE KERANJANG</span>
        </VBtn>
      </div>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.v-card .trophy {
  inline-size: 1rem;
}

.text-green {
  color: rgb(54, 217, 59);
}

</style>
