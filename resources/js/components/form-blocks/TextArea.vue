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
      <textarea
        :placeholder="placeholder"
        :required="isRequired"
        :disabled="isDisabled"
        :rows="rows"
        :maxlength="maxLength"
        :value="modelValue"
        @input="handleInput"
        class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
      />
      <div v-if="showCharacterLimit && maxLength" class="absolute bottom-2 right-2 text-xs text-muted-foreground">
        {{ (modelValue || '').length }}/{{ maxLength }}
      </div>
    </div>
    <p v-if="helpText && helpTextPosition === 'below'" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
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
  rows?: number
  modelValue?: string
  helpText?: string
  helpTextPosition?: 'above' | 'below'
  maxLength?: number
  showCharacterLimit?: boolean
  generateUniqueId?: boolean
  generateAutoIncrementId?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter text...',
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full',
  rows: 4,
  helpTextPosition: 'below',
  showCharacterLimit: false,
  generateUniqueId: false,
  generateAutoIncrementId: false
})

const emit = defineEmits<{
  'update:value': [value: string]
}>()

// Computed properties to handle the field states
const isRequired = computed(() => {
  return props.fieldState === 'required' || props.required
})

const isDisabled = computed(() => {
  return props.fieldState === 'disabled' || props.disabled
})

const isHidden = computed(() => {
  return props.fieldState === 'hidden' || props.hidden || props.generateUniqueId || props.generateAutoIncrementId
})

const handleInput = (event: Event) => {
  const target = event.target as HTMLTextAreaElement
  let value = target.value
  
  if (props.maxLength && value.length > props.maxLength) {
    // Truncate to max length
    value = value.slice(0, props.maxLength)
  }
  emit('update:value', value)
}
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 