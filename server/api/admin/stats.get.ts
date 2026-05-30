import { db } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const totalProducts = (db.prepare('SELECT COUNT(*) as count FROM Product').get() as any).count
  const totalOrders = (db.prepare('SELECT COUNT(*) as count FROM "Order"').get() as any).count
  const totalUsers = (db.prepare('SELECT COUNT(*) as count FROM User').get() as any).count
  const totalRevenue = (db.prepare('SELECT SUM(total) as sum FROM "Order" WHERE status = "paid"').get() as any).sum || 0
  const recentOrders = db.prepare('SELECT * FROM "Order" ORDER BY createdAt DESC LIMIT 5').all()
  const lowStock = db.prepare('SELECT * FROM Product WHERE stock <= 5 ORDER BY stock ASC').all()

  return { totalProducts, totalOrders, totalUsers, totalRevenue, recentOrders, lowStock }
})
