import { db } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const orders = db.prepare(`
    SELECT o.*, u.name as userName, u.email as userEmail
    FROM "Order" o
    LEFT JOIN User u ON o.userId = u.id
    ORDER BY o.createdAt DESC
  `).all()

  return orders
})
