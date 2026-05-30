import { db } from '../../lib/prisma'
import { hashPassword, signToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  const existing = db.prepare('SELECT id FROM User WHERE email = ?').get(body.email)
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const hashedPassword = hashPassword(body.password)
  const id = crypto.randomUUID().replace(/-/g, '')

  db.prepare(`
    INSERT INTO User (id, name, email, password, role, createdAt, updatedAt)
    VALUES (?, ?, ?, ?, 'customer', datetime('now'), datetime('now'))
  `).run(id, body.name, body.email, hashedPassword)

  const token = signToken({ id, email: body.email, role: 'customer' })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })

  return { user: { id, name: body.name, email: body.email, role: 'customer' } }
})
