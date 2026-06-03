import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })

  const payload = verifyToken(token)
  if (!payload) throw createError({ statusCode: 401, statusMessage: 'Invalid token' })

  const orders = await prisma.order.findMany({
    where: { userId: payload.id },
    orderBy: { createdAt: 'desc' },
    include: {
      items: {
        include: {
          product: {
            select: { name: true, slug: true }
          }
        }
      }
    }
  })

  return orders
})