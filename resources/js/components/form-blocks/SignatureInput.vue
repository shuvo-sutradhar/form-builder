<template>
  <div class="space-y-2">
    <Label v-if="label" :for="id" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="required" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    
    <div class="border border-border rounded-md p-4">
      <canvas
        ref="canvasRef"
        :width="400"
        :height="200"
        class="border border-border rounded cursor-crosshair"
        @mousedown="startDrawing"
        @mousemove="draw"
        @mouseup="stopDrawing"
        @mouseleave="stopDrawing"
        @touchstart="handleTouchStart"
        @touchmove="handleTouchMove"
        @touchend="stopDrawing"
      ></canvas>
      
      <div class="flex gap-2 mt-2">
        <Button
          variant="outline"
          size="sm"
          @click="clearCanvas"
          class="text-xs"
        >
          Clear
        </Button>
        <Button
          variant="outline"
          size="sm"
          @click="saveSignature"
          class="text-xs"
        >
          Save
        </Button>
      </div>
    </div>
    
    <p v-if="helpText" class="text-xs text-muted-foreground">
      {{ helpText }}
    </p>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'

interface Props {
  id: string
  label?: string
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

const canvasRef = ref<HTMLCanvasElement>()
const isDrawing = ref(false)
const ctx = ref<CanvasRenderingContext2D>()

onMounted(() => {
  if (canvasRef.value) {
    ctx.value = canvasRef.value.getContext('2d')!
    ctx.value.strokeStyle = '#000'
    ctx.value.lineWidth = 2
    ctx.value.lineCap = 'round'
  }
})

const startDrawing = (event: MouseEvent) => {
  isDrawing.value = true
  draw(event)
}

const draw = (event: MouseEvent) => {
  if (!isDrawing.value || !ctx.value || !canvasRef.value) return
  
  const rect = canvasRef.value.getBoundingClientRect()
  const x = event.clientX - rect.left
  const y = event.clientY - rect.top
  
  ctx.value.lineTo(x, y)
  ctx.value.stroke()
  ctx.value.beginPath()
  ctx.value.moveTo(x, y)
}

const stopDrawing = () => {
  isDrawing.value = false
  ctx.value?.beginPath()
}

const handleTouchStart = (event: TouchEvent) => {
  event.preventDefault()
  const touch = event.touches[0]
  const mouseEvent = new MouseEvent('mousedown', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  startDrawing(mouseEvent)
}

const handleTouchMove = (event: TouchEvent) => {
  event.preventDefault()
  const touch = event.touches[0]
  const mouseEvent = new MouseEvent('mousemove', {
    clientX: touch.clientX,
    clientY: touch.clientY
  })
  draw(mouseEvent)
}

const clearCanvas = () => {
  if (!ctx.value || !canvasRef.value) return
  ctx.value.clearRect(0, 0, canvasRef.value.width, canvasRef.value.height)
  emit('update:modelValue', '')
}

const saveSignature = () => {
  if (!canvasRef.value) return
  const dataURL = canvasRef.value.toDataURL('image/png')
  emit('update:modelValue', dataURL)
}
</script> 