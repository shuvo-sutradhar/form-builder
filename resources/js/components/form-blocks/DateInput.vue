<template>
  <div v-if="!isHidden" class="form-field space-y-2">
    <Label v-if="label && !hideFieldName" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="isRequired" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    <div class="relative">
      <DatePicker
        :model-value="dateValue"
        :placeholder="placeholder"
        :disabled="isDisabled"
        @update:model-value="handleDateChange"
        class="w-full"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { DatePicker } from '@/components/ui/date-picker'

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
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Select date...',
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full'
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
  return props.fieldState === 'hidden' || props.hidden
})

// Convert string date to Date object for DatePicker
const dateValue = ref<Date | undefined>(props.modelValue ? new Date(props.modelValue) : undefined)

// Watch for changes in modelValue
watch(() => props.modelValue, (newValue) => {
  dateValue.value = newValue ? new Date(newValue) : undefined
})

// Handle date change from DatePicker
const handleDateChange = (date: Date) => {
  dateValue.value = date
  // Convert Date back to string format for compatibility
  const dateString = date.toISOString().split('T')[0]
  emit('update:value', dateString)
}
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 