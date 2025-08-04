<template>
  <div class="form-field space-y-2">
    <Label v-if="label" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    <textarea
      :placeholder="placeholder"
      :required="required"
      :rows="rows"
      :value="modelValue"
      @input="$emit('update:value', ($event.target as HTMLTextAreaElement).value)"
      class="flex min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    />
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

interface Props {
  label?: string
  placeholder?: string
  required?: boolean
  rows?: number
  modelValue?: string
}

withDefaults(defineProps<Props>(), {
  placeholder: 'Enter text...',
  required: false,
  rows: 4
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