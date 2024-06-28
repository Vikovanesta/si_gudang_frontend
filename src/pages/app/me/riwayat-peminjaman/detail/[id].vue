<script setup lang="ts">
import { BorrowedItem } from '@/utils/types';
import tabsConsole from '@images/cards/tabs-console.png';
import { useRoute, useRouter } from 'vue-router';

definePage({
  meta: {
    subject: 'Academic',
  }
})

const borrowedItem= ref<BorrowedItem>();

const isLoading = ref<boolean>(false);

const borrowDate = ref('');
const returnDate = ref('');

const route = useRoute();
const router = useRouter();

const fetchBorrowedItem = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`/borrowed-items/${route.params.id}`);
    borrowedItem.value = response.data.data;
    console.log('borrowedItem:', response.data.data);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
};

const resolveStatusVariant = (status: string, is_cancelled: boolean) => {
  if (is_cancelled || status === 'cancelled') {
    return { color: 'error', text: 'DIBATALKAN', icon: 'ri-close-circle-line'}
  } else if (status === 'pending') {
    return { color: 'info', text: 'PENDING', icon: 'ri-time-line'}
  } else if (status === 'returned') {
    return { color: 'success', text: 'SELESAI', icon: 'ri-checkbox-circle-line'};
  } else if (status === 'borrowed') {
    return { color: 'warning', text: 'DIPINJAM', icon: 'ri-time-line'};
  } else {
    return { color: '', text: '', icon: ''};
  }
};

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  fetchBorrowedItem()
});
</script>

<template>
  <VCard>
    <VCardText>
    <VRow v-if="borrowedItem">
      <VCol
        cols="12"
        md="8"
      >

      <VAlert
        v-if="borrowedItem.status"
        :color="resolveStatusVariant(borrowedItem.status.name, borrowedItem.is_cancelled).color"
        variant="tonal"
        :icon="resolveStatusVariant(borrowedItem.status.name, borrowedItem.is_cancelled).icon"
      >
        <VAlertTitle class="mb-1" id="alert-title" >
          {{ resolveStatusVariant(borrowedItem.status.name, borrowedItem.is_cancelled).text }}
        </VAlertTitle>
      </VAlert>
    
        <h5 class="text-h5 my-4">
          Alat yang dipinjam
        </h5>
    
        <!-- 👉 Cart items -->
        <div
          class="border rounded-xl"
        >
          <div
            class="d-flex align-center gap-4 pa-5 position-relative flex-column flex-sm-row"
          >
            <div>
              <VImg
                width="140"
                :src="borrowedItem.item.image_url || tabsConsole"
              />
            </div>

            <div
              class="d-flex w-100"
              :class="(($vuetify.display.width <= 1280 && $vuetify.display.width >= 960) || $vuetify.display.width <= 700) ? 'flex-column' : 'flex-row'"
            >
              <div>
                <h6 class="text-h6 mb-2">
                  {{ borrowedItem.item.name }}
                </h6>
                <div class="d-flex align-center text-no-wrap gap-4 text-base">
                  <div>
                    <span class="me-2">Jumlah Dipinjam:</span>
                    <span class="text-primary">{{ borrowedItem.quantity }}</span>
                  </div>
                </div>
                <p class="text-base mb-0">
                  <span>Kategori: {{ borrowedItem.item.category.name }}</span>
                </p>

                <p class="text-base mb-0">
                  <span>Lokasi: {{ borrowedItem.item.warehouse.name }}</span>
                </p>

                <VSpacer />
    
                <div
                  class="d-flex flex-column"
                  :class="(($vuetify.display.width <= 1280 && $vuetify.display.width >= 960) || $vuetify.display.width <= 700) ? 'text-start' : 'text-end'"
                >
                  <div
                    class="d-flex flex-column"
                    :class="$vuetify.display.smAndUp ? 'gap-4' : 'gap-2'"
                  >
                  </div>
                </div>
              </div>
            </div>
          </div>
          <VDivider />
        </div>
    
        <v-container class="pa-0">
          <v-row justify="start">
            <v-col cols="auto">
              <div
                class="d-flex align-center gap-1 rounded-lg px-3 py-2 text-base mt-4"
                style="border: 1px solid rgb(var(--v-theme-primary));"
                @click="goBack"
              >
                <v-icon
                  id="btn-back"
                  icon="ri-arrow-left-line"
                  class="flip-in-rtl"
                  size="16"
                  color="primary"
                />
                <a href="javascript:void(0)" class="font-weight-medium">
                  Kembali
                </a>
              </div>
            </v-col>
          </v-row>
        </v-container>
      </VCol>
    
      <VCol
        cols="12"
        md="4"
      >
      <VForm>
    
        <VCard
          flat
          variant="outlined"
        >
          <!-- Form Title -->
          <VCardText>
            <div class="bg-var-theme-background rounded-xl pa-5 mt-4">
              <p class="text-h6">
                Data Peminjam
              </p>
              <div class="d-flex gap-12 mb-2">
                <div class="text-body-1 text-high-emphasis font-weight-medium">
                  Nama
                </div>
                <div class="text-body-1">
                  {{ borrowedItem.borrower.profile?.name ?? '-' }}
                </div>
              </div>
              <div class="d-flex gap-6 mb-2">
                <div class="text-body-1 text-high-emphasis font-weight-medium">
                  NISN/NIP
                </div>
                <div class="text-body-1">
                  {{ borrowedItem.borrower.profile?.nisn ?? borrowedItem?.borrower.profile?.nip }}
                </div>
              </div>
              <div class="d-flex gap-12 mb-2">
                <div class="text-body-1 text-high-emphasis font-weight-medium">
                  Kelas
                </div>
                <div class="text-body-1">
                  {{ borrowedItem?.borrower.profile?.class?.name ?? '-' }}
                </div>
              </div>
            </div>
          </VCardText>
    
          <!-- Form details -->
          <VCardText>
            <p class="text-h5">
              Data Peminjaman
            </p>

            <div class="text-sm text-high-emphasis">
              
              <div>
                <p class="text-h6 mt-4 font-weight-medium">
                  Jadwal Peminjaman
                </p>
                <div class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ formatDateTime(borrowedItem?.start_date ?? '-') }}
                </div>
              </div>

              <div>
                <p class="text-h6 mt-4 font-weight-medium">
                  Jadwal Pengembalian
                </p>
                <div class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ formatDateTime(borrowedItem?.end_date ?? '-') }}
                </div>
              </div>

              <div>
                <p class="text-h6 mt-4 font-weight-medium">
                  Waktu Peminjaman
                </p>
                <div v-if="borrowedItem.borrowed_at" class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ formatDateTime(borrowedItem?.borrowed_at) }}
                </div>
                <div v-else class="text-body-1 text-high-emphasis font-weight-regular">
                  -
                </div>
              </div>

              <div>
                <p class="text-h6 mt-4 font-weight-medium">
                  Waktu Pengembalian
                </p>
                <div v-if="borrowedItem.returned_at" class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ formatDateTime(borrowedItem?.returned_at) }}
                </div>
                <div v-else class="text-body-1 text-high-emphasis font-weight-regular">
                  -
                </div>
              </div>

              <div>
                <p class="text-h6 mt-4 font-weight-medium">
                  Mata pelajaran
                </p>
                <div class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ borrowedItem?.subject?.name ?? '-' }}
                </div>
              </div>

              <div>
                <p class="text-h6 mt-4 font-weight-medium">
                  Keterangan
                </p>
                <div class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ borrowedItem.purpose ?? '-'}}
                </div>
              </div>
              
            </div>
          </VCardText>
        </VCard>

      </VForm>
      </VCol>
    </VRow>
    </VCardText>
  </VCard>
</template>

<style lang="scss">
.checkout-item-remove-btn {
  position: absolute;
  inset-block-start: 10px;
  inset-inline-end: 10px;
}
</style>
