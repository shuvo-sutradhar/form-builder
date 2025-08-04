<template>
  <div class="form-field space-y-2">
    <Label v-if="label" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    <select
      :required="required"
      :value="modelValue"
      @change="$emit('update:value', ($event.target as HTMLSelectElement).value)"
      class="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value="" disabled selected>Select an option...</option>
      <option 
        v-for="option in options" 
        :key="option" 
        :value="option"
      >
        {{ option }}
      </option>
    </select>
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