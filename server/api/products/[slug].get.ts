import { db } from '../../lib/prisma'

export default defineEventHandler((event) => {
  const slug = getRouterParam(event, 'slug')

  const product = db.prepare('SELECT * FROM Product WHERE slug = ?').get(slug)

  if (!product) {
    throw createError({ statusCode: 404, statusMessage: 'Product not found' })
  }

  return product
})
