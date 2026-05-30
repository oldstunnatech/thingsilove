import { db } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) return null

  const payload = verifyToken(token)
  if (!payload) return null

  const user = db.prepare('SELECT id, name, email, role FROM User WHERE id = ?').get(payload.id) as any

  if (!user) return null

  console.log('Me route - user role:', user.role)
  return user
})
