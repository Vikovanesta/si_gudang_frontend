<script setup lang="ts">
import { Item, ItemCategory, Material, Warehouse } from '@/utils/types';

interface Props {
  item?: Item
  material?: Material
  isDialogVisible: boolean
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submitted'): void
}

const props = withDefaults(defineProps<Props>(), {
  material: () => ({
    id: 0,
    name: '',
  }),
})

const emit = defineEmits<Emit>()

const material = ref<Material>(structuredClone(toRaw(props.material)))
const isSubmitting = ref(false)

const resetForm = () => {
  emit('update:isDialogVisible', false)
  material.value = structuredClone(toRaw(props.material))
}

const onFormSubmit = () => {
  console.log('Material: ', material.value)
  if (material.value.id > 0) {
    updateMaterial()
  } else {
    addMaterial()
  }
}

const addMaterial = async () => {
  isSubmitting.value = true
  try {
    await axios.post('/materials', {
      name: material.value.name,
      material_category_id: 1,
    })
    emit('update:isDialogVisible', false)
    emit('submitted')
    console.log('Material added')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const updateMaterial = async () => {
  isSubmitting.value = true
  try {
    await axios.post(`/materials/${material.value.id}?_method=PUT`, {
      name: material.value.name,
    })
    emit('update:isDialogVisible', false)
    emit('submitted')
    console.log('Material updated')
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

watch([props], () => {
  if (props.material.id > 0) {
    material.value = structuredClone(toRaw(props.material))
  }
})

</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900 "
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard
      v-if="props.material"
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
            {{ props.material.name ? 'Edit Data' : 'Tambah Data' }} Material
          </h4>
        </div>

        <!-- Form -->
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
            <!-- Item Name -->
            <VCol
              cols="12"
            >
              <VTextField
                v-model="material.name"
                label="Nama Material"
                placeholder="Nama Material"
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
