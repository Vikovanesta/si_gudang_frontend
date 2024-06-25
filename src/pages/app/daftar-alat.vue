<script setup lang="ts">
import { Item } from '@/utils/types';
import DaftarAlatItem from '@/views/app/daftar-alat/DaftarAlatItem.vue';

definePage({
  meta: {
    subject: 'Academic',
  }
})

const items = ref<Item[]>([])
const isLoading = ref<boolean>(false)
const pagination = ref<any>(null)

const fetchItems = async (page = 1) => {
  isLoading.value = true
  try {
    const response = await axios.get('/items?page_size=8&page=' + page)
    items.value = response.data.data
    pagination.value = response.data.meta
    console.log('Response: ', response)
    console.log('items: ', items)
  } catch (error) {
    console.error('Failed to fetch items:', error)
  } finally {
    isLoading.value = false
  }
};

onMounted(() => {
  fetchItems()
});

const goToPage = (page: number) => {
  fetchItems(page);
};

</script>

<template>
  <div>
    <template v-if="isLoading">
      <div class="d-flex flex-column justify-center align-center h-screen">
        <VProgressCircular
          id="loading-circle"
          indeterminate
          color="primary"
          size="70"
          width="7"
        />
      </div>
    </template>
    <template v-else>
      <VRow class="match-height">
        <VCol
          v-for="item in items"
          :key="item.id"
          cols="12"
          md="6"
          sm="12"
        >
          <DaftarAlatItem v-bind="item" />
        </VCol>
      </VRow>
      <!-- Pagination controls -->
      <v-row justify="center">
        <v-col cols="auto" class="text-center">
          <v-btn
            v-if="pagination && pagination.current_page > 1"
            id="btn-prev"
            @click="goToPage(pagination.current_page - 1)"
            color="primary"
          >
            Previous
          </v-btn>
        </v-col>
        <v-col cols="auto" class="text-center font-weight-medium">
          <span v-if="pagination">Page {{ pagination.current_page }} of {{ pagination.last_page }}</span>
        </v-col>
        <v-col cols="auto" class="text-center">
          <v-btn
            v-if="pagination && pagination.current_page < pagination.last_page"
            id="btn-next"
            @click="goToPage(pagination.current_page + 1)"
            color="primary"
            class="px-8"
          >
            Next
          </v-btn>
        </v-col>
      </v-row>
    </template>
  </div>
</template>

<style lang="scss">
@use "@core/scss/template/libs/apex-chart.scss";
</style>
