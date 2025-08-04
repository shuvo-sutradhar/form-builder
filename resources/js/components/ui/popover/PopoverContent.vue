<template>
  <div
    v-if="isOpen"
    class="absolute z-50 w-72 rounded-md border bg-popover p-4 text-popover-foreground shadow-md outline-none"
    :style="{ top: '100%', left: '0', marginTop: '4px' }"
  >
    <slot />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

const isOpen = ref(false)

// This is a simplified version - in a real implementation, you'd use a proper popover library
// For now, we'll make it always visible for the Date Picker
</script> 