<template>
  <div class="relative date-picker-container">
    <Button
      variant="outline"
      :class="[
        'w-full justify-start text-left font-normal',
        !modelValue && 'text-muted-foreground'
      ]"
      :disabled="disabled"
      @click="toggleCalendar"
    >
      <CalendarIcon class="mr-2 h-4 w-4" />
      {{ modelValue ? formatDate(modelValue) : placeholder }}
    </Button>
    
    <div
      v-if="isOpen"
      class="absolute z-50 w-auto p-0 mt-1 bg-popover border rounded-md shadow-md"
      style="top: 100%; left: 0;"
    >
      <Calendar
        :model-value="modelValue"
        @update:model-value="updateValue"
        :disabled="disabled"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-vue-next'

interface Props {
  modelValue?: Date
  placeholder?: string
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  placeholder: 'Pick a date',
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Date]
}>()

const isOpen = ref(false)

const formatDate = (date: Date) => {
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  })
}

const toggleCalendar = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value
  }
}

const updateValue = (date: Date) => {
  emit('update:modelValue', date)
  isOpen.value = false
}

// Close calendar when clicking outside
const handleClickOutside = (event: Event) => {
  const target = event.target as HTMLElement
  if (!target.closest('.date-picker-container')) {
    isOpen.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script> 