<template>
  <div class="p-3">
    <div class="flex items-center justify-between">
      <Button
        variant="outline"
        size="sm"
        @click="previousMonth"
        class="h-7 w-7 p-0"
      >
        <ChevronLeft class="h-4 w-4" />
      </Button>
      <div class="text-sm font-medium">
        {{ currentMonthYear }}
      </div>
      <Button
        variant="outline"
        size="sm"
        @click="nextMonth"
        class="h-7 w-7 p-0"
      >
        <ChevronRight class="h-4 w-4" />
      </Button>
    </div>
    <div class="mt-4 grid grid-cols-7 gap-1">
      <div
        v-for="day in weekDays"
        :key="day"
        class="text-center text-xs font-medium text-muted-foreground"
      >
        {{ day }}
      </div>
      <div
        v-for="date in calendarDays"
        :key="date.toISOString()"
        :class="[
          'h-8 w-8 text-center text-sm rounded-md transition-colors',
          {
            'bg-primary text-primary-foreground': isSelected(date),
            'text-muted-foreground': !isCurrentMonth(date),
            'hover:bg-accent hover:text-accent-foreground cursor-pointer': isCurrentMonth(date) && !isDisabled,
            'opacity-50 cursor-not-allowed': isDisabled
          }
        ]"
        @click="selectDate(date)"
      >
        {{ date.getDate() }}
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { Button } from '@/components/ui/button'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

interface Props {
  modelValue?: Date
  disabled?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  disabled: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Date]
}>()

const currentDate = ref(new Date())
const selectedDate = ref<Date | undefined>(props.modelValue)

const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

const currentMonthYear = computed(() => {
  return currentDate.value.toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric'
  })
})

const calendarDays = computed(() => {
  const year = currentDate.value.getFullYear()
  const month = currentDate.value.getMonth()
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())
  
  const days = []
  for (let i = 0; i < 42; i++) {
    const date = new Date(startDate)
    date.setDate(startDate.getDate() + i)
    days.push(date)
  }
  return days
})

const isCurrentMonth = (date: Date) => {
  return date.getMonth() === currentDate.value.getMonth()
}

const isSelected = (date: Date) => {
  if (!selectedDate.value) return false
  return date.toDateString() === selectedDate.value.toDateString()
}

const selectDate = (date: Date) => {
  if (props.disabled) return
  selectedDate.value = date
  emit('update:modelValue', date)
}

const previousMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1)
}

const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1)
}
</script> 