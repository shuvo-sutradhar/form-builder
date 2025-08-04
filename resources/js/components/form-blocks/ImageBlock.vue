<template>
  <div v-if="!isHidden" class="form-field" :class="widthClass">
    <div class="flex justify-center">
      <img 
        :src="imageUrl" 
        :alt="altText"
        class="max-w-full h-auto rounded-lg"
        :class="imageSizeClasses"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Props {
  imageUrl?: string
  altText?: string
  imageSize?: 'sm' | 'md' | 'lg'
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  width?: string
}

const props = withDefaults(defineProps<Props>(), {
  imageUrl: 'https://via.placeholder.com/400x300',
  altText: 'Image',
  imageSize: 'md',
  hidden: false,
  width: 'full'
})

// Computed properties to handle the field states
const isHidden = computed(() => {
  return props.fieldState === 'hidden' || props.hidden
})

const imageSizeClasses = computed(() => {
  switch (props.imageSize) {
    case 'sm':
      return 'max-w-xs'
    case 'lg':
      return 'max-w-2xl'
    default:
      return 'max-w-lg'
  }
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