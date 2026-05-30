<template>
  <div class="flex min-h-screen flex-col" style="background: #020818;">
    <LayoutHeader />
    <main class="flex-1">
      <slot />
    </main>
    <LayoutFooter />
  </div>
</template>
