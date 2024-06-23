<script setup lang="ts">
import { Class } from '@/utils/types';
import registerMultiStepsIllustration from '@images/pages/register-multi-step-illustration.png';
import { VNodeRenderer } from '@layouts/components/VNodeRenderer';
import { themeConfig } from '@themeConfig';
import { useField, useForm } from 'vee-validate';
import * as yup from 'yup';

const currentStep = ref<number>(0)
const isPasswordVisible = ref(false)
const isConfirmPasswordVisible = ref(false)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const items = [
  {
    title: 'Akun',
    subtitle: 'Detail Akun',
  },
  {
    title: 'Personal',
    subtitle: 'Informasi Pribadi',
  },
]

const schemas = [
  yup.object({
    email: yup.string().email('Harus berupa e-mail yang valid.').required('Email wajib diisi.'),
    phone: yup.string().matches(/^[0-9]+$/, 'Nomor telepon hanya boleh terdiri dari angka.').min(9, 'Nomor telepon harus terdiri dari minimal 9 digit.').required('Nomor telepon wajib diisi.'),
    password: yup.string().min(8, 'Kata sandi harus terdiri dari minimal 8 karakter.').required('Kata sandi wajib diisi.'),
    confirm_password: yup.string().oneOf([yup.ref('password')], 'Konfirmasi kata sandi tidak sesuai.').required('Konfirmasi kata sandi wajib diisi.'),
  }),
  yup.object({
    name: yup.string().required('Nama wajib diisi.'),
    nisn: yup.string().required('NISN wajib diisi.'),
    class_id: yup.string().required('Kelas wajib dipilih.'),
    date_of_birth: yup.date().required('Tanggal lahir wajib diisi.'),
    year_in: yup.number().min(1900, 'Tahun masuk minimal adalah 1900.').required('Tahun masuk wajib diisi.'),
  }),
]

const currentSchema = computed(() => schemas[currentStep.value])

const form = useForm({
  validationSchema: currentSchema,
  validateOnMount: false,
});

const { handleSubmit, validate } = form;

const email = useField('email')
const phone = useField('phone')
const password = useField('password')
const confirmPassword = useField('confirm_password')
const name = useField('name')
const nisn = useField('nisn')
const classId = useField('class_id')
const dateOfBirth = useField('date_of_birth')
const yearIn = useField('year_in')

const classOptions = ref<Class[]>([])
const isSubmitting = ref(false)
const isSuccess = ref(false)
const router = useRouter()


const fetchClassOptions = async() => {
  try {
    const response = await axios.get('/classes')
    classOptions.value = response.data.data
  } catch (error) {
    console.error(error)
    }
}

const onSubmit = handleSubmit(async(values) => {
  isSubmitting.value = true;
  try {
    const response = await axios.post('/register/students', values);
    if (response.status === 201) {
      isSuccess.value = true;
    }
  } catch (error) {
    console.error(error);
  } finally {
    isSubmitting.value = false;
  }
})

const nextStep = async () => {
  const isValid = await validate();
  console.log('Schema:', currentSchema.value)
  console.log('Values:', form.values)
  console.log('isValid:', isValid);
  if (isValid.valid) {
    currentStep.value++;
    console.log('Schema:', currentSchema.value)
  }
}

onMounted(() => {
  fetchClassOptions()
})

</script>

<template>
  <RouterLink to="/">
    <div class="app-logo auth-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <h1 class="app-logo-title">
        {{ themeConfig.app.title }}
      </h1>
    </div>
  </RouterLink>

  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="4"
      class="d-none d-md-flex align-center"
    >
      <!-- here your illustration -->
      <VImg
        :src="registerMultiStepsIllustration"
        class="auth-illustration"
        height="560px"
      />
    </VCol>

    <VCol
      cols="12"
      md="8"
      class="auth-card-v2 d-flex align-center justify-center pa-10"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        class="mt-12"
      >
        <AppStepper
          v-model:current-step="currentStep"
          :items="items"
          :direction="$vuetify.display.smAndUp ? 'horizontal' : 'vertical'"
          class="mb-12"
        />

        <VWindow
          v-model="currentStep"
          class="disable-tab-transition responsive-window"
        >
          <VForm
            :validation-schema="currentSchema"
            keep-values
          >
            <VWindowItem>
              <h4 class="text-h4 mb-1">
                Informasi Akun
              </h4>
              <p class="text-body-1 mb-5">
                Masukkan detail akun Anda
              </p>

              <VRow>
                
                <VCol
                cols="12"
                md="6"
                >
                  <VTextField
                    id="email"
                    v-model="email.value.value"
                    :error-messages="email.errorMessage.value"
                    type="email"
                    label="Email"
                    placeholder="johndoe@email.com"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    id="phone"
                    v-model="phone.value.value"
                    :error-messages="phone.errorMessage.value"
                    label="Nomor telepon"
                    placeholder="081374843340"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    id="password"
                    v-model="password.value.value"
                    :error-messages="password.errorMessage.value"
                    label="Kata sandi"
                    placeholder="Kata sandi"
                    :type="isPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                    @click:append-inner="isPasswordVisible = !isPasswordVisible"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    id="confirm-password"
                    v-model="confirmPassword.value.value"
                    :error-messages="confirmPassword.errorMessage.value"
                    label="Konfirmasi kata sandi"
                    placeholder="Konfirmasi kata sandi"
                    :type="isConfirmPasswordVisible ? 'text' : 'password'"
                    :append-inner-icon="isConfirmPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                    @click:append-inner="isConfirmPasswordVisible = !isConfirmPasswordVisible"
                  />
                </VCol>

              </VRow>
            </VWindowItem>

            <VWindowItem>
              <h4 class="text-h4 mb-1">
                Informasi Personal
              </h4>
              <p class="text-body-1 mb-5">
                Masukkan detail informasi personal Anda
              </p>

              <VRow>
                <VCol
                  cols="12"
                >
                  <VTextField
                    id="name"
                    v-model="name.value.value"
                    :error-messages="name.errorMessage.value"
                    label="Nama"
                    placeholder="John Budiharto"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VTextField
                    id="nisn"
                    v-model="nisn.value.value"
                    :error-messages="nisn.errorMessage.value"
                    label="Nisn"
                    placeholder="1349133439"
                  />
                </VCol>

                <VCol
                  cols="12"
                  md="6"
                >
                  <VSelect
                    id="class-id"
                    v-model="classId.value.value"
                    :error-messages="classId.errorMessage.value"
                    label="Kelas"
                    placeholder="Pilih kelas"
                    :items="classOptions"
                    :item-title="'name'"
                    :item-value="'id'"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <AppDateTimePicker
                    id="date-of-birth"
                    v-model="dateOfBirth.value.value"
                    :error-messages="dateOfBirth.errorMessage.value"
                    label="Tanggal lahir"
                    placeholder="Tanggal lahir"
                    :config="{ dateFormat: 'Y-m-d' }"
                    :append-inner-icon="'ri-calendar-line'"
                  />
                </VCol>

                <VCol cols="12" md="6">
                  <VTextField
                    id="year-in"
                    v-model="yearIn.value.value"
                    :error-messages="yearIn.errorMessage.value"
                    type="number"
                    min="1900"
                    label="Tahun masuk"
                    placeholder="Tahun masuk"
                    :append-inner-icon="'ri-calendar-line'"
                  />
                </VCol>

              </VRow>
            </VWindowItem>
          </VForm>
        </VWindow>

        <div class="d-flex flex-wrap justify-space-between justify-center gap-x-4 gap-y-2 my-6">
          <VBtn
            id="btn-prev"
            color="secondary"
            variant="outlined"
            :disabled="currentStep === 0"
            @click="currentStep--"
          >
            <VIcon
              icon="ri-arrow-left-line"
              start
              class="flip-in-rtl"
            />
            Sebelumnya
          </VBtn>

          <VBtn
            id="btn-submit"
            v-if="items.length - 1 === currentStep"
            color="success"
            append-icon="ri-arrow-right-line"
            @click="onSubmit"
            :loading="isSubmitting"
          >
            Daftar
          </VBtn>

          <VBtn
            v-else
            id="btn-next"
            @click="nextStep"
          >
            Selanjutnya

            <VIcon
              icon="ri-arrow-right-line"
              end
              class="flip-in-rtl"
            />
          </VBtn>
        </div>
      </VCard>
    </VCol>
  </VRow>
  <VSnackbar
      v-model="isSuccess"
      location="top center"
      variant="flat"
      color="success"
      :timeout="5000"
    >
      Pendaftaran Berhasil diajukan, Mohon tunggu konfirmasi dari laboran.
    </VSnackbar>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";

.responsive-window {
  max-inline-size: 685px;
}

@media (min-width: 960px) {
  .responsive-window {
    min-inline-size: 685px;
  }
}
</style>
