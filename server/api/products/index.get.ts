import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const products = await prisma.product.findMany({
    where: query.category ? { category: String(query.category) } : undefined,
    orderBy: { createdAt: 'desc' },
  })

  return products
})