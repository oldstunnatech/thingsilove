import { db } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const body = await readBody(event)
  const id = crypto.randomUUID().replace(/-/g, '')

  db.prepare(`
    INSERT INTO Product (id, name, slug, description, price, stock, category, images, isNew, isFeatured, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, ?, ?, ?, '[]', ?, ?, datetime('now'), datetime('now'))
  `).run(id, body.name, body.slug, body.description || null, body.price, body.stock, body.category, body.isNew ? 1 : 0, body.isFeatured ? 1 : 0)

  return { success: true, id }
})
