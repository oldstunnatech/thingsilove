import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const q = query.q as string || ''
  const category = query.category as string || ''
  const minPrice = Number(query.minPrice) || 0
  const maxPrice = Number(query.maxPrice) || 9999999
  const isNew = query.isNew === 'true'
  const isFeatured = query.isFeatured === 'true'

  const products = await prisma.product.findMany({
    where: {
      AND: [
        q ? {
          OR: [
            { name: { contains: q, mode: 'insensitive' } },
            { description: { contains: q, mode: 'insensitive' } },
            { category: { contains: q, mode: 'insensitive' } },
          ]
        } : {},
        category ? { category } : {},
        { price: { gte: minPrice, lte: maxPrice } },
        isNew ? { isNew: true } : {},
        isFeatured ? { isFeatured: true } : {},
      ]
    },
    orderBy: { createdAt: 'desc' },
  })

  return products
})