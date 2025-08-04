<template>
  <div class="form-field space-y-2">
    <Label v-if="label" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    <div class="flex items-center gap-2">
      <span class="text-sm text-muted-foreground">{{ min }}</span>
      <div class="flex-1 flex gap-1">
        <button
          v-for="value in scaleValues" 
          :key="value"
          type="button"
          @click="$emit('update:value', value)"
          class="flex-1 py-2 px-1 text-sm border rounded-md transition-colors hover:bg-accent"
          :class="value === modelValue ? 'bg-primary text-primary-foreground border-primary' : 'border-border'"
        >
          {{ value }}
        </button>
      </div>
      <span class="text-sm text-muted-foreground">{{ max }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { Label } from '@/components/ui/label'

interface Props {
  label?: string
  required?: boolean
  min?: number
  max?: number
  modelValue?: number
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  min: 1,
  max: 10
})

const scaleValues = computed(() => {
  const values = []
  for (let i = props.min; i <= props.max; i++) {
    values.push(i)
  }
  return values
})

defineEmits<{
  'update:value': [value: number]
}>()
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 