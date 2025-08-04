<template>
  <div v-if="!isHidden" class="form-field space-y-2" :class="widthClass">
    <Label v-if="label && !hideFieldName" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="isRequired" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    <div class="flex items-center space-x-1">
      <button
        v-for="star in maxRating"
        :key="star"
        type="button"
        :disabled="isDisabled"
        @click="setRating(star)"
        class="text-2xl transition-colors"
        :class="[
          star <= modelValue ? 'text-yellow-400' : 'text-gray-300',
          isDisabled ? 'cursor-not-allowed opacity-50' : 'hover:text-yellow-400 cursor-pointer'
        ]"
      >
        ★
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface Props {
  label?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  hideFieldName?: boolean
  width?: string
  maxRating?: number
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full',
  maxRating: 5
})

const emit = defineEmits<{
  'update:value': [value: number]
}>()

// Computed properties to handle the field states
const isRequired = computed(() => {
  return props.fieldState === 'required' || props.required
})

const isDisabled = computed(() => {
  return props.fieldState === 'disabled' || props.disabled
})

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

const setRating = (rating: number) => {
  if (!isDisabled.value) {
    emit('update:value', rating)
  }
}
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 