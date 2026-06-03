import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const slug = getRouterParam(event, 'slug')

  const product = await prisma.product.findUnique({
    where: { slug: String(slug) },
  })

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return product
})