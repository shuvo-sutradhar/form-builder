<template>
  <div v-if="!isHidden" class="form-field space-y-2" :class="widthClass">
    <Label v-if="label && !hideFieldName" class="text-sm font-medium">
      {{ label }}
      <Badge v-if="isRequired" variant="destructive" class="text-xs ml-1">Required</Badge>
    </Label>
    
    <div class="border-2 border-dashed border-border rounded-lg p-6 text-center">
      <div class="flex flex-col items-center space-y-2">
        <UploadIcon class="h-8 w-8 text-muted-foreground" />
        <div class="text-sm">
          <span class="font-medium text-primary">Click to upload</span> or drag and drop
        </div>
        <p class="text-xs text-muted-foreground">
          {{ acceptedTypes ? `Accepted formats: ${acceptedTypes}` : 'Any file type' }}
          {{ maxSize ? `(Max ${maxSize}MB)` : '' }}
        </p>
      </div>
      
      <input
        ref="fileInput"
        type="file"
        :accept="accept"
        :multiple="multiple"
        :required="isRequired"
        :disabled="isDisabled"
        @change="handleFileChange"
        class="hidden"
      />
      
      <div v-if="selectedFiles.length > 0" class="mt-4 space-y-2">
        <div 
          v-for="file in selectedFiles" 
          :key="file.name"
          class="flex items-center justify-between p-2 bg-muted rounded"
        >
          <span class="text-sm">{{ file.name }}</span>
          <Button
            @click="removeFile(file)"
            variant="ghost"
            size="sm"
            class="h-6 w-6 p-0 text-destructive"
          >
            <XIcon class="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { Button } from '@/components/ui/button'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { UploadIcon, XIcon } from 'lucide-vue-next'

interface Props {
  label?: string
  required?: boolean
  disabled?: boolean
  hidden?: boolean
  fieldState?: 'required' | 'hidden' | 'disabled' | null
  hideFieldName?: boolean
  width?: string
  accept?: string
  multiple?: boolean
  maxSize?: number
  modelValue?: File[]
}

const props = withDefaults(defineProps<Props>(), {
  required: false,
  disabled: false,
  hidden: false,
  hideFieldName: false,
  width: 'full',
  multiple: false,
  maxSize: 10
})

const emit = defineEmits<{
  'update:value': [value: File[]]
}>()

const fileInput = ref<HTMLInputElement>()
const selectedFiles = ref<File[]>(props.modelValue || [])

// Computed properties to handle the field states
const isRequired = computed(() => {
  return props.fieldState === 'required' || props.required
})

const isDisabled = computed(() => {
  return props.fieldState === 'disabled' || props.disabled
})

const isHidden = computed(() => {
  return props.fieldState === 'hidden' || props.hidden
})

// Computed property for width classes
const widthClass = computed(() => {
  switch (props.width) {
    case '1/2':
      return 'w-1/2'
    case '1/3':
      return 'w-1/3'
    case '2/3':
      return 'w-2/3'
    case '1/4':
      return 'w-1/4'
    case '3/4':
      return 'w-3/4'
    case 'full':
    default:
      return 'w-full'
  }
})

const acceptedTypes = computed(() => {
  if (!props.accept) return null
  return props.accept.split(',').map(type => type.trim()).join(', ')
})

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement
  const files = Array.from(target.files || [])
  
  // Filter by max size
  const validFiles = files.filter(file => {
    if (props.maxSize) {
      return file.size <= props.maxSize * 1024 * 1024
    }
    return true
  })
  
  if (props.multiple) {
    selectedFiles.value = [...selectedFiles.value, ...validFiles]
  } else {
    selectedFiles.value = validFiles
  }
  
  emit('update:value', selectedFiles.value)
}

const removeFile = (file: File) => {
  selectedFiles.value = selectedFiles.value.filter(f => f !== file)
  emit('update:value', selectedFiles.value)
}
</script>

<style scoped>
.form-field {
  margin-bottom: 1rem;
}
</style> 