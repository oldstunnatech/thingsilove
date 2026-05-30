<template>
  <div class="min-h-screen text-white pt-24" style="background: #020818;">
    <div class="max-w-4xl mx-auto px-6 py-12">

      <div class="mb-12">
        <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">My Account</p>
        <h1 class="text-5xl font-black uppercase tracking-tighter">
          Hey, {{ authStore.user?.name?.split(' ')[0] }} 👋
        </h1>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-12">
        <div class="p-6" style="border: 1px solid #00d4ff20; background: linear-gradient(135deg, #0d2545, #0a1628);">
          <p class="text-xs uppercase tracking-widest mb-2" style="color: #00d4ff;">Email</p>
          <p class="font-bold">{{ authStore.user?.email }}</p>
        </div>
        <div class="p-6" style="border: 1px solid #00d4ff20; background: linear-gradient(135deg, #0d2545, #0a1628);">
          <p class="text-xs uppercase tracking-widest mb-2" style="color: #00d4ff;">Role</p>
          <p class="font-bold uppercase">{{ authStore.user?.role }}</p>
        </div>
        <div class="p-6" style="border: 1px solid #00d4ff20; background: linear-gradient(135deg, #0d2545, #0a1628);">
          <p class="text-xs uppercase tracking-widest mb-2" style="color: #00d4ff;">Cart Items</p>
          <p class="font-bold">{{ cartStore.totalItems }} items</p>
        </div>
      </div>

      <div class="flex flex-col sm:flex-row gap-4">
        <NuxtLink
          to="/products"
          class="px-8 py-4 font-bold uppercase tracking-widest text-sm text-center"
          style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
        >
          Shop Now
        </NuxtLink>
        <button
          class="px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all"
          style="border: 1px solid #ff444430; color: #ff4444;"
          @click="handleLogout"
        >
          Sign Out
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

definePageMeta({ middleware: 'auth' })

const authStore = useAuthStore()
const cartStore = useCartStore()
const router = useRouter()

async function handleLogout() {
  await authStore.logout()
  router.push('/')
}
</script>
