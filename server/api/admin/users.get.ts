import { db } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const users = db.prepare('SELECT id, name, email, role, createdAt FROM User ORDER BY createdAt DESC').all()
  return users
})
