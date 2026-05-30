import { db } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)

  const insert = db.prepare(`
    INSERT INTO Product (id, name, slug, description, price, stock, category, images, isNew, isFeatured, createdAt, updatedAt)
    VALUES (lower(hex(randomblob(16))), @name, @slug, @description, @price, @stock, @category, @images, @isNew, @isFeatured, datetime('now'), datetime('now'))
  `)

  insert.run({
    name: body.name,
    slug: body.slug,
    description: body.description || null,
    price: body.price,
    stock: body.stock || 0,
    category: body.category,
    images: JSON.stringify(body.images || []),
    isNew: body.isNew ? 1 : 0,
    isFeatured: body.isFeatured ? 1 : 0,
  })

  return { success: true }
})
