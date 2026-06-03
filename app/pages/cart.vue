<template>
  <div class="min-h-screen text-white pt-24" style="background: #020818;">
    <div class="max-w-5xl mx-auto px-6 py-12">

      <!-- Header -->
      <div class="mb-12">
        <p class="uppercase tracking-widest text-xs mb-2" style="color: #00d4ff;">Your Selection</p>
        <h1 class="text-5xl font-black uppercase tracking-tighter">Your Cart</h1>
      </div>

      <!-- Empty cart -->
      <div v-if="cartStore.items.length === 0" class="text-center py-32">
        <p class="text-5xl mb-4"></p>
        <p class="uppercase tracking-widest text-sm mb-8" style="color: #7eb8d4;">Your cart is empty</p>
        <NuxtLink
          to="/products"
          class="px-8 py-4 font-bold uppercase tracking-widest text-sm"
          style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
        >
          Shop Now
        </NuxtLink>
      </div>

      <!-- Cart items -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-12">

        <!-- Items list -->
        <div class="lg:col-span-2 flex flex-col gap-4">
          <div
            v-for="item in cartStore.items"
            :key="item.id"
            class="flex gap-6 p-4"
            style="border: 1px solid #00d4ff15; background: linear-gradient(135deg, #0d2545, #0a1628);"
          >
            <!-- Image -->
            <div
              class="w-24 h-32 shrink-0 flex items-center justify-center text-xs uppercase tracking-widest"
              style="background: linear-gradient(135deg, #0a3d6b, #0d2545); color: #00d4ff20;"
            >
              No Img
            </div>

            <!-- Info -->
            <div class="flex-1 flex flex-col justify-between">
              <div>
                <p class="font-black uppercase tracking-tight mb-1">{{ item.name }}</p>
                <p class="text-sm" style="color: #00d4ff;">₦{{ item.price }}</p>
              </div>

              <!-- Quantity controls -->
              <div class="flex items-center gap-3">
                <button
                  class="w-8 h-8 flex items-center justify-center font-bold transition-all hover:text-white"
                  style="border: 1px solid #00d4ff30; color: #7eb8d4;"
                  @click="cartStore.decreaseItem(item.id)"
                >
                  −
                </button>
                <span class="text-sm font-bold w-6 text-center">{{ item.quantity }}</span>
                <button
                  class="w-8 h-8 flex items-center justify-center font-bold transition-all hover:text-white"
                  style="border: 1px solid #00d4ff30; color: #7eb8d4;"
                  @click="cartStore.addItem(item)"
                >
                  +
                </button>
              </div>
            </div>

            <!-- Subtotal + remove -->
            <div class="flex flex-col items-end justify-between">
              <button
                class="text-xs uppercase tracking-widest transition-colors hover:text-white"
                style="color: #7eb8d4;"
                @click="cartStore.removeItem(item.id)"
              >
                Remove
              </button>
              <p class="font-black text-lg" style="color: #00d4ff;">
                ₦{{ (item.price * item.quantity).toFixed(2) }}
              </p>
            </div>
          </div>

          <!-- Continue shopping -->
          <NuxtLink
            to="/products"
            class="text-xs uppercase tracking-widest transition-colors hover:text-white mt-4 self-start"
            style="color: #7eb8d4;"
          >
            ← Continue Shopping
          </NuxtLink>
        </div>

        <!-- Order summary -->
        <div
          class="p-6 h-fit flex flex-col gap-4"
          style="border: 1px solid #00d4ff20; background: linear-gradient(135deg, #0d2545, #0a1628);"
        >
          <p class="text-xs uppercase tracking-widest font-semibold" style="color: #00d4ff;">Order Summary</p>

          <div class="flex justify-between text-sm" style="color: #7eb8d4;">
            <span>Subtotal ({{ cartStore.totalItems }} items)</span>
            <span>₦{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>

          <div class="flex justify-between text-sm" style="color: #7eb8d4;">
            <span>Shipping</span>
            <span style="color: #00d4ff;">Free</span>
          </div>

          <div
            class="flex justify-between font-black text-lg pt-4"
            style="border-top: 1px solid #00d4ff20;"
          >
            <span>Total</span>
            <span style="color: #00d4ff;">₦{{ cartStore.totalPrice.toFixed(2) }}</span>
          </div>

          <NuxtLink
            to="/checkout"
            class="w-full py-4 font-bold uppercase tracking-widest text-sm text-center transition-all mt-2"
            style="background: linear-gradient(90deg, #00d4ff, #0099cc); color: #020818;"
          >
            Proceed to Checkout
          </NuxtLink>

          <button
            class="w-full py-3 font-bold uppercase tracking-widest text-xs transition-all"
            style="border: 1px solid #ff444430; color: #ff4444;"
            @click="cartStore.clearCart()"
          >
            Clear Cart
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart'

const cartStore = useCartStore()
</script>
