import { verifyToken } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const token = getCookie(event, 'auth_token')
  if (!token) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const payload = verifyToken(token)
  if (!payload) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }

  const body = await readBody(event)
  const { email, amount, cartItems } = body

  if (!email || !amount || !cartItems) {
    throw createError({ statusCode: 400, statusMessage: 'Missing required fields' })
  }

  const response = await fetch('https://api.paystack.co/transaction/initialize', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.PAYSTACK_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      amount: Math.round(amount * 100),
      currency: 'NGN',
      metadata: {
        userId: payload.id,
        cartItems: JSON.stringify(cartItems),
      },
    }),
  })

  const data = await response.json()

  if (!data.status) {
    throw createError({ statusCode: 400, statusMessage: data.message || 'Payment initialization failed' })
  }

  return data.data
})
