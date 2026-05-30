<template>
  <div class="min-h-screen text-white flex" style="background: #020818;">

    <!-- Sidebar -->
    <aside class="w-64 shrink-0 flex flex-col" style="background: #0a1628; border-right: 1px solid #00d4ff15;">
      <div class="p-6 mb-4" style="border-bottom: 1px solid #00d4ff15;">
        <NuxtLink to="/" class="flex flex-col leading-none">
          <span class="text-lg font-black uppercase tracking-tighter text-white">Things</span>
          <span class="text-lg font-black uppercase tracking-tighter" style="color: #00d4ff;">I Love</span>
        </NuxtLink>
        <p class="text-xs uppercase tracking-widest mt-2" style="color: #7eb8d4;">Admin Panel</p>
      </div>

      <nav class="flex-1 px-4">
        <ul class="space-y-1">
          <li v-for="link in adminLinks" :key="link.href">
            <NuxtLink
              :to="link.href"
              class="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-semibold transition-all rounded"
              :style="$route.path === link.href
                ? 'background: #00d4ff15; color: #00d4ff;'
                : 'color: #7eb8d4;'"
            >
              <UIcon :name="link.icon" class="w-4 h-4" />
              {{ link.name }}
            </NuxtLink>
          </li>
        </ul>
      </nav>

      <div class="p-4 mt-auto" style="border-top: 1px solid #00d4ff15;">
        <NuxtLink to="/" class="flex items-center gap-3 px-4 py-3 text-xs uppercase tracking-widest font-semibold transition-all" style="color: #7eb8d4;">
          <UIcon name="i-heroicons-arrow-left" class="w-4 h-4" />
          Back to Store
        </NuxtLink>
      </div>
    </aside>

    <!-- Main content -->
    <main class="flex-1 overflow-auto">
      <slot />
    </main>
  </div>
</template>

<script setup lang="ts">
const adminLinks = [
  { name: 'Dashboard', href: '/admin', icon: 'i-heroicons-squares-2x2' },
  { name: 'Products', href: '/admin/products', icon: 'i-heroicons-tag' },
  { name: 'Orders', href: '/admin/orders', icon: 'i-heroicons-shopping-bag' },
  { name: 'Users', href: '/admin/users', icon: 'i-heroicons-users' },
]
</script>
