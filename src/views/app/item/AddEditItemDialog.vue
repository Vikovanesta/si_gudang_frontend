<script setup lang="ts">
import { Item, ItemCategory, Material, Warehouse } from '@/utils/types';

interface Props {
  item?: Item
  isDialogVisible: boolean
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'itemSubmitted'): void
}

const props = withDefaults(defineProps<Props>(), {
  item: () => ({
    id: 0,
    name: '',
    stock: 0,
    max_stock: 1,
    image_url: '',
    is_in_cart: false,
    warehouse: null,
    category: null,
    material: null,
  }),
})

const emit = defineEmits<Emit>()

const item = ref<Item>(structuredClone(toRaw(props.item)))
const image = ref<File | null>(null)
const isSubmitting = ref(false)
const selectedWarehouseId = ref<number>(props.item.warehouse?.id)
const selectedCategoryId = ref<number>(props.item.category?.id)
const selectedMaterialId = ref<number>(props.item.material?.id)

const resetForm = () => {
  emit('update:isDialogVisible', false)
  item.value = structuredClone(toRaw(props.item))
}

const onFormSubmit = () => {
  console.log('Item: ', item.value)
  console.log('Image: ', image.value)
  if (item.value.id > 0) {
    updateItem()
  } else {
    addItem()
  }

}

const addItem = async () => {
  isSubmitting.value = true
  const formData = new FormData();
  formData.append('name', item.value.name);
  formData.append('max_stock', String(item.value.max_stock));
  if (item.value.warehouse) formData.append('warehouse_id', String(selectedWarehouseId.value));
  if (item.value.category) formData.append('category_id', String(selectedCategoryId.value));
  if (item.value.material) formData.append('material_id', String(selectedMaterialId.value));
  if (image.value) formData.append('image', image.value);
  try {
    await axios.post('/items', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    emit('update:isDialogVisible', false)
    emit('itemSubmitted')
    console.log('Item added')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const updateItem = async () => {
  isSubmitting.value = true
  const formData = new FormData();
  formData.append('name', item.value.name);
  formData.append('max_stock', String(item.value.max_stock));
  if (item.value.warehouse) formData.append('warehouse_id', String(selectedWarehouseId.value));
  if (item.value.category) formData.append('category_id', String(selectedCategoryId.value));
  if (item.value.material) formData.append('material_id', String(selectedMaterialId.value));
  if (image.value) formData.append('image', image.value);
  try {
    await axios.post(`/items/${item.value.id}?_method=PUT`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    emit('update:isDialogVisible', false)
    emit('itemSubmitted')
    console.log('Item updated')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const materials = ref<Material[]>([])
const categories = ref<ItemCategory[]>([])
const warehouses = ref<Warehouse[]>([])

const fetchMaterials = async () => {
  try {
    const { data } = await axios.get('/materials')
    materials.value = data.data
    console.log('Materials: ', materials.value)
  } catch (error) {
    console.error(error)
  }
}

const fetchCategories = async () => {
  try {
    const { data } = await axios.get('/items/categories')
    categories.value = data.data
    console.log('Categories: ', categories.value)
  } catch (error) {
    console.error(error)
  }
}

const fetchWarehouses = async () => {
  try {
    const { data } = await axios.get('/warehouses')
    warehouses.value = data.data
    console.log('Warehouses: ', warehouses.value)
  } catch (error) {
    console.error(error)
  }
}

watch(() => props.item, (value) => {
  item.value = structuredClone(toRaw(value))
  selectedWarehouseId.value = value.warehouse?.id
  selectedCategoryId.value = value.category?.id
  selectedMaterialId.value = value.material?.id
})

onMounted(() => {
  fetchMaterials()
  fetchCategories()
  fetchWarehouses()
  console.log('Item: ', item.value)
  console.log('Props: ', props.item)
})

</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900 "
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard
      v-if="props.item"
      class="pa-sm-11 pa-3"
    >
      <VCardText class="pt-5">
        <!-- 👉 dialog close btn -->
        <DialogCloseBtn
          variant="text"
          size="default"
          @click="resetForm"
        />

        <!-- 👉 Title -->
        <div class="text-center mb-6">
          <h4 class="text-h4 mb-2">
            {{ props.item.name ? 'Edit Data' : 'Tambah Data' }} Alat
          </h4>
        </div>

        <!-- Form -->
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <!-- Item Name -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="item.name"
                label="Nama Alat"
                placeholder="Nama Alat"
              />
            </VCol>

            <!-- Item Stock -->
            <VCol
              cols="12"
              md="6"
            >
              <VTextField
                v-model="item.max_stock"
                label="Jumlah"
                placeholder="1"
                type="number"
                min="1"
              />
            </VCol>

            <!-- Select Material -->
            <VCol cols="12">
              <VSelect
              id="select-material"
              v-model="selectedMaterialId"
              placeholder="Pilih Material"
              clearable
              clear-icon="ri-close-line"
              :items="materials"
              :item-title="'name'"
              :item-value="'id'"
            />
            </VCol>

            <!-- Select Category -->
            <VCol cols="12">
              <VSelect
              id="select-category"
              v-model="selectedCategoryId"
              placeholder="Pilih Kategori"
              clearable
              clear-icon="ri-close-line"
              :items="categories"
              :item-title="'name'"
              :item-value="'id'"
            />
            </VCol>

            <!-- Select Warehouse -->
            <VCol cols="12">
              <VSelect
              id="select-warehouse"
              v-model="selectedWarehouseId"
              placeholder="Pilih Gudang"
              clearable
              clear-icon="ri-close-line"
              :items="warehouses"
              :item-title="'name'"
              :item-value="'id'"
            />
            </VCol>
            
            <!-- Item Image -->
            <VCol cols="12">
              <VFileInput
                label="Gambar Alat"
                accept="image/png, image/jpeg, image/jpg"
                prepend-icon="ri-camera-line"
                @change="e => image = e.target.files[0]"
                show-size
              />
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol
              cols="12"
              class="text-center"
            >
            <VBtn
                variant="outlined"
                color="secondary"
                class="me-3"
                @click="resetForm"
              >
                Batal
              </VBtn>

              <VBtn
                type="submit"
                :loading="isSubmitting"
              >
                Simpan
              </VBtn>

            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
