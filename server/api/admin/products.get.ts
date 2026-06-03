import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  return await prisma.product.findMany({ orderBy: { createdAt: 'desc' } })
})