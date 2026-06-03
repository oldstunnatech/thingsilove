<template>
  <div class="min-h-screen text-white pt-24" style="background: #020818;">

    <!-- Page Header -->
    <section
      class="py-16 px-6 text-center"
      style="background: linear-gradient(135deg, #020818 0%, #0a1628 50%, #0d2545 100%);"
    >
      <p class="uppercase tracking-widest text-xs font-semibold mb-3" style="color: #00d4ff;">The Full Range</p>
      <h1 class="text-5xl md:text-6xl font-black uppercase tracking-tighter mb-4">
        {{ route.query.q ? `Results for "${route.query.q}"` : 'All Products' }}
      </h1>
      <p class="text-sm max-w-xl mx-auto" style="color: #7eb8d4;">
        Exclusive streetwear drops. Limited pieces. No restocks.
      </p>
    </section>

    <section class="max-w-7xl mx-auto px-6 py-12">
      <div class="flex flex-col lg:flex-row gap-8">

        <!-- Sidebar filters -->
        <aside class="w-full lg:w-64 shrink-0">
          <div class="p-6 flex flex-col gap-6" style="border: 1px solid #00d4ff15; background: linear-gradient(135deg, #0d2545, #0a1628);">
            <p class="text-xs uppercase tracking-widest font-semibold" style="color: #00d4ff;">Filters</p>

            <!-- Search -->
            <div>
              <p class="text-xs uppercase tracking-widest mb-3" style="color: #7eb8d4;">Search</p>
              <div class="relative">
                <input
                  v-model="filters.q"
                  type="text"
                  placeholder="Search..."
                  class="w-full px-3 py-2 text-sm bg-transparent outline-none text-white"
                  style="border: 1px solid #00d4ff30;"
                  @input="applyFilters"
                />
              </div>
            </div>

            <!-- Category -->
            <div>
              <p class="text-xs uppercase tracking-widest mb-3" style="color: #7eb8d4;">Category</p>
              <div class="flex flex-col gap-2">
                <button
                  v-for="cat in categories"
                  :key="cat"
                  class="text-left px-3 py-2 text-xs uppercase tracking-widest font-semibold transition-all"
                  :style="filters.category === cat
                    ? 'background: #00d4ff; color: #020818;'
                    : 'border: 1px solid #00d4ff15; color: #7eb8d4;'"
                  @click="toggleCategory(cat)"
                >
                  {{ cat }}
                </button>
              </div>
            </div>

            <!-- Price range -->
            <div>
              <p class="text-xs uppercase tracking-widest mb-3" style="color: #7eb8d4;">Price Range</p>
              <div class="flex flex-col gap-2">
                <button
                  v-for="range in priceRanges"
                  :key="range.label"
                  class="text-left px-3 py-2 text-xs uppercase tracking-widest font-semibold transition-all"
                  :style="filters.priceRange === range.label
                    ? 'background: #00d4ff; color: #020818;'
                    : 'border: 1px solid #00d4ff15; color: #7eb8d4;'"
                  @click="togglePriceRange(range)"
                >
                  {{ range.label }}
                </button>
              </div>
            </div>

            <!-- New & Featured -->
            <div>
              <p class="text-xs uppercase tracking-widest mb-3" style="color: #7eb8d4;">Type</p>
              <div class="flex flex-col gap-2">
                <button
                  class="text-left px-3 py-2 text-xs uppercase tracking-widest font-semibold transition-all"
                  :style="filters.isNew ? 'background: #00d4ff; color: #020818;' : 'border: 1px solid #00d4ff15; color: #7eb8d4;'"
                  @click="filters.isNew = !filters.isNew; applyFilters()"
                >
                  New Arrivals
                </button>
                <button
                  class="text-left px-3 py-2 text-xs uppercase tracking-widest font-semibold transition-all"
                  :style="filters.isFeatured ? 'background: #00d4ff; color: #020818;' : 'border: 1px solid #00d4ff15; color: #7eb8d4;'"
                  @click="filters.isFeatured = !filters.isFeatured; applyFilters()"
                >
                  Featured
                </button>
              </div>
            </div>

            <!-- Clear filters -->
            <button
              class="w-full py-2 text-xs uppercase tracking-widest font-semibold transition-all"
              style="border: 1px solid #ff444430; color: #ff4444;"
              @click="clearFilters"
            >
              Clear Filters
            </button>
          </div>
        </aside>

        <!-- Products -->
        <div class="flex-1">
          <div class="flex items-center justify-between mb-6">
            <p class="text-xs uppercase tracking-widest" style="color: #7eb8d4;">
              {{ products.length }} Products
            </p>
          </div>

          <!-- Loading -->
          <div v-if="pending" class="flex items-center justify-center py-32">
            <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color: #00d4ff; border-top-color: transparent;"></div>
          </div>

          <!-- Grid -->
          <div v-else-if="products.length > 0" class="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div
              v-for="product in products"
              :key="product.id"
              class="group cursor-pointer"
              @click="$router.push(`/products/${product.slug}`)"
            >
              <div
                class="aspect-[3/4] overflow-hidden mb-4 relative"
                style="background: linear-gradient(135deg, #0d2545, #0a3d6b); border: 1px solid #00d4ff20;"
              >
                <div class="absolute inset-0 flex items-center justify-center text-sm uppercase tracking-widest" style="color: #00d4ff20;">No Image</div>
                <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" style="background: rgba(0,212,255,0.05);" />
                <div class="absolute top-3 left-3 flex flex-col gap-1">
                  <span v-if="product.isNew" class="text-xs font-bold px-2 py-1 uppercase tracking-wider" style="background: #00d4ff; color: #020818;">New</span>
                  <span v-if="product.isFeatured" class="text-xs font-bold px-2 py-1 uppercase tracking-wider" style="background: #7b2ff7; color: #fff;">Featured</span>
                </div>
                <div
                  class="absolute bottom-0 left-0 right-0 py-3 text-center text-xs font-bold uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-2 group-hover:translate-y-0"
                  style="background: #00d4ff; color: #020818;"
                  @click.stop="addToCart(product)"
                >
                  Quick Add
                </div>
              </div>
              <p class="text-xs uppercase tracking-widest mb-1" style="color: #00d4ff;">{{ product.category }}</p>
              <p class="font-bold uppercase text-sm mb-1">{{ product.name }}</p>
              <p class="text-sm" style="color: #7eb8d4;">₦{{ Number(product.price).toLocaleString() }}</p>
            </div>
          </div>

          <!-- Empty -->
          <div v-else class="text-center py-24">
            <p class="text-4xl mb-4"></p>
            <p class="uppercase tracking-widest text-sm mb-4" style="color: #7eb8d4;">No products found</p>
            <button
              class="text-xs uppercase tracking-widest font-semibold px-6 py-3 transition-all"
              style="border: 1px solid #00d4ff30; color: #00d4ff;"
              @click="clearFilters"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
const route = useRoute()
const router = useRouter()

const categories = ['All', 'Tops', 'Bottoms', 'Outerwear', 'Accessories']
const priceRanges = [
  { label: 'Under ₦20,000', min: 0, max: 20000 },
  { label: '₦20,000 - ₦50,000', min: 20000, max: 50000 },
  { label: '₦50,000 - ₦100,000', min: 50000, max: 100000 },
  { label: 'Over ₦100,000', min: 100000, max: 9999999 },
]

const filters = reactive({
  q: (route.query.q as string) || '',
  category: '',
  priceRange: '',
  minPrice: 0,
  maxPrice: 9999999,
  isNew: false,
  isFeatured: false,
})

const buildQuery = () => {
  const q: Record<string, any> = {}
  if (filters.q) q.q = filters.q
  if (filters.category && filters.category !== 'All') q.category = filters.category
  if (filters.minPrice > 0) q.minPrice = filters.minPrice
  if (filters.maxPrice < 9999999) q.maxPrice = filters.maxPrice
  if (filters.isNew) q.isNew = true
  if (filters.isFeatured) q.isFeatured = true
  return q
}

const { data: productsData, pending, refresh } = await useFetch('/api/products/search', {
  query: buildQuery(),
})

const products = computed(() => (productsData.value as any[]) || [])

let filterTimeout: ReturnType<typeof setTimeout>
function applyFilters() {
  clearTimeout(filterTimeout)
  filterTimeout = setTimeout(async () => {
    await navigateTo({ query: buildQuery() }, { replace: true })
    await refresh()
  }, 300)
}

function toggleCategory(cat: string) {
  filters.category = filters.category === cat ? '' : cat
  applyFilters()
}

function togglePriceRange(range: any) {
  if (filters.priceRange === range.label) {
    filters.priceRange = ''
    filters.minPrice = 0
    filters.maxPrice = 9999999
  } else {
    filters.priceRange = range.label
    filters.minPrice = range.min
    filters.maxPrice = range.max
  }
  applyFilters()
}

function clearFilters() {
  filters.q = ''
  filters.category = ''
  filters.priceRange = ''
  filters.minPrice = 0
  filters.maxPrice = 9999999
  filters.isNew = false
  filters.isFeatured = false
  applyFilters()
}

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