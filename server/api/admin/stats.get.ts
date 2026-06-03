import { prisma } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const [totalProducts, totalOrders, totalUsers, revenueData, recentOrders, lowStock] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.user.count(),
    prisma.order.aggregate({ where: { status: 'paid' }, _sum: { total: true } }),
    prisma.order.findMany({ orderBy: { createdAt: 'desc' }, take: 5 }),
    prisma.product.findMany({ where: { stock: { lte: 5 } }, orderBy: { stock: 'asc' } }),
  ])

  return {
    totalProducts,
    totalOrders,
    totalUsers,
    totalRevenue: revenueData._sum.total || 0,
    recentOrders,
    lowStock,
  }
})