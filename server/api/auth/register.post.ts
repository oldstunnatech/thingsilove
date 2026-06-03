import { prisma } from '../../lib/prisma'
import { hashPassword, signToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.name || !body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'All fields are required' })
  }

  const existing = await prisma.user.findUnique({ where: { email: body.email } })
  if (existing) {
    throw createError({ statusCode: 409, statusMessage: 'Email already registered' })
  }

  const user = await prisma.user.create({
    data: {
      name: body.name,
      email: body.email,
      password: hashPassword(body.password),
    },
  })

  const token = signToken({ id: user.id, email: user.email, role: user.role })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role } }
})