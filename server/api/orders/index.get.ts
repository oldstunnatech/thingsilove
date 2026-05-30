import { db } from '../../lib/prisma'
import { verifyToken } from '../../utils/auth'

export default defineEventHandler((event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const orders = db.prepare(`
    SELECT o.*,
    (
      SELECT json_group_array(json_object(
        'id', oi.id,
        'productId', oi.productId,
        'quantity', oi.quantity,
        'price', oi.price,
        'productName', p.name,
        'productSlug', p.slug
      ))
      FROM OrderItem oi
      LEFT JOIN Product p ON oi.productId = p.id
      WHERE oi.orderId = o.id
    ) as items
    FROM "Order" o
    WHERE o.userId = ?
    ORDER BY o.createdAt DESC
  `).all(payload.id)

  return orders.map((order: any) => ({
    ...order,
    items: JSON.parse(order.items || '[]')
  }))
})
