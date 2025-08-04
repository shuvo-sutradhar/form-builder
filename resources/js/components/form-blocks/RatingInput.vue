<template>
  <div class="form-field space-y-2">
    <Label v-if="label" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    <div class="flex items-center gap-1">
      <button
        v-for="star in max" 
        :key="star"
        type="button"
        @click="$emit('update:value', star)"
        class="text-2xl transition-colors hover:text-yellow-400"
        :class="star <= (modelValue || 0) ? 'text-yellow-400' : 'text-gray-300'"
      >
        ★
      </button>
      <span v-if="modelValue" class="ml-2 text-sm text-muted-foreground">
        {{ modelValue }} of {{ max }}
      </span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

interface Props {
  label?: string
  required?: boolean
  max?: number
  modelValue?: number
}

withDefaults(defineProps<Props>(), {
  required: false,
  max: 5
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