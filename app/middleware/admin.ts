export default defineNuxtRouteMiddleware(async () => {
  const { data } = await useFetch('/api/auth/me')
  const user = data.value as any

  if (!user) {
    return navigateTo('/account/login')
  }

  if (user.role !== 'admin') {
    return navigateTo('/')
  }
})
