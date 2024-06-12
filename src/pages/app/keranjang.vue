<script setup lang="ts">
import CartContent from '@/views/app/keranjang/CartContent.vue';
import type { CheckoutData } from '@/views/wizard-examples/checkout/types';
import googleHome from '@images/pages/google-home.png';
import iphone11 from '@images/pages/iphone-11.png';

definePage({
  meta: {
    action: 'manage',
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
      name: 'Gudang B',
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
      name: 'Gudang B',
    },
    material: {
      id: 3,
      name: 'Besi',
    },
  },
]

const checkoutData = ref<CheckoutData>({
  cartItems: [
    {
      id: 1,
      name: 'Google - Google Home - White',
      seller: 'Google',
      inStock: true,
      rating: 4,
      price: 299,
      discountPrice: 359,
      image: googleHome,
      quantity: 1,
      estimatedDelivery: '18th Nov 2021',
    },
    {
      id: 2,
      name: 'Apple iPhone 11 (64GB, Black)',
      seller: 'Apple',
      inStock: true,
      rating: 4,
      price: 899,
      discountPrice: 999,
      image: iphone11,
      quantity: 1,
      estimatedDelivery: '20th Nov 2021',
    },
  ],
  promoCode: '',
  orderAmount: 1198,
  deliveryAddress: 'home',
  deliverySpeed: 'free',
  deliveryCharges: 0,
  addresses: [
    {
      title: 'John Doe (Default)',
      desc: '4135 Parkway Street, Los Angeles, CA, 90017',
      subtitle: '1234567890',
      value: 'home',
    },
    {
      title: 'ACME Inc.',
      desc: '87 Hoffman Avenue, New York, NY, 10016',
      subtitle: '1234567890',
      value: 'office',
    },
  ],
})

const currentStep = ref(0)
</script>

<template>
  <VCard>
    <VCardText>
      <!-- 👉 stepper content -->
      <CartContent
        v-model:current-step="currentStep"
        v-model:checkout-data="checkoutData"
        v-model:items="items"
      />
    </VCardText>
  </VCard>
</template>
