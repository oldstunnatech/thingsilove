<template>
  <div class="min-h-screen text-white pt-24" style="background: #020818;">
    <div class="max-w-6xl mx-auto px-6 py-12">

      <div class="mb-12">
        <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">Final Step</p>
        <h1 class="text-5xl font-black uppercase tracking-tighter">Checkout</h1>
      </div>

      <div v-if="cartStore.items.length === 0" class="text-center py-32">
        <p class="text-5xl mb-4">🛸</p>
        <p class="uppercase tracking-widest text-sm mb-8" style="color: #7eb8d4;">Your cart is empty</p>
        <NuxtLink to="/products" class="px-8 py-4 font-bold uppercase tracking-widest text-sm" style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;">
          Shop Now
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-2 gap-12">

        <div class="flex flex-col gap-8">

          <div>
            <p class="text-xs uppercase tracking-widest font-semibold mb-4" style="color: #00d4ff;">Contact Info</p>
            <div class="flex flex-col gap-3">
              <input
                v-model="form.email"
                type="email"
                placeholder="Email address"
                class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white"
                style="border: 1px solid #00d4ff30;"
              />
              <input
                v-model="form.phone"
                type="tel"
                placeholder="Phone number"
                class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white"
                style="border: 1px solid #00d4ff30;"
              />
            </div>
          </div>

          <div>
            <p class="text-xs uppercase tracking-widest font-semibold mb-4" style="color: #00d4ff;">Shipping Address</p>
            <div class="flex flex-col gap-3">
              <div class="grid grid-cols-2 gap-3">
                <input v-model="form.firstName" type="text" placeholder="First name" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
                <input v-model="form.lastName" type="text" placeholder="Last name" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
              </div>
              <input v-model="form.address" type="text" placeholder="Street address" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
              <div class="grid grid-cols-2 gap-3">
                <input v-model="form.city" type="text" placeholder="City" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
                <input v-model="form.state" type="text" placeholder="State" class="w-full px-4 py-3 text-sm bg-transparent outline-none text-white" style="border: 1px solid #00d4ff30;" />
              </div>
            </div>
          </div>

          <p v-if="errorMsg" class="text-xs uppercase tracking-widest" style="color: #ff4444;">
            ⚠ {{ errorMsg }}
          </p>

          <button
            class="w-full py-4 font-bold uppercase tracking-widest text-sm transition-all disabled:opacity-50"
            style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
            :disabled="loading"
            @click="initializePayment"
          >
            {{ loading ? 'Initializing...' : `Pay ₦${cartStore.totalPrice.toLocaleString()}` }}
          </button>

          <p class="text-xs text-center" style="color: #7eb8d4;">
            🔒 Secured by Paystack
          </p>
        </div>

        <div class="h-fit flex flex-col gap-4 p-6" style="border: 1px solid #00d4ff20; background: linear-gradient(135deg, #0d2545, #0a1628);">
          <p class="text-xs uppercase tracking-widest font-semibold" style="color: #00d4ff;">Order Summary</p>

          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex justify-between items-center py-3"
            style="border-bottom: 1px solid #00d4ff10;"
          >
            <div>
              <p class="text-sm font-bold uppercase">{{ item.name }}</p>
              <p class="text-xs" style="color: #7eb8d4;">Qty: {{ item.quantity }}</p>
            </div>
            <p class="text-sm font-bold" style="color: #00d4ff;">
              ₦{{ (item.price * item.quantity).toLocaleString() }}
            </p>
          </div>

          <div class="flex justify-between text-sm pt-2" style="color: #7eb8d4;">
            <span>Subtotal</span>
            <span>₦{{ cartStore.totalPrice.toLocaleString() }}</span>
          </div>
          <div class="flex justify-between text-sm" style="color: #7eb8d4;">
            <span>Shipping</span>
            <span style="color: #00d4ff;">Free</span>
          </div>
          <div class="flex justify-between font-black text-xl pt-4" style="border-top: 1px solid #00d4ff20;">
            <span>Total</span>
            <span style="color: #00d4ff;">₦{{ cartStore.totalPrice.toLocaleString() }}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'
import { useAuthStore } from '~/stores/auth'

definePageMeta({ middleware: 'auth' })

const cartStore = useCartStore()
const authStore = useAuthStore()
const router = useRouter()
const config = useRuntimeConfig()

const loading = ref(false)
const errorMsg = ref('')
const paystackReady = ref(false)

const form = reactive({
  email: authStore.user?.email || '',
  phone: '',
  firstName: '',
  lastName: '',
  address: '',
  city: '',
  state: '',
})

// Load Paystack script manually
onMounted(() => {
  if ((window as any).PaystackPop) {
    paystackReady.value = true
    return
  }
  const script = document.createElement('script')
  script.src = 'https://js.paystack.co/v1/inline.js'
  script.onload = () => {
    paystackReady.value = true
    console.log('Paystack loaded successfully')
  }
  script.onerror = () => {
    errorMsg.value = 'Failed to load Paystack. Check your internet connection.'
  }
  document.head.appendChild(script)
})

function validateForm() {
  if (!form.email || !form.firstName || !form.lastName || !form.address || !form.city) {
    errorMsg.value = 'Please fill in all required fields.'
    return false
  }
  return true
}

async function initializePayment() {
  errorMsg.value = ''

  if (!paystackReady.value) {
    errorMsg.value = 'Paystack is still loading. Please wait a moment and try again.'
    return
  }

  if (!validateForm()) return
  loading.value = true

  try {
    const data = await $fetch('/api/payment/initialize', {
      method: 'POST',
      body: {
        email: form.email,
        amount: cartStore.totalPrice,
        cartItems: cartStore.items,
      },
    }) as any

    const handler = (window as any).PaystackPop.setup({
      key: config.public.paystackPublicKey,
      email: form.email,
      amount: cartStore.totalPrice * 100,
      currency: 'NGN',
      ref: data.reference,
      onClose() {
        loading.value = false
      },
      callback(response: any) {
        // No async here — use then/catch instead
        $fetch(`/api/payment/verify?reference=${response.reference}`)
          .then((result: any) => {
            if (result.success) {
              cartStore.clearCart()
              router.push(`/account/orders?order=${result.orderId}`)
            }
          })
          .catch((e: any) => {
            errorMsg.value = e?.data?.statusMessage || 'Payment verification failed.'
            loading.value = false
          })
      },
    })

    handler.openIframe()
  } catch (e: any) {
    console.error('Payment error:', e)
    errorMsg.value = e?.data?.statusMessage || 'Payment failed. Please try again.'
    loading.value = false
  }
}
</script>