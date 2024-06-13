<script setup lang="ts">
import CartContent from '@/views/app/keranjang/CartContent.vue';

definePage({
  meta: {
    subject: 'Academic',
  }
})
</script>

<template>
  <VCard>
    <VCardText>
      <CartContent/>
    </VCardText>
  </VCard>
</template>
