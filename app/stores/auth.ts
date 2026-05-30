import { defineStore } from 'pinia'

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isLoggedIn = computed(() => !!user.value)

  async function fetchUser() {
    try {
      const data = await $fetch('/api/auth/me')
      user.value = data as User || null
    } catch {
      user.value = null
    }
  }

  async function login(email: string, password: string) {
    const data = await $fetch('/api/auth/login', {
      method: 'POST',
      body: { email, password },
    })
    user.value = (data as any).user
  }

  async function register(name: string, email: string, password: string) {
    const data = await $fetch('/api/auth/register', {
      method: 'POST',
      body: { name, email, password },
    })
    user.value = (data as any).user
  }

  async function logout() {
    await $fetch('/api/auth/logout', { method: 'POST' })
    user.value = null
  }

  return { user, isLoggedIn, fetchUser, login, register, logout }
})

interface User {
  id: string
  name: string
  email: string
  role: string
}
