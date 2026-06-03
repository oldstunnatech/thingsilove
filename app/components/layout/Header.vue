<template>
  <header
    class="fixed top-0 left-0 right-0 z-50 transition-all duration-300"
    :style="scrolled ? 'background: rgba(2, 8, 24, 0.95); backdrop-filter: blur(12px); border-bottom: 1px solid #00d4ff20;' : 'background: transparent;'"
  >
    <div class="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between gap-6">

      <!-- Logo -->
      <NuxtLink to="/" class="flex flex-items-center leading-none shrink-0">
        <span class="text-xl font-black uppercase tracking-tighter text-white">T</span>
        <span class="text-xl font-black uppercase tracking-tighter" style="color: #00d4ff;">IL</span>
      </NuxtLink>

      <!-- Search bar -->
      <div class="flex-1 max-w-md relative hidden md:block">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full px-4 py-2 text-sm bg-transparent outline-none text-white pr-10"
          style="border: 1px solid #00d4ff30; color: #fff;"
          @keyup.enter="goToSearch"
          @input="onSearchInput"
          @focus="showDropdown = true"
          @blur="hideDropdown"
        />
        <button
          class="absolute right-3 top-1/2 -translate-y-1/2"
          style="color: #00d4ff;"
          @click="goToSearch"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4" />
        </button>

        <!-- Search dropdown -->
        <div
          v-if="showDropdown && searchResults.length > 0"
          class="absolute top-full left-0 right-0 mt-1 z-50 max-h-80 overflow-auto"
          style="background: #0a1628; border: 1px solid #00d4ff20;"
        >
          <div
            v-for="result in searchResults"
            :key="result.id"
            class="flex items-center justify-between px-4 py-3 cursor-pointer transition-all hover:bg-white/5"
            @mousedown="goToProduct(result.slug)"
          >
            <div>
              <p class="text-sm font-bold uppercase">{{ result.name }}</p>
              <p class="text-xs mt-1" style="color: #7eb8d4;">{{ result.category }}</p>
            </div>
            <p class="text-sm font-bold" style="color: #00d4ff;">₦{{ Number(result.price).toLocaleString() }}</p>
          </div>
        </div>

        <!-- No results -->
        <div
          v-if="showDropdown && searchQuery.length > 1 && searchResults.length === 0 && !searching"
          class="absolute top-full left-0 right-0 mt-1 z-50 px-4 py-3 text-xs uppercase tracking-widest"
          style="background: #0a1628; border: 1px solid #00d4ff20; color: #7eb8d4;"
        >
          No products found
        </div>
      </div>

      <!-- Nav links -->
      <nav class="hidden md:flex items-center gap-8">
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

      <!-- Right actions -->
      <div class="flex items-center gap-5 shrink-0">
        <!-- Mobile search -->
        <button
          class="md:hidden transition-colors hover:text-white"
          style="color: #7eb8d4;"
          @click="mobileSearchOpen = !mobileSearchOpen"
        >
          <UIcon name="i-heroicons-magnifying-glass" class="w-5 h-5" />
        </button>

        <!-- Account -->
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

        <!-- Cart -->
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

        <!-- Mobile menu -->
        <button
          class="md:hidden transition-colors hover:text-white"
          style="color: #7eb8d4;"
          @click="mobileOpen = !mobileOpen"
        >
          <UIcon :name="mobileOpen ? 'i-heroicons-x-mark' : 'i-heroicons-bars-3'" class="w-6 h-6" />
        </button>
      </div>
    </div>

    <!-- Mobile search bar -->
    <div
      v-if="mobileSearchOpen"
      class="px-6 pb-4 md:hidden"
      style="background: rgba(2, 8, 24, 0.98); border-top: 1px solid #00d4ff15;"
    >
      <div class="relative">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search products..."
          class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white pr-10"
          style="border: 1px solid #00d4ff30;"
          @keyup.enter="goToSearch"
        />
        <button class="absolute right-3 top-1/2 -translate-y-1/2" style="color: #00d4ff;" @click="goToSearch">
          <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4" />
        </button>
      </div>
    </div>

    <!-- Mobile menu -->
    <div
      v-if="mobileOpen"
      class="md:hidden px-6 pb-6 flex flex-col gap-6"
      style="background: rgba(2, 8, 24, 0.98); border-top: 1px solid #00d4ff20;"
    >
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
const router = useRouter()
const scrolled = ref(false)
const mobileOpen = ref(false)
const mobileSearchOpen = ref(false)
const searchQuery = ref('')
const searchResults = ref<any[]>([])
const showDropdown = ref(false)
const searching = ref(false)
let searchTimeout: ReturnType<typeof setTimeout>

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

function hideDropdown() {
  setTimeout(() => { showDropdown.value = false }, 200)
}

async function onSearchInput() {
  clearTimeout(searchTimeout)
  if (searchQuery.value.length < 2) {
    searchResults.value = []
    return
  }
  searching.value = true
  searchTimeout = setTimeout(async () => {
    const data = await $fetch(`/api/products/search?q=${searchQuery.value}`) as any[]
    searchResults.value = data.slice(0, 5)
    searching.value = false
  }, 300)
}

function goToSearch() {
  if (searchQuery.value.trim()) {
    router.push(`/products?q=${searchQuery.value}`)
    showDropdown.value = false
    mobileSearchOpen.value = false
  }
}

function goToProduct(slug: string) {
  router.push(`/products/${slug}`)
  searchQuery.value = ''
  showDropdown.value = false
}
</script>