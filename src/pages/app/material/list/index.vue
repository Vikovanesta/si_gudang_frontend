<script setup lang="ts">
import { Material } from '@/utils/types';
import AddEditMaterialDialog from '@/views/app/material/AddEditMaterialDialog.vue';
import DeleteMaterialDialog from '@/views/app/material/DeleteMaterialDialog.vue';

definePage({
  meta: {
    subject: 'Admin',
  }
})

const isAddMaterialDialogVisible = ref(false)
const isEditMaterialDialogVisible = ref(false)
const isDeleteMaterialDialogVisible = ref(false)

const headers = [
  { title: 'ID', key: 'id' },
  { title: 'Nama Material', key: 'name'},
  { title: 'Aksi', key: 'actions', sortable: false },
]

const materials = ref<Material[]>([])
const totalMaterials = ref(0)

const fetchMaterials = async () => {
  try {
    const response = await axios.get('/materials', {
      params: {
        q: searchQuery.value,
        page_size: itemsPerPage.value,
        page: page.value,
        sort_by: sortBy.value,
        sort_direction: orderBy.value,
      }
    })
    materials.value = response.data.data
    totalMaterials.value = response.data.meta.total
    console.log('materials: ', materials.value)
  } catch (error) {
    console.error('Failed to fetch materials:', error)
  }
}

const currentMaterial = ref<Material>()

const editMaterial = (material: Material) => {
  currentMaterial.value = material
  isEditMaterialDialogVisible.value = true
}

const deleteMaterial = (material: Material) => {
  currentMaterial.value = material
  isDeleteMaterialDialogVisible.value = true
}

const debouncedFetchMaterials = useDebounceFn(fetchMaterials, 300)

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

watch(searchQuery, () => {
  debouncedFetchMaterials()
})

watch([page, sortBy, orderBy], () => {
  fetchMaterials()
})

onMounted(() => {
  fetchMaterials()
})
</script>

<template>
  <section v-if="materials">

    <VCard id="registration-list">
      <VCardText class="d-flex align-center flex-wrap gap-4">
        <VBtn
          prepend-icon="ri-add-line"
          @click="isAddMaterialDialogVisible = !isAddMaterialDialogVisible"
        >
          TAMBAH MATERIAL
        </VBtn>
        <AddEditMaterialDialog v-model:isDialogVisible="isAddMaterialDialogVisible" @submitted="fetchMaterials" />
        <AddEditMaterialDialog v-model:isDialogVisible="isEditMaterialDialogVisible" @submitted="fetchMaterials" :material="currentMaterial" />
        <DeleteMaterialDialog v-model:isDialogVisible="isDeleteMaterialDialogVisible" @deleted="fetchMaterials" :id="currentMaterial?.id" />

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
        :items-length="totalMaterials"
        :headers="headers"
        :items="materials"
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

        <!-- Name -->
        <template #item.name="{ item }">
          <div :id="`name-${item.id}`">
            {{ item.name }}
          </div>
        </template>

        <template #item.actions="{ item }">
          <div class="text-no-wrap">
            <IconBtn
              :id="`btn-edit-${item.id}`"
              size="small"
              @click="editMaterial(item)"
            >
              <VIcon icon="ri-pencil-line" color="primary" size="25" />
            </IconBtn>

            <IconBtn
              :id="`btn-delete-${item.id}`"
              size="small"
              @click="deleteMaterial(item)"
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
              {{ paginationMeta({ page, itemsPerPage }, totalMaterials) }}
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
                :disabled="page >= Math.ceil(totalMaterials / itemsPerPage)"
                @click="page >= Math.ceil(totalMaterials / itemsPerPage) ? page = Math.ceil(totalMaterials / itemsPerPage ) : page++ "
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
      <VCardTitle>Tidak Ada Material</VCardTitle>
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
