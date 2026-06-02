import { db } from '../../lib/prisma'

export default defineEventHandler((event) => {
  const query = getQuery(event)
  const q = query.q as string || ''
  const category = query.category as string || ''
  const minPrice = Number(query.minPrice) || 0
  const maxPrice = Number(query.maxPrice) || 9999999
  const isNew = query.isNew === 'true'
  const isFeatured = query.isFeatured === 'true'

  let sql = `SELECT * FROM Product WHERE price >= ? AND price <= ?`
  const params: any[] = [minPrice, maxPrice]

  if (q) {
    sql += ` AND (name LIKE ? OR description LIKE ? OR category LIKE ?)`
    params.push(`%${q}%`, `%${q}%`, `%${q}%`)
  }

  if (category) {
    sql += ` AND category = ?`
    params.push(category)
  }

  if (isNew) {
    sql += ` AND isNew = 1`
  }

  if (isFeatured) {
    sql += ` AND isFeatured = 1`
  }

  sql += ` ORDER BY createdAt DESC`

  const products = db.prepare(sql).all(...params)
  return products
})
