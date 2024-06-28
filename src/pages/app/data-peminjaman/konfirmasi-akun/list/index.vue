<script setup lang="ts">
import { RegistrationRequest } from '@/utils/types';


definePage({
  meta: {
    subject: 'Admin',
  }
})

const registrationRequests = ref<RegistrationRequest[]>([])
const totalRegistrationRequests = ref(0)
const isSubmitting = ref(false)

const sendRequest = async (id: number, verify: number) => {
  isSubmitting.value = true
  try {
    const response = await axios.post(`/register/students/${id}`, {
      verify: verify
    })
    fetchRegistrationRequests()
    console.log('Response: ', response.data.data)
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const searchQuery = ref('')
const selectedStatus = ref<string>()
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

const fetchRegistrationRequests = async () => {
  try {
    const response = await axios.get('/register/students', {
      params: {
        q: searchQuery.value,
        status: selectedStatus.value,
        page_size: itemsPerPage.value,
        page: page.value,
        sort_by: sortBy.value,
        sort_direction: orderBy.value,
      }
    })
    registrationRequests.value = response.data.data
    totalRegistrationRequests.value = response.data.meta.total
    console.log('registrationRequests', registrationRequests.value)
  } catch (error) {
    console.error(error)
  }
}

// 👉 headers
const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nama', key: 'name'},
  { title: 'Kelas', key: 'class', sortable: false },
  { title: 'NISN', key: 'nisn' },
  { title: 'Tahun Masuk', key: 'year_in'},
  { title: 'Email', key: 'email', sortable: false},
  { title: 'Telepon', key: 'phone', sortable: false },
  { title: 'Status', key: 'status', sortable: false},
  { title: 'Aksi', key: 'actions', sortable: false },
]

// 👉 Borrowing request variant resolver
const resolveStatusVariant = (status: string) => {
  if (status === 'Pending')
    return { status: status, chip: { color: 'info', status:'Diajukan' } }
  if (status === 'Approved')
    return { status: status, chip: { color: 'success', status:'Disetujui' } }
  if (status === 'Rejected')
    return { status: status, chip: { color: 'error', status:'Ditolak' } }

  return { status: status, chip: { variant: 'text', status: 'Diajukan' } }
}

const registrationRequestStatuses = ref([
  { id: 1, name: 'Pending' },
  { id: 2, name: 'Approved' },
  { id: 3, name: 'Rejected' },
])

const debouncedFetchRegistrationRequests = useDebounceFn(fetchRegistrationRequests, 300)

watch(searchQuery, () => {
  debouncedFetchRegistrationRequests()
})

watch([selectedStatus, page, sortBy, orderBy], () => {
  fetchRegistrationRequests()
})

onMounted(() => {
  fetchRegistrationRequests()
})
</script>

<template>
  <section v-if="registrationRequests">

    <VCard id="registration-list">
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
              v-model="selectedStatus"
              placeholder="Status Pengajuan"
              clearable
              clear-icon="ri-close-line"
              :items="registrationRequestStatuses"
              :item-title="'name'"
              :item-value="'name'"
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
        :items-length="totalRegistrationRequests"
        :headers="headers"
        :items="registrationRequests"
        item-value="id"
        class="text-no-wrap rounded-0"
        @update:options="updateOptions"
      >
        <!-- id -->
        <template #item.id="{ item }">
          <div class="text-primary" :id="`id-${item.id}`" >
            #{{ item.id }}
          </div>
        </template>

        <!-- Name -->
        <template #item.name="{ item }">
          <div class="d-flex align-center">
            <div class="d-flex flex-column text-base font-weight-medium mb-0" :id="`name-${item.id}`" >
              {{ item.name }}
            </div>
          </div>
        </template>

        <!-- Class -->
        <template #item.class="{ item }">
          <div :id="`class-${item.id}`">
            {{ item.class.name }}
          </div>
        </template>

        <!-- NISN -->
        <template #item.nisn="{ item }">
          <div :id="`nisn-${item.id}`">
            {{ item.nisn }}
          </div>
        </template>

        <!-- Year in -->
        <template #item.year_in="{ item }">
          <div :id="`year-in-${item.id}`">
            {{ item.year_in }}
          </div>
        </template>

        <!-- Email -->
        <template #item.email="{ item }">
          <div :id="`email-${item.id}`">
            {{ item.email }}
          </div>
        </template>

        <!-- Phone -->
        <template #item.phone="{ item }">
          <div :id="`phone-${item.id}`">
            {{ item.phone }}
          </div>
        </template>

        <!-- Status -->
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
              :id="`btn-approve-${item.id}`"
              size="small"
              :loading="isSubmitting"
              :disabled="item.status !== 'Pending'"
              @click="sendRequest(item.id, 1)"
            >
              <VIcon icon="ri-checkbox-circle-fill" color="primary" size="30" />
            </IconBtn>

            <IconBtn
              :id="`btn-reject-${item.id}`"
              size="small"
              :loading="isSubmitting"
              :disabled="item.status !== 'Pending'"
              @click="sendRequest(item.id, 0)"
            >
              <VIcon icon="ri-forbid-2-line" color="error" size="30" />
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
              {{ paginationMeta({ page, itemsPerPage }, totalRegistrationRequests) }}
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
                :disabled="page >= Math.ceil(totalRegistrationRequests / itemsPerPage)"
                @click="page >= Math.ceil(totalRegistrationRequests / itemsPerPage) ? page = Math.ceil(totalRegistrationRequests / itemsPerPage ) : page++ "
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
