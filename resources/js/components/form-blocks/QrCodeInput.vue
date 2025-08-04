<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id" class="text-sm font-medium">
      {{ label }}
      <span v-if="required" class="text-destructive">*</span>
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
          <QrCode class="h-4 w-4 mr-1" />
          Scan QR
        </Button>
      </div>
      
      <div class="mt-2 text-xs text-muted-foreground">
        <p>Simulated QR code scanner. Click "Scan QR" to simulate scanning a QR code.</p>
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
import { QrCode } from 'lucide-vue-next'

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
  // Simulate scanning a random QR code
  const qrCodes = [
    'https://example.com/qr1',
    'https://example.com/qr2',
    'https://example.com/qr3',
    'https://example.com/qr4',
    'https://example.com/qr5'
  ]
  const randomQrCode = qrCodes[Math.floor(Math.random() * qrCodes.length)]
  emit('update:modelValue', randomQrCode)
}
</script> 