<template>
  <div class="min-h-screen text-white pt-24" style="background: #020818;">

    <!-- Page Header -->
    <section
      class="py-16 px-6 text-center"
      style="background: linear-gradient(135deg, #020818 0%, #0a1628 50%, #0d2545 100%);"
    >
      <p class="uppercase tracking-widest text-xs font-semibold mb-3" style="color: #00d4ff;">The Full Range</p>
      <h1 class="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">All Products</h1>
      <p class="text-sm max-w-xl mx-auto" style="color: #7eb8d4;">
        Exclusive streetwear drops. Limited pieces. No restocks.
      </p>
    </section>

    <!-- Filters + Products -->
    <section class="max-w-7xl mx-auto px-6 py-12">

      <!-- Filter bar -->
      <div class="flex flex-wrap items-center gap-3 mb-10">
        <button
          v-for="cat in categories"
          :key="cat"
          class="px-5 py-2 text-xs uppercase tracking-widest font-semibold transition-all"
          :style="activeCategory === cat
            ? 'background: #00d4ff; color: #020818;'
            : 'border: 1px solid #00d4ff30; color: #7eb8d4; background: transparent;'"
          @click="activeCategory = cat"
        >
          {{ cat }}
        </button>
      </div>

      <!-- Results count -->
      <p class="text-xs uppercase tracking-widest mb-8" style="color: #7eb8d4;">
        {{ filteredProducts.length }} Products
      </p>

      <!-- Product grid -->
      <div v-if="filteredProducts.length > 0" class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div
          v-for="product in filteredProducts"
          :key="product.id"
          class="group cursor-pointer"
          @click="$router.push(`/products/${product.slug}`)"
        >
          <!-- Image -->
          <div
            class="aspect-[3/4] overflow-hidden mb-4 relative"
            style="background: linear-gradient(135deg, #0d2545, #0a3d6b); border: 1px solid #00d4ff20;"
          >
            <div
              class="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-widest"
              style="color: #00d4ff20;"
            >
              No Image
            </div>
            <div
              class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style="background: rgba(0,212,255,0.05);"
            />
            <!-- Badges -->
            <div class="absolute top-3 left-3 flex flex-col gap-1">
              <span
                v-if="product.isNew"
                class="text-xs font-bold px-2 py-1 uppercase tracking-wider"
                style="background: #00d4ff; color: #020818;"
              >
                New
              </span>
              <span
                v-if="product.isFeatured"
                class="text-xs font-bold px-2 py-1 uppercase tracking-wider"
                style="background: #7b2ff7; color: #fff;"
              >
                Featured
              </span>
            </div>
            <!-- Quick add -->
            <div
              class="absolute bottom-0 left-0 right-0 py-3 text-center text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
              style="background: #00d4ff; color: #020818;"
              @click.stop="addToCart(product)"
            >
              Quick Add
            </div>
          </div>

          <!-- Info -->
          <p class="text-xs uppercase tracking-widest mb-1" style="color: #00d4ff;">{{ product.category }}</p>
          <p class="font-bold uppercase text-sm mb-1 group-hover:text-white transition-colors" style="color: #e2e8f0;">
            {{ product.name }}
          </p>
          <p class="text-sm" style="color: #7eb8d4;">₦{{ product.price }}</p>
        </div>
      </div>

      <!-- Empty state -->
      <div v-else class="text-center py-24">
        <p class="text-4xl mb-4">🛸</p>
        <p class="uppercase tracking-widest text-sm" style="color: #7eb8d4;">No products found</p>
      </div>

    </section>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()

const { data: productsData } = await useFetch('/api/products')

const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories']
const activeCategory = ref('All')

const filteredProducts = computed(() => {
  const products = (productsData.value as any[]) || []
  if (activeCategory.value === 'All') return products
  return products.filter(p => p.category === activeCategory.value)
})

function addToCart(product: any) {
  cartStore.addItem({
    id: product.id,
    name: product.name,
    price: product.price,
    quantity: 1,
    image: '',
  })
}
</script>