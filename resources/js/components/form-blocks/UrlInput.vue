<template>
  <div v-if="!isHidden" class="form-field space-y-2">
    <Label v-if="label && !hideFieldName" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="isRequired" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    <p v-if="helpText && helpTextPosition === 'above'" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
    <Input
      type="url"
      :placeholder="placeholder"
      :required="isRequired"
      :disabled="isDisabled"
      :model-value="modelValue"
      @update:model-value="$emit('update:value', $event)"
      class="w-full"
      :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
    />
    <p v-if="helpText && helpTextPosition === 'below'" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
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
  modelValue?: string
  helpText?: string
  helpTextPosition?: 'above' | 'below'
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Enter URL...',
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full',
  helpTextPosition: 'below'
})

defineEmits<{
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
  return props.fieldState === 'hidden' || props.hidden
})


</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 