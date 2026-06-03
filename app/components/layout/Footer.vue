<template>
  <footer style="background: linear-gradient(180deg, #020818 0%, #010510 100%); border-top: 1px solid #00d4ff15;">

    <div class="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 md:grid-cols-4 gap-12">

      <!-- Brand -->
      <div class="md:col-span-2">
        <div class="flex flex-col leading-none mb-4">
          <span class="text-2xl font-black uppercase tracking-tighter text-white">Things</span>
          <span class="text-2xl font-black uppercase tracking-tighter" style="color: #00d4ff;">I Love</span>
        </div>
        <p class="text-sm mb-6 max-w-xs" style="color: #7eb8d4;">
          Exclusive streetwear drops. Limited pieces. No restocks. Built for those who move different.
        </p>
        <div class="flex items-center gap-4">
          <div
            v-for="social in socials"
            :key="social.name"
            class="w-9 h-9 flex items-center justify-center rounded-full transition-all hover:scale-110 cursor-pointer"
            style="border: 1px solid #00d4ff30; color: #00d4ff;"
          >
            <UIcon :name="social.icon" class="w-4 h-4" />
          </div>
        </div>
      </div>

      <!-- Shop links -->
      <div>
        <p class="text-xs uppercase tracking-widest font-semibold mb-6" style="color: #00d4ff;">Shop</p>
        <ul class="space-y-3">
          <li v-for="link in shopLinks" :key="link.href">
            <NuxtLink
              :to="link.href"
              class="text-sm transition-colors hover:text-white"
              style="color: #7eb8d4;"
            >
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </div>

      <!-- Help links -->
      <div>
        <p class="text-xs uppercase tracking-widest font-semibold mb-6" style="color: #00d4ff;">Help</p>
        <ul class="space-y-3">
          <li v-for="link in helpLinks" :key="link.name">
            <span
              class="text-sm transition-colors hover:text-white cursor-pointer"
              style="color: #7eb8d4;"
            >
              {{ link.name }}
            </span>
          </li>
        </ul>
      </div>
    </div>

    <!-- Bottom bar -->
    <div
      class="max-w-7xl mx-auto px-6 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs uppercase tracking-widest"
      style="border-top: 1px solid #00d4ff15; color: #7eb8d4;"
    >
      <p>© {{ year }} Things I Love. All rights reserved.</p>
      <div class="flex items-center gap-6">
        <span class="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
        <span class="hover:text-white transition-colors cursor-pointer">Terms of Use</span>
      </div>
    </div>

  </footer>
</template>

<script setup lang="ts">
const year = new Date().getFullYear()

const socials = [
  { name: 'Facebook', href: '#', icon: 'i-mdi-facebook' },
  { name: 'Instagram', href: '#', icon: 'i-mdi-instagram' },
  // { name: 'X', href: '#', icon: 'i-mdi-twitter' },
  // { name: 'TikTok', href: '#', icon: 'i-mdi-music-note' },
]

const shopLinks = [
  { name: 'All Products', href: '/products' },
  { name: 'New Arrivals', href: '/products' },
  { name: 'Cart', href: '/cart' },
  { name: 'Checkout', href: '/checkout' },
]

const helpLinks = [
  { name: 'FAQ' },
  { name: 'Shipping & Returns' },
  { name: 'Size Guide' },
  { name: 'Contact Us' },
]
</script>
