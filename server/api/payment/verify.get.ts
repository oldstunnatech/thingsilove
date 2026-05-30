import { db } from '../../lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const reference = query.reference as string

  if (!reference) {
    throw createError({ statusCode: 400, statusMessage: 'Reference is required' })
  }

  const response = await fetch(`https://api.paystack.co/transaction/verify/${reference}`, {
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
    },
  })

  const data = await response.json()

  if (!data.status || data.data.status !== 'success') {
    throw createError({ statusCode: 400, statusMessage: 'Payment verification failed' })
  }

  const { userId, cartItems } = data.data.metadata
  const items = JSON.parse(cartItems)
  const total = data.data.amount / 100

  const orderId = crypto.randomUUID().replace(/-/g, '')
  db.prepare(`
    INSERT INTO "Order" (id, userId, status, total, createdAt, updatedAt)
    VALUES (?, ?, 'paid', ?, datetime('now'), datetime('now'))
  `).run(orderId, userId, total)

  for (const item of items) {
    const itemId = crypto.randomUUID().replace(/-/g, '')
    db.prepare(`
      INSERT INTO OrderItem (id, orderId, productId, quantity, price)
      VALUES (?, ?, ?, ?, ?)
    `).run(itemId, orderId, item.id, item.quantity, item.price)
  }

  return { success: true, orderId, total }
})
