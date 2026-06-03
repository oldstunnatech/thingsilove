// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    '@nuxt/ui',
    '@nuxt/image',
    '@pinia/nuxt',
    
  ],
  css: ['./assets/css/main.css'],
  devtools: { enabled: true },
  compatibilityDate: '2024-01-01',

  runtimeConfig: {
    paystackSecretKey: process.env.sk_test_6605438a4a7e21e114f1392ffe2977328b2fa54e,
    public: {
      paystackPublicKey: process.env.pk_test_2c43982689341341aff0a755417406f27fb901ba,
    },
  },

  vite: {
    optimizeDeps: {
      include: [
        '@supabase/supabase-js',
        '@vue/devtools-core',
        '@vue/devtools-kit',
      ]
    }
  },
  
  

})