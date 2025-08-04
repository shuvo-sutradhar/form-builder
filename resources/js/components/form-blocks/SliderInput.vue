<template>
  <div class="form-field space-y-2">
    <Label v-if="label" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    <div class="space-y-2">
      <input
        type="range"
        :min="min"
        :max="max"
        :step="step"
        :value="modelValue"
        @input="$emit('update:value', Number(($event.target as HTMLInputElement).value))"
        class="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
      />
      <div class="flex justify-between text-xs text-muted-foreground">
        <span>{{ min }}</span>
        <span v-if="modelValue !== undefined">{{ modelValue }}</span>
        <span>{{ max }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

interface Props {
  label?: string
  required?: boolean
  min?: number
  max?: number
  step?: number
  modelValue?: number
}

withDefaults(defineProps<Props>(), {
  required: false,
  min: 0,
  max: 100,
  step: 1
})

defineEmits<{
  'update:value': [value: number]
}>()
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}

.slider {
  -webkit-appearance: none;
  appearance: none;
  background: transparent;
  cursor: pointer;
}

.slider::-webkit-slider-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
}

.slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  appearance: none;
  background: #3b82f6;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
}

.slider::-moz-range-track {
  background: #e5e7eb;
  height: 8px;
  border-radius: 4px;
}

.slider::-moz-range-thumb {
  background: #3b82f6;
  height: 20px;
  width: 20px;
  border-radius: 50%;
  cursor: pointer;
  border: none;
}
</style> 