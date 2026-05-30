<template>
  <div class="p-8">
    <div class="mb-8">
      <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">Manage</p>
      <h1 class="text-4xl font-black uppercase tracking-tighter">Orders</h1>
    </div>

    <div style="border: 1px solid #00d4ff15;">
      <div class="grid grid-cols-5 gap-4 px-4 py-3 text-xs uppercase tracking-widest font-semibold" style="color: #7eb8d4; border-bottom: 1px solid #00d4ff15;">
        <span>Order ID</span>
        <span>Customer</span>
        <span>Total</span>
        <span>Status</span>
        <span>Actions</span>
      </div>

      <div
        v-if="orders.length === 0"
        class="px-4 py-8 text-center text-xs uppercase tracking-widest"
        style="color: #7eb8d4;"
      >
        No orders yet
      </div>

      <div
        v-for="order in orders"
        :key="order.id"
        class="grid grid-cols-5 gap-4 px-4 py-4 items-center"
        style="border-bottom: 1px solid #00d4ff10;"
      >
        <p class="text-xs font-bold uppercase">{{ order.id.substring(0, 8) }}...</p>
        <div>
          <p class="text-xs font-bold">{{ order.userName || 'N/A' }}</p>
          <p class="text-xs" style="color: #7eb8d4;">{{ order.userEmail }}</p>
        </div>
        <p class="text-sm font-bold" style="color: #00d4ff;">₦{{ Number(order.total).toLocaleString() }}</p>
        <span
          class="text-xs uppercase tracking-widest px-2 py-1 w-fit"
          :style="statusStyle(order.status)"
        >
          {{ order.status }}
        </span>
        <select
          class="text-xs uppercase tracking-widest px-2 py-1 outline-none"
          style="border: 1px solid #00d4ff30; background: #0a1628; color: #7eb8d4;"
          :value="order.status"
          @change="updateStatus(order.id, ($event.target as HTMLSelectElement).value)"
        >
          <option value="pending">Pending</option>
          <option value="paid">Paid</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { data: ordersData, refresh } = await useFetch('/api/admin/orders')
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

async function updateStatus(id: string, status: string) {
  await $fetch(`/api/admin/orders/${id}`, { method: 'PATCH', body: { status } })
  await refresh()
}
</script>
