import { prisma } from '../../lib/prisma'
import { comparePassword, signToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  if (!body.email || !body.password) {
    throw createError({ statusCode: 400, statusMessage: 'Email and password are required' })
  }

  const user = await prisma.user.findUnique({ where: { email: body.email } })

  if (!user || !comparePassword(body.password, user.password)) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid email or password' })
  }

  const token = signToken({ id: user.id, email: user.email, role: user.role })

  setCookie(event, 'auth_token', token, {
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7,
    sameSite: 'lax',
    path: '/',
  })

  return { user: { id: user.id, name: user.name, email: user.email, role: user.role } }
})