import { db } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const products = db.prepare('SELECT * FROM Product ORDER BY createdAt DESC').all()
  return products
})
