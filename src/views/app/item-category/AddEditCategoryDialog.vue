<script setup lang="ts">
import { ItemCategory } from '@/utils/types';

interface Props {
  category?: ItemCategory
  isDialogVisible: boolean
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submitted'): void
}

const props = withDefaults(defineProps<Props>(), {
  category: () => ({
    id: 0,
    name: '',
  }),
})

const emit = defineEmits<Emit>()

const category = ref<ItemCategory>(structuredClone(toRaw(props.category)))
const isSubmitting = ref(false)

const resetForm = () => {
  emit('update:isDialogVisible', false)
  category.value = structuredClone(toRaw(props.category))
}

const onFormSubmit = () => {
  console.log('Category: ', category.value)
  if (category.value.id > 0) {
    updateCategory()
  } else {
    addCategory()
  }
}

const addCategory = async () => {
  isSubmitting.value = true
  try {
    await axios.post('/items/categories', {
      name: category.value.name,
    })
    emit('update:isDialogVisible', false)
    emit('submitted')
    console.log('Category added')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const updateCategory = async () => {
  isSubmitting.value = true
  try {
    await axios.post(`/items/categories/${category.value.id}?_method=PUT`, {
      name: category.value.name,
    })
    emit('update:isDialogVisible', false)
    emit('submitted')
    console.log('Category updated')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}


watch([props], () => {
  if (props.category.id > 0) {
    category.value = structuredClone(toRaw(props.category))
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
      v-if="props.category"
      class="pa-sm-11 pa-3"
    >
      <VCardText class="pt-5">
        <!-- 👉 dialog close btn -->
        <DialogCloseBtn
          id="btn-close"
          variant="text"
          size="default"
          @click="resetForm"
        />

        <!-- 👉 Title -->
        <div class="text-center mb-6">
          <h4 class="text-h4 mb-2">
            {{ props.category.name ? 'Edit Data' : 'Tambah Data' }} Kategori
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
                id="input-name"
                v-model="category.name"
                label="Nama Kategori"
                placeholder="Nama Kategori"
              />
            </VCol>

            <!-- 👉 Submit and Cancel button -->
            <VCol
              cols="12"
              class="text-center"
            >
            <VBtn
                id="btn-cancel"
                variant="outlined"
                color="secondary"
                class="me-3"
                @click="resetForm"
              >
                Batal
              </VBtn>

              <VBtn
                id="btn-submit"
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
