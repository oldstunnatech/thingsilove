<template>
  <div class="p-8">
    <div class="mb-8">
      <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">Overview</p>
      <h1 class="text-4xl font-black uppercase tracking-tighter">Dashboard</h1>
    </div>

    <!-- Stats grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
      <div
        v-for="stat in stats"
        :key="stat.label"
        class="p-6"
        style="border: 1px solid #00d4ff20; background: linear-gradient(135deg, #0d2545, #0a1628);"
      >
        <p class="text-xs uppercase tracking-widest mb-2" style="color: #7eb8d4;">{{ stat.label }}</p>
        <p class="text-3xl font-black" style="color: #00d4ff;">{{ stat.value }}</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">

      <!-- Recent orders -->
      <div>
        <p class="text-xs uppercase tracking-widest font-semibold mb-4" style="color: #00d4ff;">Recent Orders</p>
        <div class="flex flex-col gap-2">
          <div
            v-if="data?.recentOrders?.length === 0"
            class="p-4 text-xs uppercase tracking-widest"
            style="color: #7eb8d4; border: 1px solid #00d4ff15;"
          >
            No orders yet
          </div>
          <div
            v-for="order in data?.recentOrders"
            :key="order.id"
            class="flex items-center justify-between p-4"
            style="border: 1px solid #00d4ff15; background: linear-gradient(135deg, #0d2545, #0a1628);"
          >
            <div>
              <p class="text-xs font-bold uppercase">{{ order.id.substring(0, 8) }}...</p>
              <p class="text-xs mt-1" style="color: #7eb8d4;">{{ order.createdAt }}</p>
            </div>
            <div class="text-right">
              <p class="text-sm font-bold" style="color: #00d4ff;">₦{{ Number(order.total).toLocaleString() }}</p>
              <span
                class="text-xs uppercase tracking-widest px-2 py-1"
                :style="order.status === 'paid' ? 'background: #00d4ff20; color: #00d4ff;' : 'background: #f59e0b20; color: #f59e0b;'"
              >
                {{ order.status }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Low stock -->
      <div>
        <p class="text-xs uppercase tracking-widest font-semibold mb-4" style="color: #00d4ff;">Low Stock Alert</p>
        <div class="flex flex-col gap-2">
          <div
            v-if="data?.lowStock?.length === 0"
            class="p-4 text-xs uppercase tracking-widest"
            style="color: #7eb8d4; border: 1px solid #00d4ff15;"
          >
            All products well stocked
          </div>
          <div
            v-for="product in data?.lowStock"
            :key="product.id"
            class="flex items-center justify-between p-4"
            style="border: 1px solid #ff444420; background: linear-gradient(135deg, #0d2545, #0a1628);"
          >
            <p class="text-xs font-bold uppercase">{{ product.name }}</p>
            <span class="text-xs font-bold px-2 py-1" style="background: #ff444420; color: #ff4444;">
              {{ product.stock }} left
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { data } = await useFetch('/api/admin/stats')

const stats = computed(() => [
  { label: 'Total Products', value: (data.value as any)?.totalProducts || 0 },
  { label: 'Total Orders', value: (data.value as any)?.totalOrders || 0 },
  { label: 'Total Users', value: (data.value as any)?.totalUsers || 0 },
  { label: 'Revenue', value: `₦${Number((data.value as any)?.totalRevenue || 0).toLocaleString()}` },
])
</script>
