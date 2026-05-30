<template>
  <div class="min-h-screen flex items-center justify-center px-6 pt-24" style="background: #020818;">
    <div class="w-full max-w-md">

      <div class="mb-10 text-center">
        <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">Welcome Back</p>
        <h1 class="text-4xl font-black uppercase tracking-tighter">Sign In</h1>
      </div>

      <div class="flex flex-col gap-4 p-8" style="border: 1px solid #00d4ff20; background: linear-gradient(135deg, #0d2545, #0a1628);">

        <input
          v-model="form.email"
          type="email"
          placeholder="Email address"
          class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white"
          style="border: 1px solid #00d4ff30;"
        />

        <input
          v-model="form.password"
          type="password"
          placeholder="Password"
          class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white"
          style="border: 1px solid #00d4ff30;"
        />

        <p v-if="errorMsg" class="text-xs uppercase tracking-widest" style="color: #ff4444;">
          ⚠ {{ errorMsg }}
        </p>

        <button
          class="w-full py-4 font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-50 mt-2"
          style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
          :disabled="loading"
          @click="handleLogin"
        >
          {{ loading ? 'Signing in...' : 'Sign In' }}
        </button>

        <p class="text-center text-xs" style="color: #7eb8d4;">
          Don't have an account?
          <NuxtLink to="/account/register" class="font-bold hover:text-white transition-colors" style="color: #00d4ff;">
            Register
          </NuxtLink>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'guest' })

const authStore = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({ email: '', password: '' })
const loading = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  loading.value = true
  try {
    await authStore.login(form.email, form.password)
    const redirect = route.query.redirect as string || '/account'
    router.push(redirect)
  } catch (e: any) {
    errorMsg.value = e?.data?.statusMessage || 'Login failed. Please try again.'
  } finally {
    loading.value = false
  }
}
</script>
