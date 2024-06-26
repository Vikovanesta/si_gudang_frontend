<script setup lang="ts">
import { BorrowingRequest, BorrowingRequestStatus } from '@/utils/types';

definePage({
  meta: {
    subject: 'Academic',
  }
})

const borrowingRequests = ref<BorrowingRequest[]>([])
const borrowingRequestStatuses = ref<BorrowingRequestStatus[]>([])
const totalBorrowingRequests = ref(0)

const fetchBorrowingRequests = async () => {
  try {
    const response = await axios.get('/me/borrowing-requests', {
      params: {
        q: searchQuery.value,
        status_id: selectedStatusId.value,
        page_size: itemsPerPage.value,
        page: page.value,
        sort_by: sortBy.value,
        sort_direction: orderBy.value,
      }
    
    })
    borrowingRequests.value = response.data.data
    totalBorrowingRequests.value = response.data.meta.total
    console.log('borrowingRequests', borrowingRequests.value)
    console.log('totalBorrowingRequests', totalBorrowingRequests.value)
  } catch (error) {
    console.error(error)
  }
}

const fetchBorrowingRequestStatuses = async () => {
  try {
    const response = await axios.get('/borrowing-request-statuses')
    borrowingRequestStatuses.value = response.data.data
    console.log('borrowingRequestStatuses', borrowingRequestStatuses.value)
  } catch (error) {
    console.error(error)
  }
}


const searchQuery = ref('')
const selectedStatusId = ref<number>()
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

// 👉 headers
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Total Item', key: 'total_item', sortable: false },
  { title: 'Waktu Pengambilan', key: 'borrowing_date' },
  { title: 'Status', key: 'status', sortable: false},
  { title: 'Actions', key: 'actions', sortable: false },
]

// 👉 Borrowing request variant resolver
const resolveStatusVariant = (status: string) => {
  if (status === 'pending')
    return { status: status, chip: { color: 'info', status:'Diajukan' } }
  if (status === 'approved')
    return { status: status, chip: { color: 'success', status:'Disetujui' } }
  if (status === 'rejected')
    return { status: status, chip: { color: 'error', status:'Ditolak' } }
  if (status === 'revised')
    return { status: status, chip: { color: 'warning', status:'Revisi' } }

  return { status: status, chip: { variant: 'text', status: 'Diajukan' } }
}

const debouncedFetchBorrowingRequests = useDebounceFn(fetchBorrowingRequests, 300)

watch(searchQuery, () => {
  debouncedFetchBorrowingRequests()
})

watch([selectedStatusId, page, sortBy, orderBy], () => {
  fetchBorrowingRequests()
})

onMounted(() => {
  fetchBorrowingRequestStatuses()
  fetchBorrowingRequests()
})
</script>

<template>
  <section v-if="borrowingRequests">

    <VCard id="borrowing-request-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <VSpacer />

        <div class="d-flex align-center flex-wrap gap-4">
          <!-- 👉 Search  -->
          <div style="inline-size: 300px;">
            <VTextField
              id="search"
              v-model="searchQuery"
              placeholder="Search Invoice"
            />
          </div>

          <div style="inline-size: 200px;">
            <VSelect
              id="select-status"
              v-model="selectedStatusId"
              placeholder="Status Pengajuan"
              clearable
              clear-icon="ri-close-line"
              :items="borrowingRequestStatuses"
              :item-title="'name'"
              :item-value="'id'"
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
        :items-length="totalBorrowingRequests"
        :headers="headers"
        :items="borrowingRequests"
        item-value="id"
        class="text-no-wrap rounded-0"
        @update:options="updateOptions"
      >
        <!-- id -->
        <template #item.id="{ item }">
          <RouterLink :to="{ name: 'app-status-pengajuan-alat-detail-id', params: { id: item.id } }" :id="`id-${item.id}`" >
            #{{ item.id }}
          </RouterLink>
        </template>

        <!-- Total -->
        <template #item.total_item="{ item }">
          <div :id="`total-item-${item.id}`" >
            {{ item.borrowed_items_count }}
          </div>
        </template>

        <!-- Date -->
        <template #item.borrowing_date="{ item }">
          <div :id="`borrow-date-${item.id}`">
            {{ formatDateTime(item.details[0].start_date) }}
          </div>
        </template>

        <!-- Balance -->
        <template #item.status="{ item }">
          <VChip
            :id="`status-${item.id}`"
            :color="resolveStatusVariant(item.status).chip.color"
            size="small"
          >
            {{ item.status }}
          </VChip>
        </template>

        <!-- Actions -->
        <template #item.actions="{ item }">
          <div class="text-no-wrap">
            <IconBtn
              :id="`btn-view-${item.id}`"
              size="small"
              :to="{ name: 'app-status-pengajuan-alat-detail-id', params: { id: item.id } }"
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
              {{ paginationMeta({ page, itemsPerPage }, totalBorrowingRequests) }}
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
                :disabled="page >= Math.ceil(totalBorrowingRequests / itemsPerPage)"
                @click="page >= Math.ceil(totalBorrowingRequests / itemsPerPage) ? page = Math.ceil(totalBorrowingRequests / itemsPerPage ) : page++ "
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
      <VCardTitle>No Invoice Found</VCardTitle>
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
