<script setup lang="ts">
import { BorrowedItem, BorrowingRequest, BorrowingRequestDetail } from '@/utils/types';
import tabsConsole from '@images/cards/tabs-console.png';
import emptyCartImg from '@images/pages/empty-cart.png';
import { format, fromZonedTime, toZonedTime } from 'date-fns-tz';
import { useRoute, useRouter } from 'vue-router';

definePage({
  meta: {
    subject: 'Academic',
  }
})

const borrowingRequest = ref<BorrowingRequest | null>(null);
const borrowingRequestDetail = ref<BorrowingRequestDetail | null>(null);
const borrowedItems = ref<BorrowedItem[]>([]);
const isLoading = ref<boolean>(false);
const isSubmitting = ref<boolean>(false);
const isSuccess = ref<boolean>(false);
const isInputDisabled = ref<boolean>(false);
const purpose = ref('');
const borrowDate = ref('');
const returnDate = ref('');
const route = useRoute();
const router = useRouter();
const borrowedItemsLength = computed(() => borrowedItems.value.length);

const sendRequest = async (is_approved: number) => {
  isSubmitting.value = true;
  try {
    const response = await axios.post(`/borrowing-requests/${route.params.id}?_method=PUT`, {
      is_approved: is_approved,
    });
    if (response.status === 201) {
      fetchBorrowingRequest();
    }
    console.log('Response:', response.data);

  } catch (error) {
    console.error('Error:', error);
  } finally {
    isSubmitting.value = false;
  }
};

const fetchBorrowingRequest = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get(`/borrowing-requests/${route.params.id}`);
    borrowingRequest.value = response.data.data;
    borrowingRequestDetail.value = response.data.data.details[0];
    borrowedItems.value = response.data.data.details[0].borrowed_items;
    borrowDate.value = response.data.data.details[0].start_date;
    returnDate.value = response.data.data.details[0].end_date;
    if (borrowingRequest.value?.status === 'pending' && borrowingRequest.value.is_revised) {
      isInputDisabled.value = false;
    } else {
      isInputDisabled.value = true;
    }

    console.log('borrowingRequest:', borrowingRequest.value);
    console.log('borrowingRequestDetail:', borrowingRequestDetail.value);
    console.log('borrowedItems:', borrowedItems.value);
  } catch (error) {
    console.error('Error:', error);
  } finally {
    isLoading.value = false;
  }
};

const timeZone = 'Asia/Jakarta';
const displayBorrowDate = computed({
  get() {
    return borrowDate.value ? format(toZonedTime(new Date(borrowDate.value), timeZone), 'yyyy-MM-dd HH:mm') : '';
  },
  set(value) {
    borrowDate.value = fromZonedTime(value, timeZone).toISOString();
  }
});

const displayReturnDate = computed({
  get() {
    return returnDate.value ? format(toZonedTime(new Date(returnDate.value), timeZone), 'yyyy-MM-dd HH:mm') : '';
  },
  set(value) {
    returnDate.value = fromZonedTime(value, timeZone).toISOString();
  }
})

const resolveStatusVariant = (status: string) => {
  if ((status === 'pending' && borrowingRequest.value?.is_revised) || status === 'revised') {
    return { color: 'warning', text: 'REVISI', icon: 'ri-pencil-line'}
  } else if (status === 'pending') {
    return { color: 'info', text: 'DIAJUKAN', icon: 'ri-time-line'}
  } else if (status === 'approved') {
    return { color: 'success', text: 'DISETUJUI', icon: 'ri-checkbox-circle-line'};
  } else if (status === 'rejected') {
    return { color: 'error', text: 'DITOLAK', icon: 'ri-close-circle-line'};
  } else {
    return { color: '', text: '', icon: ''};
  }
};

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  fetchBorrowingRequest()
});
</script>

<template>
  <VCard>
    <VCardText>
    <VRow v-if="borrowedItemsLength >= 0">
      <VCol
        cols="12"
        md="8"
      >

      <VAlert
        v-if="borrowingRequest?.status"
        :color="resolveStatusVariant(borrowingRequest?.status ? borrowingRequest.status : 'pending').color"
        variant="tonal"
        :icon="resolveStatusVariant(borrowingRequest?.status ? borrowingRequest.status : 'pending').icon"
      >
        <VAlertTitle class="mb-1" id="alert-title" >
          {{ resolveStatusVariant(borrowingRequest?.status ? borrowingRequest.status : 'pending').text }}
        </VAlertTitle>
      </VAlert>
    
        <h5 class="text-h5 my-4">
          Alat yang dipinjam
        </h5>
    
        <!-- 👉 Cart items -->
        <div
          v-if="borrowedItemsLength > 0  "
          class="border rounded-xl"
        >
          <template
            v-for="borrowedItem in borrowedItems"
            :key="borrowedItem.id"
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
                      <span class="text-disabled me-2">Tersedia:</span>
                      <span class="text-primary">{{ borrowedItem.item.stock }}</span>
                    </div>
                    <VChip
                      :color="'success'"
                      size="small"
                    >
                      {{ borrowedItem.item.warehouse.name }}
                    </VChip>
                  </div>
    
                  <VTextField
                    :id="`quantity-${borrowedItem.id}`"
                    v-model.number="borrowedItem.quantity"
                    type="number"
                    density="compact"
                    style="inline-size: 9.375rem;"
                    class="my-4"
                    min = "1"
                    Label="Jumlah"
                    :disabled="isInputDisabled"
                  />
                </div>
    
                <VSpacer />
    
                <div
                  class="d-flex flex-column"
                  :class="(($vuetify.display.width <= 1280 && $vuetify.display.width >= 960) || $vuetify.display.width <= 700) ? 'text-start' : 'text-end'"
                >
                  <div
                    class="d-flex flex-column"
                    :class="$vuetify.display.smAndUp ? 'gap-4' : 'gap-2'"
                  >
                    <p class="text-base mb-0">
                      <span>Material: {{ borrowedItem.item.material.name }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <VDivider />
          </template>
        </div>
    
        <!-- 👉 Empty Cart -->
        <div v-else>
          <VImg :src="emptyCartImg" />
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
                  {{ borrowingRequest?.sender.profile?.name }}
                </div>
              </div>
              <div class="d-flex gap-6 mb-2">
                <div class="text-body-1 text-high-emphasis font-weight-medium">
                  NISN/NIP
                </div>
                <div class="text-body-1">
                  {{ borrowingRequest?.sender.profile?.nisn ?? borrowingRequest?.sender.profile?.nip }}
                </div>
              </div>
              <div class="d-flex gap-12 mb-2">
                <div class="text-body-1 text-high-emphasis font-weight-medium">
                  Kelas
                </div>
                <div class="text-body-1">
                  {{ borrowingRequest?.sender.profile?.class?.name ?? '-' }}
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
              
              <div v-if="isInputDisabled">
                <p class="text-h6 mt-4 font-weight-medium">
                  Tanggal Peminjaman
                </p>
                <div class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ formatDateTime(borrowingRequestDetail?.start_date ?? '-') }}
                </div>
              </div>

              <AppDateTimePicker
                v-else
                id="borrow-date"
                v-model="displayBorrowDate"
                label="Tanggal Peminjaman"
                placeholder="Tanggal peminjaman"
                :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                :append-inner-icon="'ri-calendar-line'"
                class="my-4"
              />

              <div v-if="isInputDisabled">
                <p class="text-h6 mt-4 font-weight-medium">
                  Tanggal Pengembalian
                </p>
                <div class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ formatDateTime(borrowingRequestDetail?.end_date ?? '-')}}
                </div>
              </div>

              <AppDateTimePicker
                v-else
                id="return-date"
                v-model="displayReturnDate"
                label="Tanggal Pengembalian"
                placeholder="Tanggal pengembalian"
                :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
                :append-inner-icon="'ri-calendar-line'"
                class="my-4"
              />

              <div>
                <p class="text-h6 mt-4 font-weight-medium">
                  Mata pelajaran
                </p>
                <div class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ borrowingRequest?.school_subject?.name ?? '-' }}
                </div>
              </div>

              <div>
                <p class="text-h6 mt-4 font-weight-medium">
                  Keterangan
                </p>
                <div class="text-body-1 text-high-emphasis font-weight-regular">
                  {{ borrowingRequest?.purpose ?? '-'}}
                </div>
              </div>
              
            </div>
          </VCardText>
        </VCard>

        <div v-if="borrowingRequest?.status === 'revised' && borrowingRequest.is_revised">
          <VBtn
            id="btn-approve"
            block
            class="mt-4"
            :loading="isSubmitting"
            color="primary"
            @click="sendRequest(1)"
          >
            SETUJUI
          </VBtn>
  
          <VBtn
            id="btn-reject"
            block
            class="mt-4"
            :loading="isSubmitting"
            color="error"
            @click="sendRequest(0)"
          >
            TOLAK
          </VBtn>
        </div>
        <VAlert
          v-if="isSuccess"
          color="success"
          variant="tonal"
          closable
          class="mt-4"
        >
          <VAlertTitle class="text-success mb-1">
            Success
          </VAlertTitle>
    
          <p class="mb-0">
            Berhasil mengajukan peminjaman barang
          </p>
        </VAlert>
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
