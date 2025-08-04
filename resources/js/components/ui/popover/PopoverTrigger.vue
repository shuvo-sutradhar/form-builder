<template>
  <div @click="toggle" class="cursor-pointer">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { inject } from 'vue'

const emit = defineEmits<{
  click: []
}>()

const toggle = () => {
  emit('click')
}
</script> 