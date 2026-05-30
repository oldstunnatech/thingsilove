<template>
  <div class="min-h-screen text-white pt-24" style="background: #020818;">
    <div class="max-w-4xl mx-auto px-6 py-12">

      <!-- Header -->
      <div class="mb-12">
        <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">My Account</p>
        <h1 class="text-5xl font-black uppercase tracking-tighter">Order History</h1>
      </div>

      <!-- Success message -->
      <div
        v-if="route.query.order"
        class="mb-8 p-6 flex items-center gap-4"
        style="border: 1px solid #00d4ff30; background: linear-gradient(135deg, #0d2545, #0a1628);"
      >
        <p class="text-2xl">✅</p>
        <div>
          <p class="font-bold uppercase tracking-widest text-sm" style="color: #00d4ff;">Order Placed Successfully!</p>
          <p class="text-xs mt-1" style="color: #7eb8d4;">Order ID: {{ route.query.order }}</p>
        </div>
      </div>

      <!-- Loading -->
      <div v-if="pending" class="flex items-center justify-center py-32">
        <div class="w-8 h-8 rounded-full border-2 animate-spin" style="border-color: #00d4ff; border-top-color: transparent;"></div>
      </div>

      <!-- Empty -->
      <div v-else-if="orders.length === 0" class="text-center py-24">
        <p class="text-4xl mb-4">📦</p>
        <p class="uppercase tracking-widest text-sm mb-6" style="color: #7eb8d4;">No orders yet</p>
        <NuxtLink
          to="/products"
          class="px-8 py-4 font-bold uppercase tracking-widest text-sm"
          style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
        >
          Start Shopping
        </NuxtLink>
      </div>

      <!-- Orders list -->
      <div v-else class="flex flex-col gap-6">
        <div
          v-for="order in orders"
          :key="order.id"
          class="p-6"
          style="border: 1px solid #00d4ff20; background: linear-gradient(135deg, #0d2545, #0a1628);"
        >
          <!-- Order header -->
          <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6" style="border-bottom: 1px solid #00d4ff15; padding-bottom: 1rem;">
            <div>
              <p class="text-xs uppercase tracking-widest mb-1" style="color: #7eb8d4;">Order ID</p>
              <p class="font-black uppercase text-sm">{{ order.id }}</p>
            </div>
            <div class="sm:text-center">
              <p class="text-xs uppercase tracking-widest mb-1" style="color: #7eb8d4;">Date</p>
              <p class="text-sm font-bold">{{ new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'long', year: 'numeric' }) }}</p>
            </div>
            <div class="sm:text-center">
              <p class="text-xs uppercase tracking-widest mb-1" style="color: #7eb8d4;">Total</p>
              <p class="text-lg font-black" style="color: #00d4ff;">₦{{ Number(order.total).toLocaleString() }}</p>
            </div>
            <div class="sm:text-right">
              <p class="text-xs uppercase tracking-widest mb-1" style="color: #7eb8d4;">Status</p>
              <span
                class="text-xs uppercase tracking-widest font-bold px-3 py-1"
                :style="statusStyle(order.status)"
              >
                {{ order.status }}
              </span>
            </div>
          </div>

          <!-- Order items -->
          <div class="flex flex-col gap-3">
            <p class="text-xs uppercase tracking-widest mb-2" style="color: #7eb8d4;">Items</p>
            <div
              v-for="item in order.items"
              :key="item.id"
              class="flex items-center justify-between"
            >
              <div class="flex items-center gap-4">
                <div
                  class="w-12 h-16 shrink-0 flex items-center justify-center text-xs"
                  style="background: linear-gradient(135deg, #0a3d6b, #0d2545); color: #00d4ff20;"
                >
                  IMG
                </div>
                <div>
                  <p class="text-sm font-bold uppercase">{{ item.productName }}</p>
                  <p class="text-xs mt-1" style="color: #7eb8d4;">Qty: {{ item.quantity }}</p>
                </div>
              </div>
              <p class="text-sm font-bold" style="color: #00d4ff;">
                ₦{{ (Number(item.price) * item.quantity).toLocaleString() }}
              </p>
            </div>
          </div>

          <!-- Actions -->
          <div class="flex gap-3 mt-6 pt-4" style="border-top: 1px solid #00d4ff15;">
            <NuxtLink
              to="/products"
              class="px-6 py-3 font-bold uppercase tracking-widest text-xs transition-all"
              style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
            >
              Shop Again
            </NuxtLink>
            <button
              v-if="order.status === 'delivered'"
              class="px-6 py-3 font-bold uppercase tracking-widest text-xs transition-all"
              style="border: 1px solid #00d4ff30; color: #7eb8d4;"
            >
              Leave Review
            </button>
          </div>
        </div>
      </div>

      <!-- Back to account -->
      <NuxtLink
        to="/account"
        class="inline-block mt-8 text-xs uppercase tracking-widest transition-colors hover:text-white"
        style="color: #7eb8d4;"
      >
        ← Back to Account
      </NuxtLink>

    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'auth' })

const route = useRoute()
const { data: ordersData, pending } = await useFetch('/api/orders')
const orders = computed(() => (ordersData.value as any[]) || [])

function statusStyle(status: string) {
  const styles: Record<string, string> = {
    paid: 'background: #00d4ff20; color: #00d4ff;',
    pending: 'background: #f59e0b20; color: #f59e0b;',
    shipped: 'background: #7b2ff720; color: #7b2ff7;',
    delivered: 'background: #10b98120; color: #10b981;',
    cancelled: 'background: #ff444420; color: #ff4444;',
  }
  return styles[status] || styles.pending
}
</script>
