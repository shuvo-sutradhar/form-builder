<template>
  <div v-if="!isHidden" class="form-field" :class="widthClass">
    <div class="prose prose-sm max-w-none">
      <div v-html="content" class="text-foreground"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  content?: string
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  content: 'Enter your text here...',
  hidden: false,
  width: 'full'
})

// Computed properties to handle the field states
const isHidden = computed(() => {
  return props.fieldState === 'hidden' || props.hidden
})

// Computed property for width classes
const widthClass = computed(() => {
  switch (props.width) {
    case '1/2':
      return 'w-1/2'
    case '1/3':
      return 'w-1/3'
    case '2/3':
      return 'w-2/3'
    case '1/4':
      return 'w-1/4'
    case '3/4':
      return 'w-3/4'
    case 'full':
    default:
      return 'w-full'
  }
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 