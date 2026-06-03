import { prisma } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const product = await prisma.product.create({
    data: {
      name: body.name,
      slug: body.slug,
      description: body.description || null,
      price: Number(body.price),
      stock: Number(body.stock) || 0,
      category: body.category,
      images: JSON.stringify(body.images || []),
      isNew: body.isNew || false,
      isFeatured: body.isFeatured || false,
    },
  })

  return { success: true, id: product.id }
})