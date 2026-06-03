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

  await prisma.product.update({
    where: { id: String(id) },
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      price: Number(body.price),
      stock: Number(body.stock),
      category: body.category,
      isNew: body.isNew || false,
      isFeatured: body.isFeatured || false,
    },
  })

  return { success: true }
})
