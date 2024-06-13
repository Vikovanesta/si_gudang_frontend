<script setup lang="ts">
import { CartItem } from '@/utils/types';
import tabsConsole from '@images/cards/tabs-console.png';
import emptyCartImg from '@images/pages/empty-cart.png';

// remove item from cart
const removeItem = (item: CartItem) => {
  // checkoutCartDataLocal.value.cartItems = checkoutCartDataLocal.value.cartItems.filter(i => i.id !== item.id)
}

const updateCartData = () => {
  // checkoutCartDataLocal.value.orderAmount = totalCost.value
  // emit('update:checkout-data', checkoutCartDataLocal.value)
}
const borrowDate = ref('')
const returnDate = ref('')

const selectedSubject = ref({ id: null, name: 'Mata Pelajaran' })

const schoolSubjects = [
  { id: null, name: 'None' },
  { id: 1, name: 'Database' },
  { id: 2, name: 'Algoritma dan Struktur Data' },
  { id: 3, name: 'Test' },
  { id: 4, name: 'tes2' },
  { id: 5, name: 'ok' },
]

const cartItems = ref<CartItem[]>([])
const isLoading = ref<boolean>(false)

const cartLength = computed(() => cartItems.value.length)

const fetchCartItems = async () => {
  isLoading.value = true
  try {
    const response = await axios.get('/me/carts')
    cartItems.value = response.data.data
    console.log('Response: ', response)
    console.log('Cart items: ', cartItems)
    console.log('Len: ', cartLength.value)
  } catch (error) {
    console.error('Failed to fetch items:', error)
  } finally {
    isLoading.value = false
  }
};

onMounted(() => {
  fetchCartItems()
});
</script>

<template>
  <VRow v-if="cartLength">
    <VCol
      cols="12"
      md="8"
    >

      <h5 class="text-h5 my-4">
        Keranjang Alat ({{ cartLength }} Item)
      </h5>

      <!-- 👉 Cart items -->
      <div
        v-if="cartLength"
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
              @click=""
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
                  type="number"
                  density="compact"
                  style="inline-size: 9.375rem;"
                  class="my-4"
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

      <!-- 👉 Add more from wishlist -->
      <v-container class="pa-0">
        <v-row justify="start">
          <v-col cols="auto">
            <div
              class="d-flex align-center gap-1 rounded-lg px-3 py-2 text-base mt-4"
              style="border: 1px solid rgb(var(--v-theme-primary));"
            >
              <v-icon
                icon="ri-arrow-left-line"
                class="flip-in-rtl"
                size="16"
                color="primary"
              />
              <!-- TODO: Make this functional -->
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
      <VCard
        flat
        variant="outlined"
      >
        <!-- Form Title -->
        <VCardText>
          <h5 class="text-h5 mb-4">
            Data Peminjaman
          </h5>

          <!-- 👉 Gift wrap banner -->
          <div class="bg-var-theme-background rounded-xl pa-5 mt-4">
            <p class="my-2 text-body-1">
              Lengkapi data di bawah untuk keperluan peminjaman. Jika Anda meminjam di luar keperluan praktikum, maka mata pelajaran dapat dikosongi.
            </p>
          </div>
        </VCardText>

        <!-- 👉 Price details -->
        <VCardText>
          <div class="text-sm text-high-emphasis">
            <AppDateTimePicker
              v-model="borrowDate"
              label="Tanggal Peminjaman"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              class="my-4"
            />

            <AppDateTimePicker
              v-model="returnDate"
              label="Tanggal Pengembalian"
              placeholder="Select date and time"
              :config="{ enableTime: true, dateFormat: 'Y-m-d H:i' }"
              class="my-4"
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
              label="Keterangan"
              rows="2"
              placeholder="keterangan"
            />
          </div>
        </VCardText>
      </VCard>

      <!-- TODO: Make this function -->
      <VBtn
        block
        class="mt-4"
        @click=""
      >
        Ajukan Peminjaman
      </VBtn>
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
