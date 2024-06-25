<script setup lang="ts">
import { Item } from '@/utils/types';

interface Props {
  id: number
  isDialogVisible: boolean
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'deleted'): void
}

const props = withDefaults(defineProps<Props>(), {
  id: 0,
})
  
const emit = defineEmits<Emit>()

const isSubmitting = ref(false)

const resetForm = () => {
  emit('update:isDialogVisible', false)
}

const onFormSubmit = () => {
  deleteItem()
}

const deleteItem = async () => {
  isSubmitting.value = true
  try {
    const response = await axios.delete(`/materials/${props.id}`)
    console.log('Material deleted:', response.data)
    emit('deleted')
    emit('update:isDialogVisible', false)
  } catch (error) {
    console.error('Error deleting item:', error)
  } finally {
    isSubmitting.value = false
  }
}

onMounted(() => {
  console.log('Id: ', props.id)
})

</script>

<template>
  <VDialog
    :width="$vuetify.display.smAndDown ? 'auto' : 900 "
    :model-value="props.isDialogVisible"
    @update:model-value="val => $emit('update:isDialogVisible', val)"
  >
    <VCard
      v-if="props.id"
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
          <h3 class="text-h3 mb-2">
            Hapus Material
          </h3>
        </div>

        <!-- Keterangan -->
        <div class="text-center mb-6">
          <span class="text-h6 mb-2">
            Apakah Anda yakin ingin menghapus material ini?
          </span>
        </div>

        <!-- Form -->
        <VForm @submit.prevent="onFormSubmit">
          <VRow>
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
                color="error"
                :loading="isSubmitting"
              >
                Hapus
              </VBtn>

            </VCol>
          </VRow>
        </VForm>
      </VCardText>
    </VCard>
  </VDialog>
</template>
