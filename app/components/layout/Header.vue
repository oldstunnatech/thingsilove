<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :style="scrolled ? 'background: rgba(2, 8, 24, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #00d4ff20;' : 'background: transparent;'"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

      <NuxtLink to="/" class="flex flex-col leading-none">
        <span class="text-xl font-black uppercase tracking-tighter text-white">Things</span>
        <span class="text-xl font-black uppercase tracking-tighter" style="color: #00d4ff;">I Love</span>
      </NuxtLink>

      <nav class="hidden md:flex items-center gap-10">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.href"
          :to="link.href"
          class="text-xs uppercase tracking-widest font-semibold transition-colors hover:text-white"
          :style="$route.path === link.href ? 'color: #00d4ff;' : 'color: #7eb8d4;'"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>

      <div class="flex items-center gap-6">
        <ClientOnly>
          <NuxtLink
            :to="authStore.isLoggedIn ? '/account' : '/account/login'"
            class="transition-colors hover:text-white text-xs uppercase tracking-widest font-semibold hidden md:block"
            style="color: #7eb8d4;"
          >
            {{ authStore.isLoggedIn ? authStore.user?.name?.split(' ')[0] : 'Sign In' }}
          </NuxtLink>
          <template #fallback>
            <NuxtLink to="/account/login" class="transition-colors hover:text-white text-xs uppercase tracking-widest font-semibold hidden md:block" style="color: #7eb8d4;">
              Sign In
            </NuxtLink>
          </template>
        </ClientOnly>

        <NuxtLink to="/cart" class="relative transition-colors hover:text-white" style="color: #7eb8d4;">
          <UIcon name="i-heroicons-shopping-bag" class="w-5 h-5" />
          <ClientOnly>
            <span
              v-if="cartStore.totalItems > 0"
              class="absolute -top-2 -right-2 w-4 h-4 rounded-full text-xs font-bold flex items-center justify-center"
              style="background: #00d4ff; color: #020818;"
            >
              {{ cartStore.totalItems }}
            </span>
          </ClientOnly>
        </NuxtLink>

        <button class="md:hidden transition-colors hover:text-white" style="color: #7eb8d4;" @click="mobileOpen = !mobileOpen">
          <UIcon :name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <div v-if="mobileOpen" class="md:hidden px-6 pb-6 flex flex-col gap-6" style="background: rgba(2, 8, 24, 0.98); border-top: 1px solid #00d4ff20;">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.href"
        :to="link.href"
        class="text-sm uppercase tracking-widest font-semibold"
        :style="$route.path === link.href ? 'color: #00d4ff;' : 'color: #7eb8d4;'"
        @click="mobileOpen = false"
      >
        {{ link.name }}
      </NuxtLink>
      <ClientOnly>
        <NuxtLink
          :to="authStore.isLoggedIn ? '/account' : '/account/login'"
          class="text-sm uppercase tracking-widest font-semibold"
          style="color: #7eb8d4;"
          @click="mobileOpen = false"
        >
          {{ authStore.isLoggedIn ? 'My Account' : 'Sign In' }}
        </NuxtLink>
      </ClientOnly>
    </div>
  </header>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

const cartStore = useCartStore()
const authStore = useAuthStore()
const scrolled = ref(false)
const mobileOpen = ref(false)

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'Products', href: '/products' },
  { name: 'Cart', href: '/cart' },
]

onMounted(() => {
  window.addEventListener('scroll', () => {
    scrolled.value = window.scrollY > 20
  })
})
</script>
