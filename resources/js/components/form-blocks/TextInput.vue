<template>
  <div v-if="!isHidden" class="form-field space-y-2">
    <Label v-if="label && !hideFieldName" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="isRequired" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    <p v-if="helpText && helpTextPosition === 'above'" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
    <div class="relative">
      <!-- Multi-line input -->
      <textarea
        v-if="multiLine"
        :placeholder="placeholder"
        :required="isRequired"
        :disabled="isDisabled"
        :maxlength="maxLength"
        :value="modelValue"
        @input="handleTextareaInput"
        class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
      />
      <!-- Single-line input -->
      <Input
        v-else
        :type="secretInput ? 'password' : type"
        :placeholder="placeholder"
        :required="isRequired"
        :disabled="isDisabled"
        :maxlength="maxLength"
        :model-value="modelValue"
        @update:model-value="handleInput"
        class="w-full"
        :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
      />
      <div v-if="showCharacterLimit && maxLength" class="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-muted-foreground">
        {{ (modelValue || '').length }}/{{ maxLength }}
      </div>
    </div>
    <p v-if="helpText && helpTextPosition === 'below'" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
    <p v-if="validationErrorMessage && hasValidationError" class="text-xs text-destructive flex items-center gap-1">
      <AlertCircle class="h-3 w-3" />
      {{ validationErrorMessage }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { AlertCircle } from 'lucide-vue-next'

interface Props {
  label?: string
  placeholder?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  hideFieldName?: boolean
  width?: string
  type?: string
  modelValue?: string
  helpText?: string
  helpTextPosition?: 'above' | 'below'
  maxLength?: number
  showCharacterLimit?: boolean
  generateUniqueId?: boolean
  generateAutoIncrementId?: boolean
  multiLine?: boolean
  secretInput?: boolean
  logicActions?: {
    hideBlock: boolean
    disableBlock: boolean
    requireAnswer: boolean
  }
  validationConditions?: Array<{
    field: string
    operator: string
    value: string
    group?: boolean
  }>
  validationErrorMessage?: string
}

const props = withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: 'Enter text...',
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full',
  helpTextPosition: 'below',
  showCharacterLimit: false,
  generateUniqueId: false,
  generateAutoIncrementId: false,
  multiLine: false,
  secretInput: false
})

const emit = defineEmits<{
  'update:value': [value: string]
}>()

// Computed properties to handle the field states
const isRequired = computed(() => {
  return props.fieldState === 'required' || props.required || (props.logicActions?.requireAnswer || false)
})

const isDisabled = computed(() => {
  return props.fieldState === 'disabled' || props.disabled || (props.logicActions?.disableBlock || false)
})

const isHidden = computed(() => {
  return props.fieldState === 'hidden' || props.hidden || props.generateUniqueId || props.generateAutoIncrementId || (props.logicActions?.hideBlock || false)
})

const handleInput = (value: string) => {
  if (props.maxLength && value.length > props.maxLength) {
    // Truncate to max length
    value = value.slice(0, props.maxLength)
  }
  emit('update:value', value)
}

const handleTextareaInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  let value = target.value
  
  if (props.maxLength && value.length > props.maxLength) {
    // Truncate to max length
    value = value.slice(0, props.maxLength)
  }
  emit('update:value', value)
}

// Validation logic
const hasValidationError = computed(() => {
  if (!props.validationConditions || props.validationConditions.length === 0) {
    return false
  }
  
  // Simple validation check - in real app this would be more complex
  const currentValue = props.modelValue || ''
  
  return props.validationConditions.some(condition => {
    switch (condition.operator) {
      case 'is_empty':
        return currentValue.trim() === ''
      case 'is_not_empty':
        return currentValue.trim() !== ''
      case 'equals':
        return currentValue === condition.value
      case 'not_equals':
        return currentValue !== condition.value
      case 'contains':
        return currentValue.includes(condition.value)
      case 'not_contains':
        return !currentValue.includes(condition.value)
      default:
        return false
    }
  })
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 