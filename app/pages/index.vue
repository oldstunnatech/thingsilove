<template>
  <div class="min-h-screen text-white" style="background: #020818;">

    <!-- ===================== HERO ===================== -->
    <section
      class="relative min-h-screen flex flex-col justify-start items-center pt-32 px-6 overflow-hidden"
      style="background: linear-gradient(135deg, #020818 0%, #0a1628 40%, #0d2545 70%, #0a3d6b 100%);"
    >
      <!-- glow orbs -->
      <div class="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-20 blur-3xl" style="background: radial-gradient(circle, #00d4ff, transparent);"></div>
      <div class="absolute bottom-20 right-1/4 w-72 h-72 rounded-full opacity-15 blur-3xl" style="background: radial-gradient(circle, #7b2ff7, transparent);"></div>

      <div class="relative z-10 text-center max-w-5xl mx-auto">
        <p class="uppercase tracking-widest text-xs font-semibold mb-4" style="color: #00d4ff;">New Collection 2025</p>
        <h1 class="text-6xl sm:text-7xl md:text-9xl font-black uppercase leading-none tracking-tighter mb-6">
          Things <br />
          <span style="-webkit-text-stroke: 2px #00d4ff; color: transparent;">I Love</span>
        </h1>
        <p class="text-lg max-w-xl mx-auto mb-10" style="color: #7eb8d4;">
          Exclusive streetwear drops. Limited pieces. No restocks.
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <NuxtLink
            to="/products"
            class="px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all"
            style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
          >
            Shop Now
          </NuxtLink>
          <NuxtLink
            to="/products"
            class="px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all hover:bg-white/10"
            style="border: 1px solid #00d4ff; color: #00d4ff;"
          >
            New Arrivals
          </NuxtLink>
        </div>
      </div>

      <div class="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-xs animate-bounce" style="color: #00d4ff50;">
        <span class="uppercase tracking-widest">Scroll</span>
        <UIcon name="i-heroicons-chevron-down" class="w-4 h-4" />
      </div>
    </section>

    <!-- ===================== NEW ARRIVALS ===================== -->
    <section
      class="py-24 px-6"
      style="background: linear-gradient(180deg, #0a1628 0%, #050d1a 100%);"
    >
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">Just Dropped</p>
            <h2 class="text-4xl font-black uppercase">New Arrivals</h2>
          </div>
          <NuxtLink to="/products" class="text-sm uppercase tracking-widest transition-colors" style="color: #7eb8d4;">
            View All →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="product in newArrivals"
            :key="product.id"
            class="group cursor-pointer"
            @click="$router.push(`/products/${product.slug}`)"
          >
            <div
              class="aspect-[3/4] overflow-hidden mb-4 relative"
              style="background: linear-gradient(135deg, #0d2545, #0a3d6b); border: 1px solid #00d4ff20;"
            >
              <div class="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-widest" style="color: #00d4ff30;">
                No Image
              </div>
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style="background: rgba(0,212,255,0.05);"></div>
              <span
                v-if="product.isNew"
                class="absolute top-3 left-3 text-xs font-bold px-2 py-1 uppercase tracking-wider"
                style="background: #00d4ff; color: #020818;"
              >
                New
              </span>
            </div>
            <p class="text-xs uppercase tracking-widest mb-1" style="color: #00d4ff;">{{ product.category }}</p>
            <p class="font-bold uppercase text-sm mb-1">{{ product.name }}</p>
            <p class="text-sm" style="color: #7eb8d4;">₦{{ product.price }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- ===================== BANNER ===================== -->
    <section
      class="py-6 px-6"
      style="background: linear-gradient(90deg, #0a0a2e 0%, #0d2545 40%, #0a3d6b 70%, #0a0a2e 100%);"
    >
      <div
        class="max-w-7xl mx-auto p-16 flex flex-col md:flex-row items-center justify-between gap-8"
        style="border: 1px solid #00d4ff20;"
      >
        <!-- glow accent -->
        <div class="absolute w-64 h-64 rounded-full opacity-10 blur-3xl pointer-events-none" style="background: #00d4ff;"></div>

        <div class="relative z-10">
          <p class="uppercase tracking-widest text-xs mb-3" style="color: #00d4ff;">Limited Drop</p>
          <h2 class="text-4xl md:text-5xl font-black uppercase leading-tight">
            The Streets<br />Define You
          </h2>
        </div>
        <div class="relative z-10 flex flex-col gap-4 items-start md:items-end">
          <p class="max-w-sm md:text-right" style="color: #7eb8d4;">
            Our most exclusive collection yet. Hand-picked pieces for those who move different.
          </p>
          <NuxtLink
            to="/products"
            class="px-8 py-4 font-bold uppercase tracking-widest text-sm transition-all"
            style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
          >
            Explore Collection
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- ===================== ALL PRODUCTS ===================== -->
    <section
      class="py-24 px-6"
      style="background: linear-gradient(180deg, #050d1a 0%, #020818 100%);"
    >
      <div class="max-w-7xl mx-auto">
        <div class="flex items-end justify-between mb-12">
          <div>
            <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">The Full Range</p>
            <h2 class="text-4xl font-black uppercase">Products</h2>
          </div>
          <NuxtLink to="/products" class="text-sm uppercase tracking-widest transition-colors" style="color: #7eb8d4;">
            View All →
          </NuxtLink>
        </div>

        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <div
            v-for="product in allProducts"
            :key="product.id"
            class="group cursor-pointer"
            @click="$router.push(`/products/${product.slug}`)"
          >
            <div
              class="aspect-[3/4] overflow-hidden mb-4 relative"
              style="background: linear-gradient(135deg, #0d2545, #0a3d6b); border: 1px solid #00d4ff20;"
            >
              <div class="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-widest" style="color: #00d4ff30;">
                No Image
              </div>
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style="background: rgba(0,212,255,0.05);"></div>
            </div>
            <p class="text-xs uppercase tracking-widest mb-1" style="color: #00d4ff;">{{ product.category }}</p>
            <p class="font-bold uppercase text-sm mb-1">{{ product.name }}</p>
            <p class="text-sm" style="color: #7eb8d4;">₦{{ product.price }}</p>
          </div>
        </div>
      </div>
    </section>

  </div>
</template>

<script setup lang="ts">
const { data: productsData } = await useFetch('/api/products')

const newArrivals = computed(() =>
  (productsData.value as any[])?.filter(p => p.isNew === 1).slice(0, 4) || []
)

const allProducts = computed(() =>
  (productsData.value as any[])?.filter(p => p.isNew === 0) || []
)
</script>
