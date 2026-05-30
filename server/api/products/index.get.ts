import { db } from '../../lib/prisma'

export default defineEventHandler((event) => {
  const query = getQuery(event)

  if (query.category) {
    const products = db.prepare('SELECT * FROM Product WHERE category = ? ORDER BY createdAt DESC').all(query.category)
    return products
  }

  const products = db.prepare('SELECT * FROM Product ORDER BY createdAt DESC').all()
  return products
})
