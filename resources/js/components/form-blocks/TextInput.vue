<template>
  <div class="form-field space-y-2">
    <Label v-if="label" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    <Input
      :type="type"
      :placeholder="placeholder"
      :required="required"
      :model-value="modelValue"
      @update:model-value="$emit('update:value', $event)"
      class="w-full"
    />
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface Props {
  label?: string
  placeholder?: string
  required?: boolean
  type?: string
  modelValue?: string
}

withDefaults(defineProps<Props>(), {
  type: 'text',
  placeholder: 'Enter text...',
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