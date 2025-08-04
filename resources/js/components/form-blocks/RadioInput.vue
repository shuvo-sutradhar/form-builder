<template>
  <div class="form-field space-y-2">
    <Label v-if="label" class="text-sm font-medium">
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
          type="radio"
          :id="option"
          :name="label"
          :value="option"
          :checked="modelValue === option"
          @change="$emit('update:value', option)"
          class="h-4 w-4 border-gray-300 text-primary focus:ring-primary"
        />
        <Label :for="option" class="text-sm font-normal">
          {{ option }}
        </Label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

interface Props {
  label?: string
  required?: boolean
  options: string[]
  modelValue?: string
}

withDefaults(defineProps<Props>(), {
  required: false
})

defineEmits<{
  'update:value': [value: string]
}>()
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 