<script setup lang="ts">
import { Warehouse } from '@/utils/types';

interface Props {
  warehouse?: Warehouse
  isDialogVisible: boolean
}
interface Emit {
  (e: 'update:isDialogVisible', value: boolean): void
  (e: 'submitted'): void
}

const props = withDefaults(defineProps<Props>(), {
  warehouse: () => ({
    id: 0,
    name: '',
  }),
})

const emit = defineEmits<Emit>()

const warehouse = ref<ItemCategory>(structuredClone(toRaw(props.warehouse)))
const isSubmitting = ref(false)

const resetForm = () => {
  emit('update:isDialogVisible', false)
  warehouse.value = structuredClone(toRaw(props.warehouse))
}

const onFormSubmit = () => {
  console.log('Category: ', warehouse.value)
  if (warehouse.value.id > 0) {
    updateWarehouse()
  } else {
    addWarehouse()
  }
}

const addWarehouse = async () => {
  isSubmitting.value = true
  try {
    await axios.post('/warehouses', {
      name: warehouse.value.name,
    })
    emit('update:isDialogVisible', false)
    emit('submitted')
    console.log('Warehouse added')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}

const updateWarehouse = async () => {
  isSubmitting.value = true
  try {
    await axios.post(`/warehouses/${warehouse.value.id}?_method=PUT`, {
      name: warehouse.value.name,
    })
    emit('update:isDialogVisible', false)
    emit('submitted')
    console.log('Warehouse updated')
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitting.value = false
  }
}


watch([props], () => {
  if (props.warehouse.id > 0) {
    warehouse.value = structuredClone(toRaw(props.warehouse))
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
      v-if="props.warehouse"
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
            {{ props.warehouse.name ? 'Edit Data' : 'Tambah Data' }} Gudang
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
                v-model="warehouse.name"
                label="Nama Gudang"
                placeholder="Nama Gudang"
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
