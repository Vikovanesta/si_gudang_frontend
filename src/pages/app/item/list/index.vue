<script setup lang="ts">
import { Item } from '@/utils/types';
import AddEditItemDialog from '@/views/app/item/AddEditItemDialog.vue';

definePage({
  meta: {
    subject: 'Admin',
  }
})

const isAddItemDialogVisible = ref(false)
const isEditItemDialogVisible = ref(false)
const isDeleteItemDialogVisible = ref(false)

const searchQuery = ref('')
const selectedRows = ref<string[]>([])

// Data table options
const itemsPerPage = ref(10)
const page = ref(1)
const sortBy = ref()
const orderBy = ref()

// Update data table options
const updateOptions = (options: any) => {
  page.value = options.page
  sortBy.value = options.sortBy[0]?.key
  orderBy.value = options.sortBy[0]?.order
}

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nama Alat', key: 'item'},
  { title: 'Material', key: 'material', sortable: false },
  { title: 'Kategori', key: 'category', sortable: false},
  { title: 'Jumlah', key: 'stock'},
  { title: 'Gudang', key: 'warehouse',},
  { title: 'Aksi', key: 'actions', sortable: false },
]

const items = ref<Item[]>([])
const totalItems = ref(0)

const fetchItems = async (page = 1) => {
  try {
    const response = await axios.get('/items', {
      params: {
        q: searchQuery.value,
        page_size: itemsPerPage.value,
        page: page,
        sort_by: sortBy.value,
        sort_direction: orderBy.value,
      }
    })
    items.value = response.data.data
    totalItems.value = response.data.meta.total
    console.log('items: ', items)
    console.log('page: ', page)
  } catch (error) {
    console.error('Failed to fetch items:', error)
  }
}

const debouncedFetchItems = useDebounceFn(fetchItems, 300)

watch(searchQuery, () => {
  debouncedFetchItems()
})

watch([page, sortBy, orderBy], () => {
  fetchItems()
})

onMounted(() => {
  fetchItems()
})
</script>

<template>
  <section v-if="items">

    <VCard id="registration-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <VBtn
          prepend-icon="ri-add-line"
          @click="isAddItemDialogVisible = !isAddItemDialogVisible"
        >
          TAMBAH ALAT
        </VBtn>
        <AddEditItemDialog v-model:isDialogVisible="isAddItemDialogVisible" @item-submitted="fetchItems" />

        <!-- <VBtn
          prepend-icon="ri-delete-bin-7-line"
          color="error"
          :to="{ name: 'apps-invoice-add' }"
        >
          HAPUS DIPILIH
        </VBtn> -->

        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 300px;">
            <VTextField
              id="search"
              v-model="searchQuery"
              placeholder="Search"
            />
          </div>
        </div>
      </VCardText>

      <!-- SECTION Datatable -->
      <VDataTableServer
        v-model="selectedRows"
        v-model:items-per-page="itemsPerPage"
        v-model:page="page"
        show-select
        :items-length="totalItems"
        :headers="headers"
        :items="items"
        item-value="id"
        class="text-no-wrap rounded-0"
        @update:options="updateOptions"
      >
        <!-- id -->
        <template #item.id="{ item }">
          <div :id="`id-${item.id}`" >
            #{{ item.id }}
          </div>
        </template>

        <!-- Item -->
        <template #item.item="{ item }">
          <div class="d-flex align-center">
            <VAvatar
              size="34"
              :color="undefined"
              :variant="!item.image_url ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg
                v-if="item.image_url"
                :src="item.image_url"
              />
              <span v-else >{{ avatarText(item.name ? item.name : 'Alat') }}</span>
            </VAvatar>
            <div :id="`name-${item.id}`" class="d-flex flex-column text-base font-weight-medium mb-0">
              {{ item.name }}
            </div>
          </div>
        </template>

        <!-- Material -->
        <template #item.material="{ item }">
          <div :id="`material-${item.id}`">
            {{ item.material.name }}
          </div>
        </template>

        <!-- Item Category -->
        <template #item.category="{ item }">
          <div :id="`category-${item.id}`">
            {{ item.category.name }}
          </div>
        </template>

        <!-- Stock -->
        <template #item.stock="{ item }">
          <div :id="`stock-${item.id}`">
            {{ item.stock }}
          </div>
        </template>

        <!-- Warehouse -->
        <template #item.warehouse="{ item }">
          <div :id="`warehouse-${item.id}`">
            {{ item.warehouse.name }}
          </div>
        </template>

        <!-- TODO: Actions -->
        <template #item.actions="{ item }">
          <div class="text-no-wrap">
            <IconBtn
              :id="`btn-edit-${item.id}`"
              size="small"
              @click=""
            >
              <VIcon icon="ri-pencil-line" color="primary" size="25" />
            </IconBtn>

            <IconBtn
              :id="`btn-delete-${item.id}`"
              size="small"
              @click=""
            >
              <VIcon icon="ri-delete-bin-7-line" color="error" size="25" />
            </IconBtn>
          </div>
        </template>

        <!-- Pagination -->
        <template #bottom>
          <VDivider />

          <div class="d-flex justify-end flex-wrap gap-x-6 px-2 py-1">
            <div class="d-flex align-center gap-x-2 text-medium-emphasis text-base">
              Rows Per Page:
              <VSelect
                v-model="itemsPerPage"
                class="per-page-select"
                variant="plain"
                :items="[10, 20, 25, 50, 100]"
              />
            </div>

            <p class="d-flex align-center text-base text-high-emphasis me-2 mb-0">
              {{ paginationMeta({ page, itemsPerPage }, totalItems) }}
            </p>

            <div class="d-flex gap-x-2 align-center me-2">
              <VBtn
                id="btn-prev"
                class="flip-in-rtl"
                icon="ri-arrow-left-s-line"
                variant="text"
                density="comfortable"
                color="high-emphasis"
                :disabled="page <= 1"
                @click="page <= 1 ? page = 1 : page--"
              />

              <VBtn
                id="btn-next"
                class="flip-in-rtl"
                icon="ri-arrow-right-s-line"
                density="comfortable"
                variant="text"
                color="high-emphasis"
                :disabled="page >= Math.ceil(totalItems / itemsPerPage)"
                @click="page >= Math.ceil(totalItems / itemsPerPage) ? page = Math.ceil(totalItems / itemsPerPage ) : page++ "
              />
            </div>
          </div>
        </template>
      </VDataTableServer>
      <!-- !SECTION -->
    </VCard>
  </section>
  <section v-else>
    <VCard>
      <VCardTitle>Tidak ada pengajuan akun</VCardTitle>
    </VCard>
  </section>
</template>

<style lang="scss">
#invoice-list {
  .invoice-list-actions {
    inline-size: 8rem;
  }
}
</style>
