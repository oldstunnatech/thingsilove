import { prisma } from '../../../lib/prisma'
import { verifyToken } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  const payload = token ? verifyToken(token) : null
  if (!payload || payload.role !== 'admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const id = getRouterParam(event, 'id')
  const body = await readBody(event)

  await prisma.order.update({
    where: { id: String(id) },
    data: { status: body.status },
  })

  return { success: true }
})
