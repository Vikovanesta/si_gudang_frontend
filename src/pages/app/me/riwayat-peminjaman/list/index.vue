<script setup lang="ts">
import { BorrowedItem } from '@/utils/types';

definePage({
  meta: {
    subject: 'Academic',
  }
})

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
  { title: 'Jumlah', key: 'quantity'},
  { title: 'Gudang', key: 'warehouse', sortable: false},
  { title: 'Tanggal Pinjam', key: 'borrow_date',},
  { title: 'Tanggal Kembali', key: 'return_date',},
  { title: 'Status', key: 'status',},
  { title: 'Aksi', key: 'actions', sortable: false },
]


const borrowedItems = ref<BorrowedItem[]>([])
const totalBorrowedItems = ref(0)

const fetchBorrowedItems = async () => {
  try {
    const response = await axios.get('/me/borrowed-items', {
      params: {
        q: searchQuery.value,
        page_size: itemsPerPage.value,
        page: page.value,
        sort_by: sortBy.value,
        sort_direction: orderBy.value,
        request_status: 'approved'
      }
    })
    borrowedItems.value = response.data.data
    totalBorrowedItems.value = response.data.meta.total
    console.log('borrowedItems: ', borrowedItems.value)
    console.log('page: ', page.value)
  } catch (error) {
    console.error('Failed to fetch borrowed items:', error)
  }
}

const resolveStatusVariant = (status: string, is_cancelled: boolean) => {
  if (is_cancelled || status === 'cancelled')
    return { status: 'dibatalkan', chip: { color: 'error', status:'dibatalkan' } }
  if (status === 'pending')
    return { status: status, chip: { color: 'info', status:'pending' } }
  if (status === 'borrowed')
    return { status: 'dipinjam', chip: { color: 'warning', status:'dipinjam' } }
  if (status === 'returned')
    return { status: 'selesai', chip: { color: 'success', status:'selesai' } }

  return { status: 'pending', chip: { color: 'info', status: 'pending' } }
}

const debouncedFetchBorrowedItems = useDebounceFn(fetchBorrowedItems, 300)

watch(searchQuery, () => {
  debouncedFetchBorrowedItems()
})

watch([page, sortBy, orderBy], () => {
  fetchBorrowedItems()
})

onMounted(() => {
  fetchBorrowedItems()
})
</script>

<template>
  <section v-if="borrowedItems">

    <VCard id="registration-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">

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
        :items-length="totalBorrowedItems"
        :headers="headers"
        :items="borrowedItems"
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
              :variant="!item.item.image_url ? 'tonal' : undefined"
              class="me-3"
            >
              <VImg
                v-if="item.item.image_url"
                :src="item.item.image_url"
              />
              <span v-else >{{ avatarText(item.item.name ? item.item.name : 'Alat') }}</span>
            </VAvatar>
            <div :id="`item-name-${item.id}`" class="d-flex flex-column text-base font-weight-medium mb-0">
              {{ item.item.name }}
            </div>
          </div>
        </template>

        <!-- Quantity -->
        <template #item.quantity="{ item }">
          <div :id="`quantity-${item.id}`">
            {{ item.quantity }}
          </div>
        </template>

        <!-- Warehouse -->
        <template #item.warehouse="{ item }">
          <div :id="`warehouse-${item.id}`">
            {{ item.item.warehouse.name }}
          </div>
        </template>

        <!-- Borrow Date -->
        <template #item.borrow_date="{ item }">
          <div :id="`borrow-date-${item.id}`">
            {{ formatDateTime(item.start_date) }}
          </div>
        </template>

        <template #item.return_date="{ item }">
          <div v-if="item.returned_at" :id="`borrow-date-${item.id}`">
            {{ formatDateTime(item.returned_at)}}
          </div>
          <div v-else :id="`borrow-date-${item.id}`">
            -
          </div>
        </template>

        <!-- Status -->
        <template #item.status="{ item }">
          <VChip
            :id="`status-${item.id}`"
            :color="resolveStatusVariant(item.status?.name, item.is_cancelled).chip.color"
            size="small"
          >
            {{ resolveStatusVariant(item.status?.name, item.is_cancelled).status}}
          </VChip>
        </template>

        <template #item.actions="{ item }">
          <div class="text-no-wrap">

            <IconBtn
              :id="`btn-view-${item.id}`"
              size="small"
              :to="{ name: 'app-me-riwayat-peminjaman-detail-id', params: { id: item.id } }"
            >
              <VIcon icon="ri-eye-line" />
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
              {{ paginationMeta({ page, itemsPerPage }, totalBorrowedItems) }}
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
                :disabled="page >= Math.ceil(totalBorrowedItems / itemsPerPage)"
                @click="page >= Math.ceil(totalBorrowedItems / itemsPerPage) ? page = Math.ceil(totalBorrowedItems / itemsPerPage ) : page++ "
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
      <VCardTitle>Tidak ada riwayat peminjaman</VCardTitle>
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
