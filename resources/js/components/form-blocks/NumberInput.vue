<template>
  <div v-if="!isHidden" class="form-field space-y-2">
    <Label v-if="label && !hideFieldName" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="isRequired" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    <Input
      type="number"
      :placeholder="placeholder"
      :required="isRequired"
      :disabled="isDisabled"
      :min="min"
      :max="max"
      :step="step"
      :model-value="modelValue"
      @update:model-value="$emit('update:value', $event)"
      class="w-full"
      :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
    />
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface Props {
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  hideFieldName?: boolean
  width?: string
  min?: number
  max?: number
  step?: number
  modelValue?: string | number
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter number...',
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full',
  step: 1
})

defineEmits<{
  'update:value': [value: string | number]
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


</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 