<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    
    <div class="space-y-2">
      <div
        v-for="option in options"
        :key="option"
        class="flex items-center space-x-2"
      >
        <input
          :id="`${id}-${option}`"
          type="checkbox"
          :value="option"
          :checked="modelValue.includes(option)"
          @change="toggleOption(option)"
          class="h-4 w-4 rounded border-border text-primary focus:ring-primary"
        />
        <Label :for="`${id}-${option}`" class="text-sm font-normal">
          {{ option }}
        </Label>
      </div>
    </div>
    
    <p v-if="helpText" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

interface Props {
  id: string
  label?: string
  options?: string[]
  required?: boolean
  helpText?: string
  modelValue?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => [],
  options: () => [],
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string[]]
}>()

const toggleOption = (option: string) => {
  const newValue = [...props.modelValue]
  const index = newValue.indexOf(option)
  
  if (index > -1) {
    newValue.splice(index, 1)
  } else {
    newValue.push(option)
  }
  
  emit('update:modelValue', newValue)
}
</script> 