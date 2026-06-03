import { prisma } from '../../lib/prisma'

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

  const order = await prisma.order.create({
    data: {
      userId,
      status: 'paid',
      total,
      items: {
        create: items.map((item: any) => ({
          productId: item.id,
          quantity: item.quantity,
          price: item.price,
        }))
      }
    }
  })

  return { success: true, orderId: order.id, total }
})