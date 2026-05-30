<template>
  <div class="min-h-screen text-white pt-24" style="background: #020818;">

    <!-- Loading -->
    <div v-if="pending" class="flex items-center justify-center py-32">
      <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color: #00d4ff; border-top-color: transparent;"></div>
    </div>

    <!-- Error -->
    <div v-else-if="error" class="text-center py-32">
      <p class="text-5xl mb-4">🛸</p>
      <p class="uppercase tracking-widest text-sm mb-6" style="color: #7eb8d4;">Product not found</p>
      <NuxtLink to="/products" class="px-6 py-3 text-xs uppercase tracking-widest font-bold" style="border: 1px solid #00d4ff; color: #00d4ff;">
        Back to Products
      </NuxtLink>
    </div>

    <!-- Product -->
    <div v-else-if="product" class="max-w-7xl mx-auto px-6 py-12">

      <!-- Breadcrumb -->
      <div class="flex items-center gap-2 text-xs uppercase tracking-widest mb-10" style="color: #7eb8d4;">
        <NuxtLink to="/" class="hover:text-white transition-colors">Home</NuxtLink>
        <span style="color: #00d4ff30;">/</span>
        <NuxtLink to="/products" class="hover:text-white transition-colors">Products</NuxtLink>
        <span style="color: #00d4ff30;">/</span>
        <span style="color: #00d4ff;">{{ product.name }}</span>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-12">

        <!-- Image -->
        <div class="aspect-[3/4] relative overflow-hidden" style="background: linear-gradient(135deg, #0d2545, #0a3d6b); border: 1px solid #00d4ff20;">
          <div class="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-widest" style="color: #00d4ff20;">
            No Image
          </div>
          <div class="absolute top-4 left-4 flex flex-col gap-2">
            <span v-if="product.isNew" class="text-xs font-bold px-2 py-1 uppercase tracking-wider" style="background: #00d4ff; color: #020818;">New</span>
            <span v-if="product.isFeatured" class="text-xs font-bold px-2 py-1 uppercase tracking-wider" style="background: #7b2ff7; color: #fff;">Featured</span>
          </div>
        </div>

        <!-- Details -->
        <div class="flex flex-col justify-center">
          <p class="text-xs uppercase tracking-widest mb-3" style="color: #00d4ff;">{{ product.category }}</p>
          <h1 class="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-4">{{ product.name }}</h1>
          <p class="text-3xl font-bold mb-6" style="color: #00d4ff;">${{ product.price }}</p>

          <p class="text-sm mb-8 leading-relaxed" style="color: #7eb8d4;">
            {{ product.description || 'Premium streetwear piece. Limited stock. Crafted for those who move different.' }}
          </p>

          <!-- Stock -->
          <div class="text-xs uppercase tracking-widest mb-6">
            <span v-if="product.stock > 5" style="color: #00d4ff;">● In Stock ({{ product.stock }} left)</span>
            <span v-else-if="product.stock > 0" style="color: #f59e0b;">● Low Stock ({{ product.stock }} left)</span>
            <span v-else style="color: #ff4444;">● Out of Stock</span>
          </div>

          <!-- Size selector -->
          <div class="mb-8">
            <p class="text-xs uppercase tracking-widest mb-3" style="color: #7eb8d4;">Select Size</p>
            <div class="flex flex-wrap gap-2">
              <button
                v-for="size in sizes"
                :key="size"
                class="w-12 h-12 text-xs font-bold uppercase transition-all"
                :style="selectedSize === size ? 'background: #00d4ff; color: #020818;' : 'border: 1px solid #00d4ff30; color: #7eb8d4;'"
                @click="selectedSize = size"
              >
                {{ size }}
              </button>
            </div>
          </div>

          <!-- Add to cart -->
          <div class="flex flex-col sm:flex-row gap-4">
            <button
              class="flex-1 py-4 font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-50"
              style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
              :disabled="product.stock === 0"
              @click="handleAddToCart"
            >
              {{ product.stock === 0 ? 'Out of Stock' : 'Add to Cart' }}
            </button>
            <NuxtLink
              to="/cart"
              class="flex-1 py-4 font-bold uppercase tracking-widest text-sm text-center transition-all"
              style="border: 1px solid #00d4ff; color: #00d4ff;"
            >
              View Cart ({{ cartStore.totalItems }})
            </NuxtLink>
          </div>

          <p v-if="added" class="mt-4 text-xs uppercase tracking-widest text-center" style="color: #00d4ff;">
            ✓ Added to cart!
          </p>
        </div>
      </div>

      <!-- Related products -->
      <div class="mt-24">
        <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">You Might Also Like</p>
        <h2 class="text-3xl font-black uppercase mb-8">Related Products</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div
            v-for="related in relatedProducts"
            :key="related.id"
            class="group cursor-pointer"
            @click="$router.push(`/products/${related.slug}`)"
          >
            <div class="aspect-[3/4] overflow-hidden mb-4 relative" style="background: linear-gradient(135deg, #0d2545, #0a3d6b); border: 1px solid #00d4ff20;">
              <div class="absolute inset-0 flex items-center justify-center text-xs uppercase tracking-widest" style="color: #00d4ff20;">No Image</div>
              <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity" style="background: rgba(0,212,255,0.05);"></div>
            </div>
            <p class="text-xs uppercase tracking-widest mb-1" style="color: #00d4ff;">{{ related.category }}</p>
            <p class="font-bold uppercase text-sm mb-1">{{ related.name }}</p>
            <p class="text-sm" style="color: #7eb8d4;">₦{{ related.price }}</p>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const route = useRoute()
const cartStore = useCartStore()

const { data: product, pending, error } = await useFetch(`/api/products/${route.params.slug}`)
const { data: allProducts } = await useFetch('/api/products')

const sizes = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
const selectedSize = ref('M')
const added = ref(false)

const relatedProducts = computed(() => {
  const all = (allProducts.value as any[]) || []
  return all
    .filter(p => p.category === (product.value as any)?.category && p.id !== (product.value as any)?.id)
    .slice(0, 4)
})

function handleAddToCart() {
  const p = product.value as any
  cartStore.addItem({
    id: p.id,
    name: p.name,
    price: p.price,
    quantity: 1,
    image: '',
  })
  added.value = true
  setTimeout(() => added.value = false, 2000)
}
</script>
