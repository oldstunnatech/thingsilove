<template>
  <div class="p-8">
    <div class="flex items-center justify-between mb-8">
      <div>
        <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">Manage</p>
        <h1 class="text-4xl font-black uppercase tracking-tighter">Products</h1>
      </div>
      <button
        class="px-6 py-3 font-bold uppercase tracking-widest text-xs"
        style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
        @click="showAddModal = true"
      >
        + Add Product
      </button>
    </div>

    <!-- Products table -->
    <div style="border: 1px solid #00d4ff15;">
      <div class="grid grid-cols-6 gap-4 px-4 py-3 text-xs uppercase tracking-widest font-semibold" style="color: #7eb8d4; border-bottom: 1px solid #00d4ff15;">
        <span class="col-span-2">Name</span>
        <span>Category</span>
        <span>Price</span>
        <span>Stock</span>
        <span>Actions</span>
      </div>
      <div
        v-for="product in products"
        :key="product.id"
        class="grid grid-cols-6 gap-4 px-4 py-4 items-center"
        style="border-bottom: 1px solid #00d4ff10;"
      >
        <div class="col-span-2">
          <p class="text-sm font-bold uppercase">{{ product.name }}</p>
          <p class="text-xs mt-1" style="color: #7eb8d4;">{{ product.slug }}</p>
        </div>
        <span class="text-xs uppercase tracking-widest" style="color: #00d4ff;">{{ product.category }}</span>
        <span class="text-sm font-bold">₦{{ Number(product.price).toLocaleString() }}</span>
        <span
          class="text-xs font-bold px-2 py-1 w-fit"
          :style="product.stock <= 5 ? 'background: #ff444420; color: #ff4444;' : 'background: #00d4ff20; color: #00d4ff;'"
        >
          {{ product.stock }}
        </span>
        <div class="flex gap-2">
          <button
            class="text-xs uppercase tracking-widest px-3 py-1 transition-all"
            style="border: 1px solid #00d4ff30; color: #00d4ff;"
            @click="editProduct(product)"
          >
            Edit
          </button>
          <button
            class="text-xs uppercase tracking-widest px-3 py-1 transition-all"
            style="border: 1px solid #ff444430; color: #ff4444;"
            @click="deleteProduct(product.id)"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Add/Edit Modal -->
    <div
      v-if="showAddModal || showEditModal"
      class="fixed inset-0 z-50 flex items-center justify-center px-4"
      style="background: rgba(2,8,24,0.95);"
    >
      <div class="w-full max-w-lg p-8 flex flex-col gap-4" style="border: 1px solid #00d4ff20; background: #0a1628;">
        <p class="text-xs uppercase tracking-widest font-semibold" style="color: #00d4ff;">
          {{ showEditModal ? 'Edit Product' : 'Add Product' }}
        </p>

        <input v-model="form.name" type="text" placeholder="Product name" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
        <input v-model="form.slug" type="text" placeholder="Slug (e.g. my-product)" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
        <input v-model="form.description" type="text" placeholder="Description" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
        <div class="grid grid-cols-2 gap-3">
          <input v-model="form.price" type="number" placeholder="Price (₦)" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
          <input v-model="form.stock" type="number" placeholder="Stock" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
        </div>
        <select v-model="form.category" class="w-full px-4 py-3 text-sm outline-none text-white" style="border: 1px solid #00d4ff30; background: #0a1628;">
          <option value="">Select category</option>
          <option v-for="cat in categories" :key="cat" :value="cat">{{ cat }}</option>
        </select>
        <div class="flex gap-6">
          <label class="flex items-center gap-2 text-xs uppercase tracking-widest" style="color: #7eb8d4;">
            <input v-model="form.isNew" type="checkbox" /> New
          </label>
          <label class="flex items-center gap-2 text-xs uppercase tracking-widest" style="color: #7eb8d4;">
            <input v-model="form.isFeatured" type="checkbox" /> Featured
          </label>
        </div>

        <p v-if="formError" class="text-xs uppercase tracking-widest" style="color: #ff4444;">⚠ {{ formError }}</p>

        <div class="flex gap-3 mt-2">
          <button
            class="flex-1 py-3 font-bold uppercase tracking-widest text-xs"
            style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
            @click="showEditModal ? updateProduct() : addProduct()"
          >
            {{ showEditModal ? 'Update' : 'Add Product' }}
          </button>
          <button
            class="flex-1 py-3 font-bold uppercase tracking-widest text-xs"
            style="border: 1px solid #00d4ff30; color: #7eb8d4;"
            @click="closeModal"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { data: productsData, refresh } = await useFetch('/api/admin/products')
const products = computed(() => (productsData.value as any[]) || [])

const categories = ['Tops', 'Bottoms', 'Outerwear', 'Accessories']
const showAddModal = ref(false)
const showEditModal = ref(false)
const editingId = ref('')
const formError = ref('')

const form = reactive({
  name: '', slug: '', description: '', price: 0, stock: 0,
  category: '', isNew: false, isFeatured: false,
})

function editProduct(product: any) {
  Object.assign(form, {
    name: product.name,
    slug: product.slug,
    description: product.description || '',
    price: product.price,
    stock: product.stock,
    category: product.category,
    isNew: product.isNew === 1,
    isFeatured: product.isFeatured === 1,
  })
  editingId.value = product.id
  showEditModal.value = true
}

function closeModal() {
  showAddModal.value = false
  showEditModal.value = false
  formError.value = ''
  Object.assign(form, { name: '', slug: '', description: '', price: 0, stock: 0, category: '', isNew: false, isFeatured: false })
}

async function addProduct() {
  formError.value = ''
  if (!form.name || !form.slug || !form.price || !form.category) {
    formError.value = 'Please fill in all required fields.'
    return
  }
  await $fetch('/api/admin/products', { method: 'POST', body: form })
  await refresh()
  closeModal()
}

async function updateProduct() {
  formError.value = ''
  await $fetch(`/api/admin/products/${editingId.value}`, { method: 'PATCH', body: form })
  await refresh()
  closeModal()
}

async function deleteProduct(id: string) {
  if (!confirm('Are you sure you want to delete this product?')) return
  await $fetch(`/api/admin/products/${id}`, { method: 'DELETE' })
  await refresh()
}
</script>
