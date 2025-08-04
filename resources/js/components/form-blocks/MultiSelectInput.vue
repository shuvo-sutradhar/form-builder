<template>
  <div v-if="!isHidden" class="form-field space-y-2">
    <Label v-if="label && !hideFieldName" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="isRequired" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    <div class="space-y-2">
      <div 
        v-for="option in options" 
        :key="option"
        class="flex items-center space-x-2"
      >
        <Checkbox
          :value="option"
          :required="isRequired"
          :disabled="isDisabled"
          :checked="selectedValues.includes(option)"
          @update:checked="toggleOption(option)"
          :class="{ 'opacity-50 cursor-not-allowed': isDisabled }"
        />
        <Label class="text-sm font-normal cursor-pointer" @click="toggleOption(option)">
          {{ option }}
        </Label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'

interface Props {
  label?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  hideFieldName?: boolean
  width?: string
  options?: string[]
  modelValue?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full',
  options: () => []
})

const emit = defineEmits<{
  'update:value': [value: string[]]
}>()

const selectedValues = ref<string[]>(props.modelValue || [])

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

const toggleOption = (option: string) => {
  if (isDisabled.value) return
  
  if (selectedValues.value.includes(option)) {
    selectedValues.value = selectedValues.value.filter(val => val !== option)
  } else {
    selectedValues.value = [...selectedValues.value, option]
  }
  emit('update:value', selectedValues.value)
}

watch(() => props.modelValue, (newVal) => {
  selectedValues.value = newVal || []
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 