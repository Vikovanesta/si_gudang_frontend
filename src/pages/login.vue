<script setup lang="ts">
import { themeConfig } from '@themeConfig'
import { VForm } from 'vuetify/components/VForm'

import { Rule } from '@/plugins/casl/ability'
import authV2LoginIllustrationBorderedDark from '@images/pages/auth-v2-login-illustration-bordered-dark.png'
import authV2LoginIllustrationBorderedLight from '@images/pages/auth-v2-login-illustration-bordered-light.png'
import authV2LoginIllustrationDark from '@images/pages/auth-v2-login-illustration-dark.png'
import authV2LoginIllustrationLight from '@images/pages/auth-v2-login-illustration-light.png'
import authV2LoginMaskDark from '@images/pages/auth-v2-login-mask-dark.png'
import authV2LoginMaskLight from '@images/pages/auth-v2-login-mask-light.png'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

const authThemeImg = useGenerateImageVariant(
  authV2LoginIllustrationLight,
  authV2LoginIllustrationDark,
  authV2LoginIllustrationBorderedLight,
  authV2LoginIllustrationBorderedDark,
  true)

const authThemeMask = useGenerateImageVariant(authV2LoginMaskLight, authV2LoginMaskDark)

definePage({
  meta: {
    layout: 'blank',
    unauthenticatedOnly: true,
  },
})

const isPasswordVisible = ref(false)

const route = useRoute()
const router = useRouter()

const ability = useAbility()

const errors = ref<Record<string, string | undefined>>({
  email: undefined,
  password: undefined,
  message: undefined,
})

const refVForm = ref<VForm>()

const credentials = ref({
  email: '',
  password: '',
})

const rememberMe = ref(false)

const login = async () => {
  try {
    const body = {
      email: credentials.value.email,
      password: credentials.value.password,
    };

    const res = await axios.post('/login', body);

    const data = res.data.data
    const accessToken = data.token
    const userData = data.user
    let userAbilityRules: Rule[] = []

    console.log('response: ', res)
    console.log('data: ', data)
    console.log('token: ', accessToken)
    console.log('user: ', userData)

    if (userData.role.name == 'admin') {
      userAbilityRules = [{
        'action': 'manage',
        'subject': 'Admin',
      }]
    } else if (userData.role.name == 'teacher' || userData.role.name == 'student') {
      userAbilityRules = [{
        'action': 'manage',
        'subject': 'Academic',
      }]
    } else if (userData.role.name == 'laboran') {
      userAbilityRules = [{
        'action': 'manage',
        'subject': 'Laboran',
      }]
    }

    useCookie('userAbilityRules').value = JSON.stringify(userAbilityRules)
    ability.update(userAbilityRules)

    useCookie('userData').value = userData
    useCookie('accessToken').value = accessToken

    errors.value.message = undefined

    // Redirect to `to` query if exist or redirect to index route
    // ❗ nextTick is required to wait for DOM updates and later redirect
    await nextTick(() => {
      router.replace(route.query.to ? String(route.query.to) : '/')
    })
  }
  catch (err) {
    if (err.response && err.response.data && err.response.data.errors) {
      errors.value.message = err.response.data.errors.message
    } else {
      console.error(err)
    }
  }
}

const onSubmit = () => {
  refVForm.value?.validate()
    .then(({ valid: isValid }) => {
      if (isValid)
        login()
    })
}
</script>

<template>
  <RouterLink to="/">
    <div class="auth-logo app-logo">
      <VNodeRenderer :nodes="themeConfig.app.logo" />
      <div class="app-logo-title text-h6">
        <div class="a-0">Sistem Informasi</div>
        <div class="a-0">Peminjaman Alat dan Gudang</div>
      </div>
    </div>
  </RouterLink>

  <VRow
    no-gutters
    class="auth-wrapper"
  >
    <VCol
      md="8"
      class="d-none d-md-flex align-center justify-center position-relative"
    >
      <div class="d-flex align-center justify-center pa-10">
        <img
          :src="authThemeImg"
          class="auth-illustration w-100"
          alt="auth-illustration"
        >
      </div>
      <VImg
        :src="authThemeMask"
        class="d-none d-md-flex auth-footer-mask"
        alt="auth-mask"
      />
    </VCol>

    <VCol
      cols="12"
      md="4"
      class="auth-card-v2 d-flex align-center justify-center"
      style="background-color: rgb(var(--v-theme-surface));"
    >
      <VCard
        flat
        :max-width="500"
        class="mt-12 mt-sm-0 pa-5 pa-lg-7"
      >
        <VCardText>
          <h4 class="text-h4 mb-1">
            Selamat datang!👋🏻
          </h4>
          <p class="mb-0">
            Silakan isi data di bawah ini untuk masuk ke akun Anda!
          </p>
        </VCardText>
        <VCardText>
          <VAlert
            color="primary"
            variant="tonal"
          >
            <p class="text-caption mb-2 text-primary">
              Admin Email: <strong>admin@mail.com</strong> / Pass: <strong>password</strong>
            </p>
            <p class="text-caption mb-2 text-primary">
              Laboran Email: <strong>laboran@mail.com</strong> / Pass: <strong>password</strong>
            </p>
            <p class="text-caption mb-2 text-primary">
              Teacher Email: <strong>teacher@mail.com</strong> / Pass: <strong>password</strong>
            </p>
            <p class="text-caption mb-0 text-primary">
              Student Email: <strong>student@mail.com</strong> / Pass: <strong>password</strong>
            </p>
          </VAlert>
        </VCardText>

        <VCardText>
          <VForm
            ref="refVForm"
            @submit.prevent="onSubmit"
          >
            <VRow>
              <!-- email -->
              <VCol cols="12">
                <VTextField
                  id="email"
                  v-model="credentials.email"
                  label="Email"
                  placeholder="johndoe@email.com"
                  type="email"
                  autofocus
                  :rules="[requiredValidator, emailValidator]"
                  :error-messages="errors.email"
                />
              </VCol>

              <!-- password -->
              <VCol cols="12">
                <VTextField
                  id="password"
                  v-model="credentials.password"
                  label="Kata sandi"
                  placeholder="············"
                  :rules="[requiredValidator]"
                  :type="isPasswordVisible ? 'text' : 'password'"
                  :error-messages="errors.password"
                  :append-inner-icon="isPasswordVisible ? 'ri-eye-off-line' : 'ri-eye-line'"
                  @click:append-inner="isPasswordVisible = !isPasswordVisible"
                />

                <div class="d-flex align-center flex-wrap justify-space-between my-6 gap-x-2">
                  <VCheckbox
                    v-model="rememberMe"
                    label="Ingat saya"
                  />
                  <RouterLink
                    class="text-primary"
                    :to="{ name: 'forgot-password' }"
                  >
                    Lupa kata sandi?
                  </RouterLink>
                </div>

                <VBtn
                  id="btn-submit"
                  block
                  type="submit"
                >
                  Masuk
                </VBtn>

                <VAlert
                  v-if="errors.message"
                  variant="text"
                  color="error"
                  density="compact"
                  class="mt-2 d-flex justify-center align-center"
                >
                  {{ errors.message }}
                </VAlert>

              </VCol>

              <!-- create account -->
              <VCol
                cols="12"
                class="text-body-1 text-center"
              >
                <span class="d-inline-block">
                  Belum memiliki akun?
                </span>
                <RouterLink
                  id="to-register"
                  class="text-primary ms-1 d-inline-block text-body-1"
                  :to="{ name: 'register' }"
                >
                  Daftar
                </RouterLink>
              </VCol>
            </VRow>
          </VForm>
        </VCardText>
      </VCard>
    </VCol>
  </VRow>
</template>

<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>
