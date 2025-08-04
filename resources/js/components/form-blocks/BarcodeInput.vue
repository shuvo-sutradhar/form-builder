<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="required" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    
    <div class="border border-border rounded-md p-4">
      <div class="flex items-center gap-2">
        <Input
          :id="id"
          type="text"
          :value="modelValue"
          :placeholder="placeholder"
          :required="required"
          @input="handleInput"
          class="flex-1"
        />
        <Button
          variant="outline"
          size="sm"
          @click="simulateScan"
          class="text-xs"
        >
          <Scan class="h-4 w-4 mr-1" />
          Scan
        </Button>
      </div>
      
      <div class="mt-2 text-xs text-muted-foreground">
        <p>Simulated barcode scanner. Click "Scan" to simulate scanning a barcode.</p>
      </div>
    </div>
    
    <p v-if="helpText" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Scan } from 'lucide-vue-next'

interface Props {
  id: string
  label?: string
  placeholder?: string
  required?: boolean
  helpText?: string
  modelValue?: string
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  required: false
})

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const handleInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}

const simulateScan = () => {
  // Simulate scanning a random barcode
  const barcodes = [
    '1234567890123',
    '9876543210987',
    '4567891234567',
    '7891234567890',
    '3210987654321'
  ]
  const randomBarcode = barcodes[Math.floor(Math.random() * barcodes.length)]
  emit('update:modelValue', randomBarcode)
}
</script> 