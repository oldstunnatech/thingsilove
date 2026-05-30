<template>
  <div class="p-8">
    <div class="mb-8">
      <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">Manage</p>
      <h1 class="text-4xl font-black uppercase tracking-tighter">Users</h1>
    </div>

    <div style="border: 1px solid #00d4ff15;">
      <div class="grid grid-cols-4 gap-4 px-4 py-3 text-xs uppercase tracking-widest font-semibold" style="color: #7eb8d4; border-bottom: 1px solid #00d4ff15;">
        <span>Name</span>
        <span>Email</span>
        <span>Role</span>
        <span>Joined</span>
      </div>

      <div
        v-if="users.length === 0"
        class="px-4 py-8 text-center text-xs uppercase tracking-widest"
        style="color: #7eb8d4;"
      >
        No users yet
      </div>

      <div
        v-for="user in users"
        :key="user.id"
        class="grid grid-cols-4 gap-4 px-4 py-4 items-center"
        style="border-bottom: 1px solid #00d4ff10;"
      >
        <p class="text-sm font-bold uppercase">{{ user.name }}</p>
        <p class="text-xs" style="color: #7eb8d4;">{{ user.email }}</p>
        <span
          class="text-xs uppercase tracking-widest px-2 py-1 w-fit"
          :style="user.role === 'admin' ? 'background: #7b2ff720; color: #7b2ff7;' : 'background: #00d4ff20; color: #00d4ff;'"
        >
          {{ user.role }}
        </span>
        <p class="text-xs" style="color: #7eb8d4;">{{ new Date(user.createdAt).toLocaleDateString() }}</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({ middleware: 'admin', layout: 'admin' })

const { data: usersData } = await useFetch('/api/admin/users')
const users = computed(() => (usersData.value as any[]) || [])
</script>
