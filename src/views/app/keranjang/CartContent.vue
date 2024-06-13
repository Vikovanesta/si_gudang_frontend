<script setup lang="ts">
import { CartItem } from '@/utils/types';
import tabsConsole from '@images/cards/tabs-console.png';
import emptyCartImg from '@images/pages/empty-cart.png';
import { format } from 'date-fns';
import { useRouter } from 'vue-router';


const cartItems = ref<CartItem[]>([]);
const isLoading = ref<boolean>(false);
const isRemoving = ref<{ [key: number]: boolean }>({});
const isSubmitting = ref<boolean>(false);
const isSuccess = ref<boolean>(false);
const formRef = ref<any>(null);
const purpose = ref('');
const borrowDate = ref('');
const returnDate = ref('');
const selectedSubject = ref({ id: null, name: 'Mata Pelajaran' });

const schoolSubjects = [
  { id: null, name: 'Tidak ada' },
  { id: 1, name: 'Database' },
  { id: 2, name: 'Algoritma dan Struktur Data' },
  { id: 3, name: 'Test' },
  { id: 4, name: 'tes2' },
  { id: 5, name: 'ok' },
];

const router = useRouter();

const removeItem = async (item: CartItem) => {
  isRemoving.value[item.id] = true;
  try {
    const response = await axios.delete(`/me/carts/${item.item.id}`);
    if (response.status === 200) {
      cartItems.value = cartItems.value.filter(cartItem => cartItem.id !== item.id);
      console.log('Deleted:', cartItems.value);
    }
  } catch (error) {
    console.error('Error:', error);
  } finally {
    isRemoving.value[item.id] = false;
  }
};

const sendRequest = async () => {
  if (!formRef.value || !(await formRef.value.validate())) {
    console.log('Form is not valid');
    return;
  }

  try {
    isSubmitting.value = true;
    const borrowedItems = JSON.stringify(cartItems.value.map(item => ({
      item_id: item.id,
      quantity: item.quantity || 1,
    })))

    const response = await axios.post('/borrowing-requests', {
      purpose: purpose.value,
      start_date: format(new Date(borrowDate.value), 'yyyy-MM-dd HH:mm:ss'),
      end_date: format(new Date(returnDate.value), 'yyyy-MM-dd HH:mm:ss'),
      borrowed_items: borrowedItems,
    });

    console.log('Response:', response.data);

    if (response.status === 201) {
      isSuccess.value = true; // Set success message
    }

  } catch (error) {
    console.error('Error:', error);
    // Handle error and possibly show error message
  } finally {
    isSubmitting.value = false;
  }
};

const cartLength = computed(() => cartItems.value.length);

const fetchCartItems = async () => {
  isLoading.value = true;
  try {
    const response = await axios.get('/me/carts');
    cartItems.value = response.data.data.map((item: any) => ({
      ...item,
      quantity: 1,
    }));
    console.log('Cart items:', cartItems.value);
  } catch (error) {
    console.error('Failed to fetch items:', error);
    // Handle error fetching cart items
  } finally {
    isLoading.value = false;
  }
};

const goBack = () => {
  router.go(-1);
};

onMounted(() => {
  fetchCartItems();
});
</script>

<template>
  <VRow v-if="cartLength >= 0">
    <VCol
      cols="12"
      md="8"
    >

      <h5 class="text-h5 my-4">
        Keranjang Alat ({{ cartLength }} Item)
      </h5>

      <!-- 👉 Cart items -->
      <div
        v-if="cartLength > 0  "
        class="border rounded-xl"
      >
        <template
          v-for="cartItem in cartItems"
          :key="cartItem.id"
        >
          <div
            class="d-flex align-center gap-4 pa-5 position-relative flex-column flex-sm-row"
          >
            <IconBtn
              class="checkout-item-remove-btn"
              color="disabled"
              @click="removeItem(cartItem)"
              :loading="isRemoving[cartItem.id]"
            >
              <VIcon
                size="18"
                icon="ri-close-line"
              />
            </IconBtn>

            <div>
              <VImg
                width="140"
                :src="cartItem.item.image_url || tabsConsole"
              />
            </div>

            <div
              class="d-flex w-100"
              :class="(($vuetify.display.width <= 1280 && $vuetify.display.width >= 960) || $vuetify.display.width <= 700) ? 'flex-column' : 'flex-row'"
            >
              <div>
                <h6 class="text-h6 mb-2">
                  {{ cartItem.item.name }}
                </h6>
                <div class="d-flex align-center text-no-wrap gap-4 text-base">
                  <div>
                    <span class="text-disabled me-2">Tersedia:</span>
                    <span class="text-primary">{{ cartItem.item.stock }}</span>
                  </div>
                  <VChip
                    :color="'success'"
                    size="small"
                  >
                    {{ cartItem.item.warehouse.name }}
                  </VChip>
                </div>

                <VTextField
                  v-model.number="cartItem.quantity"
                  type="number"
                  density="compact"
                  style="inline-size: 9.375rem;"
                  class="my-4"
                  min = "1"
                  Label="Jumlah"
                />
              </div>

              <VSpacer />

              <div
                class="d-flex flex-column"
                :class="(($vuetify.display.width <= 1280 && $vuetify.display.width >= 960) || $vuetify.display.width <= 700) ? 'text-start mt-4' : 'text-end mt-8'"
              >
                <div
                  class="d-flex flex-column"
                  :class="$vuetify.display.smAndUp ? 'gap-4' : 'gap-2'"
                >
                  <p class="text-base mb-0">
                    <span>Material: {{ cartItem.item.material.name }}</span>
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
    <VForm @submit.prevent="sendRequest" ref="formRef">

      <VCard
        flat
        variant="outlined"
      >
        <!-- Form Title -->
        <VCardText>
          <h5 class="text-h5 mb-4">
            Data Peminjaman
          </h5>

          <div class="bg-var-theme-background rounded-xl pa-5 mt-4">
            <p class="my-2 text-body-1">
              Lengkapi data di bawah untuk keperluan peminjaman. Jika Anda meminjam di luar keperluan praktikum, maka mata pelajaran dapat dikosongi.
            </p>
          </div>
        </VCardText>

        <!-- Form details -->
        <VCardText>
          <div class="text-sm text-high-emphasis">
            <AppDateTimePicker
              v-model="borrowDate"
              label="Tanggal Peminjaman"
              placeholder="Tanggal peminjaman"
              :rules="[v => !!v || 'Tanggal peminjaman harus diisi']"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              class="my-4"
              required
            />

            <AppDateTimePicker
              v-model="returnDate"
              label="Tanggal Pengembalian"
              placeholder="Tanggal pengembalian"
              :rules="[v => !!v || 'Tanggal pengembalian harus diisi']"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              class="my-4"
              aria-required="true"
            />

            <VSelect
              v-model="selectedSubject"
              :items="schoolSubjects"
              item-title="name"
              item-value="id"
              label="Mata Pelajaran"
              return-object
              single-line
              placeholder="Select State"
              persistent-placeholder
              class="my-4"
            />

            <VTextarea
              v-model="purpose"
              label="Keterangan"
              rows="2"
              placeholder="keterangan"
              :rules="[v => !!v || 'Keterangan harus diisi']"
              required
            />
          </div>
        </VCardText>
      </VCard>

      <VBtn
        block
        class="mt-4"
        :loading="isSubmitting"
        type="submit"
      >
        Ajukan Peminjaman
      </VBtn>
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
</template>

<style lang="scss">
.checkout-item-remove-btn {
  position: absolute;
  inset-block-start: 10px;
  inset-inline-end: 10px;
}
</style>
