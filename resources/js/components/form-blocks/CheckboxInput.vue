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
          type="checkbox"
          :id="option"
          :value="option"
          :checked="selectedValues.includes(option)"
          @change="toggleOption(option)"
          class="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label :for="option" class="text-sm font-normal">
          {{ option }}
        </Label>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { Label } from '@/components/ui/label'

interface Props {
  label?: string
  required?: boolean
  options: string[]
  modelValue?: string[]
}

const props = withDefaults(defineProps<Props>(), {
  required: false
})

const emit = defineEmits<{
  'update:value': [value: string[]]
}>()

const selectedValues = ref<string[]>(props.modelValue || [])

const toggleOption = (option: string) => {
  if (selectedValues.value.includes(option)) {
    selectedValues.value = selectedValues.value.filter(val => val !== option)
  } else {
    selectedValues.value = [...selectedValues.value, option]
  }
  emit('update:value', selectedValues.value)
}

watch(() => props.modelValue, (newValue) => {
  selectedValues.value = newValue || []
})
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 