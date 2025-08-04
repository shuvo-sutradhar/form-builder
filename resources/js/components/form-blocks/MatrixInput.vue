<template>
  <div class="space-y-4">
    <Label v-if="label" :for="id" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
    </Label>
    
    <div class="overflow-x-auto">
      <table class="w-full border-collapse border border-border">
        <thead>
          <tr class="bg-muted/50">
            <th class="border border-border p-2 text-left font-medium"></th>
            <th
              v-for="column in matrixColumns"
              :key="column"
              class="border border-border p-2 text-center font-medium"
            >
              {{ column }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="row in matrixRows"
            :key="row"
            class="hover:bg-muted/30"
          >
            <td class="border border-border p-2 font-medium">
              {{ row }}
            </td>
            <td
              v-for="column in matrixColumns"
              :key="column"
              class="border border-border p-2 text-center"
            >
              <input
                v-if="matrixType === 'radio'"
                type="radio"
                :name="`${id}-${row}`"
                :value="column"
                :checked="getMatrixValue(row, column)"
                @change="setMatrixValue(row, column, $event.target.checked)"
                class="h-4 w-4 text-primary focus:ring-primary"
              />
              <input
                v-else-if="matrixType === 'checkbox'"
                type="checkbox"
                :value="column"
                :checked="getMatrixValue(row, column)"
                @change="setMatrixValue(row, column, $event.target.checked)"
                class="h-4 w-4 rounded text-primary focus:ring-primary"
              />
              <input
                v-else
                type="text"
                :value="getMatrixValue(row, column) || ''"
                @input="setMatrixValue(row, column, $event.target.value)"
                class="w-full border border-border rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
                :placeholder="`Enter ${column.toLowerCase()}`"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    
    <p v-if="helpText" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Label } from '@/components/ui/label'

interface Props {
  id: string
  label?: string
  matrixRows?: string[]
  matrixColumns?: string[]
  matrixType?: 'radio' | 'checkbox' | 'text'
  required?: boolean
  helpText?: string
  modelValue?: Record<string, any>
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: () => ({}),
  matrixRows: () => ['Row 1', 'Row 2'],
  matrixColumns: () => ['Column 1', 'Column 2'],
  matrixType: 'radio',
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: Record<string, any>]
}>()

const getMatrixValue = (row: string, column: string) => {
  const key = `${row}-${column}`
  return props.modelValue[key]
}

const setMatrixValue = (row: string, column: string, value: any) => {
  const newValue = { ...props.modelValue }
  const key = `${row}-${column}`
  
  if (props.matrixType === 'radio') {
    // For radio, clear other values in the same row
    props.matrixColumns.forEach(col => {
      newValue[`${row}-${col}`] = false
    })
    newValue[key] = value
  } else {
    newValue[key] = value
  }
  
  emit('update:modelValue', newValue)
}
</script> 